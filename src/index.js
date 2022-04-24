import {Game} from './game';
import { Vec2 } from "./vec2";
document.addEventListener('load', () => {
  window.game = new Game();
  window.game.run();
}, true);







