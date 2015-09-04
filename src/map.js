import Generator from './mapgen'
import Signal from './signal'

class Map {
    constructor(game, generator=null) {
        this.game = game;
        this.cells = {}
        this.cell_size = {
            width: game.settings.screen_size.width,
            height: game.settings.screen_size.height,
        };
        this.createSignals();
        if (generator != null) {
            this.generator = new generator(
                this.game.models,
                this.game.entities,
                this.cell_size);
        } else {
            this.generator = new Generator(
                this.game.models,
                this.game.entities,
                this.cell_size);
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

    setTile(x, y, tile) {
        // translate tile coords to cell coords
        let cx = Math.floor(x / this.cell_size.width);
        let cy = Math.floor(y / this.cell_size.height);
        // get corresponding cell
        let cell = this.getCell(cx, cy);
        this.onTileDirty(x, y, tile);
        return cell.setTile(x, y, tile);
    }
}

export default Map
