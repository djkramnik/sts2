import { Player } from "./domain/entities/player";
import { Simulation } from "./harness/sim";

console.log('sts2 simulator')

;(async function main() {
  const hero = new Player({
    maxHp: 80,
    hp: 80,
    mana: 3,
    deck: [],
    block: 0,
  }, 'ironclad')


  // const sim = new Simulation()


})()