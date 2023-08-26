import { render } from "./Render.js";

function insertarElemento($parent, nodo) {

    const tmp = nodo.$element ?? nodo.$fragment;

    let $ref;

    if (!tmp) {
        $ref = render(nodo, null, $parent);
    }

    if (nodo.type === Fragment) {
        $parent.append(...nodo.fragmento);
    } else {
        $parent.appendChild($ref);
    }

    if (!tmp && nodo.construido) {
        nodo.construido($ref);
    }

}

function reemplazarElemento($parent, nodo) {

    const tmp = nodo.$element ?? nodo.$fragment;

    let $ref;

    if (!tmp) {
        $ref = render(nodo, null, $parent);
    }

    if (!$parent.hasChildNodes()) {
        if (nodo.type === Fragment) {
            $parent.appendChild(...nodo.fragmento);
        } else {
            $parent.appendChild($ref);
        }
    } else {
        if (nodo.type === Fragment) {
            $parent.replaceChildren(...nodo.fragmento);
        } else {
            $parent.replaceChildren($ref);
        }
    }

    if (!tmp && nodo.construido) {
        nodo.construido($ref);
    }

}

function h(type, props, ...children) {

    let key = null;

    if (Array.isArray(children) && children.length === 1 && Array.isArray(children[0])) {
        children = children[0];
    }

    //quitar null o undefine
    children = children.filter(ch => ch !== undefined && ch !== null && typeof ch !== "boolean");

    if (props?.key !== undefined) {
        key = props.key;
        delete props.key;
    }

    if (type instanceof Function) {
        let componente

        if (!(type.prototype instanceof Object)) {
            componente = type({ ...props, children });
        } else {
            componente = new type({ ...props, children });
        }

        if (typeof componente === "object" && Object.keys(componente).length === 0) {
            if (children.length > 1) {
                return h(Fragment, null, children);
            }
            return children[0];
        }

        if (componente) {
            componente.key = key
            return componente;
        } else {
            if (children.length > 1) {
                return h(Fragment, null, children);
            }
            return children[0];
        }

    }

    return { type, props, children, key };
}

export const Portal = Symbol("Portal");

export const Fragment = Symbol("Fragment");

export const Contexto = Symbol("Contexto");

export { reemplazarElemento, insertarElemento, h };
