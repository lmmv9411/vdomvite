import { Componente } from "./Componente";
import { VDOM } from "./Render";

/**
 * Construir jsx en nodo html en insertar.
 * @param {HTMLElement} $parent nodo donde se insertara
 * @param {Componente} nodo nodo jsx a convertir
 * @returns {void}
 */
function insertarElemento($parent, nodo) {

    const tmp = nodo.$fragment ?? nodo.$element;

    let $ref;

    if (!tmp) {
        $ref = VDOM.render(nodo, null, $parent);
    } else {
        $ref = tmp;
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

    const tmp = nodo.$fragment ?? nodo.$element;

    let $ref;

    if (!tmp) {
        $ref = VDOM.render(nodo, null, $parent);
    } else {
        $ref = tmp;
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

function createChildren(props, type) {
    let componente;

    if (props?.keepRef) {
        const { name, nodo } = props.keepRef;
        delete props.keepRef
        if (nodo[name]) {
            componente = nodo[name];
        } else {
            componente = type();
            nodo[name] = componente;
        }
    } else {
        componente = type();
    }

    return componente;
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
            componente = createChildren(props, () => type({ children, ...props }));
        } else {
            componente = createChildren(props, () => new type({ children, ...props }));
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
