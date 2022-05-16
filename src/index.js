import {Game} from './game';
document.addEventListener('load', () => {
  window.game = new Game();
  window.game.run();
}, true);
