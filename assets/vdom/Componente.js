import changes from "./Changes.js";
import { Fragment } from "./VDom.js"

export class Componente {

    constructor(state) {

        this.state = state;

        const nodo = this.render(this.state);

        for (let [k, v] of Object.entries(nodo)) {
            this[k] = v;
        }

        Object.freeze(this.state);

    }

    /**
     * Evento que se dispara cuando el elemento está en el dom real
     * @param {HTMLElement} $ref 
     */
    construido($ref) {
        this.$element = $ref;
        this.montado();
    }

    montado() {

    }
    update(newState) {

        const newNode = this.render(this.#copyState(newState));
        const $ref = this.type === Fragment ? this.$fragment : this.$element;

        changes($ref, this, newNode);

        for (let [k, v] of Object.entries(newNode)) {
            this[k] = v;
        }

        this.state = newState

        if (this.type === Fragment) {
            this.fragmento = [...this.$fragment.children];
        }

        this.postRender();
    }

    postRender() {

    }

    #copyState(newState) {
        for (let [k, v] of Object.entries(this.state)) {
            if (newState[k] === undefined) {
                newState[k] = v
            }
        }
        return newState;
    }

}
