import Tile from './tile'
import Generator from './mapgen'
import Signal from './signal'

var empty_tile = new Tile();

class Map {
    constructor(cell_size, generator=null) {
        this.cells = {}
        this.cell_size = cell_size;
        this.createSignals();
        if (generator != null) {
            this.generator = new generator(this);
        } else {
            this.generator = new Generator(this);
        }
    }

    createSignals() {
        this.onCellGen = new Signal(); // x, y, new_cell
        this.onCellDirty = new Signal(); // x, y, cell
        this.onTileDirty = new Signal(); // x, y, tile
    }

    pregen() {
        for (var x=-10; x<=10; x++) {
            for (var y=-10; y<=10; y++) {
                console.log(`Pregenning tile at ${x}, ${y}`);
                this.getCell(x, y, pregen=true);
            }
        }
    }

    getCell(x, y, pregen=false) {
        if (!([x, y] in this.cells)) {
            let new_cell = this.generator.newCell(x, y);
            this.setCell(x, y, new_cell);
            if (!pregen) {
                this.onCellGen.dispatch(new_cell);
            }
            return new_cell;
        }
        return this.cells[[x, y]];
    }

    setCell(x, y, cell) {
        cell.position = {x: x, y: y};
        this.onCellDirty.dispatch(cell);
        return this.cells[[x, y]] = cell;
    }

    getTileOwner(x, y) {
        // translate tile coords to cell coords
        let cx = Math.floor(x / this.cell_size.width);
        let cy = Math.floor(y / this.cell_size.height);
        let cell = this.getCell(cx, cy);
        return cell;
    }

    getTile(x, y) {
        let cell = this.getTileOwner(x, y);
        // return tile from cell
        return cell.getTile(x, y);
    }

    setTile(x, y, tileno) {
        // translate tile coords to cell coords
        let cx = Math.floor(x / this.cell_size.width);
        let cy = Math.floor(y / this.cell_size.height);
        // get corresponding cell
        let cell = this.getCell(cx, cy);
        // set the tile in the cell
        let new_tile = new new Tile(tileno);
        this.onTileDirty(x, y, new_tile);
        return cell.setTile(x, y, new Tile(tileno));
    }

}

export default Map
