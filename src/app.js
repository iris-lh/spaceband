//import { remote } from 'electron'; // native electron module
import { ROT } from './rot-game/rot'
import { Game } from './rot-game/game'

//var app = remote.app;

document.addEventListener('DOMContentLoaded', function () {
    Game.init();
});
