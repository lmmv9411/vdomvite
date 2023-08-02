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
                            <a onclick={AppControlador.bind(this)} href="#">Home</a>
                        </li>
                        <li>
                            <a onclick={AppControlador.bind(this)} href="/Clientes">Clientes</a>
                        </li>
                        <li>
                            <a onclick={AppControlador.bind(this)} href="/Proveedores">Proveedores</a>
                        </li>
                    </ul>
                </nav>
                <main>{props.modulo}</main>
            </div>
        )
    }
}