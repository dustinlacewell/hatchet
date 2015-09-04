import Map from '../map'
import Generator from '../mapgen'

class WorldgenState extends Phaser.State {

    create() {
        this.game.map = new Map(this.game, Generator);
        this.game.state.start('gamestate');
    }

}

export default WorldgenState
