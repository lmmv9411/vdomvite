import { reconciliation } from "./UpdateDOMII.js";
import { k } from "./VDom.js";

export class Componente {

    /**
     * 
     * @param {Object} props Propiedades que tendrá el nodo en su estado.
     */
    constructor(props) {
        this.state = props;
        this.creado = false;
    }

    construir() {
        
        this.instancias = null;
        k.nodo = this;

        const nodo = this.render(this.state);

        k.nodo = null;

        for (const a of Object.keys(nodo)) {
            this[a] = nodo[a];
        }

        this.creado = true;

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

        if (typeof newState !== "object" || this.#compareState(newState)) {
            return;
        }

        newState = this.#copyState(newState)

        k.nodo = this;
        const newNode = this.render(newState);
        k.nodo = null;

        let $ref = this.type === k.Fragment ? this.$fragment : this.$element

        if (reconciliation.updateDOM($ref, this, newNode)) {
            for (const k of Object.keys(newNode)) {
                this[k] = newNode[k];
            }

            if (this.type === k.Fragment && this.childrenFragment) {
                this.childrenFragment = [...this.$fragment.children];
            }
        }

        this.state = newState;

    }

    /**
     * Comparar nuevo estado con el anteriror.
     * @param {Object} newState Nuevo estado
     * @returns {Boolean} Regresa true si son iguales o false si al menos un valor es diferente.
     */
    #compareState(newState) {

        for (const [key, value] of Object.entries(newState)) {
            if (!(key in this.state) || value !== this.state[key]) {
                if (Array.isArray(value)) {
                    if (value.length === 0 && this.state[key].length === 0) {
                        continue;
                    }
                }
                if (key.startsWith('on')) {
                    continue;
                }
                return false;
            }
        }

        return true;
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
