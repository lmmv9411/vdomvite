import { Componente } from "../../vdom/Componente";
import { Link, Router } from "../../vdom/Router";
import "../estilos/menu.css"

export class Almacen extends Componente {
    constructor(props) {
        super({ saludo: "", ...props })
    }

    async handleRoute(path) {
        return await import(`../componentes/almacen/${path}.jsx`);
    }

    render(props) {

        return (
            <Router idContenedor="articulo" pathBase="Almacen" rutaComponentes={this.handleRoute}>

                <header>
                    <h3>Soy el Almacen</h3>
                </header>

                <nav>
                    <ul className="d-flex flex-wrap" style={{ listStyle: "none", padding: "0" }}>
                        <li>
                            <Link url="" to="Home" titulo="Titulo Almacén">Inicio</Link>
                        </li>
                        <li>
                            <Link to="Tetas" titulo="Tetas">Tetas</Link>
                        </li>
                    </ul>
                </nav>

                <article id="articulo"></article>

                <section>

                    <button
                        className="btn btn-primary"
                        onclick={() => {
                            if (this.state.saludo === "hola") {
                                this.setState({ saludo: "Luis" })
                            } else {
                                this.setState({ saludo: "hola" })
                            }
                        }}
                    >Saludar</button>

                    <p>{props.saludo}</p>

                </section>
            </Router>
        )
    }
}