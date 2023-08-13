import { Componente } from "../../vdom/Componente";
import { Link, Links, Router, navigateTo } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";
import menu from "../estilos/menu.module.css"

export class Almacen extends Componente {
    constructor(props) {
        super(props)
    }

    montado() {
        navigateTo(null, "contenido", "Almacen", "home");
    }

    render() {

        return (
            <Router idContenedor="contenido" pathBase="Almacen">

                <Links className="d-flex flex-wrap" style={{ listStyle: "none" }}>
                    <Link className={menu.link} to="" name="home" titulo="Almacén">Home</Link>
                    <Link className={menu.link} to="tetas" name="tetas" titulo="Tetas">Tetas</Link>
                </Links>

                <div id="contenido" className="p-3">
                </div>
            </Router>
        )
    }
}