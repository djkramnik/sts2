import { Card, Player } from "shared";
import { Simulation } from "../harness/sim";
import { randomUUID } from "node:crypto";

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
    randomUUID,
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
    randomUUID,
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
    randomUUID,
  );

export const createDemoSimulation = () => {
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
      stats: { dex: 0, str: 0 }
    },
    "ironclad"
  );

  const enemy = new Player(
    {
      maxHp: 40,
      hp: 40,
      mana: 1,
      deck: enemyDeck,
      block: 0,
      stats: { dex: 2, str: 2 }
    },
    "test-dummy",
    true,
  );

  return new Simulation(hero, [enemy]);
};
