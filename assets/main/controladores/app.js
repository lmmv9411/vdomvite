import { reemplazarElemento } from "../../vdom/VDom";

const instancias = [];

window.addEventListener('popstate', navitateTo);

export default function AppControlador(e) {
    e.stopPropagation();
    e.preventDefault();

    const url = e.target.href;
    history.pushState(null, null, url);
    navitateTo(e);
}

async function navitateTo(e) {

    const titulo = e.target.getAttribute("data-title");
    const main = document.querySelector("main");
    const nombreClase = location.pathname.substring(1)

    let i = instancias.findIndex(i => i.key === nombreClase);

    if (i === -1) {

        const modulo = await import(`../componentes/${nombreClase.toLowerCase()}.jsx`)

        const instancia = new modulo[nombreClase]({});

        instancias.push({ key: nombreClase, instancia });

        i = instancias.length - 1;
    }

    document.title = titulo;

    reemplazarElemento(
        main,
        instancias[i].instancia
    )
}