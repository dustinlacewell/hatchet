import choice from './utils'
import Noise from './perlin'
import Cell from './cell'

class Tile {
    constructor(entity) {
        this.terrain = null;
        this.minor = {}; // any number of non-major items
        this.major = entity; // a single major item
    }

    putEntity(entity) {
        this.major = entity;
    }

}

class Generator {
    constructor(model_manager, entity_manager, cell_size, seed=0) {
        this.model_manager = model_manager;
        this.entity_manager = entity_manager;
        this.cell_size = cell_size;
        this.seed = seed;
        this.noise = new Noise()
        this.noise.seed(seed);
    }

    pickModel(val) {
        if (val > 0) {
            return choice(["grass", "tree", "pine"]);
        } else if (val > -0.1) {
            return choice(["grass", "grass", "grass", "flower"]);
        } else {
            return choice(["grass", "dirt", "dirt", "dirt", "dirt"]);
        }
    }

    newTile(x, y) {
        let val = this.noise.perlin2(x/7.0, y/7.0);
        let variation = Math.random() * .1 - .1;
        val += variation;
        let model_name = this.pickModel(val);
        let entity = this.entity_manager.makeEntity(model_name);
        return new Tile(entity);
    }

    newCell(x, y) {
        let tx = x * this.cell_size.width;
        let ty = y * this.cell_size.height;
        var tiles = {}
        for (var i=tx; i<tx + this.cell_size.width; i++) {
            for (var j=ty; j<ty + this.cell_size.height; j++) {
                tiles[[i, j]] = this.newTile(i, j);
            }
        }
        let cell = new Cell(tiles, {x, y});
        return cell;
    }

}

export default Generator
