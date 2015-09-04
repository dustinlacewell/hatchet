
class LayerPool {
    constructor(tilemap, layer_size, tile_size) {
        this.tilemap = tilemap;
        this.tilemap.setPreventRecalculate(true);
        this.layer_size = layer_size;
        this.tile_size = tile_size;
        this.layers = [];
        this.cell_layers = {};
        this.pool = [];
        window.pool = this;
        for(var i=0; i<20; i++) {
            this.allocateLayer();
        }
    }

    allocateLayer() {
        let num_layers = this.layers.length;
        let layer = this.tilemap.createBlankLayer(`layer${num_layers}`,
                                                  this.layer_size.width,
                                                  this.layer_size.height,
                                                  this.tile_size.width,
                                                  this.tile_size.height);
        layer.fixedToCamera = false;
        layer.scrollFactorX = 0;
        layer.scrollFactorY = 0;
        layer.id = num_layers;
        this.layers.push(layer);
        this.pool.push(num_layers);
    }

    claimLayer() {
        if (this.pool.length == 0) {
            this.allocateLayer();
        }
        let index = this.pool.pop();
        return this.layers[index];
    }

    getLayer(x, y) {
        if ([x,y] in this.cell_layers) {
            return this.cell_layers[[x,y]];
        } else {
            let new_layer = this.claimLayer();
            new_layer.dirty = true;
            this.cell_layers[[x,y]] = new_layer;
            return new_layer;
        }
    }

    freeLayer(layer) {
        this.hideLayer(layer);
        this.pool.push(layer.id);
    }
}

export default LayerPool
