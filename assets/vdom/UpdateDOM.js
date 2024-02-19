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
    const updateDOM = function ($parentNode, vOldNode, vNewNode) {

        if (!compararNodos(vOldNode, vNewNode)) {
            parent = vOldNode;
            return _updateDOM($parentNode, vOldNode, vNewNode);
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

        if ((vNewNode === undefined || vNewNode === null) && vOldNode.type !== k.Fragment) {

            $parentNode.remove();

        } else if (vOldNode === undefined || vOldNode === null) {

            const $ref = VDOM.render(vNewNode, parent);
            $parentNode.appendChild($ref);
            setReff(vNewNode, $ref);

        } else if (compareNodes(vOldNode, vNewNode) && vOldNode.type !== k.Fragment) {

            replaceNode($parentNode, vNewNode);

        } else {
            compareAttributes($parentNode, vOldNode, vNewNode);
            compareChildren($parentNode, vOldNode, vNewNode);
        }

        return true;
    }

    const compareChildren = function ($parentNode, vOldNode, vNewNode) {

        let sizes = { childrenOldNode: 0, childrenNewNode: 0, maxChildren: 0 };
        let size = getSizeChildren({ vOldNode, vNewNode, ...sizes });

        let $refChildren = null;
        let childrenOld, childrenNew;
        let indexParent = null;

        if (!isNaN(vOldNode.idx)) {
            indexParent = vOldNode.idx ?? 0;
            $parentNode = vOldNode.$element ?? $parentNode;
            if (vNewNode) {
                vNewNode.idx = vOldNode.idx;
                vNewNode.$element = vOldNode.$element ?? $parentNode;
            }
        }

        if (indexParent === undefined || indexParent === null) {
            indexParent = 0;
        }

        let isAddedFragment = false;

        for (let i = 0; i < size.maxChildren; i++) {

            childrenNew = vNewNode?.children ? vNewNode?.children[i] : undefined;
            childrenOld = vOldNode?.children ? vOldNode?.children[i] : undefined;

            if ((childrenOld && childrenOld.type === k.Portal) ||
                (childrenNew && childrenNew.type === k.Portal)) {
                continue;
            }

            if (vOldNode.type === k.Fragment) {
                $refChildren = $parentNode.childNodes[indexParent++];
            } else {
                let index;

                if (indexParent > 0) {
                    index = indexParent;
                    indexParent++;
                } else {
                    index = i;

                    if (childrenOld?.type === k.Fragment &&
                        childrenOld.idx !== index) {
                        childrenOld.idx = index;
                        indexParent = index;
                        indexParent++;
                        isAddedFragment = true;
                    }
                }

                $refChildren = $parentNode.childNodes[index] ?? $parentNode;
            }

            if ((vOldNode.is === k.Portal || vNewNode.is === k.Portal) &&
                (childrenOld.props?.id)) {
                $refChildren = document.getElementById(childrenOld.props.id);
            }

            if (childrenNew?.type === k.Fragment && childrenOld?.type === k.Fragment) {
                childrenNew.idx = childrenOld.idx;
                childrenNew.$element = childrenOld.$element ?? $parentNode;
            }

            const conKeys = containsKeys(childrenOld, childrenNew);

            const isDiffNode = compareNodes(childrenOld, childrenNew);

            if (conKeys || isDiffNode) {

                if (childrenNew !== undefined && childrenOld !== undefined &&
                    childrenNew.key !== undefined && childrenOld.key !== undefined &&
                    childrenNew.key !== null && childrenOld.key !== null &&
                    childrenNew.key !== childrenOld.key &&
                    vNewNode.children.length === vOldNode.children.length) {

                    if (childrenNew.type === k.Fragment) {

                        for (let index = 0; index < childrenNew.children.length; index++) {
                            const $ch = $parentNode.children[i + index];
                            replaceNode($ch, childrenNew.children[index]);
                        }

                    } else {
                        replaceNode($refChildren, childrenNew);
                        vOldNode.children[i] = childrenNew;
                    }

                    continue
                }

                if (childrenNew !== undefined && childrenOld !== undefined &&
                    childrenNew.key && childrenOld.key &&
                    childrenNew?.key === childrenOld?.key) {

                    if (childrenNew.type === k.Fragment) {
                        childrenOld.idx = i;
                        compareChildren($refChildren, childrenOld, childrenNew);
                    } else {
                        checkAndUpdate(childrenOld, childrenNew, $refChildren);
                    }
                    continue
                }

                if (size.childrenNewNode > size.childrenOldNode) {

                    let index = i + 1 === size.childrenNewNode ? i + 1 : i;

                    if (vOldNode.type === k.Fragment) {
                        if (indexParent > 0) {
                            index = indexParent - 1;
                        }
                    }

                    const $ref = VDOM.render(childrenNew, parent);

                    const $nextSibling = $parentNode.children[index];

                    if ($nextSibling) {
                        $parentNode.insertBefore($ref, $nextSibling);
                    } else {
                        $parentNode.appendChild($ref);
                    }

                    setReff(childrenNew, $ref);

                    if (childrenNew.type === k.Fragment) {

                        childrenNew.$element = $parentNode;

                        if (indexParent - 1 === 0 || indexParent === 0) {
                            indexParent = childrenNew.countChildren;
                            if (i > 0) {
                                indexParent++
                            }
                        } else {
                            indexParent += childrenNew.countChildren - 1;
                        }

                        childrenNew.idx = i;
                    }

                    vOldNode?.children.splice(i, 0, childrenNew);
                    size.childrenOldNode++;

                } else if (size.childrenNewNode < size.childrenOldNode) {

                    if (childrenOld.type === k.Fragment) {
                        deleteFragments($parentNode, childrenOld, i, indexParent);
                    } else {
                        $refChildren.remove();
                    }

                    vOldNode.children.splice(i--, 1);

                    if (indexParent > 0) {
                        indexParent--;
                    }

                    size.maxChildren = vOldNode.children?.length ?? 0;

                } else if (isDiffNode && size.childrenNewNode === size.childrenOldNode) {
                    replaceNode($refChildren, childrenNew);
                    vOldNode.children[i] = childrenNew;
                } else {
                    checkAndUpdate(childrenOld, childrenNew, $refChildren);
                }

            } else {

                if (!compararNodos(childrenOld, childrenNew)) {
                    if (childrenOld.type === k.Fragment) {
                        _updateDOM($parentNode, childrenOld, childrenNew);
                    } else {
                        _updateDOM($refChildren, childrenOld, childrenNew);
                    }
                }

                if (childrenOld.type === k.Fragment) {
                    if (!isAddedFragment) {
                        indexParent += childrenNew.children.length - 1;
                    } else {
                        isAddedFragment = false;
                    }
                }
            }

        }

    }

    const deleteFragments = function ($parentNode, childrenOld, index, indexParent) {

        let idx = index;
        let deleted = 0;

        if (indexParent > 0) {
            idx = indexParent - 1;
        }

        childrenOld.idx = idx

        let size = childrenOld.children.length;

        size += indexParent + idx;

        for (; idx < size; idx++) {

            const ch = childrenOld.children.shift();

            if (ch.type === k.Fragment) {
                const d = deleteFragments($parentNode, ch, idx, indexParent);
                deleted += d;
                idx -= d;
                size = childrenOld.children.length + indexParent + index;
                if (childrenOld.children.length === 0) {
                    break;
                }

                continue;
            }
            $parentNode.children[idx--].remove();
            deleted++;
            size = childrenOld.children.length + indexParent + index;
            if (childrenOld.children.length === 0) {
                break;
            }
        }

        return deleted;

    }

    const checkAndUpdate = function (childrenOld, childrenNew, $refChildren) {

        if (!compararNodos(childrenOld, childrenNew)) {
            _updateDOM($refChildren, childrenOld, childrenNew);
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
