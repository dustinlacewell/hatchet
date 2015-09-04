class Settings extends Phaser.State {
    preload() {
        // load the core settings file
        this.game.load.json('settings', 'json/settings.json');
        // add a handler to respond to when core settings are loaded
        this.game.load.onFileComplete.add((progress, key) => {
            if (key == 'settings') {
                // set the core settings onto the game
                this.game.settings = this.game.cache.getJSON('settings');
            }
        });
    }

    create() {
        // load the tileset
        this.game.state.start('tileset');
    }

}

export default Settings
