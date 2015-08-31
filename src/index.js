import Settings from './states/settings';
import Preload from './states/preload';
import WorldGen from './states/worldgen';
import GameState from './states/gamestate';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
        console.log("Loading settings...");
		this.state.add('Settings', Settings);
		this.state.add('Preload', Preload);
		this.state.add('WorldGen', WorldGen);
		this.state.add('GameState', GameState);
		this.state.start('Settings');
	}

}

new Game();
