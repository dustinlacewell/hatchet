import Map from '../map'
import Generator from '../mapgen'

class WorldGen extends Phaser.State {

    preload() {
        console.log("Generating world...");
        let settings = this.game.settings;
        console.log(`Screen width: ${settings.screen_size.width}`);
        console.log(`Screen height: ${settings.screen_size.height}`);
        this.game.map = new Map(settings.screen_size, Generator);
    }

    create() {
        this.game.state.start('GameState');
    }

}

export default WorldGen
