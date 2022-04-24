import {Game} from './game';
document.addEventListener('load', () => { //makes a new game window when the page loads
  window.game = new Game();
  window.game.run();
}, true);


document.addEventListener("mousemove", function(e) { 
console.log("X "+e.clientX);  //print x mouse position
console.log("Y "+e.clientY);  //print y mouse position

});