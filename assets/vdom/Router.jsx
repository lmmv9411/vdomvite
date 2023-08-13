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

export const navigateTo = async (e, idContenedor, pathRoute, name) => {

    const paths = window.location.pathname.slice(1).split("/");
    let nombreClase = ""

    if (paths.length === 1) {
        nombreClase = paths[0];
    } else {
        paths.forEach((path, i) => {
            if (path === pathRoute) {
                nombreClase = paths[i + 1]
                return;
            }
        });

        if (nombreClase === "") {
            nombreClase = paths[0];
        }
    }

    let main;

    if (pathRoute === window.location.pathname.slice(1)) {
        const inst = instancias.find(ins => ins.key === nombreClase);
        if (inst !== undefined) {
            if (name) {

                main = inst.instancia.$fragment;
                main.querySelector(`#${idContenedor}`).innerHTML = "";
                const modulo = await import(`../main/componentes/${name}.jsx`)
                main.querySelector(`#${idContenedor}`).appendChild(render(modulo[name]()));
                return
            }
            main = inst.instancia.$fragment;
            main.querySelector(`#${idContenedor}`).innerHTML = "";
        } else {
            main = document.getElementById(idContenedor);
        }
    } else {
        main = document.getElementById(idContenedor);
    }

    if (e !== null && e !== undefined && "getAttribute" in e.target) {
        let titulo = e.target.getAttribute("data-title");
        document.title = titulo;
    }

    main.innerHTML = "";

    if (nombreClase === "") {
        //     return;
        nombreClase = name;
    }

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

        window.addEventListener('popstate', (e) => navigateTo(e, this.idContenedor, this.pathBase));

        children.forEach(ch => this.setEvent(ch))

        this.props = {};
        this.children = children;
        this.type = Fragment;
    }

    redirect(name, e) {
        e.stopPropagation();
        e.preventDefault();

        const url = e.target.href;
        history.pushState(null, null, url);
        navigateTo(e, this.idContenedor, this.pathBase, name);
    }

    setEvent(ch) {

        let tmpPath = this.pathBase;

        if (ch.type === "a") {
            const name = ch.props.name;
            delete ch.props.name;
            ch.props.onclick = this.redirect.bind(this, name);

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

export const Link = ({ to, titulo, ...props }, children) => (
    <li>
        <a {...props} href={to} data-title={titulo} style={{ display: "block" }}>{children}</a>
    </li >
)

export const Links = (props, children) => (<ul {...props}>{children}</ul>)