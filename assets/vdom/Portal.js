import { Portal } from "./VDom";

/**
 * Crea un portal entre un árbol de Virtual DOM y una ubicación en el DOM real.
 * @param {Array.<{type: String, children: Array, props: Object}>} nodo - El árbol de Virtual DOM que se va a portalizar.
 * @param {HTMLElement} $parent - El elemento DOM en el que se va a montar el portal.
 * @return {{type: Symbol, $element: HTMLElement, children: Array.<Object>}} - El nodo portalizado y su información asociada.
 */

export function crearPortal(nodo, $parent) {
    return { type: Portal, $element: $parent, children: [nodo] }
}