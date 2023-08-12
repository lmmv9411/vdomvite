import { render } from "./Render";
import { reemplazarElemento } from "./VDom";

const instancias = [];

const estilos = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute"
}

let idContenedor = "", pathBase = "";

const load = render(
    <div style={estilos}>
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
        </div>
    </div>
)

export const navigateTo = function (e, ic) {

    const nt = async () => {
        const paths = window.location.pathname.slice(1).split("/");
        let nombreClase = ""

        if (paths.length === 1) {
            nombreClase = paths[0];
        } else {
            paths.forEach((path, i) => {
                if (path === pathBase) {
                    nombreClase = paths[i + 1]
                    return;
                }
            });
        }

        if (e !== undefined && "getAttribute" in e.target) {
            let titulo = e.target.getAttribute("data-title");
            document.title = titulo;
        }

        const main = document.getElementById(ic);

        main.innerHTML = "";

        if (nombreClase === "") {
            return;
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
    };

    return nt;
}

export const Router = (props, children) => {

    idContenedor = props.idContenedor
    pathBase = props.pathBase;

    const AppControlador = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const url = e.target.href;
        history.pushState(null, null, url);
        navigateTo(e, idContenedor)();
    }

    window.addEventListener('popstate', navigateTo);

    const setEvent = (ch) => {
        if (ch.type === "a") {
            ch.props.onclick = AppControlador;
            ch.props.href = pathBase + "/" + ch.props.href;
        }
        if (ch.children?.length > 0) {
            ch.children.forEach(setEvent)
        }
    }

    children.forEach(setEvent)
}

export const Link = ({ to, titulo, ...props }, children) => (
    <li>
        <a {...props} href={to} data-title={titulo} style={{ display: "block" }}>{children}</a>
    </li >
)

export const Links = (props, children) => (<ul {...props}>{children}</ul>)