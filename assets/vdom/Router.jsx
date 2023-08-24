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

const navigateTo = async (idContenedor, pathRoute, componentes) => {

    const paths = window.location.pathname.slice(1).split("/");

    let nombreClase = ""

    if (paths.length === 1) {
        nombreClase = componentes[paths[0]];
    } else {

        const i = paths.findIndex(path => path === pathRoute);

        nombreClase = componentes[paths[i + 1]]

    }

    const main = document.getElementById(idContenedor);

    if (!main) {
        return;
    }

    if (!nombreClase) {
        document.body.innerHTML = "";
        document.body.appendChild(
            render(
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <span className="alert alert-danger" role="alert">
                        {`Ruta no encontrada: "${nombreClase ?? location.pathname}"`}
                    </span >
                </div>));
        return;
    }

    document.title = nombreClase?.titulo;

    try {
        await buscarRutaDinamica(main, nombreClase);
    } catch (error) {
        document.body.innerHTML = ""
        document.body.appendChild(render(
            <div className="d-flex justify-content-center align-items-center vh-100">
                <span className="alert alert-danger" role="alert">
                    {`${error.message}, clase: "${nombreClase.componente}"`}
                </span >
            </div>
        ));
    }

}

const buscarRutaDinamica = async (main, nombreClase) => {

    main.innerHTML = "";
    main.appendChild(load);

    let i = instancias.findIndex(i => i.key === nombreClase.componente);

    if (i === -1) {

        let modulo;

        try {
            modulo = await import(`../main/componentes/${nombreClase.componente.toLowerCase()}.jsx`)
        } catch (error) {
            throw new Error(`Ruta no encontrada: "/${nombreClase.componente.toLowerCase()}"`)
        }

        let instancia;

        let clase = await modulo[nombreClase.componente];

        if (!(clase.prototype instanceof Object)) {
            instancia = clase({ ...nombreClase.props });
        } else {
            instancia = new clase({ ...nombreClase.props });
        }

        instancias.push({ key: nombreClase.componente, instancia });

        i = instancias.length - 1;
    }

    reemplazarElemento(
        main,
        instancias[i].instancia
    )
}

export class Router {

    constructor({ idContenedor, pathBase, children }) {

        this.idContenedor = idContenedor
        this.pathBase = pathBase;
        this.componentes = {};

        children.forEach(ch => this.setEvent(ch))

        window.addEventListener('popstate', (e) => {
            e.preventDefault()
            e.stopPropagation()
            navigateTo(this.idContenedor, this.pathBase, this.componentes)
        });

        this.props = {};
        this.children = children;
        this.type = Fragment;

        const observador = new MutationObserver((mutations, observer) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.id === this.idContenedor) {
                        navigateTo(this.idContenedor, this.pathBase, this.componentes);
                        observer.disconnect();
                    }
                })
            })
        })

        observador.observe(document.body, { childList: true, subtree: true });

    }

    redirect(e) {
        e.stopPropagation();
        e.preventDefault();

        const url = e.target.href;
        window.history.pushState(null, null, url);

        navigateTo(this.idContenedor, this.pathBase, this.componentes);
    }

    setEvent(ch) {

        let tmpPath = this.pathBase;

        if (ch.type === "a") {
            const componente = ch.props.componente;
            const props = ch.props.data ?? {};
            const titulo = ch.props.titulo;

            const url = ch.props.href === "" ? tmpPath : ch.props.href;

            this.componentes[url] = { componente, props, titulo }

            if (componente) {
                delete ch.props.componente;
                delete ch.props.data;
                delete ch.props.titulo;
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

export const Link = (props) => {

    let { to, titulo, url, children, ...p } = props;

    if (url === undefined || url === null) {
        url = to.toLowerCase();
    }

    return (
        <a {...p}
            titulo={titulo}
            componente={to}
            href={url}>
            {children}
        </a>
    )
}