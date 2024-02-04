import { compararNodos } from "./CompararNodos";
import { VDOM } from "./Render";
import { k } from "./VDom";


export const reconciliation = (function () {

    const ADD = Symbol('add');
    const DELETE = Symbol('delte');
    let action = null;
    let idxFragment = null;
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

        if (vNewNode === undefined || vNewNode === null) {

            action = { type: DELETE }

            if (vOldNode.type === k.Fragment) {
                vOldNode.childrenFragment?.forEach($ch => $ch.remove());
                action.childrenFragment = vOldNode.childrenFragment;
            } else {
                $parentNode.remove();
            }

        } else if (vOldNode === undefined || vOldNode === null) {

            const $ref = VDOM.render(vNewNode, parent);

            action = { type: ADD };

            if (idxFragment) {

                const $nextSibling = $parentNode.children[idxFragment];

                if ($nextSibling) {
                    $parentNode.insertBefore($ref, $nextSibling);
                } else {
                    $parentNode.appendChild($ref);
                }

            } else {
                $parentNode.appendChild($ref);
            }

            if (vNewNode.type === k.Fragment) {
                action.childrenFragment = vNewNode.childrenFragment;
            } else {
                action.reff = $ref;
            }

            setReff(vNewNode, $ref);

        } else if (compareNodes(vOldNode, vNewNode)) {

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

        if (vOldNode?.type === k.Fragment && vNewNode?.type === k.Fragment) {
            vNewNode.childrenFragment = vOldNode.childrenFragment;
        }

        if (!isNaN(vOldNode.idx)) {
            indexParent = vOldNode.idx;
            $parentNode = vOldNode.$element;
            vNewNode.idx = vOldNode.idx;
            vNewNode.$element = vOldNode.$element;
        }

        for (let i = 0; i < size.maxChildren; i++) {

            childrenNew = vNewNode?.children ? vNewNode?.children[i] : undefined;
            childrenOld = vOldNode?.children ? vOldNode?.children[i] : undefined;

            if (vOldNode.type === k.Fragment) {
                $refChildren = $parentNode.childNodes[indexParent++];
            } else {
                $refChildren = $parentNode.childNodes[indexParent ?? i] ?? $parentNode;
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

                    let index = i + 1 === size.childrenNewNode ? i + 1 : i;

                    if (vOldNode.type === k.Fragment) {
                        index = indexParent - i + 1;
                    }

                    const $ref = VDOM.render(childrenNew, parent);

                    const $nextSibling = $parentNode.children[index];

                    if ($nextSibling) {
                        $parentNode.insertBefore($ref, $nextSibling);
                    } else {
                        $parentNode.appendChild($ref);
                    }

                    setReff(childrenNew, $ref);

                    vOldNode?.children.splice(i, 0, childrenNew);
                    size.childrenOldNode++;

                    if (childrenNew.type === k.Fragment) {
                        indexParent = childrenNew.childrenFragment.length - 1;
                    }

                } else if (size.childrenNewNode < size.childrenOldNode) {

                    if (childrenOld.type === k.Fragment) {
                        const size = indexParent - 1 + childrenOld.children.length;
                        for (let index = indexParent - 1; index < size; index++) {
                            $parentNode.children[index].remove();
                        }
                        const $childrens = childrenOld.childrenFragment;
                        $childrens.forEach($ch => $ch.remove());
                    } else {
                        $refChildren.remove();
                    }

                    vOldNode.children.splice(i--, 1);
                    size.maxChildren = vOldNode.children?.length ?? 0;

                } else {
                    checkAndUpdate(vOldNode, vNewNode, childrenOld, childrenNew, $refChildren, i);
                }

            } else {
                //   if (childrenOld?.type === k.Fragment) {
                /* let $children = childrenOld.childrenFragment ?? $parentNode.children;
                 //let $children = Array.from($parentNode.children).slice(i, childrenOld.children.length + i);

                 let max = Math.max(childrenOld.children.length, childrenNew.children.length);

                 childrenNew.childrenFragment = [];

                 for (let index = 0; index < max; index++) {

                     let $ch = $children[index];

                     if ($ch && !childrenNew.childrenFragment[index]) {
                         childrenNew.childrenFragment[index] = $ch
                     }

                     if (!$ch) {
                         $ch = $parentNode;
                     }

                     const chOld = childrenOld?.children[index];
                     const chNew = childrenNew?.children[index];
                     idxFragment = index + 1;

                     _updateDOM($ch, chOld, chNew);

                     if (!action) continue;

                     switch (action.type) {
                         case ADD:
                             if (action.childrenFragment) {
                                 childrenNew.childrenFragment.splice(index, 0, ...action.childrenFragment)
                             } else {
                                 childrenNew.childrenFragment.splice(index, 0, action.reff)
                             }
                             break;
                         case DELETE:
                             childrenNew.childrenFragment.splice(index, 1);
                             break;
                     }

                     action = null;
                     idxFragment = null;

                 }

                 indexParent = childrenNew.children.length;
*/
                //} else {
                if (childrenOld.type === k.Fragment) {
                    _updateDOM($parentNode, childrenOld, childrenNew);
                } else {
                    _updateDOM($refChildren, childrenOld, childrenNew);
                }
                //   }

                action = null;
                idxFragment = null;

            }

        }

    }

    const checkAndUpdate = function (vOldNode, vNewNode, childrenOld, childrenNew, $refChildren, i) {

        if (childrenOld && childrenOld.type === k.Fragment) {

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

    const reemplazarNodos = function (
        childrenOld,
        childrenNew,
        vOldNode,
        vNewNode,
        $refChildren,
        i
    ) {

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
