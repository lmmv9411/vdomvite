import { render } from "./Render.js"
/**
 * Append un nodo virtual en el $elemento dom real y set su $ref 
 * @param {HTMLElement} $parent 
 * @param {Object} nodo 
 */
function insertarElemento($parent, nodo) {
    const $element = crearElemento(nodo);
    $parent.appendChild($element);
    if (nodo.construido) nodo.construido($element);
}

/**
 * 
 * @param {HTMLElement} $parent 
 * @param {HTMLElement} $newParent
 * @param {Object} nodo
 */
function reemplazarElemento($parent, $newParent, nodo) {
    $parent.firstChild?.remove();
    $parent.appendChild($newParent);
    nodo?.construido($newParent);
}

/**
 * @param {Object} nodo 
 * @returns {HTMLElement}
 */
function crearElemento(nodo) {
    return render(nodo);
}

/**
 * 
 * @param {String} type 
 * @param {Object} props 
 * @param {Array<Object>} children 
 * @returns 
 */
function h(type, props, ...children) {

    let key = null;

    if (props?.key !== undefined) {
        key = props.key;
        delete props.key;
    }

    if (type instanceof Function && type.prototype && type.prototype.render) {
        const componente = new type(props);
        componente.key = key;
        return componente;
    }

    if (Array.isArray(children) && children.length === 1 && Array.isArray(children[0])) {
        children = children[0];
    }

    //quitar null o undefine
    children = children.filter(ch => ch !== undefined && ch !== null);

    return { type, props, children: children, key };
}

function crearContexto(contexto) {
    contexto.emitir = (value) => emitir(contexto, value);
    contexto.emitirAsync = async (value) => await emitirAsync(contexto, value);

    Object.values(contexto.oyentes).forEach(oy => {
        oy.contexto = contexto;
    });
}

async function emitirAsync(contexto, value) {

    let r = null;

    for (let ch of Object.values(contexto.oyentes)) {

        if (ch.escuchar === undefined) {
            continue
        }

        r = await ch.escuchar(value);

        if (r.manejado) {
            break;
        }
    }

    return r.value;
}

function emitir(contexto, value) {

    let r = null;

    for (let ch of Object.values(contexto.oyentes)) {

        if (ch.escuchar === undefined) {
            continue
        }

        r = ch.escuchar(value);

        if (r.manejado) {
            break;
        }
    }

    return r.value;
}

export { reemplazarElemento, insertarElemento, crearElemento, h, crearContexto };