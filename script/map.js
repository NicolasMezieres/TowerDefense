const body = document.querySelector("body");
const grid = document.querySelector(".grid");
let slimes = [];
let intervalSlime = []; // tableau de variable pour chaque interval différent
let bounding = [];
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
for (let i = 0; i < 13; i++) {
  //nombre de rows
  for (let j = 0; j < 20; j++) {
    //nombre de columns 13
    let cell = document.createElement("div");
    cell.classList.add(`case${arrayRows[i]}${j + 1}`, "case");
    grid.appendChild(cell);
  }
}
//Positionnement du chemin des monstres
roadMapLvl1.forEach((nameClass) => {
  nameClass[1].forEach((cell) => {
    document.querySelector("." + cell).classList.add(nameClass[0]);
  });
});
for (let i = 0; i < roadMobLvl1.length; i++) {
  bounding.push(
    document.querySelector(`.${roadMobLvl1[i][1]}`).getBoundingClientRect()
  );
}
let index = 1;
//Creation class mobs
class mobs {
  constructor(life, damage, image, name, id, angle) {
    this.life = life;
    this.damage = damage;
    this.image = image;
    this.name = name;
    this.id = id;
    this.angle = 1;
  }
  display() {
    const creature = document.createElement("img");
    creature.classList.add(`${this.name}${this.id}`);
    creature.src = this.image;
    creature.style.position = "absolute";
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
      // parseInt(10 - bounding[i].top);
      this.angle++;
      clearInterval(`intervalSlime${this.angle}`);
      if (this.angle < bounding.length) {
        creature.style.top = parseInt(creature.style.top) + 1 + "px";
        creature.style.left = parseInt(creature.style.left) + 1 + "px";
        nextInterval();
      } else {
        console.log("fin du parcours");
        creature.remove();
      }
    } else {
      switch (roadMobLvl1[this.angle - 1][0]) {
        case "right": // de gauche vers la droite
          creature.style.left = parseInt(creature.style.left) + 1 + "px";
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
          console.log("fin du parcours");
          break;
      }
    }
  }
}
let intervalSlime1;
let intervalSlime2;
let intervalSlime3;
let intervalSlime4;
let intervalSlime5;
let intervalSlime6;
let intervalSlime7;
let intervalSlime8;
let intervalSlime9;
let intervalSlime10;
let intervalSlime11;
let intervalSlime12;
let intervalSlime13;
let intervalSlime14;
let intervalSlime15;
let intervalSlime16;
let intervalSlime17;
let intervalSlime18;
let intervalSlime19;
let intervalSlime20;
let intervalSlimes = [];
for (let i = 0; i < 20; i++) {
  intervalSlimes.push(`${intervalSlime}${i}`);
}
for (let i = 0; i < 20; i++) {
  setTimeout(() => {
    const slime = new mobs(20, 1, "./image/mobs/blueSlime.gif", "slime", i);
    slimes.push(slime);
    intervalSlime.push(slime.name);
    slime.display();
    slime.positionStart();
    nextInterval(i, intervalSlime[i]);
  }, 5000 * i);
}
// setTimeout(() => {
//   nextInterval();
// }, 1000 * i);
function nextInterval(i) {
  intervalSlimes[i] = setInterval(() => {
    slimes[i].move();
  }, 20);
}
