import { Componente } from "./Componente.js";

function render(node) {

    if (!node || !node.type) {
        if (typeof node === "string" || typeof node === "number") {
            return document.createTextNode(node);
        }
        return;
    }

    if (Array.isArray(node)) {
        return node.map(render);
    }

    const $element = document.createElement(node.type);

    if (!!node.props && typeof node.props === 'object') {

        for (let [k, v] of Object.entries(node.props)) {

            if ($element.type === 'checkbox') {
                $element.checked = v;
            } else if (k === "$ref") {
                node.$element = $element;
            } else {
                $element[k] = v
            }
        }

    }

    if (Array.isArray(node.children) && node.children.length > 0) {

        node.children.map(render).forEach(($children, i) => {
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

export { render };
