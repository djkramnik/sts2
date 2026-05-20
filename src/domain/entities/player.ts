import { Card } from "./card"

type PlayerState = {
  maxHp: number
  hp: number
  mana: number
  deck: Card[]
  block: number
}

export class Player {
  maxHp: number
  hp: number
  mana: number
  deck: Card[]
  block: number
  base: PlayerState
  constructor({ maxHp, hp, mana, deck, block }: PlayerState) {
    this.maxHp = maxHp
    this.hp = hp
    this.mana = mana
    this.deck = deck
    this.block = block
    this.base = {maxHp, hp, mana, deck, block}
  }

  restoreBase() {
    this.maxHp = this.base.maxHp
    this.hp = this.base.hp
    this.mana = this.base.mana
    this.deck = this.base.deck
    this.block = this.base.block
  }

  raiseBlock(b: number) {
    this.block += b
  }
  removeBlock(b: number) {
    this.block = Math.max(0, this.block - b)
  }
  raiseHp(hp: number) {
    this.hp = Math.min(this.maxHp, this.hp + hp)
  }
  removeHp(damage: number) {
    this.hp = Math.max(0, this.hp - damage)
  }
}