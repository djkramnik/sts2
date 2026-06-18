import {
  Card,
  CardEffect,
  EventMessageType,
  Player,
  sendSimMessage,
  TurnSummaryMessage,
  type PlayerStatusMessage,

} from 'shared'
import { Orchestrator } from '../orchestrator'

const serializeCards = (cards: Card[]) => cards.map((card) => card.serialize())

const playerStatusMessage = (player: Player): PlayerStatusMessage => ({
  type: EventMessageType.PLAYER_STATUS,
  name: player.name,
  hp: player.hp,
  maxHp: player.maxHp,
  mana: player.mana,
  block: player.block,
  enemy: player.enemy,
})

export class Match {
  winner: 0 | 1 | null
  player: Player
  enemy: Player
  turn: number
  lineUp: [Player, Player]
  orchestrator: Orchestrator

  constructor(player: Player, enemy: Player, orchestrator: Orchestrator) {
    this.winner = null
    this.player = player
    this.enemy = enemy
    this.turn = 0
    this.lineUp = [player, enemy]
    this.orchestrator = orchestrator
  }

  async runMatch(): Promise<0 | 1> {
    sendSimMessage({
      type: EventMessageType.MATCH_BOUNDARY,
      idx: this.turn,
      kind: 'start',
      playerName: this.player.name,
      enemyName: this.enemy.name,
    })
    while (this.winner === null) {
      await this.tick()
    }
    const winnerName = this.winner === 0 ? this.player.name : this.enemy.name
    sendSimMessage({
      type: EventMessageType.MATCH_BOUNDARY,
      idx: this.turn,
      kind: 'end',
      playerName: this.player.name,
      enemyName: this.enemy.name,
      winnerName,
    })
    sendSimMessage({
      type: EventMessageType.PRINT_MESSAGE,
      message: `Match winner: ${winnerName}`,
    })
    return this.winner
  }

  async tick(delayMs: number = 0) {
    const playerToMove = this.lineUp[this.turn % 2]
    const otherPlayer = this.lineUp[(this.turn + 1) % 2]
    const drawTotal = playerToMove.enemy ? playerToMove.base.deck.length : 5

    playerToMove.beforeTurn()
    for (let i = 0; i < drawTotal; i += 1) {
      if (!playerToMove.drawOne()) {
        break
      }
    }

    const playerCardEffects: Array<Record<string, CardEffect>> = []

    const turnSummary: TurnSummaryMessage = {
      type: EventMessageType.TURN_SUMMARY,
      idx: this.turn,
      playerToMove: playerToMove.name,
      otherPlayer: otherPlayer.name,
      playerToMoveHand: serializeCards(playerToMove.hand),
      effects: playerCardEffects,
      before: [playerStatusMessage(this.player), playerStatusMessage(this.enemy)],
      after: [],
      moves: []
    }

    for await (const card of this.orchestrator.playTurn(
      playerToMove,
      otherPlayer,
      this.turn,
    )) {
      turnSummary.moves.push(serializeCards([card])[0])
      const moveEffects: Record<string, CardEffect> = {}
      moveEffects[playerToMove.name] = {}
      moveEffects[otherPlayer.name] = {}
      playerCardEffects.push(moveEffects)
      this.applyCard(playerToMove, otherPlayer, card, moveEffects)
    }
    turnSummary.after = [
      playerStatusMessage(this.player),
      playerStatusMessage(this.enemy),
    ]
    sendSimMessage(turnSummary)

    this.winner = this.isGameOver()
    if (this.winner !== null) {
      return
    }

    playerToMove.afterTurn()
    this.turn += 1

    if (delayMs > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs)
      })
    }
  }

  applyCard(source: Player, target: Player, card: Card, effects: Record<string, CardEffect>) {
    const { attack: baseAttack, defense: baseDefense } = card
    const attack = baseAttack > 0
      ? baseAttack + source.stats.str
      : 0
    const defense = baseDefense > 0
      ? baseDefense + source.stats.dex
      : 0

    const effectiveAttack = Math.max(0, attack - target.block)
    target.removeHp(effectiveAttack)
    target.removeBlock(attack)
    source.raiseBlock(defense)

    // so.. we need to micromanage both the things happening simulation wise
    // and also the deltas / effects so we can communicate it back to client
    // this will scale poorly as variety of effects grow
    effects[target.name].hp = effectiveAttack * -1
    effects[target.name].block = (attack - effectiveAttack) * - 1
    effects[source.name].block = defense

    const cardIndex = source.hand.indexOf(card)
    if (cardIndex >= 0) {
      source.discardOne(cardIndex)
    }
  }

  isGameOver(): 0 | 1 | null {
    if (this.player.hp === 0) {
      return 1
    }
    if (this.enemy.hp === 0) {
      return 0
    }
    return null
  }
}
