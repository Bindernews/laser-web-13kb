import { Game } from "./game";
const setupGame = () => {
  window.game = new Game();
  window.game.run();
};
document.addEventListener("load", setupGame, true);
