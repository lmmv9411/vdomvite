import { VDOM } from "./Render";
import { Fragment, reemplazarElemento } from "./VDom";

const instancias = [];

const estilos = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute"
}

const load = VDOM.render(
    <div style={estilos}>
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
        </div>
    </div>
)

export class Router {

    constructor({ idContenedor, pathBase, children, rutaComponentes }) {

        this.idContenedor = idContenedor
        this.pathBase = pathBase;
        this.componentes = {};
        this.rutaComponentes = rutaComponentes;

        children.forEach(ch => this.setEvent(ch))

        window.addEventListener('popstate', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.navigateTo()
        });

        this.props = {};
        this.children = children;
        this.type = Fragment;

        const observador = new MutationObserver((mutations, observer) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.id === this.idContenedor) {
                        this.navigateTo();
                        observer.disconnect();
                    }
                })
            })
        })

        observador.observe(document.body, { childList: true, subtree: true });

    }

    async navigateTo() {

        const paths = window.location.pathname.slice(1).split("/");

        let nombreClase = ""

        if (paths.length === 1) {
            nombreClase = this.componentes[paths[0]];
        } else {
            const i = paths.findIndex(path => path === this.pathBase);
            nombreClase = this.componentes[paths[i + 1]]
        }

        const main = document.getElementById(this.idContenedor);

        if (!main) {
            this.manejarError('¡Contenedor "main" inválido!.');
            return;
        }

        if (!nombreClase) {
            this.manejarError(`Ruta no encontrada: "${nombreClase ?? location.pathname}"`);
            return;
        }

        document.title = nombreClase?.titulo;

        try {
            await this.buscarRutaDinamica(main, nombreClase);
        } catch (error) {
            this.manejarError(`${error.message}, clase: "${nombreClase.componente}"`);
        }

    }

    manejarError(mensaje) {
        document.body.innerHTML = ""
        document.body.appendChild(VDOM.render(
            <div className="d-flex justify-content-center align-items-center vh-100">
                <span className="alert alert-danger" role="alert">
                    {mensaje}
                </span >
            </div>
        ));
    }

    async buscarRutaDinamica(main, nombreClase) {

        main.innerHTML = "";
        main.appendChild(load);

        let i = instancias.findIndex(i => i.key === nombreClase.componente);

        if (i === -1) {

            let modulo;

            try {
                modulo = await this.rutaComponentes(nombreClase.componente.toLowerCase());
            } catch (error) {
                throw new Error(`${error.message} ${error.stack}`)
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

    redirect(e) {
        e.stopPropagation();
        e.preventDefault();

        const url = e.target.href;
        window.history.pushState(null, null, url);

        this.navigateTo();
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
        <a
            titulo={titulo}
            componente={to}
            href={url}
            {...p}
        >{children}</a>
    )
}