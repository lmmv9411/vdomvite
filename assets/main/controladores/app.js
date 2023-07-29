import { render } from "../../vdom/Render";
import { reemplazarElemento } from "../../vdom/VDom";

const path = "../componentes/"
const modules = import.meta.glob("../componentes/*.jsx")

export default function AppControlador() {

    const instancias = [];

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {

        link.addEventListener("click", async (e) => {

            e.preventDefault();
            e.stopPropagation();

            const nombreClase = e.target.getAttribute("href").substring(1);

            let i = instancias.findIndex(i => i.key === nombreClase);

            if (i === -1) {

                const modulo = await modules[`${path}${nombreClase.toLowerCase()}.jsx`]();

                const instancia = new modulo[nombreClase]({});

                instancias.push({ key: nombreClase, value: instancia });
                i = instancias.length - 1;
            }

            reemplazarElemento(
                document.querySelector("main"),
                render(instancias[i].value),
                instancias[i].value
            )

        })
    })
}