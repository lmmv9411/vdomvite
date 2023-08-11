import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { Link, Links, Router, navigateTo } from "../../vdom/Router";
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
            <Router>
                <>
                    <Links className="d-flex">
                        <Link className={menu.link} link="/" titulo="Virtual Dom">Home</Link>

                        <Link className={menu.link} link="/Clientes" titulo="Clientes">Clientes</Link>

                        <Link className={menu.link} link="/Proveedores" titulo="Preveedores 🏭">Proveedores</Link>

                        <Link className={menu.link} link="/Almacen" titulo="Almacen 🏭">Almacen</Link>

                        <Link className={menu.link} link="/ListaEnlazada" titulo="Lista Enlazada">Lista Enlazada</Link>
                    </Links>

                    <main>{props.modulo}</main>
                </>
            </Router >
        )
    }
}