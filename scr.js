function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Character {
  constructor(name, maxHp, avatar) {
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

class Player extends Character {
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

class Boss extends Character {
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

const player = new Player("Megumin", 100, "megumin.png");
const boss = new Boss("Verdia", 320, "verdia.png");

let isGameOver = false;

const bossAvatar = document.getElementById("boss-avatar");
const bossName = document.getElementById("boss-name");
const bossHp = document.getElementById("boss-hp");
const bossBar = document.getElementById("boss-bar");

const playerAvatar = document.getElementById("player-avatar");
const playerName = document.getElementById("player-name");
const playerHp = document.getElementById("player-hp");
const playerBar = document.getElementById("player-bar");

const logEl = document.getElementById("log");
const btnAttack = document.getElementById("btn-attack");
const btnExplosion = document.getElementById("btn-explosion");
const btnRestart = document.getElementById("btn-restart");

function render() {
  bossAvatar.src = boss.avatar;
  bossName.textContent = boss.name;
  bossHp.textContent = `${boss.hp} / ${boss.maxHp}`;
  bossBar.style.width = `${boss.getHpPercent()}%`;

  playerAvatar.src = player.avatar;
  playerName.textContent = player.name;
  playerHp.textContent = `${player.hp} / ${player.maxHp}`;
  playerBar.style.width = `${player.getHpPercent()}%`;

  btnAttack.disabled = isGameOver;
  btnExplosion.disabled = isGameOver;
  btnRestart.style.display = isGameOver ? "inline-block" : "none";
}

function enemyTurn() {
  if (!boss.isAlive()) return;

  btnAttack.disabled = true;
  btnExplosion.disabled = true;

  setTimeout(() => {
    const action = boss.attack(player);

    if (action.isMiss) {
      logEl.textContent = `${boss.name} swings his massive sword, but MISSES!`;
    } else {
      logEl.textContent = `${boss.name} strikes back with his sword for ${action.dmg} damage!`;
    }

    if (!player.isAlive()) {
      logEl.textContent = `${player.name} fell in battle... Defeat!`;
      isGameOver = true;
    }

    render();
  }, 600);
}

btnAttack.addEventListener("click", () => {
  if (isGameOver) return;

  const result = player.attack(boss);

  logEl.textContent = result.isCrit
    ? `CRITICAL HIT! ${player.name} strikes hard for ${result.dmg} damage!`
    : `${player.name} deals ${result.dmg} damage with her staff!`;

  if (!boss.isAlive()) {
    logEl.textContent = `${boss.name} is defeated! Victory!`;
    isGameOver = true;
    render();
  } else {
    render();
    enemyTurn();
  }
});

btnExplosion.addEventListener("click", () => {
  if (isGameOver) return;

  const result = player.castExplosion(boss);

  logEl.textContent = `EXPLOSION! Boss takes ${result.dmgToBoss} damage, recoil hits ${player.name} for ${result.selfDmg} HP!`;

  if (!player.isAlive() && !boss.isAlive()) {
    logEl.textContent = "Mutual destruction! Both collapsed!";
    isGameOver = true;
    render();
    return;
  }

  if (!player.isAlive()) {
    logEl.textContent = `${player.name} collapsed from the explosion recoil... Defeat!`;
    isGameOver = true;
    render();
    return;
  }

  if (!boss.isAlive()) {
    logEl.textContent = `${boss.name} was pulverized! Absolute victory!`;
    isGameOver = true;
    render();
  } else {
    render();
    enemyTurn();
  }
});

btnRestart.addEventListener("click", function () {
  player.reset();
  boss.reset();
  isGameOver = false;
  this.style.display = "none";
  logEl.textContent = "Battle restarted! Your turn.";
  render();
});

render();
