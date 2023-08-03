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
function reemplazarElemento($parent, nodo) {

    const tmp = nodo.$element;

    let $ref;

    if (!tmp) {
        $ref = render(nodo);
    } else {
        $ref = tmp;
    }

    if (!$parent.firstChild) {
        $parent.appendChild($ref);
    } else {
        $parent.firstChild?.replaceWith($ref)
    }

    if (!tmp) {
        nodo.construido($ref);
    }
}

/**
 * @param {Object} nodo 
 * @returns {HTMLElement}
 */
function crearElemento(nodo) {
    return render(nodo);
}

function h(type, props, ...children) {

    let key = null;

    if (props?.key !== undefined) {
        key = props.key;
        delete props.key;
    }

    if (type instanceof Function && type.prototype?.render) {
        const componente = new type(props);
        componente.key = key;
        return componente;
    }

    if (Array.isArray(children) && children.length === 1 && Array.isArray(children[0])) {
        children = children[0];
    }

    //quitar null o undefine
    const chl = children.filter(ch => { if (ch) return ch });

    return { type, props, children: chl, key };
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