/**
 * Comparar nodos, si son iguales retorna true, si son diferentes retorna false.
 * @param {{children: Array.<Object>, type:String, props: Object}} oldNode 
 * @param {{children: Array.<Object>, type:String, props: Object}} newNode 
 * @returns {Boolean}
 */
export function compararNodos(oldNode, newNode) {

    if ((oldNode === undefined && newNode === undefined)
        || (oldNode === null || newNode === null)) {
        return false;
    }

    if ((!oldNode && newNode) || (oldNode && !newNode)) {
        return false
    }

    if (oldNode.type !== newNode.type
        || (typeof newNode === "number" && oldNode !== newNode)
        || (typeof newNode === "string" && oldNode !== newNode)) {
        return false;
    }


    const oldProps = oldNode.props ?? {};
    const newProps = newNode.props ?? {};

    if (Object.keys(oldProps).length !== Object.keys(newProps).length) {
        return false;
    }

    for (let att in oldProps) {
        if ((!newNode.props) || !(att in newNode.props)) {
            return false;
        }
    }

    for (let att in newProps) {
        if ((!oldNode.props) || !(att in oldNode.props)
            || newNode.props[att] !== oldNode.props[att]) {

            return false;
        }
    }

    const oldChildren = oldNode.children ?? [];
    const newChildren = newNode.children ?? [];

    if (oldChildren.length !== newChildren.length) {
        return false;
    }

    for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
        if (!compararNodos(oldChildren[i], newChildren[i])) {
            return false;
        }
    }

    return true;
}