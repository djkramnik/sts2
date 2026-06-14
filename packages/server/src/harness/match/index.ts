import { Card, EventMessageType, Player, sendSimMessage } from 'shared'
import { Orchestrator } from '../orchestrator'

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
      type: EventMessageType.PLAYER_HAND,
      hand: playerToMove.hand.map((c) => ({
        uuid: c.id,
        name: c.name,
        cost: c.cost,
        attack: c.attack,
        defense: c.defense,
      })),
      handType: 'hand',
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: playerToMove.drawPile.map((c) => ({
        uuid: c.id,
        name: c.name,
        cost: c.cost,
        attack: c.attack,
        defense: c.defense,
      })),
      handType: 'draw',
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: playerToMove.discardPile.map((c) => ({
        uuid: c.id,
        name: c.name,
        cost: c.cost,
        attack: c.attack,
        defense: c.defense,
      })),
      handType: 'discard',
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_STATUS,
      name: this.player.name,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      mana: this.player.mana,
      block: this.player.block,
      enemy: this.enemy.enemy,
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_STATUS,
      name: this.enemy.name,
      hp: this.enemy.hp,
      maxHp: this.enemy.maxHp,
      mana: this.enemy.mana,
      block: this.enemy.block,
      enemy: this.enemy.enemy,
    })

    for await (const card of this.orchestrator.playTurn(
      playerToMove,
      otherPlayer,
      this.turn,
    )) {
      this.applyCard(playerToMove, otherPlayer, card)
    }

    // TURN END

    sendSimMessage({
      type: EventMessageType.TURN_BOUNDARY,
      idx: this.turn,
      kind: 'end',
    })

    // AFTER TURN: PLAYER TO MOVE: HAND, DRAW AND DISCARD

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: playerToMove.hand.map((c) => ({
        uuid: c.id,
        name: c.name,
        cost: c.cost,
        attack: c.attack,
        defense: c.defense,
      })),
      handType: 'hand',
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: playerToMove.drawPile.map((c) => ({
        uuid: c.id,
        name: c.name,
        cost: c.cost,
        attack: c.attack,
        defense: c.defense,
      })),
      handType: 'draw',
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_HAND,
      hand: playerToMove.discardPile.map((c) => ({
        uuid: c.id,
        name: c.name,
        cost: c.cost,
        attack: c.attack,
        defense: c.defense,
      })),
      handType: 'discard',
    })

    // AFTER TURN PLAYER STATUSES
    sendSimMessage({
      type: EventMessageType.PLAYER_STATUS,
      name: this.player.name,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      mana: this.player.mana,
      block: this.player.block,
      enemy: this.enemy.enemy,
    })

    sendSimMessage({
      type: EventMessageType.PLAYER_STATUS,
      name: this.enemy.name,
      hp: this.enemy.hp,
      maxHp: this.enemy.maxHp,
      mana: this.enemy.mana,
      block: this.enemy.block,
      enemy: this.enemy.enemy,
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
    const { attack, defense } = card
    const effectiveAttack = Math.max(0, attack - target.block)
    target.removeHp(effectiveAttack)
    target.removeBlock(attack)
    source.raiseBlock(defense)
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
