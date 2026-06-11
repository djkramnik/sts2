import { Player } from "shared";
import { Orchestrator } from "../orchestrator";
import { consoleLogger, Logger } from "../../util/logger";
import { Match } from "../match";

export class Simulation {
  orchestrator: Orchestrator;
  enemies: Player[];
  player: Player;
  logger: Logger;

  constructor(player: Player, enemies: Player[], logger: Logger = consoleLogger) {
    this.logger = logger;
    this.orchestrator = new Orchestrator(logger);
    this.player = player;
    this.enemies = enemies;
  }

  async runSim() {
    for (let i = 0; i < this.enemies.length; i += 1) {
      const enemy = this.enemies[i];
      const enemyName = enemy.name;
      const playerName = this.player.name;

      const match = new Match(this.player, enemy, this.orchestrator);
      const result = await match.runMatch();

      if (result === 1) {
        break;
      }

      this.player.afterMatch();
    }
  }
}
