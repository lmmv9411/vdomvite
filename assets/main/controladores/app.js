import { reemplazarElemento } from "../../vdom/VDom";

const instancias = [];

export default async function AppControlador(e) {

    const main = document.querySelector("main");
    e.preventDefault();
    e.stopPropagation();

    const nombreClase = e.target.getAttribute("href").substring(1);

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