type PlayerState = {
  maxHp: number
  hp: number
  mana: number
}

export class Player {
  maxHp: number
  hp: number
  mana: number
  constructor({ maxHp, hp, mana }: PlayerState) {
    this.maxHp = maxHp
    this.hp = hp
    this.mana = mana
  }
}