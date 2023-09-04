import { reconciliation } from "./UpdateDOM.js";
import { Fragment } from "./VDom.js"

export class Componente {

    /**
     * 
     * @param {Object} props Propiedades que tendrá el nodo en su estado.
     */
    constructor(props) {

        this.state = props;

    }

    construir() {
        const nodo = this.render(this.state);

        for (const k of Object.keys(nodo)) {
            this[k] = nodo[k];
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

    construido($ref) {
        this.$element = $ref;
        this.montado();
    }

    /**
     * Método que se invoca cuando este componente ya se agregó en el HTMLElement Padre.
     * @returns {void}
     */
    montado() { }

    /**
       * Establecer y actualizar estado y el DOM si existen cambios.
       * @param {Object} newState Nuevo estado.
       * @returns {void}
       */
    setState(state) {
        if (typeof state === "function") {
            const newState = state(this.state);
            this.#update(newState);
        } else if (typeof state === "object") {
            this.#update(state)
        }
    }

    #update(newState) {

        if (typeof newState !== "object" || !this.#compareState(newState)) {
            return
        }
        
        newState = this.#copyState(newState)

        const newNode = this.render(newState);

        let $ref = this.type === Fragment ? this.$fragment : this.$element

        if (reconciliation.updateDOM($ref, this, newNode)) {
            this.state = newState;
            for (const k of Object.keys(newNode)) {
                this[k] = newNode[k];
            }

            if (this.type === Fragment && this.fragmento) {
                this.fragmento = [...this.$fragment.children];
            }
        }

    }

    /**
     * Comparar nuevo estado con el anteriror.
     * @param {Object} newState Nuevo estado
     * @returns {Boolean} Regresa true si son iguales o false si al menos un valor es diferente.
     */
    #compareState(newState) {
        for (const [key, value] of Object.entries(newState)) {
            if (!(key in this.state) || value !== this.state[key]) {
                return true;
            }
        }

        return false;
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
