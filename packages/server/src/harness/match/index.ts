import { Card, EventMessageType, Player, sendSimMessage, type PlayerStatusMessage } from 'shared'
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
    sendSimMessage({
      type: EventMessageType.MATCH_BOUNDARY,
      idx: this.turn,
      kind: 'end',
      playerName: this.player.name,
      enemyName: this.enemy.name,
      winnerName: this.winner === 0 ? this.player.name : this.enemy.name,
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

    // TURN START
    sendSimMessage({
      type: EventMessageType.TURN_BOUNDARY,
      idx: this.turn,
      kind: 'start',
    })

    // BEFORE TURN: PLAYER TO MOVE: HAND, DRAW AND DISCARD

    sendSimMessage({
      type: EventMessageType.PRINT_MESSAGE,
      message: 'Everything before the moves played:'
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: serializeCards(playerToMove.hand),
      handType: 'hand',
    })

    // sendSimMessage({
    //   type: EventMessageType.PLAYER_HAND,
    //   hand: serializeCards(playerToMove.drawPile),
    //   handType: 'draw',
    // })

    // sendSimMessage({
    //   type: EventMessageType.PLAYER_HAND,
    //   hand: serializeCards(playerToMove.discardPile),
    //   handType: 'discard',
    // })

    sendSimMessage(playerStatusMessage(this.player))

    sendSimMessage(playerStatusMessage(this.enemy))

    for await (const card of this.orchestrator.playTurn(
      playerToMove,
      otherPlayer,
      this.turn,
    )) {
      this.applyCard(playerToMove, otherPlayer, card)
    }

    // TURN END

    sendSimMessage({
      type: EventMessageType.PRINT_MESSAGE,
      message: 'Everything after the moves played: '
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: serializeCards(playerToMove.hand),
      handType: 'hand',
    })

    // sendSimMessage({
    //   type: EventMessageType.PLAYER_HAND,
    //   hand: serializeCards(playerToMove.drawPile),
    //   handType: 'draw',
    // })

    // sendSimMessage({
    //   type: EventMessageType.PLAYER_HAND,
    //   hand: serializeCards(playerToMove.discardPile),
    //   handType: 'discard',
    // })

    // AFTER TURN PLAYER STATUSES
    sendSimMessage(playerStatusMessage(this.player))

    sendSimMessage(playerStatusMessage(this.enemy))

    // AFTER TURN: PLAYER TO MOVE: HAND, DRAW AND DISCARD
    sendSimMessage({
      type: EventMessageType.TURN_BOUNDARY,
      idx: this.turn,
      kind: 'end',
    })

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

  applyCard(source: Player, target: Player, card: Card) {
    const sourceCurrBlock = source.block
    const targetCurrBlock = target.block
    const targetCurrHp = target.hp


    const { attack, defense } = card
    const effectiveAttack = Math.max(0, attack - target.block)
    target.removeHp(effectiveAttack)
    target.removeBlock(attack)
    source.raiseBlock(defense)
    const cardIndex = source.hand.indexOf(card)
    if (cardIndex >= 0) {
      source.discardOne(cardIndex)
    }
    const cardMessage = serializeCards([card])[0]
    sendSimMessage({
      type: EventMessageType.PLAYER_MOVE,
      card: cardMessage
    })
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
