import Tileset from '../tileset'

class TilesetState extends Phaser.State {

    preload() {
        // load the asset pack for the configured tileset
        let tileset_file = `tilesets/${this.game.settings.tileset}/tilesets.json`;
        this.game.load.pack('tileset', tileset_file);
    }

    create() {
        let tileconf = this.game.cache.getJSON('tiles');
        this._set_tile_size(tileconf);
        this._set_screen_size(tileconf);
        this._set_half_screen(tileconf);
        this._set_pixel_size(tileconf);
        this.game.tileset = new Tileset(tileconf);
        this.game.state.start('models');
    }

    _set_tile_size(tileconf) {
        // calculate the screen size in tiles
        this.game.settings["tile_size"] = {
            width: tileconf.width,
            height: tileconf.height,
        };
    }

    _set_screen_size(tileconf) {
        // calculate the screen size in tiles
        this.game.settings["screen_size"] = {
            width: this.game.width / tileconf.width,
            height: this.game.height / tileconf.height,
        };
    }

    _set_half_screen(tileconf) {
        // calculate the screen size in tiles
        this.game.settings["half_screen"] = {
            width: Math.floor((this.game.width / tileconf.width) / 2),
            height: Math.floor((this.game.height / tileconf.height) / 2),
        };
    }

    _set_pixel_size(tileconf) {
        // make object containing screen pixel size
        this.game.settings["pixel_size"] = {
            width: this.game.width,
            height: this.game.height,
        };
    }

}

export default TilesetState
