class Cell {
    constructor(tiles, position=null) {
        this.tiles = tiles;
        this.position = position;
    }

    getTile(x, y) {
        return this.tiles[[x, y]];
    }

    setTile(x, y, tile) {
        this.tiles[[x, y]] = tile;
    }
}

export default Cell
