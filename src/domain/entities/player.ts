import { shuffle } from "../../util"
import { Card } from "./card"

type PlayerState = {
  maxHp: number
  hp: number
  mana: number
  deck: Card[]
  block: number
}

export class Player {
  readonly enemy: boolean
  maxHp: number
  hp: number
  mana: number
  deck: Card[]
  drawPile: Card[]
  discardPile: Card[]
  hand: Card[]
  block: number
  base: PlayerState

  constructor({ maxHp, hp, mana, deck, block }: PlayerState, enemy?: boolean) {
    this.enemy = enemy === true
    this.maxHp = maxHp
    this.hp = hp
    this.mana = mana
    this.deck = deck
    this.block = block

    // transient shit I assume
    this.hand = []
    this.drawPile = shuffle(this.deck.slice(0))
    this.discardPile = []
    this.base = {maxHp, hp, mana, deck: deck.slice(0), block}
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

  // move one card from draw pile to hand
  // for some reason we can't return false
  drawOne(): boolean {
    if (this.drawPile.length === 0) {
      this.drawPile = shuffle(this.discardPile)
      this.discardPile = []
    }
    if (this.drawPile.length === 0) {
      return false
    }
    const card = this.drawPile.pop() // last item of array is 'top' of the deck
    this.hand.push(card)
    return true
  }
  // move one particular card from hand to discard pile
  // if we can't return false
  discardOne(index: number): boolean {
    const discarded = this.hand.splice(index, 1)
    if (discarded.length === 0) {
      console.error('tried to discard card from hand but index cannot be found')
      return false
    }
    this.discardPile = this.discardPile.concat(discarded)
    return true
  }

}