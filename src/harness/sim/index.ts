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

}