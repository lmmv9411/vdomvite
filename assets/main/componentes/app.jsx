import { Componente } from "../../vdom/Componente";
import AppControlador from "../controladores/app";

export class App extends Componente {
    constructor(props) {
        super({ ...props })
    }

    render(props) {
        return (
            <div>
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
                    </ul>
                </nav>
                <main>{props.modulo}</main>
            </div>
        )
    }
}