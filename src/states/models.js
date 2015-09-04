import ModelManager from '../models'
import EntityManager from '../entities'
import component_map from '../components/component_map'

class ModelState extends Phaser.State {

    preload () {
        // load the model files from the configured asset pack
        let pack_file = `json/${this.game.settings.assetpack}/assets.json`;
        this.game.load.pack("models", pack_file); // as asset pack
        this.game.load.json("models", pack_file); // as json
    }

    create() {
        let asset_pack = this.game.cache.getJSON("models");
        let models = {};
        for (var i=0; i<asset_pack.models.length; i++) {
            let asset_key = asset_pack.models[i]["key"];
            console.log(`Loading asset: ${asset_key}`);
            let model_file = this.game.cache.getJSON(asset_key);
            for (var name in model_file) {
                models[name] = model_file[name];
            }
        }
        this.game.models = new ModelManager(models);
        this.game.entities = new EntityManager(this.game.models);
        this.game.state.start('worldgen');
    }
}

export default ModelState
