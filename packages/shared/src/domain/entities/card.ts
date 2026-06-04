import type { CardMeta, CardState, SerializableCard } from "../../card";

export class Card {
  id: string;
  name: string;
  flavor: string;
  cost: number;
  attack: number;
  defense: number;
  base: CardState;

  constructor(meta: CardMeta, state: CardState, getRandomUUID: () => string) {
    this.id = getRandomUUID()
    this.flavor = meta.flavor;
    this.name = meta.name;
    this.cost = state.cost;
    this.attack = state.attack;
    this.defense = state.defense;
    this.base = { ...state };
  }

  restoreBase() {
    this.cost = this.base.cost;
    this.attack = this.base.attack;
    this.defense = this.base.defense;
  }

  serialize(): SerializableCard {
    return {
      id: this.id,
      name: this.name,
      flavor: this.flavor,
      cost: this.cost,
      attack: this.attack,
      defense: this.defense,
      base: { ...this.base },
    };
  }

  toString() {
    return `Card ${this.name}, Cost ${this.cost}. ${this.attack ? `ATK: ${this.attack}` : ""} ${this.defense ? `DEF: ${this.defense}` : ""}`;
  }
}
