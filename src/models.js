/*

Models are small data structures loaded from disk that act as blueprints for Entities.
The responsibility of a model is to specify what Components an Entity will get and
what their default values are.

The ModelManager is responsible for holding the loaded Models and organizing them by
Component type.

*/

class ModelManager {
    constructor(models) {
        this.models = models;
        this.components = {};
        this.make_component_map();
    }

    add_to_component(component, model) {
        if (component in this.components) {
            this.components[component].push(model);
        } else {
            this.components[component] = [];
            this.add_to_components(component, model);
        }
    }

    make_component_map() {
        for (var model_name in this.models) {
            let model = this.models[model_name];
            for (var component_name in model.components) {
                let component = model.components[component_name];
                this.add_to_components(component_name, model);
            }
        }
    }
}

export default ModelManager
