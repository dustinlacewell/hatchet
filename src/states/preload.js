class Preload extends Phaser.State {

    preload() {
        let settings = this.game.settings;
        this.game.load.image('tileset', this.game.settings.tileset);
    }

    create() {
        this.game.state.start('WorldGen');
    }
}

export default Preload
