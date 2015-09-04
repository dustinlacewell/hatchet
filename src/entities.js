import component_map from './components/component_map'
import specials from './model_specials'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

let PROP_ID = Symbol("Entity.id");
let PROP_MANAGER = Symbol("Entity.manager");

class Entity {
    constructor(manager) {
        this[PROP_MANAGER] = manager;
        this[PROP_ID] = Symbol();
    }

    set id(v) { }

    get id() {
        return this[PROP_ID];
    }

    addComponent(name, data) {
        this[PROP_MANAGER].processComponents(this, {name: data});
    }

    removeComponent(name) {
        this[PROP_MANAGER].removeComponent(this, name);
    }
}

class EntityManager {
    constructor(model_manager) {
        this.model_manager = model_manager;
        this.components = {};
    }

    flagsToComponents(flags) {
        let components = {}
        flags.map((flag)=>{components[flag] = {};});
        return components;
    }

    makeEntity(model_name) {
        /* construct a new entity given a model name */
        let model = this.model_manager.models[model_name];
        let e = guid();
        // process components with provided arguments
        if ('components' in model) {
            this.processComponents(e, model.components);
        }
        // process components with no arguments
        if ('flags' in model) {
            let flag_components = this.flagsToComponents(model.flags);
            this.processComponents(e, flag_components);
        }
        // process special model attributes
        this.processSpecials(e, model);
        return e;
    }

    processComponents(e, components) {
        for (var name in components) {
            if (name in component_map) {
                let data = components[name];
                let type = component_map[name];
                let component = new type(data);
                this.addComponent(e, name, component);
           }
        }
    }

    addComponent(e, name, component) {
        if (name in this.components) {
            this.components[name][e] = component;
        } else {
            this.components[name] = {};
            this.addComponent(e, name, component);
        }
    }

    removeComponent(e, name) {
        if (e in this.components[name]) {
            delete this.components[name][e];
        }
    }

    processSpecials(entity, model) {
        for (var prop in specials) {
            if (prop in model) {
                let value = model[prop];
                let component_name = specials[prop];
                if (component_name in this.components) {
                    let components = this.components[component_name];
                    if (entity in components) {
                        this.components[component_name][prop] = value;
                    } else {
                        let components = {[component_name]: {[prop]: value}};
                        this.processComponents(entity, components);
                    }
                } else {
                    let components = {[component_name]: {[prop]: value}};
                    this.processComponents(entity, components);
                }
            }
        }
    }

    getComponents(e) {
        let components = {};
        for (var name in this.components) {
            let component_map = this.components[name];
            if (e in component_map) {
                components[name] = component_map[e];
            }
        }
        return components;
    }

}

export default EntityManager
