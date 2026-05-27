import { Card } from "../../domain/entities/card";
import { Player } from "../../domain/entities/player";
import { logCards } from "../../util/logging";
import { consoleLogger, Logger } from "../../util/logger";

export class Match {
  winner: 0 | 1 | null;
  player: Player;
  enemy: Player;
  turn: number;
  lineUp: [Player, Player];
  orchestrator: Orchestrator;

  constructor(player: Player, enemy: Player, orchestrator: Orchestrator) {
    this.winner = null;
    this.player = player;
    this.enemy = enemy;
    this.turn = 0;
    this.lineUp = [player, enemy];
    this.orchestrator = orchestrator;
  }

  async tick(delayMs: number = 0) {
    const playerToMove = this.lineUp[this.turn % 2];
    const otherPlayer = this.lineUp[(this.turn + 1) % 2];
    const drawTotal = playerToMove.enemy ? playerToMove.base.deck.length : 5;

    playerToMove.beforeTurn();
    for (let i = 0; i < drawTotal; i += 1) {
      if (!playerToMove.drawOne()) {
        break;
      }
    }

    this.orchestrator.logger.log(
      `\nBEFORE TURN #${this.turn}\n${playerToMove.enemy ? "Enemy" : "Player"} hand:\n${logCards(playerToMove.hand)}`,
    );

    await this.orchestrator.playTurn(playerToMove, otherPlayer, this.turn);

    this.orchestrator.logger.log(`\nAFTER TURN #${this.turn}:\n`);
    this.orchestrator.logger.log("player:", String(this.player));
    this.orchestrator.logger.log("enemy:", String(this.enemy));

    this.winner = this.isGameOver();
    if (this.winner !== null) {
      return;
    }

    playerToMove.afterTurn();
    this.turn += 1;

    if (delayMs > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }
  }

  isGameOver(): 0 | 1 | null {
    if (this.player.hp === 0) {
      return 1;
    }
    if (this.enemy.hp === 0) {
      return 0;
    }
    return null;
  }
}

export class Orchestrator {
  logger: Logger;
  match: Match | null = null;

  constructor(logger: Logger = consoleLogger) {
    this.logger = logger;
  }

  async runMatch(player: Player, enemy: Player): Promise<0 | 1> {
    this.match = new Match(player, enemy, this);
    while (this.match.winner === null) {
      await this.match.tick();
    }
    return this.match.winner;
  }

  async playTurn(playerToMove: Player, otherPlayer: Player, turn: number) {
    playerToMove.setBaseMana();
    while (playerToMove.mana && playerToMove.hand.length > 0) {
      const firstCardCanPlay = playerToMove.hand.find((card) => card.cost <= playerToMove.mana);
      if (!firstCardCanPlay) {
        break;
      }

      playerToMove.removeMana(firstCardCanPlay.cost);
      this.logger.log("mana left:", playerToMove.mana);
      this.applyCard(playerToMove, otherPlayer, firstCardCanPlay);
    }
  }

  applyCard(source: Player, target: Player, card: Card) {
    this.logger.log(`player ${source.name} playing ${card.name}`);
    const { attack, defense } = card;
    const effectiveAttack = Math.max(0, attack - target.block);
    target.removeHp(effectiveAttack);
    target.removeBlock(attack);
    source.raiseBlock(defense);
    const cardIndex = source.hand.indexOf(card);
    if (cardIndex >= 0) {
      source.discardOne(cardIndex);
    }
  }
}
