import { Player } from "shared";
import { Match, Orchestrator } from "../orchestrator";
import { consoleLogger, Logger } from "../../util/logger";

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

      this.logger.log(`Commence match no. ${i + 1} between ${playerName} and ${enemyName}`);
      this.logger.log(`Player: ${this.player}`);
      this.logger.log(`Enemy: ${enemy}`);

      const result = await this.orchestrator.runMatch(this.player, enemy);

      this.logger.log(
        `Match ${i} between ${playerName} and ${enemyName} won by: ${result === 0 ? playerName : enemyName}`,
      );

      if (result === 1) {
        this.logger.log(`${playerName} has lost after ${i + 1} matches. goodbye`);
        break;
      }

      this.player.afterMatch();
    }
  }
}
