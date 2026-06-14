import { Player } from "shared";

export class Orchestrator {
  async *playTurn(playerToMove: Player, otherPlayer: Player, turn: number) {
    playerToMove.setBaseMana();
    while (playerToMove.mana && playerToMove.hand.length > 0) {
      const firstCardCanPlay = playerToMove.hand.find((card) => card.cost <= playerToMove.mana);
      if (!firstCardCanPlay) {
        break;
      }

      playerToMove.removeMana(firstCardCanPlay.cost);
      yield firstCardCanPlay
    }
  }
}
