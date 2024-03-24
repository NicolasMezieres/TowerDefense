const body = document.querySelector("body");
const game = document.querySelector(".game");
const grid = document.querySelector(".grid");
const gold = document.querySelector(".money");
const gameOver = document.querySelector(".gameOver");
const buyRedTurret = document.querySelector(".buyRedTurret");
const priceTurret = document.querySelector(".priceTurret");
const caseSelect = document.createElement("div");
const menuStart = document.querySelector(".menuStart");
const buttonStart = document.querySelector(".start");
const timer = document.querySelector(".timer");
let caseSelected;
caseSelect.classList.add("caseSelect");
const turretArray = [];
const turrets = [];
let turretNumber = 0;
let isTurret = false;
let missiles = 0;
let mobDead = 0;
let lvl = 1;
const slimes = [];
// tableau de variable pour chaque interval différent
const intervalSlimes = [];
const bounding = []; //enplacement de tous les angles du chemin
const mobMove = [];
//Création de la grille de jeu
const arrayRows = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
];

class roadMap {
  constructor(map, roadMob) {
    this.mapRoad = map;
    this.roadMob = roadMob;
  }
  initGround() {
    this.mapRoad.forEach((nameClass) => {
      nameClass[1].forEach((cell) => {
        document.querySelector("." + cell).classList.add(nameClass[0], "road");
      });
    });
    for (let i = 0; i < this.roadMob.length; i++) {
      bounding.push(
        document.querySelector(`.${this.roadMob[i][1]}`).getBoundingClientRect()
      );
    }
  }
}

