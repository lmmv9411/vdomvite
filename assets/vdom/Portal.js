import { Componente } from "./Componente";
import { k } from "./VDom";

/**
 * Crea un portal entre un árbol de Virtual DOM y una ubicación en el DOM real.
 * @param {Array.<{type: String, children: Array, props: Object}>} nodo - El árbol de Virtual DOM que se va a portalizar.
 * @param {HTMLElement} $parent - El elemento DOM en el que se va a montar el portal.
 * @return {{type: Symbol, $element: HTMLElement, children: Array.<Object>}} - El nodo portalizado y su información asociada.
 */
function crearPortal(nodo, $parent) {
    const children = nodo !== undefined && nodo !== null && typeof nodo !== "boolean" ? [nodo] : [];
    return { type: k.Portal, $element: $parent, children };
}

export class Portal extends Componente {
    constructor(props) {
        super({ ...props });
        this.is = k.Portal;
    }

    render(props) {
        return crearPortal(this.getNodo(props), props.parent)
    }

    getNodo() {
        return {};
    }
}