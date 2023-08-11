import { Componente } from "../../vdom/Componente";
import { AppControlador, navigateTo } from "../controladores/app";
import { Fragment } from "../../vdom/VDom";

export class App extends Componente {
    constructor(props) {
        super({ ...props })
    }

    montado() {
        navigateTo()
    }

    render(props) {

        return (
            <>
                <nav >
                    <ul>
                        <li>
                            <a onclick={AppControlador} href="/">Home</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} data-title="Clientes" href="/Clientes">Clientes</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} data-title="Preveedores 🏭" href="/Proveedores">Proveedores</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} data-title="Almacén 🏬" href="/Almacen">Almacén</a>
                        </li>
                        <li>
                            <a onclick={AppControlador} data-title="Lista Enlazada" href="/ListaEnlazada">Lista Enlazada</a>
                        </li>
                    </ul>
                </nav>
                <main>{props.modulo}</main>
            </>
        )
    }
}