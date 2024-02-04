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

    if (nodo.type === k.Fragment) {
        $parent.append(...nodo.childrenFragment);
    } else {
        $parent.appendChild($ref);
    }

    if (!tmp && nodo.construido && nodo.type !== k.Fragment) {
        nodo.construido($ref);
    }

    if (nodo.type === k.Fragment) {
        delete nodo.$fragment;
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
        if (nodo.type === k.Fragment) {
            $parent.append(...nodo.childrenFragment);
        } else {
            $parent.appendChild($ref);
        }
    } else {
        if (nodo.type === Fragment) {
            $parent.replaceChildren(...nodo.childrenFragment);
        } else {
            $parent.replaceChildren($ref);
        }
    }

    if (!tmp && nodo.construido && nodo.type !== k.Fragment) {
        nodo.construido($ref);
    }

    if (nodo.type === k.Fragment) {
        delete nodo.$fragment;
    }
}

export const k = (function () {

    const Fragment = Symbol('Fragment');
    const Portal = Symbol("Portal");
    const Contexto = Symbol("Contexto");
    let nodo = null;

    const h = function (type, props, ...children) {

        let key = null;

        if (Array.isArray(children) && children.length === 1 && Array.isArray(children[0])) {
            children = children[0];
        }

        //quitar null o undefine
        children = children.filter(ch => ch !== undefined && ch !== null && (typeof ch !== "boolean"));

        if (props?.key !== undefined) {
            key = props.key;
            delete props.key;
        }


        if (typeof type === 'function') {
            let componente

            if (!(type.prototype instanceof Object)) {
                componente = type({ children, ...props });
            } else {

                if (props?.reff) {

                    if (!k.nodo.instancias) {
                        k.nodo.instancias = {};
                    }

                    const tmpComponent = k.nodo.instancias[props.reff];

                    if (tmpComponent) {
                        const copyNodo = k.nodo;
                        k.nodo = null;
                        tmpComponent.setState({ children, ...props });
                        k.nodo = copyNodo;
                        return tmpComponent;
                    } else {
                        componente = new type({ children, ...props });
                        k.nodo.instancias[props.reff] = componente;
                    }
                } else {
                    componente = new type({ children, ...props });
                    if (componente.construir) {
                        const copyNodo = k.nodo;
                        k.nodo = null;
                        componente.construir();
                        k.nodo = copyNodo;
                    }
                }
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

    return { h, Fragment, Portal, Contexto, nodo }
})();

export { insertarElemento, reemplazarElemento };

