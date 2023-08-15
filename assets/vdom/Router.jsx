import { render } from "./Render";
import { Fragment, reemplazarElemento } from "./VDom";

const instancias = [];

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

export const navigateTo = async (e, idContenedor, pathRoute, componentes) => {

    const paths = window.location.pathname.slice(1).split("/");

    let nombreClase = ""

    if (paths.length === 1) {
        nombreClase = componentes[paths[0]];
    } else {

        const i = paths.findIndex(path => path === pathRoute);

        nombreClase = componentes[paths[i + 1]]

        if (nombreClase === "") {
            nombreClase = componentes[paths[0]];
        }
    }

    let main = document.getElementById(idContenedor);

    if (!main) {
        return
    }

    if (e !== null && e !== undefined && "getAttribute" in e.target) {
        let titulo = e.target.getAttribute("data-title");
        document.title = titulo;
    }

    await buscarRutaDinamica(main, nombreClase);

}

const buscarRutaDinamica = async (main, nombreClase) => {

    main.innerHTML = "";
    main.appendChild(load);

    let i = instancias.findIndex(i => i.key === nombreClase);

    if (i === -1) {

        let modulo;

        try {
            modulo = await import(`../main/componentes/${nombreClase.toLowerCase()}.jsx`)
        } catch (error) {
            console.error(error);
            main.innerHTML = "";
            main.appendChild(render(<p class="alert alert-danger" role="alert">Ruta No Encontrada</p>))
            return;
        }

        let instancia;

        let clase = await modulo[nombreClase];

        if (!(clase.prototype instanceof Object)) {
            instancia = clase({});
        } else {
            instancia = new clase({});
        }

        instancias.push({ key: nombreClase, instancia });

        i = instancias.length - 1;
    }

    reemplazarElemento(
        main,
        instancias[i].instancia
    )
}

export class Router {

    constructor(props, children) {

        this.idContenedor = props.idContenedor
        this.pathBase = props.pathBase;
        this.componentes = {};

        children.forEach(ch => this.setEvent(ch))

        window.addEventListener('popstate', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (document.getElementById(this.idContenedor) === null) {
                return;
            }
            navigateTo(e, this.idContenedor, this.pathBase, this.componentes)
        });

        this.props = {};
        this.children = children;
        this.type = Fragment;

        document.addEventListener("DOMContentLoaded", () => {
            navigateTo(null, this.idContenedor, this.pathBase, this.componentes)
        });

    }

    redirect(e) {
        e.stopPropagation();
        e.preventDefault();

        const url = e.target.href;
        window.history.pushState(null, null, url);

        navigateTo(e, this.idContenedor, this.pathBase, this.componentes);
    }

    setEvent(ch) {

        let tmpPath = this.pathBase;

        if (ch.type === "a") {
            const componente = ch.props.componente;

            const url = ch.props.href === "" ? tmpPath : ch.props.href;

            this.componentes[url] = componente

            if (componente) {
                delete ch.props.componente;
            }

            ch.props.onclick = this.redirect.bind(this);

            if (tmpPath === "") {
                tmpPath = "/"
            } else if (tmpPath !== "/" && !tmpPath.startsWith("/")) {
                tmpPath = "/" + tmpPath + "/"
            }

            ch.props.href = ch.props.href === "" ? `${tmpPath}` : `${tmpPath}${ch.props.href}`;

            if (ch.props.href !== "/" && ch.props.href.endsWith("/")) {
                ch.props.href = ch.props.href.slice(0, -1);
            }
        }
        if (ch.children?.length > 0) {
            ch.children.forEach(c => this.setEvent(c))
        }
    }

}

export const Link = ({ to, titulo, url, ...props }, children) => {

    if (url === undefined || url === null) {
        url = to.toLowerCase();
    }

    return (
        <li>
            <a {...props} componente={to} href={url} data-title={titulo} style={{ display: "block" }}>{children}</a>
        </li>
    )
}

export const Links = (props, children) => (<ul {...props}>{children}</ul>)