import { compararNodos } from "./CompararNodos";
import { Componente } from "./Componente";
import { VDOM } from "./Render";
import { Fragment, Portal } from "./VDom";


export const reconciliation = (function () {

    let parent;

    /**
     * Comparar nodos virtual y reflejar cambios en DOM.
     * @param {HTMLElement} $parentNode Nodo del DOM, referencia de los nodos a comparar.
     * @param {Object} vOldNode Nodo Virtual antiguo.
     * @param {Object} vNewNode Nodo Virtual nuevo
     * @returns {void}
     * */
    const updateDOM = function ($parentNode, vOldNode, vNewNode) {
        parent = vOldNode;
        _updateDOM($parentNode, vOldNode, vNewNode);
    }

    const _updateDOM = function ($parentNode, vOldNode, vNewNode) {

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

            const $ref = VDOM.render(vNewNode, parent);

            if (Array.isArray($ref)) {
                for (let i = 0; i < $ref.length; i++) {
                    $parentNode.appendChild($ref[i]);
                    setReff(vNewNode[i], $ref[i]);
                }
            } else {
                $parentNode.appendChild($ref);
                setReff(vNewNode, $ref);
            }

        } else if (compareNodes(vOldNode, vNewNode)) {

            replaceNode($parentNode, vNewNode);

        } else {

            compareAttributes($parentNode, vOldNode, vNewNode);
            compareChildren($parentNode, vOldNode, vNewNode);

        }

    }

    const tratarFragmentos = function ($parentNode, vOldNode, vNewNode, idx = 0) {

        let sizes = { childrenOldNode: 0, childrenNewNode: 0, maxChildren: 0 };
        let size = getSizeChildren({ vOldNode, vNewNode, ...sizes })

        let $refChildren = null, childrenNew = null, childrenOld = null;

        for (let i = 0; i < size.maxChildren; i++) {

            childrenNew = vNewNode?.children[i] ?? vNewNode;
            childrenOld = vOldNode?.children[i] ?? vOldNode;

            $refChildren = $parentNode.children[idx++] ?? $parentNode;

            _updateDOM($refChildren, childrenOld, childrenNew);

            if (!vNewNode) {
                idx--;
                size.maxChildren = $parentNode.children.length;
            }

        }
    }

    const compareChildren = function ($parentNode, vOldNode, vNewNode) {

        let sizes = { childrenOldNode: 0, childrenNewNode: 0, maxChildren: 0 };
        let size = getSizeChildren({ vOldNode, vNewNode, ...sizes })

        let $refChildren = null;
        let childrenOld, childrenNew;

        for (let i = 0; i < size.maxChildren; i++) {

            let tmpParent;
            childrenNew = vNewNode?.children[i];
            childrenOld = vOldNode?.children[i];

            $refChildren = $parentNode.childNodes[i] ?? $parentNode;

            if (childrenNew && childrenNew.type === Fragment) {

                if (!childrenNew.key) {
                    tratarFragmentos($parentNode, childrenOld, childrenNew, i);
                    continue
                }

                $refChildren = $parentNode;
            }

            if (!childrenNew && childrenOld && childrenOld.type === Fragment && !childrenOld.key) {
                tratarFragmentos($parentNode, childrenOld, childrenNew, i);
                continue
            }

            if (childrenNew && childrenNew instanceof Componente) {
                tmpParent = parent;
                parent = childrenNew;
            }

            let conKeys = false;

            if (typeof childrenNew === "object" || typeof childrenOld === "object") {

                let a = false, b = false;

                if (childrenNew && childrenNew.key) {
                    a = !a;
                }
                if (childrenOld && childrenOld.key) {
                    b = !b;
                }

                conKeys = (a || b);

            }

            const diferentesNodos = compareNodes(childrenOld, childrenNew);

            if (conKeys || diferentesNodos) {

                if (childrenNew?.key !== childrenOld?.key || diferentesNodos) {

                    if (size.childrenNewNode > size.childrenOldNode) {
                        const index = i + 1 === size.childrenNewNode ? i + 1 : i;

                        const $ref = VDOM.render(childrenNew, parent);

                        const $nextSibling = $parentNode.children[index];

                        if ($nextSibling) {
                            $parentNode.insertBefore($ref, $nextSibling);
                        } else {
                            $parentNode.appendChild($ref);
                        }

                        setReff(childrenNew, $ref);

                        vOldNode.children.splice(i, 0, childrenNew);

                        if (childrenNew.type === Fragment) {
                            if (!vNewNode.children[i].fragmento) {
                                vNewNode.children[i].fragmento = vOldNode.children[i].fragmento;
                            }
                            //vNewNode.children.splice(0, vOldNode.children.length, ...vOldNode.children.slice(0, vOldNode.children.length));
                        }

                    } else if (size.childrenNewNode < size.childrenOldNode) {

                        if (childrenOld.type === Fragment) {
                            const $childrens = vOldNode.children[i].fragmento;
                            $childrens.forEach($ch => $parentNode.removeChild($ch))
                        } else {
                            $refChildren.remove();
                        }

                        vOldNode.children.splice(i, 1);

                        if (childrenOld.type === Fragment) {
                            vNewNode.children.splice(0, vOldNode.children.length, ...vOldNode.children.slice(0, vOldNode.children.length));
                        }

                        i--;


                    } else {

                        $refChildren
                        replaceNode($refChildren, childrenNew);
                        vOldNode.children[i] = childrenNew;

                        if (childrenOld.type === Fragment) {
                            const $childrens = vOldNode.children[i].fragmento;
                            $childrens.forEach(($ch, i) => { replaceNode($ch, childrenNew.children[i]) })
                        } else {
                            replaceNode($refChildren, childrenNew);
                            vOldNode.children[i] = childrenNew;
                        }

                        if (childrenNew.type === Fragment) {
                            if (!vNewNode.children[i].fragmento) {
                                vNewNode.children[i].fragmento = vOldNode.children[i].fragmento;
                            }
                            //vNewNode.children.splice(0, vOldNode.children.length, ...vOldNode.children.slice(0, vOldNode.children.length));
                        }
                    }
                } else {
                    if (childrenOld.type === Fragment) {
                        const $childrens = vOldNode.children[i].fragmento;
                        $childrens.forEach(($ch, i) => {
                            _updateDOM($ch, childrenOld.children[i], childrenNew.children[i])
                        });

                        if (!vNewNode.children[i].fragmento) {
                            vNewNode.children[i].fragmento = vOldNode.children[i].fragmento;
                        }
                    } else {
                        _updateDOM($refChildren, childrenOld, childrenNew);
                    }
                }

            } else {
                _updateDOM($refChildren, childrenOld, childrenNew);
            }

            parent = tmpParent ?? parent;

        }

    }

    const getSizeChildren = function (size) {
        let childrenOldNode = size.vOldNode?.children?.length ?? 0;
        let childrenNewNode = size.vNewNode?.children?.length ?? 0;
        let maxChildren = Math.max(childrenOldNode, childrenNewNode);
        return { childrenNewNode, childrenOldNode, maxChildren };
    }

    const compareNodes = function (vOldNode, vNewNode) {

        if (vNewNode === undefined || vOldNode === undefined) {
            return false
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
        $n.replaceWith($ref);
        setReff(vNewNode, $ref);
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
                            $node[att] = "";
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
                                vOldNode.props[att][key] = v;
                            })
                        } else {
                            $node[att] = v;
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