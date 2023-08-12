import { Componente } from "../../vdom/Componente";
import { Link, Links, Router } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";

export class Almacen extends Componente {
    constructor(props) {
        super({ ...props, frase: true })
    }

    render(props) {
        return (
            <Router idContenedor="test">

                <Links>
                    <Link to="/home" titulo="Almacén">Home</Link>
                    <Link to="test/tetas" titulo="Tetas">Tetas</Link>
                </Links>

                <div id="test">
                    <span>Hola perros</span>
                </div>
            </Router>
        )
    }
}