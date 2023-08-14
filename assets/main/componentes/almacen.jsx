import { Componente } from "../../vdom/Componente";
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
                </header>
                <Home titulo="Buscar Items" parrafo="Registro de items" />
            </>
        )
    }
}