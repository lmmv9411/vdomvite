import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { Link, Links, Router } from "../../vdom/Router";
import menu from "../estilos/menu.module.css"

export class App extends Componente {

    constructor(props) {
        super({ ...props })
    }

    render() {

        return (
            <Router idContenedor="main" pathBase="">
                <Links className="d-flex flex-wrap" style={{ listStyle: "none" }}>
                    <Link className={menu.link} url="" to="HomeInit" titulo="Virtual Dom">Home</Link>

                    <Link className={menu.link} to="Clientes" titulo="Clientes">Clientes</Link>

                    <Link className={menu.link} to="Proveedores" titulo="Preveedores 🏭">Proveedores</Link>

                    <Link className={menu.link} to="Almacen" titulo="Almacen 🏭">Almacen</Link>

                    <Link className={menu.link} to="ListaEnlazada" titulo="Lista Enlazada">Lista Enlazada</Link>
                </Links>

                <main id="main" className="p-3"></main>

            </Router >
        )
    }
}