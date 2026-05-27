import { Card } from "../domain/entities/card";
import { Player } from "../domain/entities/player";
import { Simulation } from "../harness/sim";
import { Logger } from "../util/logger";

const strike = () =>
  new Card(
    {
      name: "Strike",
      flavor: "A straightforward attack.",
    },
    {
      cost: 1,
      attack: 6,
      defense: 0,
    },
  );

const defend = () =>
  new Card(
    {
      name: "Defend",
      flavor: "Basic protection.",
    },
    {
      cost: 1,
      attack: 0,
      defense: 5,
    },
  );

const bash = () =>
  new Card(
    {
      name: "Bash",
      flavor: "A heavier hit for the demo.",
    },
    {
      cost: 2,
      attack: 8,
      defense: 0,
    },
  );

export const createDemoSimulation = (logger: Logger) => {
  const heroDeck = [
    strike(),
    strike(),
    strike(),
    strike(),
    defend(),
    defend(),
    defend(),
    bash(),
  ];

  const enemyDeck = [strike(), strike(), defend()];

  const hero = new Player(
    {
      maxHp: 80,
      hp: 80,
      mana: 3,
      deck: heroDeck,
      block: 0,
    },
    "ironclad",
    false,
    logger,
  );

  const enemy = new Player(
    {
      maxHp: 40,
      hp: 40,
      mana: 1,
      deck: enemyDeck,
      block: 0,
    },
    "test-dummy",
    true,
    logger,
  );

  return new Simulation(hero, [enemy], logger);
};
