import { render } from "./Render";
import { Portal, Fragment } from "./VDom";

/**
 * 
 * @param {Array.<{type: String, children: Array, props: Object}>} nodo 
 * @param {HTMLElement} $parent 
 */
export function crearPortal(nodo, $parent) {

    const tmp = nodo.$element;

    let $ref;

    if (!tmp) {
        $ref = render(nodo);

        if (nodo.type === Fragment) {
            //const hijos = Array.from($ref.children.length > 0 ? $ref.children : nodo.fragmento ?? [])
            // $parent.append(...hijos);
            nodo.fragmento = [...$ref.children]
        }

        if (nodo.type === Fragment) {
            nodo.$fragment = $parent;
        }

    } else {
        $ref = tmp;
    }

    return { ...nodo, type: Portal, $element: $parent }
}