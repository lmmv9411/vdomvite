function _compararNodos(oldNode, newNode) {

    if ((oldNode === undefined && newNode === undefined) ||
        (oldNode === null && newNode === null)) {
        return true;
    }

    if (oldNode === undefined || newNode === undefined ||
        oldNode === null || newNode === null) {
        return false;
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

        if ((!oldNode.props) || !(att in oldNode.props)) {
            return false;
        }

        if (att.startsWith("on")) {
            continue
        }

        if (typeof newNode.props[att] === "object") {
            const tmpNewNode = JSON.stringify(newNode.props[att]);
            const tmpOldNode = JSON.stringify(oldNode.props[att]);
            if (tmpNewNode !== tmpOldNode) {
                return false;
            }
        } else if (newNode.props[att] !== oldNode.props[att]) {
            return false;
        }
    }

    const oldChildren = oldNode.children ?? [];
    const newChildren = newNode.children ?? [];

    if (oldChildren.length !== newChildren.length) {
        return false;
    }

    /*for (let i = 0; i < oldChildren.length; i++) {
        if (!compararNodos(oldChildren[i], newChildren[i])) {
            return false;
        }
    }*/

    return true;
}

/**
 * Comparar dos Nodos Virtuales, si son iguales retorna true.
 * @param {Object} oldNode 
 * @param {Object} newNode 
 * @returns {Boolean}
 */
export function compararNodos(oldNode, newNode) {

    if (oldNode === undefined && newNode === undefined) {
        return true;
    }

    const stack1 = [oldNode];
    const stack2 = [newNode];

    while (stack1.length > 0 && stack2.length > 0) {

        const nodo1 = stack1.pop();
        const nodo2 = stack2.pop();
        // Realiza aquí la comparación deseada entre nodo1 y nodo2

        if (!_compararNodos(nodo1, nodo2)) {
            return false;
        }

        // Agrega los hijos de nodo1 y nodo2 a las pilas
        if (nodo1.children && nodo2.children) {
            stack1.push(...nodo1.children);
            stack2.push(...nodo2.children);
        }
    }

    return true;
}