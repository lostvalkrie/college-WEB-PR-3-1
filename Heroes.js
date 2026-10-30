import { Character } from "./Character.js";
import { getRandom } from "./utils.js";

class Hero extends Character {
  attack(target) {
    const isCrit = Math.random() < 0.25;
    const baseDmg = getRandom(30, 50);
    const dmg = isCrit ? baseDmg * 2 : baseDmg;
    target.takeDamage(dmg);
    return { name: "Basic Attack", dmg, isCrit };
  }

  useSpecial() {
    console.warn("Any special");
  }
}

export class Mage extends Hero {
  useSpecial(target, teamArray) {
    const dmgToBoss = getRandom(180, 260);
    const selfDmg = getRandom(40, 60);

    target.takeDamage(dmgToBoss);
    this.takeDamage(selfDmg);

    return `EXPLOSION! Damage to boss: ${dmgToBoss}. Self dmg ${this.name}: ${selfDmg} HP.`;
  }
}

export class Warrior extends Hero {
  useSpecial(target, teamArray) {
    const isMiss = Math.random() < 0.3;
    if (isMiss) return `${this.name} Swings her sword but misses!`;

    const dmg = getRandom(80, 140);
    target.takeDamage(dmg);
    return `CLUNK! ${this.name} deals to boss ${dmg} HP.`;
  }
}

export class Healer extends Hero {
  useSpecial(target, teamArray) {
    const healAmount = getRandom(40, 60);
    let healedNames = [];

    teamArray.forEach((hero) => {
      if (hero.isAlive()) {
        hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
        healedNames.push(hero.name);
      }
    });

    return `Nature's Beauty! ${this.name} heals ${healAmount} HP to heroes: ${healedNames.join(", ")}.`;
  }
}
