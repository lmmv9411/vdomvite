import { reemplazarElemento } from "../../vdom/VDom";

const instancias = [];

window.addEventListener('popstate', navitateTo);

export default function AppControlador(e) {
    e.stopPropagation();
    e.preventDefault();

    const url = e.target.href;
    router(url);
}

function router(url) {
    history.pushState(null, null, url);
    navitateTo();
}

async function navitateTo() {

    const main = document.querySelector("main");
    const nombreClase = location.pathname.substring(1)

    let i = instancias.findIndex(i => i.key === nombreClase);

    if (i === -1) {

        const modulo = await import(`../componentes/${nombreClase.toLowerCase()}.jsx`)

        const instancia = new modulo[nombreClase]({});

        instancias.push({ key: nombreClase, instancia });

        i = instancias.length - 1;
    }

    reemplazarElemento(
        main,
        instancias[i].instancia
    )
}