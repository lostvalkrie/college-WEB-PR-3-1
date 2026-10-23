import { Character } from "./Character.js";
import { getRandom } from "./utils.js";

export class Boss extends Character {
  attack(target) {
    const isMiss = Math.random() < 0.2;
    if (isMiss) {
      return { isMiss: true, dmg: 0 };
    }

    const dmg = getRandom(20, 35);
    target.takeDamage(dmg);
    return { isMiss: false, dmg };
  }
}
