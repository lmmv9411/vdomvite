import { Componente } from "./Componente.js";
import { Contexto, Fragment, Portal } from "./VDom.js";

export const VDOM = (function () {

    let parent, contexto, $parent;

    /**
     * Convierte Objeto jsx en objeto html.
     * @param {Object} node Objeto jsx.
     * @param {Object} p Padre del "node".
     * @param {HTMLElement} $nodeParent Elemento Html referencia del padre.
     * @returns {HTMLElement} Elemento Html;
     */
    const render = function (node, p, $nodeParent) {
        parent = p ?? node;
        $parent = $nodeParent;
        return _render(node);
    }

    const _render = function (node) {

        if (node instanceof Componente) {
            node.construir();
        }

        if (!node || !node.type) {
            if (typeof node === "string" || typeof node === "number") {
                return document.createTextNode(node);
            }
            return;
        }

        if (Array.isArray(node)) {
            return node.map(_render);
        }

        let $element;

        if (node.type === Fragment) {
            $element = document.createDocumentFragment();
            node.$fragment = $parent;
        } else if (node.type === Portal) {
            recursividadHijos(node, node.$element);
            return;
        } else {
            $element = document.createElement(node.type);
        }

        if (!!node.props && typeof node.props === 'object') {

            for (let [k, v] of Object.entries(node.props)) {

                v = typeof v === "string" ? v.trim() : v;

                if (k === "$ref") {
                    parent[v] = $element;
                } else if (k.startsWith("on")) {
                    k = k.substring(2).toLowerCase();

                    switch (k) {
                        case "focus":
                            $element.addEventListener("focusin", v);
                            break;
                        case "blur":
                            $element.addEventListener("focusout", v);
                            break;
                        default:
                            $element.addEventListener(k, v);
                    }

                } else {
                    if (k in $element) {
                        if (typeof v === "object") {
                            Object.entries(v).forEach(([key, value]) => {
                                $element[k][key] = value;
                            })
                        } else {
                            $element[k] = v;
                        }
                    } else {
                        $element.setAttribute(k, v)
                    }
                }
            }

        }

        recursividadHijos(node, $element);

        if (node.type === Fragment) {
            node.fragmento = [...$element.children];
        }

        return $element;

    }

    /**
     * Recorre los hijos de un nodo y los renderiza al $element padre.
     * @param {Object} node Nodo padre.
     * @param {HTMLElement} $element Html Elemento del padre.
     * @returns {void}
     */
    const recursividadHijos = function (node, $element) {

        let tmpParent, $tmpParent = $parent;

        if (node instanceof Componente) {
            tmpParent = parent;
            parent = node;
        }

        if (node.type !== Fragment) {
            $parent = $element;
        }

        if (node.is === Contexto) {
            contexto = node;
        }

        if (Array.isArray(node.children) && node.children.length > 0) {

            for (let ch of node.children) {

                const $children = _render(ch);

                if ($children) {
                    $element.appendChild($children)
                }

                if (ch instanceof Componente) {

                    if (ch.type !== Portal) {
                        ch.construido($children);
                    }

                    if (contexto) {
                        contexto.padre.children[ch.state.contextoNombre] = ch;
                    }
                }

            }

        } else {
            if (node.children.length > 0) {
                $element.textContent = node.children;
            }
        }

        if (tmpParent) {
            parent = tmpParent;
        }

        if (node === contexto) {
            contexto = null
            delete node.padre;
        }

        $parent = $tmpParent;

    }

    return { render };
})();