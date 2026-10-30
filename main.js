import { Mage, Warrior, Healer } from "./Heroes.js";
import { Boss } from "./Boss.js";
import { withClickLimit } from "./utils.js";

const team = [
  new Mage({ name: "Megumin", maxHp: 100, avatar: "megumin.png" }),
  new Warrior({ name: "Darkness", maxHp: 250, avatar: "darkness.png" }),
  new Healer({ name: "Aqua", maxHp: 120, avatar: "aqua.png" }),
];

let activePlayer = team[0];

const boss = new Boss({
  name: "Verdia",
  maxHp: 600,
  avatar: "verdia.png",
});

let isGameOver = false;
const CLICK_LIMIT = 15;

const bossAvatar = document.getElementById("boss-avatar");
const bossName = document.getElementById("boss-name");
const bossHp = document.getElementById("boss-hp");
const bossBar = document.getElementById("boss-bar");

const heroSelect = document.getElementById("hero-select");
const playerAvatar = document.getElementById("player-avatar");
const playerName = document.getElementById("player-name");
const playerHp = document.getElementById("player-hp");
const playerBar = document.getElementById("player-bar");

const logEl = document.getElementById("log");
const logsContainer = document.getElementById("logs");
const btnAttack = document.getElementById("btn-attack");
const btnSpecial = document.getElementById("btn-special");
const btnRestart = document.getElementById("btn-restart");

const addLog = (text) => {
  logEl.textContent = text;
  const logEntry = document.createElement("p");
  logEntry.className = "log-entry";
  logEntry.textContent = text;
  logsContainer.prepend(logEntry);
};

const getSpecialBtnLabel = (hero) => {
  if (hero instanceof Mage) return "EXPLOSION! (Massive AoE)";
  if (hero instanceof Warrior) return "Heavy Slash (Chance to miss)";
  if (hero instanceof Healer) return "Nature's Beauty (Team Heal)";
  return "Special Move";
};

const render = () => {
  bossAvatar.src = boss.avatar;
  bossName.textContent = boss.name;
  bossHp.textContent = `${boss.hp} / ${boss.maxHp}`;
  bossBar.style.width = `${boss.getHpPercent()}%`;

  playerAvatar.src = activePlayer.avatar;
  playerName.textContent = activePlayer.name;
  playerHp.textContent = `${activePlayer.hp} / ${activePlayer.maxHp}`;
  playerBar.style.width = `${activePlayer.getHpPercent()}%`;

  btnSpecial.textContent = getSpecialBtnLabel(activePlayer);

  btnAttack.disabled = isGameOver || !activePlayer.isAlive();
  btnSpecial.disabled = isGameOver || !activePlayer.isAlive();
  heroSelect.disabled = isGameOver;
  btnRestart.style.display = isGameOver ? "inline-block" : "none";
};

heroSelect.addEventListener("change", (e) => {
  const selectedIndex = Number(e.target.value);
  activePlayer = team[selectedIndex];

  if (!activePlayer.isAlive()) {
    addLog(
      `${activePlayer.name} is knocked out and cannot fight! Switch to another hero.`,
    );
  } else {
    addLog(`Switched fighter to ${activePlayer.name}!`);
  }

  render();
});

const enemyTurn = () => {
  if (!boss.isAlive()) return;

  btnAttack.disabled = true;
  btnSpecial.disabled = true;

  setTimeout(() => {
    const action = boss.attack(activePlayer);

    if (action.isMiss) {
      addLog(`${boss.name} attacks, but MISSES!`);
    } else {
      addLog(
        `${boss.name} deals ${action.dmg} damage to ${activePlayer.name}!`,
      );
    }

    if (!activePlayer.isAlive()) {
      addLog(`${activePlayer.name} is knocked out! Choose another fighter!`);

      const hasAliveHeroes = team.some((hero) => hero.isAlive());
      if (!hasAliveHeroes) {
        addLog("All heroes have been defeated... DEFEAT!");
        isGameOver = true;
      }
    }

    render();
  }, 600);
};

btnAttack.addEventListener(
  "click",
  withClickLimit(CLICK_LIMIT, "Attack", () => {
    if (isGameOver || !activePlayer.isAlive()) return;

    const result = activePlayer.attack(boss);
    const hitType = result.isCrit ? "CRITICAL HIT!" : "Strike!";
    addLog(`${hitType} ${activePlayer.name} deals ${result.dmg} damage.`);

    if (!boss.isAlive()) {
      addLog(`${boss.name} is defeated! VICTORY!`);
      isGameOver = true;
      render();
    } else {
      render();
      enemyTurn();
    }
  }),
);

btnSpecial.addEventListener(
  "click",
  withClickLimit(CLICK_LIMIT, "Special", () => {
    if (isGameOver || !activePlayer.isAlive()) return;

    const specialLog = activePlayer.useSpecial(boss, team);
    addLog(specialLog);

    if (!activePlayer.isAlive() && !boss.isAlive()) {
      addLog("Mutual destruction! The boss is dead!");
      isGameOver = true;
      render();
      return;
    }

    if (!boss.isAlive()) {
      addLog(`${boss.name} is pulverized! VICTORY!`);
      isGameOver = true;
      render();
      return;
    }

    if (!activePlayer.isAlive()) {
      addLog(`${activePlayer.name} fell in battle! Switch heroes.`);
      const hasAliveHeroes = team.some((hero) => hero.isAlive());
      if (!hasAliveHeroes) {
        addLog("All heroes are down... DEFEAT!");
        isGameOver = true;
        render();
        return;
      }
    }

    render();
    enemyTurn();
  }),
);

btnRestart.addEventListener("click", () => {
  team.forEach((hero) => hero.reset());
  boss.reset();
  activePlayer = team[0];
  heroSelect.value = "0";
  isGameOver = false;

  btnRestart.style.display = "none";
  logsContainer.innerHTML = "";
  addLog("A new battle has begun!");
  render();
});

render();
