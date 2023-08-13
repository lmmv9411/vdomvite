import { Componente } from "../../vdom/Componente";
import { Link, Links, Router, navigateTo } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";

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

                <Links>
                    <Link to="" name="home" titulo="Almacén">Home</Link>
                    <Link to="tetas" name="tetas" titulo="Tetas">Tetas</Link>
                </Links>

                <div id="test">
                    <span>Hola perros</span>
                </div>
            </Router>
        )
    }
}