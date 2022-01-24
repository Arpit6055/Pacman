let pScore = 0,
  gScore = 0,
  contBlink = 50,
  ghost = false,
  ghost2 = false;
let player = {
  x: 50,
  y: 100,
  pacMouth: 320,
  pacDir: 0,
  pSize: 32,
  speed: 10,
};
let enemy = {
  x: 0,
  y: 350,
  speed: 0.5,
  moving: 0,
  diry: 0,
  dirx: 0,
  ghostNum: 0,
  flash: 0,
  ghostEat: false,
};
let enemy2 = {
  x: 0,
  y: 350,
  speed: 0.5,
  moving: 0,
  diry: 0,
  dirx: 0,
  ghostNum: 0,
  flash: 0,
  ghostEat: false,
};
let powerDot = {
  x: 10,
  y: 10,
  powerUp: false,
  pCountDown: 0,
  ghostNum: 0,
};
let alerts = document.getElementById("alert");
let canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
let context = canvas.getContext("2d");
let container = document.getElementById("container");
container.append(canvas);
document.getElementById("alert").style.display = "none";

let lose = new Image();
lose.src = "../img/lose.png";
let backgroundimg = new Image();
backgroundimg.src = "../img/image.png";
let mainImage = new Image();
mainImage.ready = false;
mainImage.onload = checkReady;
mainImage.src = "../img/pac.png";

let success ='success'
let danger ='danger'
function displayScore(e) {
  let scoreCon = document.getElementById("scorecard");
  scoreCon.innerHTML = `<div class="alert alert-${e} show" role="alert" style="margin-top: 5%;"><strong>Player: ${pScore} vs Ghost: ${gScore}</strong></div>`;
}

displayScore(success);

//key clicks for controlling
let keyClick = {};
//keyclick event listner
document.addEventListener("keydown", keyDown, false);
function keyDown(event) {
  keyClick[event.keyCode] = true;
  move(keyClick);
}

document.addEventListener("keyup", keyUp, false);
function keyUp(event) {
  delete keyClick[event.keyCode];
}

function checkReady() {
  this.ready = true;
  playGame();
}

function playGame() {
  render();
  requestAnimationFrame(playGame);
}

function myNum(n) {
  return Math.floor(Math.random() * n) + 1;
}

