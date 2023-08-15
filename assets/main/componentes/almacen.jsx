import { Componente } from "../../vdom/Componente";
import { Link, Links, Router } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";
import { Home } from "./home";

export class Almacen extends Componente {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <header>
                    <h3>Soy el Almacen</h3>
                    <Router idContenedor="articulo" pathBase="Almacen">
                        <Links>
                            <Link to="" home="HomeInit">Inicio</Link>
                            <Link to="tetas" titulo="Tetas" >Tetas</Link>
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