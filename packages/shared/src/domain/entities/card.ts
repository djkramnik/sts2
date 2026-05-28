type CardState = {
  cost: number;
  attack: number;
  defense: number;
};

type CardMeta = {
  name: string;
  flavor: string;
};

export class Card {
  name: string;
  flavor: string;
  cost: number;
  attack: number;
  defense: number;
  base: CardState;

  constructor(meta: CardMeta, state: CardState) {
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

  toString() {
    return `Card ${this.name}, Cost ${this.cost}. ${this.attack ? `ATK: ${this.attack}` : ""} ${this.defense ? `DEF: ${this.defense}` : ""}`;
  }
}
