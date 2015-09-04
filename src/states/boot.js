class BootState extends Phaser.State {
    preload() {
        // load the core settings file
        this.game.load.json('settings', 'json/settings.json');
    }

    create() {
        this.game.settings = this.game.cache.getJSON('settings');
        // load the tileset
        this.game.state.start('tileset');
    }

}

export default BootState
