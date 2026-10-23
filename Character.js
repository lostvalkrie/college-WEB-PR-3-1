export class Character {
  constructor({ name, maxHp, avatar }) {
    this.name = name;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.avatar = avatar;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp;
  }

  reset() {
    this.hp = this.maxHp;
  }

  isAlive() {
    return this.hp > 0;
  }

  getHpPercent() {
    return (this.hp / this.maxHp) * 100;
  }
}
