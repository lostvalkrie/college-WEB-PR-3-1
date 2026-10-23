import { Player } from "./Player.js";
import { Boss } from "./Boss.js";
import { withClickLimit } from "./utils.js";

const player = new Player({
  name: "Megumin",
  maxHp: 100,
  avatar: "megumin.png",
});

const boss = new Boss({
  name: "Verdia",
  maxHp: 320,
  avatar: "verdia.png",
});

let isGameOver = false;
const CLICK_LIMIT = 7;

const bossAvatar = document.getElementById("boss-avatar");
const bossName = document.getElementById("boss-name");
const bossHp = document.getElementById("boss-hp");
const bossBar = document.getElementById("boss-bar");

const playerAvatar = document.getElementById("player-avatar");
const playerName = document.getElementById("player-name");
const playerHp = document.getElementById("player-hp");
const playerBar = document.getElementById("player-bar");

const logEl = document.getElementById("log");
const logsContainer = document.getElementById("logs");
const btnAttack = document.getElementById("btn-attack");
const btnExplosion = document.getElementById("btn-explosion");
const btnRestart = document.getElementById("btn-restart");

const addLog = (text) => {
  logEl.textContent = text;
  const logEntry = document.createElement("p");
  logEntry.className = "log-entry";
  logEntry.textContent = text;
  logsContainer.prepend(logEntry);
};

const render = () => {
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
};

const enemyTurn = () => {
  if (!boss.isAlive()) return;

  btnAttack.disabled = true;
  btnExplosion.disabled = true;

  setTimeout(() => {
    const action = boss.attack(player);

    if (action.isMiss) {
      addLog(`${boss.name} swings his massive sword, but MISSES!`);
    } else {
      addLog(
        `${boss.name} strikes with sword for ${action.dmg} damage! [${player.name} HP: ${player.hp}/${player.maxHp}]`,
      );
    }

    if (!player.isAlive()) {
      addLog(`${player.name} fell in battle... Defeat!`);
      isGameOver = true;
    }

    render();
  }, 600);
};

btnAttack.addEventListener(
  "click",
  withClickLimit(CLICK_LIMIT, "Attack", () => {
    if (isGameOver) return;

    const result = player.attack(boss);
    const hitType = result.isCrit ? "CRITICAL HIT!" : "Staff strike!";

    addLog(
      `${hitType} ${player.name} deals ${result.dmg} damage. [${boss.name} HP: ${boss.hp}/${boss.maxHp}]`,
    );

    if (!boss.isAlive()) {
      addLog(`${boss.name} is defeated! Victory!`);
      isGameOver = true;
      render();
    } else {
      render();
      enemyTurn();
    }
  }),
);

btnExplosion.addEventListener(
  "click",
  withClickLimit(CLICK_LIMIT, "Explosion", () => {
    if (isGameOver) return;

    const result = player.castExplosion(boss);
    addLog(
      `EXPLOSION! ${boss.name} takes ${result.dmgToBoss} damage [HP: ${boss.hp}/${boss.maxHp}], recoil hits ${player.name} for ${result.selfDmg} HP [HP: ${player.hp}/${player.maxHp}]`,
    );

    if (!player.isAlive() && !boss.isAlive()) {
      addLog("Mutual destruction! Both collapsed!");
      isGameOver = true;
      render();
      return;
    }

    if (!player.isAlive()) {
      addLog(`${player.name} collapsed from recoil... Defeat!`);
      isGameOver = true;
      render();
      return;
    }

    if (!boss.isAlive()) {
      addLog(`${boss.name} was pulverized! Absolute victory!`);
      isGameOver = true;
      render();
    } else {
      render();
      enemyTurn();
    }
  }),
);

btnRestart.addEventListener(
  "click",
  withClickLimit(CLICK_LIMIT, "Restart", (e) => {
    player.reset();
    boss.reset();
    isGameOver = false;

    e.target.style.display = "none";
    logsContainer.innerHTML = "";
    addLog("Battle restarted! Your turn.");

    render();
  }),
);

render();
