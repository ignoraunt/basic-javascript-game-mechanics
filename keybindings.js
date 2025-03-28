import { player } from "./general-render.js";

export var keys = null;

export function keybindings() {
  keys = {
    w: false,
    a: false,
    d: false,
    space: false,
  };

  addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        keys.w = true;
        break;
      case "KeyD":
        keys.d = true;
        player.lastKey = "d";
        break;
      case "KeyA":
        keys.a = true;
        player.lastKey = "a";
        break;
      case "Space":
        keys.space = true;
        break;
    }
  });

  addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        keys.w = false;
        break;
      case "KeyD":
        keys.d = false;
        break;
      case "KeyA":
        keys.a = false;
        break;
      case "Space":
        keys.space = false;
        break;
    }
  });
}
