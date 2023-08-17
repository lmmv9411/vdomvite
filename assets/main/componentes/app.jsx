import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { Link, Router } from "../../vdom/Router";
import menu from "../estilos/menu.module.css"

export class App extends Componente {

    constructor(props) {
        super({ ...props })
    }

    render() {

        return (
            <>
                <header>
                    <h1><strong>VDOM</strong></h1>
                </header>
                <Router idContenedor="main" pathBase="">
                    <nav>
                        <ul className="d-flex flex-wrap" style={{ listStyle: "none", padding: "0" }}>
                            <li>
                                <Link className={menu.link} url="" to="HomeInit" titulo="Inicio De Virtual Dom">Home</Link>
                            </li>

                            <li>
                                <Link className={menu.link} to="Clientes" titulo="Clientes">Clientes</Link>
                            </li>
                            <li>
                                <Link className={menu.link} to="Proveedores" titulo="Preveedores 🏭">Proveedores</Link>
                            </li>
                            <li>
                                <Link className={menu.link} to="Almacen" titulo="Almacen 🏭">Almacen</Link>
                            </li>
                            <li>
                                <Link className={menu.link} to="ListaEnlazada" titulo="Lista Enlazada">Lista Enlazada</Link>
                            </li>
                        </ul>
                    </nav>

                    <main id="main" className="p-3 vw-100"></main>

                </Router >

                <footer style={{ position: "absolute", bottom: 0 }}>
                    <h6>Creado por: Luis Murillo</h6>
                </footer>
            </>
        )
    }
}