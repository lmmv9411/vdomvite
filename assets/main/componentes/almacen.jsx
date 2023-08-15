import { Componente } from "../../vdom/Componente";
import { Link, Links, Router, navigateTo } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";
import { Home } from "./home";

export class Almacen extends Componente {
    constructor(props) {
        super(props)
    }

    montado() {
        navigateTo(null, "articulo", "almacen", { "almacen": "HomeInit", "tetas": "Tetas" });
    }

    render() {

        return (
            <>
                <header>
                    <h3>Soy el Almacen</h3>
                    <Router idContenedor="articulo" pathBase="almacen">
                        <Links>
                            <Link url="" to="HomeInit" titulo="Titulo Almacén">Inicio</Link>
                            <Link to="Tetas" titulo="Tetas" >Tetas</Link>
                        </Links>
                    </Router>
                </header >
                <article id="articulo">
                    <Home titulo="Buscar Items" parrafo="Registro de items" />
                </article>
            </>
        )
    }
}