function render() {
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //setting up poowerup dot position

  //ghost setup
  if (!ghost) {
    enemy.ghostNum = myNum(9) * 32;
    enemy.x = myNum(550) + 5;
    enemy.y = myNum(350) + 50;
    ghost = true;
  }
  if (!ghost2) {
    enemy2.ghostNum = myNum(9) * 32;
    enemy2.x = myNum(550) + 5;
    enemy2.y = myNum(350) + 50;
    ghost2 = true;
  }
  context.drawImage(backgroundimg, 0, 0, 700, 840, 0, 0, 700, 800);
  if (!powerDot.powerUp) {
    powerDot.x = myNum(500) + 30;
    powerDot.y = myNum(350);
    powerDot.powerUp = true;
  }
  //setting up the power dot
  if (powerDot.powerUp && powerDot.pCountDown < 1) {
    context.fillStyle = "rgb(255, 255, 0)";
    context.beginPath();
    context.arc(powerDot.x, powerDot.y, 10, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  if (enemy.moving < 0) {
    enemy.moving = myNum(20) * 3 + myNum(2);
    enemy.speed = myNum(3);
    enemy.dirx = 0;
    enemy.diry = 0;
    if (powerDot.ghostEat) {
      enemy.speed = enemy.speed * -1;
    }
    if (enemy.moving % 2) {
      if (player.x < enemy.x) {
        enemy.dirx = -enemy.speed;
      } else {
        enemy.dirx = enemy.speed;
      }
    } else {
      if (player.y < enemy.y) {
        enemy.diry = -enemy.speed;
      } else {
        enemy.diry = enemy.speed;
      }
    }
  }
  if (enemy2.moving < 0) {
    enemy2.moving = myNum(20) * 3 + myNum(2);
    enemy2.speed = myNum(3);
    enemy2.dirx = 0;
    enemy2.diry = 0;
    if (powerDot.ghostEat) {
      enemy2.speed = enemy2.speed * -1;
    }
    if (enemy2.moving % 2) {
      if (player.x < enemy2.x) {
        enemy2.dirx = -enemy2.speed;
      } else {
        enemy2.dirx = enemy2.speed;
      }
    } else {
      if (player.y < enemy2.y) {
        enemy2.diry = -enemy2.speed;
      } else {
        enemy2.diry = enemy2.speed;
      }
    }
  }
  //for keeping enemy inside the frame
  {
    if (enemy.x >= canvas.width - 32) {
      enemy.x = 0;
    }
    if (enemy.y >= canvas.height - 32) {
      enemy.y = 0;
    }
    if (enemy.x < 0) {
      enemy.x = canvas.width - 32;
    }
    if (enemy.y < 0) {
      enemy.y = canvas.height - 32;
    }
  }
  {
    if (enemy2.x >= canvas.width - 32) {
      enemy2.x = 0;
    }
    if (enemy2.y >= canvas.height - 32) {
      enemy2.y = 0;
    }
    if (enemy2.x < 0) {
      enemy2.x = canvas.width - 32;
    }
    if (enemy2.y < 0) {
      enemy2.y = canvas.height - 32;
    }
  }

  enemy.moving--;
  enemy.x += enemy.dirx;
  enemy.y += enemy.diry;

  enemy2.moving--;
  enemy2.x += enemy2.dirx;
  enemy2.y += enemy2.diry;

  //collison detection of player and powerdot
  if (
    player.x <= powerDot.x &&
    powerDot.x <= player.x + 32 &&
    player.y <= powerDot.y &&
    powerDot.y <= player.y + 32
  ) {
    console.log("hit");
    powerDot.powerUp = false;
    powerDot.pCountDown = 500;
    powerDot.ghostNum = enemy2.ghostNum;
    powerDot.ghostNum = enemy.ghostNum;
    enemy.ghostNum = 384;
    enemy2.ghostNum = 384;
    powerDot.x = 0;
    powerDot.y = 0;
    powerDot.ghostEat = true;
    player.speed = 15;
    pScore++;
    displayScore(success);
    
  }


  //countdown
  if (powerDot.ghostEat) {
    let timeLeft = Math.ceil(powerDot.pCountDown/10);
    console.log(timeLeft);
    powerDot.pCountDown--;
    
   context.font = '30px serif';
    context.fillText(`time left: ${timeLeft}`, 400,32, 200)
    if (powerDot.pCountDown <= 0) {
      powerDot.ghostEat = false;
      enemy2.ghostNum = powerDot.ghostNum;
      enemy.ghostNum = powerDot.ghostNum;
    }
  }

  // collision detection of enemy and player
  if (
    player.x <= enemy.x + 26 &&
    enemy.x <= player.x + 26 &&
    player.y <= enemy.y + 26 &&
    enemy.y <= player.y + 32
  ) {
    console.log("ghost has eaten you sucker");
    if (powerDot.ghostEat) {
      pScore++;
    } else {
      gScore++;
    }
    displayScore(success);
    enemy.x = player.x + 200;
    enemy.y = player.y + 200;
  }

  if (
    player.x <= enemy2.x + 26 &&
    enemy2.x <= player.x + 26 &&
    player.y <= enemy2.y + 26 &&
    enemy2.y <= player.y + 32
  ) {
    console.log("ghost has eaten you sucker");
    if (powerDot.ghostEat) {
      pScore++;
    } else {
      gScore++;
    }
    displayScore(success);
    enemy2.x = player.x + 200;
    enemy2.y = player.y + 200;
  }

  //blinking
  if (contBlink > 0) {
    contBlink--;
  } else {
    countBlink = 20;
    if (enemy.flash == 0) {
      enemy.flash = 32;
    } else {
      enemy.flash = 0;
    }
  }

  if (contBlink > 0) {
    contBlink--;
  } else {
    countBlink = 20;
    if (enemy2.flash == 0) {
      enemy2.flash = 32;
    } else {
      enemy2.flash = 0;
    }
  }

  //adding images on the page
  context.drawImage(
    mainImage,
    enemy.ghostNum,
    enemy.flash,
    32 * 1,
    32 * 1,
    enemy.x,
    enemy.y,
    32,
    32
  );
  context.drawImage(
    mainImage,
    enemy2.ghostNum,
    enemy2.flash,
    32 * 1,
    32 * 1,
    enemy2.x,
    enemy2.y,
    32,
    32
  );
  context.drawImage(
    mainImage,
    player.pacMouth,
    player.pacDir,
    32,
    32,
    player.x,
    player.y,
    player.pSize,
    player.pSize
  );
  if (gScore > pScore) {
    context.drawImage(lose, 0, 0, 600, 400);
    player.x = -100;
    player.y = -100;
    document.getElementById("alert").style.display = "flex";
    displayScore(danger);
  }
  //context.drawImage(src, x-axis(web), y-axis(web), x-axis(img), y-axis(img), x(size you want to display), y(size you want to display), )
  // context.drawImage(mainImage, pacMouth,pacDirection, 32,32,50,50,32,32)
}
function move(keyClick) {
  if (37 in keyClick) {
    player.x -= player.speed;
    player.pacDir = 64;
  }
  if (38 in keyClick) {
    player.y -= player.speed;
    player.pacDir = 96;
  }
  if (39 in keyClick) {
    player.x += player.speed;
    player.pacDir = 0;
  }
  if (40 in keyClick) {
    player.y += player.speed;
    player.pacDir = 32;
  }
  if (player.x >= canvas.width - 32) {
    player.x = 0;
  }
  if (player.y >= canvas.height - 32) {
    player.y = 0;
  }
  if (player.x < 0) {
    player.x = canvas.width - 32;
  }
  if (player.y < 0) {
    player.y = canvas.height - 32;
  }
  if (player.pacMouth == 320) {
    player.pacMouth = 352;
  } else {
    player.pacMouth = 320;
  }
  render();
}
