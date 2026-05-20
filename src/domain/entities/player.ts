import { Card } from "./card"

type PlayerState = {
  maxHp: number
  hp: number
  mana: number
  deck: Card[]
}

export class Player {
  maxHp: number
  hp: number
  mana: number
  deck: Card[]
  base: PlayerState
  constructor({ maxHp, hp, mana, deck }: PlayerState) {
    this.maxHp = maxHp
    this.hp = hp
    this.mana = mana
    this.deck = deck
    this.base = {maxHp, hp, mana, deck}
  }

  restoreBase() {
    this.maxHp = this.base.maxHp
    this.hp = this.base.hp
    this.mana = this.base.mana
    this.deck = this.base.deck
  }

}