import { Portal } from "./VDom";

/**
 * 
 * @param {Array.<{type: String, children: Array, props: Object}>} nodo 
 * @param {HTMLElement} $parent 
 * @returns {Object}
 */
export function crearPortal(nodo, $parent) {
    return { type: Portal, $element: $parent, children: [nodo] }
}