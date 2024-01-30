import { VDOM } from "./Render";
import { reemplazarElemento } from "./VDom";

const instancias = [];

export class Router {

    /**
     * 
     * @param {String} idContenedor ID de etiqutea donde se cargará contenido dinámicamente.
     * @param {String} pathBase Ruta base donde arranca aplicacioón.
     * @param {Object} children Nodos virutuales.
     * @param {Function} rutaComponentes Función que retorna rutas dinámicamente.
     */
    constructor({ idContenedor, pathBase, children, rutaComponentes, cambioInstancia }) {

        this.cambioInstancia = cambioInstancia;
        this.idContenedor = idContenedor
        this.pathBase = pathBase ?? "";
        this.componentes = {};
        this.rutaComponentes = rutaComponentes;

        children.forEach(ch => this.setEvent(ch))

        this.props = {};
        this.children = children;
        this.type = k.Fragment;

        if (document.readyState === "complete") {

            const config = { attributes: true, childList: true, subtree: true };

            const callback = (mutationsList) => {
                for (let mutation of mutationsList) {
                    mutation.addedNodes.forEach(n => {
                        if (n.id === this.idContenedor) {
                            this.firstCheck();
                            this.navigateTo();
                            observer.disconnect();
                        }
                    })

                }
            };

            const observer = new MutationObserver(callback);
            observer.observe(document.body, config);

        } else {

            window.addEventListener('popstate', (e) => {
                e.preventDefault()
                e.stopPropagation()
                const a = document.querySelector(`a[href="${window.location.pathname}"]`)
                this.target = a;
                this.navigateTo()
            });

            document.addEventListener("DOMContentLoaded", () => {
                this.firstCheck();
                this.navigateTo();
            })
        }


    }

    firstCheck() {

        this.main = document.getElementById(this.idContenedor);

        if (!this.main) {
            this.manejarError('¡Contenedor "main" inválido!.');
            throw new Error("Contenedor inválido");
        }
    }

    async navigateTo() {

        const paths = window.location.pathname.slice(1).split("/");

        let nombreClase = ""

        if (paths.length === 1) {
            const ruta = paths[0];
            nombreClase = this.componentes[ruta == "" ? "/" : ruta];
        } else {
            const i = paths.findIndex(path => path === this.pathBase);
            const ruta = paths[i + 1];
            nombreClase = this.componentes[ruta]
        }

        if (!nombreClase) {
            this.manejarError(`Ruta no encontrada: "${nombreClase ?? location.pathname}"`);
            return;
        }

        if (nombreClase.titulo !== document.title) {
            document.title = nombreClase.titulo;
        }

        if (nombreClase.props.render !== null && typeof nombreClase.props.render === "function") {
            try {
                await this.buscarRutaDinamica(this.main, nombreClase, nombreClase.props.render);
            } catch (error) {
                this.manejarError(`${error.message}, clase: "${nombreClase.componente}"`);
                throw new Error(`${error.message}, clase: "${nombreClase.componente}"`)
            }
            return;
        }


        try {
            await this.buscarRutaDinamica(this.main, nombreClase);
        } catch (error) {
            this.manejarError(`clase: "${nombreClase.componente}": ${error.stack}`);
            throw new Error(`${error.stack}, clase: "${nombreClase.componente}"`)
        }

    }

    manejarError(mensaje) {
        document.body.innerHTML = ""
        document.body.appendChild(VDOM.render(
            <div className="tarjeta">
                <span className="color-danger">
                    {mensaje}
                </span >
            </div>
        ));
    }

    async buscarRutaDinamica(main, nombreClase, render = null) {

        main.innerHTML = "";
        let instancia;

        let i = instancias.findIndex(i => i.key === nombreClase.componente);

        instancias.forEach(obj => {
            obj.instancia.activa = false;
            if (obj.instancia.setInactivate) {
                obj.instancia.setInactivate();
            }
        });

        if (i === -1) {

            if (render === null) {
                let modulo;

                try {
                    modulo = await this.rutaComponentes(nombreClase.componente.toLowerCase());
                } catch (error) {
                    throw new Error(`${error.message} ${error.stack}`)
                }

                let clase = await modulo[nombreClase.componente];

                if (!(clase.prototype instanceof Object)) {
                    instancia = clase({ ...nombreClase.props });
                } else {
                    instancia = new clase({ ...nombreClase.props });
                }

                instancias.push({ key: nombreClase.componente, instancia });

                i = instancias.length - 1;

            } else {
                if (!(render.prototype instanceof Object)) {
                    //let classe = await render();
                    // instancia = new classe({});
                    instancia = await render();
                } else {
                    instancia = new render({});
                }

                instancias.push({ key: nombreClase.componente, instancia });

                i = instancias.length - 1;

            }
        }

        reemplazarElemento(
            main,
            instancias[i].instancia
        )

        instancias[i].instancia.activa = true;

        if (instancias[i].instancia.setActivate) {
            instancias[i].instancia.setActivate();
        }

        if (this.cambioInstancia) {
            this.cambioInstancia({ instancia: instancias[i].instancia, target: this.target });
        }

    }

    redirect(ch, e) {

        e.stopPropagation();
        e.preventDefault();

        const isLink = e.target.tagName === 'A';

        if (!isLink) {

            if (ch.props?.href) {
                const url = ch.props.href;
                window.history.pushState(null, null, url);
                const a = document.querySelector(`a[href="${window.location.pathname}"]`)
                this.target = a;
                this.navigateTo();
            }

            return;
        }

        const url = e.target.href;
        window.history.pushState(null, null, url);

        this.target = e.target;
        this.navigateTo();
    }

    setEvent(ch) {

        let tmpPath = this.pathBase;

        if (ch.type === "a") {

            const componente = ch.props.componente;
            const props = ch.props ?? {};
            const titulo = ch.props.titulo;

            const url = ch.props.href === "" ? tmpPath : ch.props.href;

            this.componentes[url] = { componente, props, titulo }

            if (componente) {
                delete ch.props.componente;
                delete ch.props.data;
                delete ch.props.titulo;
            }

            ch.props.onclick = this.redirect.bind(this, ch);

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

    if (!to) {
        throw new Error(`"to" no puede ser vacío ${titulo} ${url} ${to}`)
    }

    if (!url || url === "/") {
        titulo = document.title;
    }

    return (
        <a
            titulo={titulo}
            componente={to}
            href={url ?? to}
            {...p}
        >{children}</a>
    )
}
