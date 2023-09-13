/**
 * Comparar nodos, si son iguales retorna true, si son diferentes retorna false.
 * @param {{children: Array.<Object>, type:String, props: Object}} oldNode 
 * @param {{children: Array.<Object>, type:String, props: Object}} newNode 
 * @returns {Boolean} Retorna true si son iguales.
 */
export function compararNodos(oldNode, newNode) {

    if ((oldNode === undefined && newNode === undefined)
        || (oldNode === null || newNode === null)) {
        return false;
    }

    if ((!oldNode && newNode) || (oldNode && !newNode)) {
        return false
    }

    if (oldNode.type !== newNode.type) {
        return false;
    }
    if (typeof newNode === "number" ||
        typeof newNode === "string") {
        return oldNode === newNode;
    }

    const oldProps = oldNode.props ?? {};
    const newProps = newNode.props ?? {};

    for (let att in oldProps) {
        if ((!newNode.props) || !(att in newNode.props)) {
            return false;
        }
    }

    for (let att in newProps) {
        if ((!oldNode.props) || !(att in oldNode.props)
            || newNode.props[att] !== oldNode.props[att]) {

            if (att.startsWith("on")) {
                continue
            }

            return false;
        }
    }

    const oldChildren = oldNode.children ?? [];
    const newChildren = newNode.children ?? [];

    if (oldChildren.length !== newChildren.length) {
        return false;
    }

    for (let i = 0; i < oldChildren.length; i++) {
        if (!compararNodos(oldChildren[i], newChildren[i])) {
            return false;
        }
    }

    return true;
}