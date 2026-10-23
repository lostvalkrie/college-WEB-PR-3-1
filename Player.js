import { Character } from "./Character.js";
import { getRandom } from "./utils.js";

export class Player extends Character {
  attack(target) {
    const isCrit = Math.random() < 0.25;
    const baseDmg = getRandom(35, 55);
    const dmg = isCrit ? baseDmg * 2 : baseDmg;

    target.takeDamage(dmg);
    return { dmg, isCrit };
  }

  castExplosion(target) {
    const dmgToBoss = getRandom(180, 260);
    const selfDmg = getRandom(40, 60);

    target.takeDamage(dmgToBoss);
    this.takeDamage(selfDmg);

    return { dmgToBoss, selfDmg };
  }
}
