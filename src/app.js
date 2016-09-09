import { remote } from 'electron'; // native electron module
import { ROT } from './rot-game/rot'
import { Game } from './rot-game/game'

document.addEventListener('DOMContentLoaded', function () {
    Game.init(remote);
});
