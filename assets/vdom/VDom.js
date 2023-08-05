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
        const hijos = Array.from($ref.children.length > 0 ? $ref.children : nodo.fragmento)
        $parent.append(...hijos);
        nodo.fragmento = [...$parent.children]
    } else {
        $parent.appendChild($ref);
    }

    if (!tmp) {
        nodo.construido($ref);
    }

    if (nodo.type === Fragment) {
        nodo.$fragment = $parent;
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
            const hijos = Array.from($ref.children.length > 0 ? $ref.children : nodo.fragmento)
            $parent.append(...hijos);
            nodo.fragmento = [...$parent.children]
        } else {
            $parent.appendChild($ref);
        }

    } else {
        if (nodo.type === Fragment) {
            const hijos = Array.from($ref.children.length > 0 ? $ref.children : nodo.fragmento)
            $parent.replaceChildren(...hijos);
            nodo.fragmento = [...$parent.children]
        } else {
            $parent.replaceChildren($ref)
        }
    }

    if (!tmp) {
        nodo.construido($ref);
    }

    if (nodo.type === Fragment) {
        nodo.$fragment = $parent;
    }
}

function h(type, props, ...children) {

    let key = null;

    if (props?.key !== undefined) {
        key = props.key;
        delete props.key;
    }

    if (type instanceof Function) {
        const componente = new type(props, children);

        if (typeof componente === "object" && Object.keys(componente).length === 0) {
            if (children.length > 1) {
                return h(Fragment, null, children);
            }
            return children[0];
        }

        componente.key = key;
        return componente;
    }

    if (Array.isArray(children) && children.length === 1 && Array.isArray(children[0])) {
        children = children[0];
    }

    //quitar null o undefine
    const chl = children.filter(ch => { if (ch) return ch });

    return { type, props, children: chl, key };
}

export const Fragment = Symbol("Fragment");

export { reemplazarElemento, insertarElemento, h };