import { render } from "./Render.js";

function insertarElemento($parent, nodo) {

    const tmp = nodo.$element;

    let $ref;

    if (!tmp) {
        $ref = render(nodo);
    } else {
        $ref = tmp;
    }

    if (nodo.type === Fragment) {
        nodo.fragmento = $ref.children.length ? [...$ref.children] : nodo.fragmento;
        $parent.append(...(nodo.fragmento));
    } else {
        $parent.appendChild($ref);
    }

    if (nodo.type === Fragment) {
        nodo.$fragment = $parent;
    }

    if (!tmp) {
        nodo.construido($ref);
    }

}

function reemplazarElemento($parent, nodo) {

    const tmp = nodo.$element;

    let $ref;

    if (!tmp) {
        $ref = render(nodo);
    } else {
        $ref = tmp;
    }

    if (!$parent.hasChildNodes()) {
        if (nodo.type === Fragment) {
            nodo.fragmento = $ref.children.length ? [...$ref.children] : nodo.fragmento;
            $parent.append(...(nodo.fragmento));
        } else {
            $parent.appendChild($ref);
        }

    } else {
        if (nodo.type === Fragment) {
            nodo.fragmento = $ref.children.length ? [...$ref.children] : nodo.fragmento;
            $parent.replaceChildren(...(nodo.fragmento));
        } else {
            $parent.replaceChildren($ref)
        }
    }

    if (nodo.type === Fragment) {
        nodo.$fragment = $parent;
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