//Création du joueur
class player extends roadMap {
  constructor(map, roadMob, life, money, image) {
    super(map, roadMob);
    this.life = life;
    this.money = money;
    this.image = image;
  }
  lifePosition() {
    const life = document.querySelector(
      `.${this.roadMob[this.roadMob.length - 1][1]}`
    );
    life.classList.add("life");
  }
  isAlive() {
    const life = document.querySelector(".life");
    switch (this.life) {
      case 4:
        life.style.backgroundImage = "url('./image/heart75.png')";
        body.style.backgroundColor = "#08cc0a";
        break;
      case 3:
        life.style.backgroundImage = "url('./image/heart50.png')";
        body.style.backgroundColor = "yellow";
        break;
      case 2:
        life.style.backgroundImage = "url('./image/heart25.png')";
        body.style.backgroundColor = "orange";
        break;
      case 1:
        life.style.backgroundImage = "url('./image/heart1.png')";
        body.style.backgroundColor = "red";
        break;
      default:
        life.style.backgroundImage = "url('./image/heart0.png')";
        break;
    }
    if (this.life <= 0) {
      game.style.opacity = 0;
      body.style.backgroundColor = "black";
      setTimeout(() => {
        gameOver.style.visibility = "visible";
      }, 1500);
    }
  }
}
//Création des tourrelles
class turret {
  constructor(damage, price, id, cell, color) {
    this.id = id;
    this.damage = damage;
    this.price = price;
    this.cell = cell;
    this.colorTurret = color;
  }
  //Spawn Turret
  display() {
    const newTurret = document.createElement("div");
    newTurret.classList.add(`turret${this.id}`, `${this.colorTurret}`);
    this.cell.appendChild(newTurret);
    setInterval(() => {
      this.ennemie();
    }, 1000);
  }
  //turret detect and attack
  ennemie() {
    const tourelle = document.querySelector(`.turret${this.id}`);
    const tourelleBounding = tourelle.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      if (slimes[i]?.life > 0) {
        let cible = document.querySelector(`.${slimes[i].name}${i}`);
        let cibleBounding = cible?.getBoundingClientRect();
        // let cibleBounding = cibles[i].getBoundingClientRect();
        if (typeof cibleBounding != "undefined") {
          if (
            cibleBounding.bottom - 25 <= tourelleBounding.bottom + 100 &&
            cibleBounding.top + 25 >= tourelleBounding.top - 100 &&
            cibleBounding.right + 25 >= tourelleBounding.right - 100 &&
            cibleBounding.left - 25 <= tourelleBounding.left + 100
          ) {
            const mob = document.querySelector(`.life${slimes[i].name}${i}`);
            missiles++;
            const missile = new projectile(this.damage, missiles);
            missile.display(tourelleBounding, cible);
            slimes[i].life -= this.damage;
            slimes[i].isAlive();
            setTimeout(() => {
              mob.style.width = slimes[i].life + "px";
            }, 400);

            return;
          }
        }
      }
    }
  }
}
//Creation projectile
class projectile extends turret {
  constructor(damage, id) {
    super(damage);
    this.id = id;
  }
  //apparition du projectile
  display(turret, target) {
    const missile = document.createElement("div");
    missile.classList.add("missile", `missile${missiles}`);
    missile.style.top = turret.top + 15 + "px";
    missile.style.left = turret.left + 15 + "px";
    grid.appendChild(missile);
    setTimeout(() => {
      this.attack(target);
    }, 100);
  }
  attack(target) {
    const missile = document.querySelector(`.missile${this.id}`);
    const targetBounding = target.getBoundingClientRect();
    missile.style.top = targetBounding.top + 21 + "px";
    missile.style.left = targetBounding.left + 18 + "px";
    setTimeout(() => {
      missile.remove();
    }, 300);
  }
}
//Creation class mobs
class mobs {
  constructor(life, damage, image, name, id, money) {
    this.life = life;
    this.damage = damage;
    this.image = image;
    this.name = name;
    this.id = id;
    this.angle = 1;
    this.money = money;
  }
  //spawwn mob
  display() {
    const creature = document.createElement("div");
    creature.classList.add("mob", `${this.name}${this.id}`);
    creature.style.backgroundImage = `url('${this.image}')`;
    creature.style.display = "grid";
    const creatureLife = document.createElement("div");
    creatureLife.classList.add(`life${this.name}${this.id}`);
    creatureLife.style.height = "3px";
    creatureLife.style.width = this.life + "px";
    creatureLife.style.backgroundColor = "red";
    creatureLife.style.position = "absolute";
    creatureLife.style.justifySelf = "center";
    creature.appendChild(creatureLife);
    grid.appendChild(creature);
  }
  positionStart() {
    const creature = document.querySelector(`.${this.name}${this.id}`);
    creature.style.top = bounding[0].top + 4 + "px";
    creature.style.left = bounding[0].left + "px";
    //roadMobLvl1.length;
  }
  move() {
    const creature = document.querySelector(`.${this.name}${this.id}`);
    if (
      // la creature est en contact avec la bordure
      parseInt(creature.style.top) == parseInt(bounding[this.angle].top) ||
      parseInt(creature.style.left) == 7 + parseInt(bounding[this.angle].left)
    ) {
      this.angle++;
      clearInterval(intervalSlimes[this.id]);
      // si le nombre d'angle est plus grand ou égale à l'angle du prochain bord
      if (this.angle < bounding.length) {
        creature.style.top = parseInt(creature.style.top) + 5 + "px";
        creature.style.left = parseInt(creature.style.left) + 1 + "px";
        nextInterval(this.id, intervalSlimes[this.id]);
      } else {
        player1.life--;
        player1.isAlive();
        creature.remove();
      }
    } else {
      creature.style.transform = "rotateY(0deg)";
      switch (roadMobLvl1[this.angle - 1][0]) {
        case "right": // de gauche vers la droite
          creature.style.left = parseInt(creature.style.left) + 1 + "px";
          creature.style.transform = "rotateY(180deg)";
          break;
        case "left": // de droite vers la Gauche
          creature.style.left = parseInt(creature.style.left) - 1 + "px";
          break;
        case "top": // de bas vers le haut
          creature.style.top = parseInt(creature.style.top) - 1 + "px";
          break;
        case "bottom": // de haut en bas
          creature.style.top = parseInt(creature.style.top) + 1 + "px";
          break;
        default:
          break;
      }
    }
  }
  isAlive() {
    const creature = document.querySelector(`.${this.name}${this.id}`);
    if (this.life == 0) {
      mobDead++;
      gold.innerText = parseInt(gold.innerText) + this.money;
      creature.style.backgroundImage = `url('./image/mobs/death${this.name}.gif')`;
      setTimeout(() => {
        creature.remove();
        delete slimes[this.id];
      }, 500);
      clearInterval(intervalSlimes[this.id]);
    }
  }
}
//appuie sur le bouton Start
buttonStart.addEventListener("click", () => {
  menuStart.style.opacity = 0;
  menuStart.style.zIndex = -1;
  gridGround();
  guideline();
  heartPlayer();
  timerBeforeWave();
  setTimeout(() => {
    wave();
  }, parseInt(timer.innerText) * 1000);
  selectCase();
});
//Creation de la grille du jeu
function gridGround() {
  for (let i = 0; i < 13; i++) {
    //nombre de rows
    for (let j = 0; j < 20; j++) {
      //nombre de columns 13
      let cell = document.createElement("div");
      cell.classList.add(`case${arrayRows[i]}${j + 1}`, "case");
      grid.appendChild(cell);
    }
  }
}
//Mise en place du chemin des monstres
function guideline() {
  let mapRoadLvl1 = new roadMap(roadMapLvl1, roadMobLvl1);
  mapRoadLvl1.initGround();
}
//Mise en place du coeur du joueur
function heartPlayer() {
  const player1 = new player(
    roadMapLvl1,
    roadMobLvl1,
    5,
    100,
    "./image/heart100.png"
  );
  //placement de la vie du joueur
  player1.lifePosition();
}
// Vague de monstre lancer
function wave() {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const slime = new mobs(
        15,
        1,
        "./image/mobs/blueSlime.gif",
        "blueSlime",
        i,
        2
      );
      slimes.push(slime);
      intervalSlimes.push(slime.name + slime.id);
      slime.display();
      slime.positionStart();
      nextInterval(i);
    }, 2000 * i); //2000
  }
}

function nextInterval(i) {
  intervalSlimes[i] = setInterval(() => {
    slimes[i].move();
  }, 17); //17
}
//Mise en place de la possibiler de selectionner une case
function selectCase() {
  grid.childNodes.forEach((element) => {
    if (
      element.classList.contains("case") &&
      !element.classList.contains("road") &&
      !element.classList.contains("caseTurret") &&
      !element.classList.contains("life")
    ) {
      element.addEventListener("click", () => {
        element.appendChild(caseSelect);
        caseSelected = element;
      });
    }
  });
}
function reStart() {
  location.reload();
}
function timerBeforeWave() {
  for (let i = 0; i < parseInt(timer.innerText); i++) {
    setTimeout(() => {
      timer.innerHTML--;
      if (parseInt(timer.innerText) == 0) {
        timer.style.visibility = "hidden";
      }
    }, 1000 * (i + 1));
  }
}
buyRedTurret.addEventListener("click", () => {
  if (
    typeof caseSelected != "undefined" &&
    !caseSelected.classList.contains("caseTurret") &&
    parseInt(gold.innerText) >= parseInt(priceTurret.innerText)
  ) {
    gold.innerText -= priceTurret.innerText;
    turretNumber++;
    const defense = new turret(1, 25, turretNumber, caseSelected, "redTurret");
    defense.display();
    caseSelected.classList.add("caseTurret");
  } else {
    console.log(
      "tu n'as rien selectionner ou tu as déja une tourelle ignare à moins que tu sois pauvre"
    );
  }
});
