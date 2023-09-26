import { compararNodos } from "./CompararNodos";

export const COMPARACION = {
    ADD: Symbol("ADD"),
    REMOVE: Symbol("REMOVE"),
    TYPE: Symbol("TYPE"),
    ERROR: Symbol("ERROR"),
    EQUAL: Symbol("EQUAL"),
    PROPS: Symbol("PROPS"),
    KEYS: Symbol("KEYS"),
    KEYSCAMBIOS: Symbol("KEYSCAMBIOS")
}

function _compararNodos(oldNode, newNode) {

    if ((oldNode === undefined && newNode === undefined) ||
        (oldNode === null && newNode === null)) {
        return COMPARACION.ERROR;
    }

    if ((!oldNode && newNode)) {
        return COMPARACION.ADD;
    }

    if (oldNode && !newNode) {
        return COMPARACION.REMOVE;
    }

    if (oldNode.type !== newNode.type) {
        return COMPARACION.TYPE;
    }
    if (typeof newNode === "number" ||
        typeof newNode === "string") {
        //return oldNode === newNode;
        if (oldNode !== newNode) {
            return COMPARACION.TYPE;
        } else {
            return COMPARACION.EQUAL;
        }
    }

    const oldProps = oldNode.props ?? {};
    const newProps = newNode.props ?? {};

    for (let att in oldProps) {
        if ((!newNode.props) || !(att in newNode.props)) {
            return COMPARACION.PROPS;
        }
    }

    for (let att in newProps) {
        if ((!oldNode.props) || !(att in oldNode.props)
            || newNode.props[att] !== oldNode.props[att]) {

            if (att.startsWith("on")) {
                continue
            }

            return COMPARACION.PROPS;
        }
    }

    const oldChildren = oldNode.children ?? [];
    const newChildren = newNode.children ?? [];

    const chnew = newChildren[0]
    const chold = oldChildren[0]

    if (chnew?.key || chold?.key) {

        if (newChildren.length !== oldChildren.length) {
            return COMPARACION.KEYSCAMBIOS;
        }

        const max = Math.max(oldChildren.length, newChildren.length);

        for (let i = 0; i < max; i++) {
            if (!compararNodos(oldChildren[i], newChildren[i])) {
                return COMPARACION.KEYSCAMBIOS;
            }
        }

        return COMPARACION.KEYS;

    }

    if (oldChildren.length > newChildren.length) {
        return COMPARACION.REMOVE;
    }

    if (oldChildren.length < newChildren.length) {
        return COMPARACION.ADD;
    }

    return COMPARACION.EQUAL;
}

export function buscaDiff(oldNode, newNode) {

    const stackOld = [oldNode];
    const stackNew = [newNode];
    const rutaOld = [];
    const rutaNew = [];
    let resp = true;

    while (stackOld.length > 0 && stackNew.length > 0) {

        const nodoOld = stackOld.pop();
        const nodoNew = stackNew.pop();
        // Realiza aquí la comparación deseada entre nodo1 y nodo2
        const equal = _compararNodos(nodoOld, nodoNew);

        if (equal !== COMPARACION.EQUAL &&
            equal !== COMPARACION.ERROR &&
            equal !== COMPARACION.KEYS) {

            if (typeof nodoOld === "object" &&
                typeof nodoNew === "object") {

                nodoOld.diff = equal;
                nodoNew.diff = equal;

            }

            resp = false;

            // Marca todos los nodos en la ruta desde el nodo raíz hasta current1 como diferentes
            for (const nodo of rutaOld) {
                nodo.diff = equal;
            }
            for (const nodo of rutaNew) {
                nodo.diff = equal;
            }

        }

        // Agrega los hijos de nodo1 y nodo2 a las pilas
        const condicion = (
            equal !== COMPARACION.TYPE &&
            equal !== COMPARACION.REMOVE &&
            equal !== COMPARACION.ADD &&
            equal !== COMPARACION.ERROR &&
            equal !== COMPARACION.KEYS &&
            equal !== COMPARACION.KEYSCAMBIOS
        );

        if (condicion && nodoOld.children && nodoNew.children) {
            stackOld.push(...nodoOld.children);
            stackNew.push(...nodoNew.children);
            rutaOld.push(nodoOld)
            rutaNew.push(nodoNew);
        }
    }

    //   debugger
    return resp;
}