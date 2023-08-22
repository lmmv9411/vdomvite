import { Componente } from "./Componente.js";
import { Fragment, Portal } from "./VDom.js";

let parent;

export function render(node, p) {
    parent = p ?? node;
    return _render(node);
}

function _render(node) {

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
    } else if (node.type === Portal) {
        recursividadHijos(node, node.$element);
        return;
    } else {
        $element = document.createElement(node.type);
    }

    if (!!node.props && typeof node.props === 'object') {

        for (let [k, v] of Object.entries(node.props)) {

            if (k === "$ref") {
                parent[v] = $element
            } else if (k.startsWith("on")) {
                k = k.substring(2)
                $element.addEventListener(k, v);
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

    return $element;

}

function recursividadHijos(node, $element) {

    let tmpParent;

    if (node instanceof Componente) {
        tmpParent = parent;
        parent = node;
    }

    if (Array.isArray(node.children) && node.children.length > 0) {

        node.children.map(_render).forEach(($children, i) => {
            if ($children !== undefined) {

                const ch = node.children[i];

                if (ch instanceof Componente) {
                    ch.construido($children);
                }

                $element.appendChild($children)
            }
        });

    } else {
        if (node.children.length > 0) {
            $element.textContent = node.children;
        }
    }

    if (tmpParent) {
        parent = tmpParent;
    }
}