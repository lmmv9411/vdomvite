import { Componente } from "../../vdom/Componente";
import { Link, Router } from "../../vdom/Router";
import "../estilos/menu.css"

export class App extends Componente {

    constructor(props) {
        super({ ...props })
    }

    async handleRoute(path) {
        return await import(`../componentes/${path}.jsx`);
    }

    render() {

        return (
            <Router idContenedor="main" rutaComponentes={this.handleRoute}>

                <header>
                    <h1>
                        <strong>VDOM</strong>
                    </h1>
                </header>

                <nav>
                    <ul className="d-flex flex-wrap" style={{ listStyle: "none", padding: "0" }}>
                        <li>
                            <Link url="/" to="HomeInit">Home</Link>
                        </li>
                        <li>
                            <Link to="Clientes">Clientes</Link>
                        </li>
                        <li>
                            <Link to="Proveedores">Proveedores</Link>
                        </li>
                        <li>
                            <Link to="Almacen">Almacen</Link>
                        </li>
                        <li>
                            <Link to="ListaEnlazada">Lista Enlazada</Link>
                        </li>
                        <li>
                            <Link to="Test">Test</Link>
                        </li>
                    </ul>
                </nav>

                <main id="main"></main>

                <footer style={{ position: "absolute", bottom: 0 }}>
                    <h6>Creado por: Luis Murillo</h6>
                </footer>

            </Router >

        )
    }
}