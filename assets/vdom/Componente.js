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

        const newNode = this.render(this.#copyState(newState));

        const $ref = this.type === Fragment ? this.$fragment : this.$element

        reconciliacion.updateDOM($ref, this, newNode);

        for (let [k, v] of Object.entries(newNode)) {
            this[k] = v;
        }

        this.state = newState

        if (this.type === Fragment && this.fragmento) {
            this.fragmento = [...this.$fragment.children];
        }

        this.postRender();
    }

    postRender() { }

    #copyState(newState) {
        for (let [k, v] of Object.entries(this.state)) {
            if (newState[k] === undefined) {
                newState[k] = v
            }
        }
        return newState;
    }

}
