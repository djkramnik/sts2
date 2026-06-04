import { Player } from "shared";
import { consoleLogger, Logger } from "../../util/logger";


export class Orchestrator {
  logger: Logger;

  constructor(logger: Logger = consoleLogger) {
    this.logger = logger;
  }

  async *playTurn(playerToMove: Player, otherPlayer: Player, turn: number) {
    playerToMove.setBaseMana();
    while (playerToMove.mana && playerToMove.hand.length > 0) {
      const firstCardCanPlay = playerToMove.hand.find((card) => card.cost <= playerToMove.mana);
      if (!firstCardCanPlay) {
        break;
      }

      playerToMove.removeMana(firstCardCanPlay.cost);
      this.logger.log("mana left:", playerToMove.mana);
      // this.applyCard(playerToMove, otherPlayer, firstCardCanPlay);
      yield firstCardCanPlay
    }
  }
}
