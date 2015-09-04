class Tileset {

    constructor(tileconf) {
        this.width = tileconf.width;
        this.height = tileconf.height;
        this.tilesets = {};
        this.tiles = {};
        this.readConf(tileconf);
    }

    readConf(tileconf) {
        for (var tileset in tileconf.tiles) {
            // get current number of tiles
            let count = Object.keys(this.tiles).length;
            // record tileset tile index start (firstgid)
            this.tilesets[tileset] = count
            // record all tile indexes for this tileset
            let tiles = tileconf.tiles[tileset];
            for (var i=0; i<tiles.length; i++) {
                this.tiles[tiles[i]] = count + i;
            }
        }
    }
}

export default Tileset
