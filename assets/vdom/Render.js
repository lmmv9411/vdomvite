import { Componente } from "./Componente";
import { k } from "./VDom";

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
        try {
            parent = p ?? node;
            $parent = $nodeParent;
            return _render(node);
        } catch (error) {
            throw new Error(error.stack)
        }
    }

    const _render = function (node) {

        if (node instanceof Componente && !node.creado) {
            const copy = $parent;
            node.construir();
            $parent = copy;
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

        if (node.type === k.Fragment) {
            $element = document.createDocumentFragment();
            node.$fragment = $parent;
            if (parent !== node) {
                node.parent = parent;
                node.idx = 0;
            }
        } else if (node.type === k.Portal) {
            recursividadHijos(node, node.$element);
            return;
        } else {
            $element = document.createElement(node.type);
        }


        if (typeof node.type === "string" && node.props && typeof node.props === 'object') {

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
                        case "doubleclick":
                            $element.addEventListener("dblclick", v);
                            break
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

        if (node.type === k.Fragment) {
            node.childrenFragment = [...$element.children];
            node.$element = $parent;
            delete node.$fragment;
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

        if (node.type !== k.Fragment) {
            $parent = $element;
        }

        if (node.is === k.Contexto) {
            contexto = node;
        }

        if (Array.isArray(node.children) && node.children.length > 0) {

            for (let i = 0; i < node.children.length; i++) {

                const ch = node.children[i];


                const $children = _render(ch);

                if ($children) {
                    $element.appendChild($children)
                }

                if (ch.type === k.Fragment) {
                    ch.idx = $element.children.length - ch.children.length;
                }

                if (ch instanceof Componente) {

                    if (ch.is !== k.Portal) {
                        ch.construido($children);
                    }

                    if (contexto && ch.state?.ctx) {
                        contexto.padre[ch.state.ctx] = ch
                    }

                }


            }

        } else {
            if (node.children?.length > 0) {
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