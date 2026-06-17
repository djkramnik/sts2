import { consoleLogger, Logger } from "../../logger";
import type { SerializablePlayer } from "../../player";
import { shuffle } from "../../util/shuffle";
import { Card } from "./card";

type PlayerState = {
  maxHp: number;
  hp: number;
  mana: number;
  deck: Card[];
  block: number;
};

export class Player {
  readonly enemy: boolean;
  readonly name: string;
  readonly logger: Logger;
  maxHp: number;
  hp: number;
  mana: number;
  deck: Card[];
  drawPile: Card[];
  discardPile: Card[];
  hand: Card[];
  block: number;
  base: PlayerState;

  constructor(
    { maxHp, hp, mana, deck, block }: PlayerState,
    name: string,
    enemy: boolean = false,
    logger: Logger = consoleLogger,
  ) {
    this.enemy = (enemy === true);
    this.name = name;
    this.logger = logger;
    this.maxHp = maxHp;
    this.hp = hp;
    this.mana = mana;
    this.deck = deck;
    this.block = block;
    this.hand = [];
    this.drawPile = shuffle(this.deck.slice(0));
    this.discardPile = [];
    this.base = { maxHp, hp, mana, deck: deck.slice(0), block };
  }

  restoreBase() {
    this.maxHp = this.base.maxHp;
    this.hp = this.base.hp;
    this.mana = this.base.mana;
    this.deck = this.base.deck;
    this.block = this.base.block;
  }

  raiseBlock(block: number) {
    this.block += block;
  }

  removeBlock(block: number) {
    this.block = Math.max(0, this.block - block);
  }

  raiseHp(hp: number) {
    this.hp = Math.min(this.maxHp, this.hp + hp);
  }

  removeHp(damage: number) {
    this.hp = Math.max(0, this.hp - damage);
  }

  setBaseMana() {
    this.mana = this.base.mana;
  }

  raiseMana(mana: number) {
    this.mana += mana;
  }

  removeMana(mana: number) {
    this.mana = Math.max(0, this.mana - mana);
  }

  drawOne(): boolean {
    if (this.drawPile.length === 0) {
      this.drawPile = shuffle(this.discardPile);
      this.discardPile = [];
    }

    if (this.drawPile.length === 0) {
      return false;
    }

    const card = this.drawPile.pop();
    if (!card) {
      return false;
    }

    this.hand.push(card);
    return true;
  }

  discardOne(index: number): boolean {
    const discarded = this.hand.splice(index, 1);
    if (discarded.length === 0) {
      this.logger.error("tried to discard card from hand but index cannot be found");
      return false;
    }

    this.discardPile = this.discardPile.concat(discarded);
    return true;
  }

  serialize(): SerializablePlayer {
    return {
      enemy: this.enemy,
      name: this.name,
      maxHp: this.maxHp,
      hp: this.hp,
      mana: this.mana,
      deck: this.deck.map((card) => card.serialize()),
      drawPile: this.drawPile.map((card) => card.serialize()),
      discardPile: this.discardPile.map((card) => card.serialize()),
      hand: this.hand.map((card) => card.serialize()),
      block: this.block,
      base: {
        maxHp: this.base.maxHp,
        hp: this.base.hp,
        mana: this.base.mana,
        deck: this.base.deck.map((card) => card.serialize()),
        block: this.base.block,
      },
    };
  }

  toString() {
    return `${this.enemy ? "Enemy" : "Player"} "${this.name}".  Hp: ${this.hp}.  MaxHp: ${this.maxHp}.  Mana: ${this.mana}. Block: ${this.block}`;
  }

  afterMatch() {
    this.mana = this.base.mana;
    this.deck = this.base.deck;
    this.block = this.base.block;
    this.hand = [];
    this.drawPile = shuffle(this.deck.slice(0));
    this.discardPile = [];
    this.hp = Math.min(this.maxHp, this.hp + 6);
  }

  beforeTurn() {
    this.mana = this.base.mana;
    this.block = this.base.block;
  }

  afterTurn() {
    while (this.hand.length > 0) {
      if (!this.discardOne(0)) {
        this.logger.error("wtf, discard after turn?");
        break;
      }
    }
  }
}
