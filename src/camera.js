import items from './utils'
import LayerPool from './pool'

class Camera {
    constructor(game, map) {
        this.game = game;
        this.settings = game.settings;
        this.position = {x: 0, y: 0};
        this.tilemap = this.createTilemap();
        this.pool = this.createPool();
        this.map = map
        this.map.onCellGen.add(this.renderCell, this);
    }

    createTilemap() {
        let tilemap = this.game.add.tilemap();
        let tile_size = this.settings.tile_size;
        tilemap.setTileSize(tile_size.width, tile_size.height);
        tilemap.addTilesetImage('tileset');
        return tilemap;
    }

    createPool() {
        let pool = new LayerPool(this.tilemap,
                                 this.settings.screen_size,
                                 this.settings.tile_size);
        return pool;
    }

    c2t(x, y) {
        return {
            x: x * this.settings.screen_size.width,
            y: y * this.settings.screen_size.height,
        };
    }

    t2c(x, y) {
        return {
            x: Math.floor(x / this.settings.screen_size.width),
            y: Math.floor(y / this.settings.screen_size.height),
        };
    }

    extentsInvolved(x, y) {
        let half_w = Math.floor(this.settings.screen_size.width / 1.8);
        let half_h = Math.floor(this.settings.screen_size.height / 1.8);
        return [
            {x: x, y: y},
            {x: x, y: y - half_h},
            {x: x, y: y + half_h},
            {x: x - half_w, y: y},
            {x: x - half_w, y: y - half_h},
            {x: x - half_w, y: y + half_h},
            {x: x + half_w, y: y},
            {x: x + half_w, y: y - half_h},
            {x: x + half_w, y: y + half_h},
        ]
    }

    cellsInvolved(x, y) {
        let extents = this.extentsInvolved(x, y);
        var cells = {};
        for (let i=0; i<extents.length; i++) {
            let ex = extents[i];
            let cell = this.map.getTileOwner(ex.x, ex.y);
            cells[[cell.position.x, cell.position.y]] = cell;
        }
        return cells;
    }

    lookAt(x, y) {
        this.position = {x, y};
        let half_w = Math.floor(this.settings.screen_size.width / 2.0);
        let half_h = Math.floor(this.settings.screen_size.height / 2.0);
        let cells = this.cellsInvolved(x + half_w, y + half_h);
        for (var key in cells) {
            let pos = eval(`[${key}]`);
            let cell = cells[pos];
            let layer = this.pool.getLayer(cell.position.x, cell.position.y);
            this.positionLayer(layer, cell);
            if (layer.dirty) {
                this.renderCell(cell);
            }
        };
    }

    positionLayer(layer, cell) {
        let ox = this.position.x * this.settings.tile_size.width;
        let oy = this.position.y * this.settings.tile_size.height;
        let lx = cell.position.x * this.settings.pixel_size.width;
        let ly = cell.position.y * this.settings.pixel_size.height;
        let sx = lx - ox;
        let sy = ly - oy;
        layer.position.x = sx;
        layer.position.y = sy;
    }

    renderCell(cell) {
        let layer = this.pool.getLayer(cell.position.x, cell.position.y);
        layer.dirty = false;
        let tile_position = this.c2t(cell.position.x, cell.position.y);
        for (let x=0; x<this.settings.screen_size.width; x++) {
            for (let y=0; y<this.settings.screen_size.height; y++) {
                let px = tile_position.x + x;
                let py = tile_position.y + y;
                let tile = cell.getTile(px, py);
                this.tilemap.putTile(tile.tileno, x, y, layer);
            }
        }
    }
}

export default Camera
