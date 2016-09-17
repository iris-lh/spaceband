import { remote } from 'electron'; // native electron module
import { Game } from './rot-game/game'

document.addEventListener('DOMContentLoaded', function () {
    Game.init(remote);
});
