const body = document.querySelector("body");
const grid = document.querySelector(".grid");
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
//Creation class mobs
class mobs {
  constructor(health, moveSpeed, damage) {
    mobs.health = health;
    mobs.moveSpeed = moveSpeed;
    mobs.damage = damage;
  }
}

const laneTop = document.querySelector(".laneTop");
