import { render } from "./Render";

let parent;

export default function changes($parentNode, vOldNode, vNewNode) {
    parent = vNewNode;
    _changes($parentNode, vOldNode, vNewNode);
}

function _changes($parentNode, vOldNode, vNewNode) {

    if (($parentNode === undefined || $parentNode === null) ||
        !($parentNode instanceof Node) ||
        (vOldNode === undefined && vNewNode === undefined) ||
        (vOldNode === null && vNewNode === null)) {
        return;
    }

    if (vNewNode === undefined || vNewNode === null) {

        $parentNode.remove();

    } else if (vOldNode === undefined || vOldNode === null) {

        const $ref = render(vNewNode, parent);

        if (Array.isArray($ref)) {
            for (let i = 0; i < $ref.length; i++) {
                $parentNode.appendChild($ref[i]);
                reff(vNewNode[i], $ref[i]);
            }
        } else {
            $parentNode.appendChild($ref);
            reff(vNewNode, $ref);
        }

    } else if (vOldNode.type !== vNewNode.type
        || (typeof vNewNode === "number" && vOldNode !== vNewNode)
        || (typeof vNewNode === "string" && vOldNode !== vNewNode)) {

        const $ref = render(vNewNode, parent);

        $parentNode.replaceWith($ref);

        reff(vNewNode, $ref);

    } else {

        setAttributes($parentNode, vOldNode, vNewNode);

        let on = vOldNode.children?.length ?? 0;
        let nn = vNewNode.children?.length ?? 0;
        let max = Math.max(on, nn);
        let $n = null;
        let chOld, chNew;

        for (let i = 0; i < max; i++) {

            chNew = vNewNode.children[i];
            chOld = vOldNode.children[i];

            $n = $parentNode.childNodes[i] ?? $parentNode;

            let cond1 = chNew !== undefined || chOld !== undefined;
            let cond2 = chNew?.key !== null || chOld?.key !== null;
            let cond3 = chNew?.key !== chOld?.key;
            let cond4 = cond1 && cond2;

            if (cond4 || comparaTypes(chOld, chNew)) {

                if (!cond4 + cond3) {

                    if (nn > on) {
                        const index = i + 1 === nn ? i + 1 : i;

                        const $ref = render(chNew, parent);

                        $parentNode.insertBefore($ref, $parentNode.children[index]);

                        reff(chNew, $ref);

                        vOldNode.children.splice(i, 0, chNew);

                        on = vOldNode.children?.length ?? 0;
                        nn = vNewNode.children?.length ?? 0;
                        max = Math.max(on, nn);

                    } else if (nn < on) {
                        $n.remove();

                        vOldNode.children.splice(i, 1);

                        on = vOldNode.children?.length ?? 0;
                        nn = vNewNode.children?.length ?? 0;
                        max = Math.max(on, nn);
                        i--;
                    } else {
                        equalKeys($n, chNew);
                        vOldNode.children.splice(i, 1);
                        vOldNode.children.splice(i, 0, chNew);
                    }
                } else {
                    _changes($n, chOld, chNew);
                }

            } else {
                _changes($n, chOld, chNew);

            }

        }
    }

}

function comparaTypes(vOldNode, vNewNode) {

    if (vNewNode === undefined || vOldNode === undefined) {
        return false
    }

    return (typeof vOldNode === 'string' || typeof vNewNode === 'string')
        && (vOldNode !== vNewNode)
        || vOldNode.type !== vNewNode.type
}

function reff(vNewNode, $ref) {

    if (vNewNode === undefined || vNewNode === null) {
        return;
    }

    if (vNewNode.construido !== undefined &&
        typeof vNewNode.construido === "function") {

        vNewNode.construido($ref);

    }

}

function equalKeys($n, vNewNode) {
    if (vNewNode === undefined || vNewNode === null) {
        return;
    }
    const $ref = render(vNewNode, parent);
    $n.replaceWith($ref);
    reff(vNewNode, $ref);
}

/**
 * 
 * @param {HTMLElement} $node 
 * @param {*} vOldNode 
 * @param {*} vNewNode 
 * @returns 
 */
function setAttributes($node, vOldNode, vNewNode) {


    if (!vOldNode || !vNewNode) {
        return;
    }

    for (let att in vOldNode.props) {
        if ((!vNewNode.props) || !(att in vNewNode.props)) {

            const v = vOldNode.props[att];

            if (att.startsWith("on")) {
                continue
            } else if (att === "$ref") {
                parent[v] = null;
            } else {
                if (!att in $node) {
                    $node.removeAttribute(att);
                } else {

                    if (typeof v === "object") {
                        Object.keys(v).forEach((key) => {
                            $node[att][key] = "";
                        })
                    } else {
                        $node[att] = "";
                    }

                }

            }
        }

    }


    for (let att in vNewNode.props) {
        if (!vOldNode?.props
            || !(att in vOldNode?.props)
            || vNewNode.props[att] !== vOldNode.props[att]) {

            const v = vNewNode.props[att];

            if (att.startsWith("on")) {
                continue
            } else if (att !== "$ref") {

                if (att in $node) {
                    if (typeof v === "object") {
                        Object.entries(v).forEach(([key, value]) => {
                            $node[att][key] = value;
                        })
                    } else {
                        $node[att] = v;
                    }

                } else {
                    $node.setAttribute(att, v);
                }

            } else {
                parent[v] = $node;
            }

        }
    }
}
