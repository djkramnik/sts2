import { Player } from "../entities/player";

type Orchestrator = {
  playCards: (playerToMove: Player, target: Player) => Promise<void>
}

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
  async tick() {
    const playerToMove = this.lineUp[this.turn % 2]
    const otherPlayer = this.lineUp[this.turn + 1 % 2]

    const drawTotal = playerToMove.enemy ? playerToMove.base.deck.length : 5
    // draw up to drawTotal.  enemy player always draws their full deck every turn
    for(let i = 0; i < drawTotal; i += 1) {
      if (!playerToMove.drawOne()) {
        break
      }
    }

    console.log(`${playerToMove.enemy ? 'Enemy' : 'Player'} hand: ${playerToMove.hand}` )

    // we have logic, at first pure random, for players playing their cards.
    // enemies will follow a particular pattern that has to be established by orchestrator

    await this.orchestrator.playCards(playerToMove, otherPlayer)

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