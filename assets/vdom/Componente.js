import { reconciliacion } from "./updateDOM.js";
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

    montado() { }

    /**
     * Actualizar el DOM si hay cambios en el estado.
     * @param {Object} newState nuevo estado ha crear
     * @returns {void}
     */
    update(newState) {

        const oldState = { ...this.state };

        this.#copyState(newState, oldState)

        const newNode = this.render(oldState);

        let $ref = this.type === Fragment ? this.$fragment : this.$element

        reconciliacion.updateDOM($ref, this, newNode);

        if (this.type === Fragment && this.fragmento) {
            this.fragmento = [...this.$fragment.children];
        }

        this.state = oldState;

        this.postRender();
    }

    postRender() { }

    #copyState(newState, oldState) {

        for (let k of Object.keys(newState)) {
            if (!k in this.state || newState[k] !== oldState[k]) {
                oldState[k] = newState[k];
            }
        }
    }

}
