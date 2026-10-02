const player = {
  name: "Megumin",
  hp: 100,
  maxHp: 100,
  avatar: "megumin.png",
};

const boss = {
  name: "Verdia",
  hp: 320,
  maxHp: 320,
  avatar: "verdia.png",
};

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

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render() {
  bossAvatar.src = boss.avatar;
  bossName.textContent = boss.name;
  bossHp.textContent = `${boss.hp} / ${boss.maxHp}`;
  bossBar.style.width = `${(boss.hp / boss.maxHp) * 100}%`;

  playerAvatar.src = player.avatar;
  playerName.textContent = player.name;
  playerHp.textContent = `${player.hp} / ${player.maxHp}`;
  playerBar.style.width = `${(player.hp / player.maxHp) * 100}%`;

  btnAttack.disabled = isGameOver;
  btnExplosion.disabled = isGameOver;
  btnRestart.style.display = isGameOver ? "inline-block" : "none";
}

function enemyTurn() {
  if (boss.hp <= 0) return;
  btnAttack.disabled = true;
  btnExplosion.disabled = true;

  setTimeout(() => {
    const isMiss = Math.random() < 0.2;

    if (isMiss) {
      logEl.textContent = "Verdia swings his massive sword, but MISSES!";
    } else {
      const dmg = getRandom(20, 35);
      player.hp = Math.max(0, player.hp - dmg);
      logEl.textContent = `Verdia strikes back with his sword for ${dmg} damage!`;
    }

    if (player.hp <= 0) {
      logEl.textContent = "Megumin fell in battle... Defeat!";
      isGameOver = true;
    }
    render();
  }, 600);
}

btnAttack.addEventListener("click", () => {
  if (isGameOver) return;

  const isCrit = Math.random() < 0.25;
  const baseDmg = getRandom(35, 55);
  const dmg = isCrit ? baseDmg * 2 : baseDmg;

  boss.hp = Math.max(0, boss.hp - dmg);
  logEl.textContent = isCrit
    ? `CRITICAL HIT! Megumin strikes hard for ${dmg} damage!`
    : `Megumin deals ${dmg} damage with her staff!`;

  if (boss.hp <= 0) {
    logEl.textContent = "Verdia is defeated! Victory!";
    isGameOver = true;
    render();
  } else {
    render();
    enemyTurn();
  }
});

btnExplosion.addEventListener("click", () => {
  if (isGameOver) return;

  const dmgToBoss = getRandom(180, 260);
  const selfDmg = getRandom(40, 60);

  boss.hp = Math.max(0, boss.hp - dmgToBoss);
  player.hp = Math.max(0, player.hp - selfDmg);
  logEl.textContent = `EXPLOSION! Boss takes ${dmgToBoss} damage, recoil hits Megumin for ${selfDmg} HP!`;

  if (player.hp <= 0 && boss.hp <= 0) {
    logEl.textContent = "Mutual destruction! Both collapsed!";
    isGameOver = true;
    render();
    return;
  }

  if (player.hp <= 0) {
    logEl.textContent =
      "Megumin collapsed from the explosion recoil... Defeat!";
    isGameOver = true;
    render();
    return;
  }

  if (boss.hp <= 0) {
    logEl.textContent = "Verdia was pulverized! Absolute victory!";
    isGameOver = true;
    render();
  } else {
    render();
    enemyTurn();
  }
});

btnRestart.addEventListener("click", () => {
  player.hp = player.maxHp;
  boss.hp = boss.maxHp;
  isGameOver = false;
  logEl.textContent = "Battle restarted! Your turn.";
  render();
});

render();
