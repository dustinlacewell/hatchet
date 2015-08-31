class Signal {
    constructor() {
        this.listeners = [];
    }

    add(cb, ctx) {
        if (!([cb, ctx] in this.listeners)) {
            this.listeners.push([cb, ctx]);
        }
    }

    remove(cb, ctx) {
        if ([cb, ctx] in this.listeners) {
            this.listeners.splice(this.listeners.indexOf([cb, ctx]), 1);
        }
    }

    dispatch(...args) {
        this.listeners.forEach(l => {
            let [cb, ctx] = l;
            cb.call(ctx, ...args);
        })
    }
}

export default Signal
