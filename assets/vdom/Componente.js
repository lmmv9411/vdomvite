import { reconciliation } from "./UpdateDOM.js";
import { Fragment } from "./VDom.js"

export class Componente {

    constructor(state) {

        this.state = state;

        const nodo = this.render(this.state);

        for (let [k, v] of Object.entries(nodo)) {
            this[k] = v;
        }

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

        this.#copyState(newState)

        const newNode = this.render(this.state);

        let $ref = this.type === Fragment ? this.$fragment : this.$element

        reconciliation.updateDOM($ref, this, newNode);

        if (this.type === Fragment && this.fragmento) {
            this.fragmento = [...this.$fragment.children];
        }

        this.postRender();
    }

    postRender() { }

    #copyState(newState) {

        if (!newState) {
            return;
        }

        for (let k of Object.keys(newState)) {
            if (!k in this.state || newState[k] !== this.state[k]) {
                this.state[k] = newState[k];
            }
        }
    }

}
