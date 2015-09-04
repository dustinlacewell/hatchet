import items from './utils'
import LayerPool from './pool'

class Camera {
    constructor(game) {
        this.game = game;
        this.settings = game.settings;
        this.position = {x: 0, y: 0};
        this.tilemap = this.createTilemap();
        this.pool = this.createPool();
        this.map = game.map;
        this.map.onCellGen.add(this.renderCell, this);
    }

    createTilemap() {
        let tilemap = this.game.add.tilemap();
        tilemap.setTileSize(this.game.tileset.width, this.game.tileset.height);
        for (var tileset in this.game.tileset.tilesets) {
            let firstgid = this.game.tileset.tilesets[tileset];
            tilemap.addTilesetImage(
                tileset, null,
                this.game.tileset.width,
                this.game.tileset.height,
                0, 0, firstgid);
        }
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
        let half_w = this.settings.half_screen.width;
        let half_h = this.settings.half_screen.height;
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
        let tile_position = this.c2t(cell.position.x, cell.position.y);
        for (let x=0; x<this.settings.screen_size.width; x++) {
            for (let y=0; y<this.settings.screen_size.height; y++) {
                let px = tile_position.x + x;
                let py = tile_position.y + y;
                let tile = cell.getTile(px, py);
                this.renderTile(tile, x, y, layer);
            }
        }
        layer.dirty = false;
    }

    renderTile(tile, x, y, layer) {
        let entities = [tile.major, tile.minor, tile.terrain];
        let tile_name = null;
        if (tile.major) {
            let components = this.game.entities.getComponents(tile.major);
            if ("visible" in components) {
                tile_name = components.visible.tile;
            }
        }

        if (tile_name == null){
            for (var i=0; i<tile.minor.length; i++) {
                let entity = tile.minor[i];
                let components = this.game.entities.getComponents(e);
                if ("visible" in components) {
                    tile_name = components.visible.tile;
                    break;
                }
            }
        }

        tile_name = tile_name || "dirt";
        let tile_index = this.game.tileset.tiles[tile_name];
        this.tilemap.putTile(tile_index, x, y, layer);
    }

}

export default Camera
