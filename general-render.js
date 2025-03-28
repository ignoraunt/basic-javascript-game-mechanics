import { keys } from "./keybindings.js";

export var player = null;

export function generalRender() {
  var canvas = document.querySelector("canvas");
  var cs = canvas.getContext("2d");

  var canvasWidth = 800;
  var canvasHeight = 600;

  canvas.classList.remove("invisible");

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  var playerWidth = 48;
  var playerHeight = 48;

  var centerX = canvasWidth / 2 - playerWidth / 2;

  var pointerCoords = [0.0, 0.0];
  var projectilesList = [];

  class Projectile {
    constructor({ pos, vel }) {
      this.pos = pos;
      this.vel = vel;
      this.color = "hsl(210deg 75% 50%)";
    }

    updatePosition() {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    }

    draw() {
      cs.beginPath();
      cs.fillStyle = this.color;
      cs.arc(this.pos.x, this.pos.y, 4, 0, Math.PI * 2);
      cs.fill();
      cs.closePath();
    }

    animate() {
      this.updatePosition();
      this.draw();
    }
  }

  class Visor {
    constructor(w, h, color) {
      this.x = 0;
      this.y = 0;
      this.w = w;
      this.h = h;
      this.color = color;
      this.radius = 50;
      this.radians = 0;
    }

    updatePosition() {
      this.x = player.x + playerWidth / 2;
      this.y = player.y + playerHeight / 2;

      this.radians = Math.atan2(
        pointerCoords[1] - this.y,
        pointerCoords[0] - this.x
      );
    }

    draw() {
      cs.beginPath();
      cs.strokeStyle = this.color;
      cs.lineWidth = 3;
      cs.moveTo(this.x, this.y);
      cs.lineTo(
        this.x + Math.cos(this.radians) * this.radius,
        this.y + Math.sin(this.radians) * this.radius
      );
      cs.closePath();
      cs.stroke();
    }

    animate() {
      this.updatePosition();
      this.draw();
    }
  }

  class Player {
    constructor(x, y, w, h, color) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.color = color;
      this.gravity = 0.163;
      this.horizontalAcceleration = 0;
      this.verticalAcceleration = 0;
      this.projectileVelocity = 8;
      this.radians = 0;
      this.lastKey;
    }

    shoot() {
      this.radians = Math.atan2(
        pointerCoords[1] - this.y,
        pointerCoords[0] - this.x
      );

      projectilesList.push(
        new Projectile({
          pos: { x: this.x + playerWidth / 2, y: this.y + playerHeight / 2 },
          vel: {
            x: Math.cos(this.radians) * this.projectileVelocity,
            y: Math.sin(this.radians) * this.projectileVelocity,
          },
        })
      );
    }

    updateHorizontalPosition() {
      this.horizontalAcceleration = 0;

      if (keys.a && this.lastKey === "a") {
        this.horizontalAcceleration = -2.7;
      } else if (keys.d && this.lastKey === "d") {
        this.horizontalAcceleration = 2.7;
      }

      this.x += this.horizontalAcceleration;

      if (this.x + this.w >= canvasWidth) {
        this.horizontalAcceleration = 0;
        this.x = canvasWidth - this.w;
      } else if (this.x <= 0) {
        this.horizontalAcceleration = 0;
        this.x = 0;
      }
    }

    updateVerticalPosition() {
      if (keys.w) {
        this.gravity = -0.12;
      } else {
        this.gravity = 0.16;
      }

      if (keys.space) {
        if (this.verticalAcceleration === 0) {
          this.verticalAcceleration = -6;
        }
      }

      this.verticalAcceleration += this.gravity;
      this.y += this.verticalAcceleration;

      if (this.y + this.h >= canvasHeight) {
        this.y = canvasHeight - this.h;
        this.verticalAcceleration = 0;
      }
    }

    draw() {
      cs.fillStyle = this.color;
      cs.strokeStyle = this.color;
      cs.fillRect(this.x, this.y, this.w, this.h);
    }

    animate() {
      this.updateHorizontalPosition();
      this.updateVerticalPosition();
      this.draw();
    }
  }

  player = new Player(
    centerX,
    320,
    playerWidth,
    playerHeight,
    "hsl(0, 38%, 52%)"
  );

  var visor = new Visor(2, 60, "hsl(0, 38%, 40%)");

  function main() {
    cs.clearRect(0, 0, canvasWidth, canvasHeight);

    player.animate();
    visor.animate();

    projectilesList.forEach((bullet, i) => {
      bullet.animate();

      if (
        bullet.pos.x > canvas.width ||
        bullet.pos.x < 0 ||
        bullet.pos.y > canvas.height ||
        bullet.pos.y < 0
      ) {
        projectilesList.splice(i, 1);
      }
    });

    requestAnimationFrame(main);
  }

  requestAnimationFrame(main);

  canvas.addEventListener("mousemove", (e) => {
    pointerCoords = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("click", () => {
    player.shoot();
  });
}
