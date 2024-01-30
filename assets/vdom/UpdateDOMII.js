import { compararNodos } from "./CompararNodos";
import { VDOM } from "./Render";
import { k } from "./VDom";


export const reconciliation = (function () {

    let parent;

    /**
     * Comparar nodos virtual y reflejar cambios en DOM.
     * @param {HTMLElement} $parentNode Nodo del DOM, referencia de los nodos a comparar.
     * @param {Object} vOldNode Nodo Virtual antiguo.
     * @param {Object} vNewNode Nodo Virtual nuevo
     * @returns {Boolean} Retorna true si hubo cabios;
     **/
    const updateDOM = function (vOldNode, vNewNode, idx) {

        if (!compararNodos(vOldNode, vNewNode)) {
            parent = vOldNode;
            return _updateDOM(vOldNode, vNewNode, idx);
        }

    }

    const _updateDOM = function ($parentNode, vOldNode, vNewNode) {

        if (vNewNode && vNewNode.type === k.Portal ||
            vOldNode && vOldNode.type === k.Portal) {
            $parentNode = vNewNode.$element ?? vOldNode.$element;
        }

        if (($parentNode === undefined || $parentNode === null) ||
            (vOldNode === undefined && vNewNode === undefined) ||
            (vOldNode === null && vNewNode === null)) {
            return false;
        }

        if (vNewNode === undefined || vNewNode === null) {

            $parentNode.remove();

        } else if (vOldNode === undefined || vOldNode === null) {

            const $ref = VDOM.render(vNewNode, parent);
            $parentNode.appendChild($ref);
            setReff(vNewNode, $ref);

        } else if (compareNodes(vOldNode, vNewNode)) {

            replaceNode($parentNode, vNewNode);

        } else {
            compareAttributes($parentNode, vOldNode, vNewNode);
            compareChildren($parentNode, vOldNode, vNewNode, 0);
        }

        return true;
    }

    const compareChildren = function ($parentNode, vOldNode, vNewNode, idx) {

        let sizes = { childrenOldNode: 0, childrenNewNode: 0, maxChildren: 0 };
        let size = getSizeChildren({ vOldNode, vNewNode, ...sizes });

        let $refChildren = null;
        let childrenOld, childrenNew;
        let indexParent = null;

        for (let i = 0; i < size.maxChildren; i++) {

            if (indexParent) {
                indexParent++;
            }
            childrenNew = vNewNode?.children ? vNewNode?.children[i] : undefined;
            childrenOld = vOldNode?.children ? vOldNode?.children[i] : undefined;
            $refChildren = $parentNode.childNodes[indexParent ?? idx++] ?? $parentNode;

            if (childrenNew?.type === k.Fragment || childrenOld?.type === k.Fragment) {
                idx--;
                compareChildren($parentNode, childrenOld, childrenNew, idx);
                idx += childrenNew?.children?.length ?? 0;
                continue;
            }


            const conKeys = containsKeys(childrenOld, childrenNew);

            const isDiffNode = compareNodes(childrenOld, childrenNew);

            if (conKeys || isDiffNode) {

                if (childrenNew !== undefined && childrenOld !== undefined &&
                    childrenNew?.key !== childrenOld?.key) {
                    reemplazarNodos(childrenOld, childrenNew, vOldNode, vNewNode, $refChildren, i);
                    continue
                }

                if (childrenNew !== undefined && childrenOld !== undefined &&
                    childrenNew.key && childrenOld.key &&
                    childrenNew?.key === childrenOld?.key) {
                    checkAndUpdate(vOldNode, vNewNode, childrenOld, childrenNew, $refChildren, i);
                    continue
                }

                if (size.childrenNewNode > size.childrenOldNode) {

                    let index = i;

                    if (vNewNode.type === k.Fragment) {
                        index = idx;
                    }

                    index = index + 1 === size.childrenNewNode ? index + 1 : index;

                    const $ref = VDOM.render(childrenNew, parent);

                    const $nextSibling = $parentNode.children[index];

                    if ($nextSibling) {
                        $parentNode.insertBefore($ref, $nextSibling);
                    } else {
                        $parentNode.appendChild($ref);
                    }

                    setReff(childrenNew, $ref);

                    vOldNode?.children?.splice(i, 0, childrenNew);
                    size.childrenOldNode++;

                    if (childrenNew.type === k.Fragment) {
                        indexParent = childrenNew.children.length - 1;
                    }

                } else if (size.childrenNewNode < size.childrenOldNode) {

                    $refChildren.remove();
                    vOldNode.children.splice(i--, 1);
                    size.maxChildren = vOldNode.children?.length ?? 0;
                    idx--;

                } else {
                    checkAndUpdate(vOldNode, vNewNode, childrenOld, childrenNew, $refChildren, i);
                }

            } else {
                _updateDOM($refChildren, childrenOld, childrenNew);
            }

        }

    }

    const checkAndUpdate = function (vOldNode, vNewNode, childrenOld, childrenNew, $refChildren, i) {

        if (childrenOld.type === k.Fragment) {

            const $childrens = vOldNode.children[i].childrenFragment;

            vNewNode.children[i].childrenFragment = vOldNode.children[i].childrenFragment;

            $childrens.forEach(($ch, idx) => {
                if (!compararNodos(childrenOld.children[idx], childrenNew.children[idx])) {
                    _updateDOM($ch, childrenOld.children[idx], childrenNew.children[idx]);
                }
            })

        } else {
            if (!compararNodos(childrenOld, childrenNew)) {
                _updateDOM($refChildren, childrenOld, childrenNew);
            }
        }

    }

    const containsKeys = function (childrenOld, childrenNew) {

        if (typeof childrenNew === "object" || typeof childrenOld === "object") {

            let a = false, b = false;

            if (childrenNew?.key) {
                a = !a;
            }

            if (childrenOld?.key) {
                b = !b;
            }

            return (a || b);
        }

        return false;
    }

    const reemplazarNodos = function (childrenOld, childrenNew, vOldNode, vNewNode, $refChildren, i) {
        if (childrenOld.type === k.Fragment) {

            const $childrens = vOldNode.children[i].childrenFragment;

            vNewNode.children[i].childrenFragment = vOldNode.children[i].childrenFragment;

            $childrens.forEach(($ch, idx) => {
                if (!compararNodos(childrenOld.children[idx], childrenNew.children[idx])) {
                    const $ref = replaceNode($ch, childrenNew.children[idx])
                    vNewNode.children[i].childrenFragment[idx] = $ref;
                }
            })

        } else {
            replaceNode($refChildren, childrenNew);
            vOldNode.children[i] = childrenNew;
        }
    }

    const getSizeChildren = function (size) {
        let childrenOldNode = size.vOldNode?.children?.length ?? 0;
        let childrenNewNode = size.vNewNode?.children?.length ?? 0;
        let maxChildren = Math.max(childrenOldNode, childrenNewNode);
        return { childrenNewNode, childrenOldNode, maxChildren };
    }

    const compareNodes = function (vOldNode, vNewNode) {

        if ((vNewNode === undefined && vOldNode !== undefined) ||
            (vNewNode !== undefined && vOldNode === undefined)) {
            return true;
        }

        return vOldNode.type !== vNewNode.type
            || (typeof vNewNode === "number" && vOldNode !== vNewNode)
            || (typeof vNewNode === "string" && vOldNode !== vNewNode)
    }

    const setReff = function (vNewNode, $ref) {

        if (vNewNode === undefined || vNewNode === null) {
            return;
        }

        if (vNewNode.construido !== undefined &&
            typeof vNewNode.construido === "function") {

            vNewNode.construido($ref);

        }

    }

    const replaceNode = function ($n, vNewNode) {
        if (vNewNode === undefined || vNewNode === null) {
            return;
        }

        const $ref = VDOM.render(vNewNode, parent);

        if ($ref) {
            $n.replaceWith($ref);
            setReff(vNewNode, $ref);
        }

        return $ref;
    }

    /**
     * Comparar y actualizar atributos de un elemento del DOM si hay cambios.
     * @param {HTMLElement} $node Referencia al DOM del elemento a comparar.
     * @param {Object} vOldNode Antiguo estado del VDOM.
     * @param {Object} vNewNode Nuevo estado del VDOM.
     * @returns {void}
     */
    const compareAttributes = function ($node, vOldNode, vNewNode) {

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
                        delete vOldNode.props[att]
                    } else {

                        if (typeof v === "object") {
                            Object.keys(v).forEach((key) => {
                                $node[att][key] = "";
                                delete vOldNode.props[att][key];
                            })
                        } else {
                            try {
                                $node[att] = "";
                            } catch (error) {
                                $node.removeAttribute(att)
                            }
                            delete vOldNode.props[att];
                        }

                    }

                }
            }

        }

        for (let att in vNewNode.props) {
            if (!vOldNode.props
                || !(att in vOldNode.props)
                || vNewNode.props[att] !== vOldNode.props[att]) {

                let v = vNewNode.props[att];

                v = typeof v === "string" ? v.trim() : v;

                if (typeof v === "object") {
                    const tmpNewNode = JSON.stringify(v);
                    if (!vOldNode.props) {
                        vOldNode.props = {};
                        vOldNode.props[att] = {};
                    }
                    const tmpOldNode = JSON.stringify(vOldNode.props[att]);
                    if (tmpNewNode === tmpOldNode) {
                        continue;
                    }
                }

                if (att.startsWith("on")) {
                    continue;
                } else if (att !== "$ref") {

                    if (att in $node) {
                        if (typeof v === "object") {
                            Object.entries(v).forEach(([key, value]) => {
                                $node[att][key] = value;
                                vOldNode.props[att][key] = v;
                            })
                        } else {
                            try {
                                $node[att] = v;
                            } catch (error) {
                                $node.setAttribute(att, v)
                            }
                            vOldNode.props[att] = v;
                        }

                    } else {
                        $node.setAttribute(att, v);
                        vOldNode.props[att] = v;
                    }

                } else {
                    parent[v] = $node;
                }

            }
        }

    }

    return { updateDOM };
})();
