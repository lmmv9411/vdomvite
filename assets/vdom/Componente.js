import changes from "./Changes.js";
import { Fragment, h } from "./VDom.js"

export class Componente {

    /**
     * 
     * @param {{contexto: {oyentes:{}}}} state 
     */
    constructor(state) {

        this.h = h;

        this.state = state;

        this.contexto = {}

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

    /**
     * Recibe valor de emision de cambios en contexto
     * devuelte true si hubo cambios
     * @param {Object} value 
     * @returns {{manejado:boolean, value:object}}
     */
    escuchar(value) { return { manejado: false } }

    /**
     * Actualizar el estado del componente y reenderizar
     * @param {Object} newState 
     */
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
