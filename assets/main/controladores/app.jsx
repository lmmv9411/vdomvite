import { render } from "../../vdom/Render";
import { reemplazarElemento } from "../../vdom/VDom";

const instancias = [];

window.addEventListener('popstate', navigateTo);

const estilos = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute"
}

const load = render(
    <div style={estilos}>
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
        </div>
    </div>
)

export function AppControlador(e) {
    e.stopPropagation();
    e.preventDefault();

    const url = e.target.href;
    history.pushState(null, null, url);
    navigateTo(e);
}

export async function navigateTo(e) {

    const paths = location.pathname.slice(1).split("/")
    const nombreClase = paths[0];

    if (e !== undefined && "getAttribute" in e.target) {
        let titulo = e.target.getAttribute("data-title");
        document.title = titulo;
    }

    const main = document.querySelector("main");

    main.innerHTML = "";

    if (nombreClase === "") {
        return;
    }

    main.appendChild(load);

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