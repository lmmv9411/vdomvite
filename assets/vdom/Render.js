import { Componente } from "./Componente.js";

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

    const $element = document.createElement(node.type);

    if (!!node.props && typeof node.props === 'object') {

        for (let [k, v] of Object.entries(node.props)) {

            if ($element.type === 'checkbox') {
                $element.checked = v;
            } else if (k === "$ref") {
                parent[v] = $element
            } else {
                $element[k] = v
            }
        }

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

    return $element;

}