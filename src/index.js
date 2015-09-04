import BootState from './states/boot';
import TilesetState from './states/tileset';
import ModelState from './states/models';
import WorldgenState from './states/worldgen';
import GameState from './states/gamestate';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
        console.log("Loading settings...");
		this.state.add('boot', BootState);
		this.state.add('tileset', TilesetState);
		this.state.add('models', ModelState);
		this.state.add('worldgen', WorldgenState);
		this.state.add('gamestate', GameState);
		this.state.start('boot');
	}

}

new Game();
