class Component {
    constructor(model) {
        this.initComponent(model);
    }

    defaults() {
        return {};
    }

    validate(model) {return model;}

    initComponent(model) {
        Object.assign(this, this.defaults(), model);
    }
}

export default Component
