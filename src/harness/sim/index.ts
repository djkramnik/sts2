// manages state outside of a specific match.
// runs a series of matches

import { Player } from "../../domain/entities/player";
import { Match, Orchestrator } from "../orchestrator";

export class Simulation {
  orchestrator: Orchestrator
  enemies: Player[]
  player: Player
  constructor(player: Player, enemies: Player[]) {
    this.orchestrator = new Orchestrator()
    this.player = player
    this.enemies = enemies
  }
  async runSim() {
    for(let i = 0; i < this.enemies.length; i += 1) {
      const enemy = this.enemies[i]
      const enemyName = enemy.name
      const playerName = this.player.name

      console.log(`Commence match no. ${i + 1} between ${playerName} and ${enemyName}`)
      console.log(`Player: ${this.player}`)
      console.group(`Enemy: ${enemy}`)

      const result = await this.orchestrator.runMatch(this.player, enemy)


      console.log(`Match ${i} between ${playerName} and ${enemyName} won by: ${result === 0 ? playerName : enemyName}`)

      if (result === 1) {
        console.log(`${playerName} has lost after ${i + 1} matches. goodbye`)
        break
      }
      // reset crap after the match
      this.player.afterMatch()
    }
  }

}