import { compararNodos } from "./CompararNodos";
import { Componente } from "./Componente";
import { render } from "./Render";
import { Fragment, Portal } from "./VDom";

let parent, indexFragment = null;

export default function changes($parentNode, vOldNode, vNewNode) {
    parent = vNewNode;
    _changes($parentNode, vOldNode, vNewNode);
}

function _changes($parentNode, vOldNode, vNewNode) {

    if (vNewNode && vNewNode.type === Portal) {
        $parentNode = vNewNode.$element;
    }

    if (($parentNode === undefined || $parentNode === null) ||
        (vOldNode === undefined && vNewNode === undefined) ||
        (vOldNode === null && vNewNode === null) ||
        compararNodos(vOldNode, vNewNode)) {
        return;
    }

    if (vNewNode === undefined || vNewNode === null) {

        $parentNode.remove();

    } else if (vOldNode === undefined || vOldNode === null) {

        const $ref = render(vNewNode, parent);

        if (Array.isArray($ref)) {
            for (let i = 0; i < $ref.length; i++) {
                $parentNode.appendChild($ref[i]);
                setReff(vNewNode[i], $ref[i]);
            }
        } else {
            $parentNode.appendChild($ref);
            setReff(vNewNode, $ref);
        }

    } else if (sonDiferentes(vOldNode, vNewNode)) {

        reemplazarNodo($parentNode, vNewNode);

    } else {

        compararAtributos($parentNode, vOldNode, vNewNode);

        let on = vOldNode.children?.length ?? 0;
        let nn = vNewNode.children?.length ?? 0;
        let max = Math.max(on, nn);
        let $n = null;
        let chOld, chNew;

        for (let i = 0; i < max; i++) {

            let tmpParent;
            chNew = vNewNode.children[i];
            chOld = vOldNode.children[i];

            $n = indexFragment ?? $parentNode.childNodes[i] ?? $parentNode;

            indexFragment = indexFragment && null;

            if (chNew && chNew.type === Fragment) {
                $n = chNew.$fragment ?? $parentNode;
                indexFragment = chNew?.$fragment?.childNodes[i] ?? $parentNode;
            }

            if (chNew && chNew instanceof Componente) {
                tmpParent = parent;
                parent = chNew;
            }

            let conKeys = false;

            if (typeof chNew === "object" || typeof chOld === "object") {

                let a = false, b = false;

                if (chNew && chNew.key) {
                    a = !a;
                }
                if (chOld && chOld.key) {
                    b = !b;
                }

                conKeys = (a || b);

            }

            const diferentesNodos = sonDiferentes(chOld, chNew);

            if (conKeys || diferentesNodos) {

                if (chNew?.key !== chOld?.key || diferentesNodos) {

                    if (nn > on) {
                        const index = i + 1 === nn ? i + 1 : i;

                        const $ref = render(chNew, parent);

                        $parentNode.insertBefore($ref, $parentNode.children[index]);

                        setReff(chNew, $ref);

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
                        reemplazarNodo($n, chNew);
                        vOldNode.children[i] = chNew;
                    }
                } else {
                    _changes($n, chOld, chNew);
                }

            } else {
                _changes($n, chOld, chNew);
            }

            parent = tmpParent ?? parent;

            indexFragment = null;

        }
    }

}

function sonDiferentes(vOldNode, vNewNode) {

    if (vNewNode === undefined || vOldNode === undefined) {
        return false
    }

    return vOldNode.type !== vNewNode.type
        || (typeof vNewNode === "number" && vOldNode !== vNewNode)
        || (typeof vNewNode === "string" && vOldNode !== vNewNode)
}

function setReff(vNewNode, $ref) {

    if (vNewNode === undefined || vNewNode === null) {
        return;
    }

    if (vNewNode.construido !== undefined &&
        typeof vNewNode.construido === "function") {

        vNewNode.construido($ref);

    }

}

function reemplazarNodo($n, vNewNode) {
    if (vNewNode === undefined || vNewNode === null) {
        return;
    }
    const $ref = render(vNewNode, parent);
    $n.replaceWith($ref);
    setReff(vNewNode, $ref);
}

/**
 * 
 * @param {HTMLElement} $node 
 * @param {*} vOldNode 
 * @param {*} vNewNode 
 * @returns {void}
 */
function compararAtributos($node, vOldNode, vNewNode) {

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
        if (!vOldNode.props
            || !(att in vOldNode.props)
            || vNewNode.props[att] !== vOldNode.props[att]) {

            const v = vNewNode.props[att];

            if (typeof v === "object") {
                const tmpNewNode = JSON.stringify(v);
                const tmpOldNode = JSON.stringify(vOldNode.props[att]);
                if (tmpNewNode === tmpOldNode) {
                    continue;
                }
            }

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
