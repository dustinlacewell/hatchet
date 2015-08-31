import choice from './utils'
import Noise from './perlin'
import Tile from './tile'
import Cell from './cell'

class Generator {
    constructor(map, seed=0) {
        this.map = map;
        this.seed = seed;
        this.noise = new Noise()
        this.noise.seed(seed);
    }

    newTile(x, y) {
        let val = this.noise.perlin2(x/7.0, y/7.0);
        let tileno = 0;
        let variation = Math.random() * .1 - .1;
        val += variation;
        if (val > -0.1) {
            tileno = choice([2, 2, 3, 4, 4, 6, 6, 7, 8, 9, 9, 12, 13, 13, 16, 17, 17, 20, 20, 21]); // trees
        } else if (val > -0.22) {
            tileno = choice([0, 4, 2, 3]);
        } else {
            tileno = choice([0, 0, 0, 0, 4, 2]);
        }
        return new Tile(tileno);
    }

    newCell(x, y) {
        let tx = x * this.map.cell_size.width;
        let ty = y * this.map.cell_size.height;
        var tiles = {}
        for (var i=tx; i<tx + this.map.cell_size.width; i++) {
            for (var j=ty; j<ty + this.map.cell_size.height; j++) {
                tiles[[i, j]] = this.newTile(i, j);
            }
        }
        let cell = new Cell(tiles, {x, y});
        return cell;
    }

}

export default Generator
