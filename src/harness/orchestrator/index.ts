// the responsibility for fiddling with the players and enemies, applying card effects etc within the context of a match

import { Card } from "../../domain/entities/card";
import { Player } from "../../domain/entities/player";

export class Match {
  winner: 0 | 1 | null // 0 = player wins, 1 = enemy wins, null = match not over
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
  // find the player whose turn it is
  //
  async tick(delayMs: number = 5000) {
    const playerToMove = this.lineUp[this.turn % 2]
    const otherPlayer = this.lineUp[this.turn + 1 % 2]

    const drawTotal = playerToMove.enemy ? playerToMove.base.deck.length : 5
    // draw up to drawTotal.  enemy player always draws their full deck every turn
    for(let i = 0; i < drawTotal; i += 1) {
      if (!playerToMove.drawOne()) {
        break
      }
    }

    console.log(`\nBEFORE TURN #${this.turn}\n${playerToMove.enemy ? 'Enemy' : 'Player'} hand: ${playerToMove.hand}` )

    // we have logic, at first pure random, for players playing their cards.
    // enemies will follow a particular pattern that has to be established by orchestrator

    await this.orchestrator.playTurn(playerToMove, otherPlayer, this.turn)

    console.log(`\nAFTER TURN #${this.turn}:\n`)
    console.log('player: ', String(this.player))
    console.log('enemy:', String(this.enemy))

    await this.tick(delayMs)

    // if we don't have a winner yet, advance turn
    this.winner = this.isGameOver()
    if (this.winner === null) {
      this.turn += 1
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

class Orchestrator {
  match: Match | null
  async runMatch(player: Player, enemy: Player): Promise<0 | 1> {
    this.match = new Match(player, enemy, this)
    while(this.match.winner === null) {
      await this.match.tick()
    }
    return this.match.winner
  }
  // err.. this doesn't handle multi enemy fights
  // this also assumes that the player has their hand dealt to them from draw pile already
  async playTurn(playerToMove: Player, otherPlayer: Player, turn: number) {
    playerToMove.setBaseMana(turn)
    while(playerToMove.mana && playerToMove.hand.length > 0) {
      // need randomPick
      const firstCardCanPlay = playerToMove.hand.find(c => c.cost <= playerToMove.mana)
      if (!firstCardCanPlay) {
        break
      }
      playerToMove.removeMana(firstCardCanPlay.cost)
      this.applyCard(playerToMove, otherPlayer, firstCardCanPlay)
    }
  }
  applyCard(source: Player, target: Player, card: Card) {
    console.log(`player ${source.name} playing card ${card}`)
    const { attack, defense } = card
    target.removeHp(attack)
    source.raiseBlock(defense)
  }
}