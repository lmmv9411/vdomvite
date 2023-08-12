import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { Contenedor, Link, Links, Router, navigateTo } from "../../vdom/Router";
import menu from "../estilos/menu.module.css"

export class App extends Componente {
    constructor(props) {
        super({ ...props })
    }

    montado() {
        navigateTo()
    }

    render(props) {

        return (
            <Router pathFiles="../main/componentes/">
                <Links className="d-flex flex-wrap" style={{ listStyle: "none" }}>
                    <Link className={menu.link} to="/" titulo="Virtual Dom">Home</Link>

                    <Link className={menu.link} to="/Clientes" titulo="Clientes">Clientes</Link>

                    <Link className={menu.link} to="/Proveedores" titulo="Preveedores 🏭">Proveedores</Link>

                    <Link className={menu.link} to="/Almacen" titulo="Almacen 🏭">Almacen</Link>

                    <Link className={menu.link} to="/ListaEnlazada" titulo="Lista Enlazada">Lista Enlazada</Link>
                </Links>

                <Contenedor id="main">
                    <main id="main">{props.modulo}</main>
                </Contenedor>

            </Router >
        )
    }
}
