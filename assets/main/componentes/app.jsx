import { Componente } from "../../vdom/Componente";
import AppControlador from "../controladores/app";
import { Fragment } from "../../vdom/VDom";

export class App extends Componente {
    constructor(props) {
        super({ ...props })
    }

    render(props) {

        return (
            <>
                <nav >
                    <ul>
                        <li>
                            <a onclick={AppControlador} href="#">Home</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} href="/Clientes">Clientes</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} href="/Proveedores">Proveedores</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} href="/Almacen">Almacén</a>
                        </li>
                    </ul>
                </nav>
                <main>{props.modulo}</main>
            </>
        )
    }
}