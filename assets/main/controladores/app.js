import { render } from "../../vdom/Render";
import { reemplazarElemento } from "../../vdom/VDom";

const instancias = [];

export default async function AppControlador(e) {

    e.preventDefault();
    e.stopPropagation();

    const nombreClase = e.target.getAttribute("href").substring(1);

    let i = instancias.findIndex(i => i.key === nombreClase);

    if (i === -1) {

        const modulo = await import(`../componentes/${nombreClase.toLowerCase()}.jsx`)

        const instancia = new modulo[nombreClase]({});

        instancias.push({ key: nombreClase, value: instancia, render: render(instancia) });
        i = instancias.length - 1;
    }

    reemplazarElemento(
        document.querySelector("main"),
        instancias[i].render,
        instancias[i].value
    )

    /*this.update({ modulo: this.instancias[i].value })

    this.instancias[i].value.update({});
    this.instancias[i].value.construido(document.querySelector("main").firstChild)*/


}