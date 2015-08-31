class Settings extends Phaser.State {
    preload() {
        this.game.load.json('settings', 'json/settings.json');
    }

    create() {
        this.game.settings = this.game.cache.getJSON('settings');
        this.game.settings['screen_size'] = {
            width: this.game.width / this.game.settings.tile_size.width,
            height: this.game.height / this.game.settings.tile_size.height,
        };
        this.game.settings['pixel_size'] = {
            width: this.game.width,
            height: this.game.height,
        };
        this.game.state.start('Preload');

    }
}

export default Settings
