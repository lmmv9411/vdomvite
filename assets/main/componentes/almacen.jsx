import { Componente } from "../../vdom/Componente";
import { Link, Links, Router, navigateTo } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";
import menu from "../estilos/menu.module.css"

export class Almacen extends Componente {
    constructor(props) {
        super({ ...props, frase: true })
    }

    montado() {
        navigateTo(null, "test", "Almacen", "home");
    }

    render() {

        return (
            <Router idContenedor="test" pathBase="Almacen">

                <Links className="d-flex flex-wrap" style={{ listStyle: "none" }}>
                    <Link className={menu.link} to="" name="home" titulo="Almacén">Home</Link>
                    <Link className={menu.link} to="tetas" name="tetas" titulo="Tetas">Tetas</Link>
                </Links>

                <div id="test" className="p-3">
                </div>
            </Router>
        )
    }
}