import { compararNodos } from "./CompararNodos";
import { Componente } from "./Componente";
import { VDOM } from "./Render";
import { Fragment, Portal } from "./VDom";


export const reconciliacion = (function () {

    let parent, indexFragment = null;

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

    const _updateDOM = function ($parentNode, vOldNode, vNewNode, padre = null, idx = null) {

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
            padre && (padre.children.splice(idx, 1))

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

            padre && (padre.children.splice(idx, 0, vNewNode))

        } else if (sonDiferentes(vOldNode, vNewNode)) {

            reemplazarNodo($parentNode, vNewNode);

            padre && (padre.children[idx] = vNewNode)

        } else {

            compararAtributos($parentNode, vOldNode, vNewNode);

            let sizes = { childrenOldNode: 0, childrenNewNode: 0, maxChildren: 0 };
            let size = getSizeChildren({ vOldNode, vNewNode, ...sizes })

            let $refChildren = null;
            let childrenOld, childrenNew;

            for (let i = 0; i < size.maxChildren; i++) {

                let tmpParent;
                childrenNew = vNewNode.children[i];
                childrenOld = vOldNode.children[i];

                $refChildren = indexFragment ?? $parentNode.childNodes[i] ?? $parentNode;

                indexFragment = indexFragment && null;

                if (childrenNew && childrenNew.type === Fragment) {
                    $refChildren = childrenNew.$fragment ?? $parentNode;
                    indexFragment = childrenNew?.$fragment?.childNodes[i] ?? $parentNode.childNodes[i] ?? $parentNode;
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

                const diferentesNodos = sonDiferentes(childrenOld, childrenNew);

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

                        } else if (size.childrenNewNode < size.childrenOldNode) {

                            $refChildren = childrenNew?.type === Fragment ? indexFragment : $refChildren

                            $refChildren.remove();

                            vOldNode.children.splice(i, 1);

                            i--;

                        } else {

                            $refChildren = childrenNew?.type === Fragment ? indexFragment : $refChildren
                            reemplazarNodo($refChildren, childrenNew);
                            vOldNode.children[i] = childrenNew;
                        }
                    } else {
                        _updateDOM($refChildren, childrenOld, childrenNew, vOldNode, i);
                    }

                } else {
                    _updateDOM($refChildren, childrenOld, childrenNew, vOldNode, i);
                }

                size = getSizeChildren({ vOldNode, vNewNode, ...sizes })

                parent = tmpParent ?? parent;
                indexFragment = null;

            }

        }

    }

    const getSizeChildren = function (size) {
        let childrenOldNode = size.vOldNode?.children?.length ?? 0;
        let childrenNewNode = size.vNewNode?.children?.length ?? 0;
        let maxChildren = Math.max(childrenOldNode, childrenNewNode);
        return { childrenNewNode, childrenOldNode, maxChildren };
    }

    const sonDiferentes = function (vOldNode, vNewNode) {

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

    const reemplazarNodo = function ($n, vNewNode) {
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
    const compararAtributos = function ($node, vOldNode, vNewNode) {

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