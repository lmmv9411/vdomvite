import { reconciliation } from "./UpdateDOM.js";
import { Fragment, Portal } from "./VDom.js"

export class Componente {

    /**
     * 
     * @param {Object} props Propiedades que tendrá el nodo en su estado.
     */
    constructor(props) {

        this.state = props;

        const nodo = this.render(props);

        for (let [k, v] of Object.entries(nodo)) {
            this[k] = v;
        }

    }

    /**
     * Crear objeto jsx
     * @param {Object} props Propiedades para crear jsx.
     * @returns {{type: String, props: Object, children: Array.<Object>}} Objeto jsx.
     */
    render(props) {
        return null;
    }

    /**
     * Método que se llama cuando se construlle Element Html y lo agrega a this.$element.
     * @param {HTMLElement} $ref Elemento Html
     * @returns {void}
     */
    construido($ref) {
        this.$element = $ref;
        this.montado();
    }

    /**
     * Método que se invoca cuando se crea Elemento Html y se monta en el dom.
     * @returns {void}
     */
    montado() { }

    /**
   * Actualizar el DOM si hay cambios en el estado.
   * @param {Object} newState nuevo estado ha crear
   * @returns {void}
   */
    update(newState) {

        newState = this.#copyState(newState)

        const newNode = this.render(newState);

        let $ref = this.type === Fragment ? this.$fragment : this.$element

        const cambio = reconciliation.updateDOM($ref, this, newNode);

        if (cambio) {
            this.state = newState;
            for (let k of Object.keys(newNode)) {
                this[k] = newNode[k];
            }

            if (this.type === Fragment && this.fragmento) {
                this.fragmento = [...this.$fragment.children];
            }
        }

    }

    #copyState(newState) {

        if (!newState) {
            return;
        }

        for (let k of Object.keys(this.state)) {
            if (!(k in newState)) {
                newState[k] = this.state[k];
            }
        }

        return newState;
    }

}
