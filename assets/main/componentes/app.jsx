import { Componente } from "../../vdom/Componente";
import AppControlador from "../controladores/app";

export class App extends Componente {
    constructor(props) {
        super({ ...props })
    }

    construido($ref) {
        super.construido($ref);
        this.controlador = new AppControlador();
    }

    render(props) {
        return (
            <div>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">Pruebas con Vite</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/Clientes">Clientes</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/Proveedores">Proveedores</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main></main>
            </div>
        )
    }
}