import { keybindings } from "./keybindings.js";
import { generalRender } from "./general-render.js";

(() => {
  var modulesToExecList = [keybindings, generalRender];
  var i;
  for (i = 0; i < modulesToExecList.length; i++) {
    setTimeout(
      (i) => {
        modulesToExecList[i]();
      },
      0,
      i
    );
  }
})();
