import { Componente } from "../../vdom/Componente";
import { Link, Router } from "../../vdom/Router";
import { Fragment } from "../../vdom/VDom";
import menu from "../estilos/menu.module.css"

export class Almacen extends Componente {
    constructor(props) {
        super({ saludo: "", ...props })
        this.data = {
            titulo: "La Verdadera Historia Del estado de Isrrael",
            parrafo: "Durante la guerra fría, los judíos soviéticos fueron considerados con frecuencia como traidores y espías, con ese pretexto se practicó una vez más el antisemitismo oficial por parte de las autoridades soviéticas. Muchos judíos intentaron abandonar la URSS, pero muy pocos lograban el permiso correspondiente para emigrar. La sola solicitud del visado suponía un grave riesgo, pues conllevaba a menudo la pérdida de sus trabajos, la confiscación de sus bienes e incluso el ostracismo de toda la familia.54​ Con posterioridad a la guerra de 1967, la situación de los judíos a quienes se les rechazaba el visado, conocidos ya como refuseniks, se convirtió en un tema permanente de denuncia por parte de los grupos de derechos humanos occidentales. Algunos de ellos, como Natan Sharansky, fueron confinados en gulags durante varios años."
        }
    }
    
    render(props) {

        return (
            <>
                <header>
                    <h3>Soy el Almacen</h3>
                    <Router idContenedor="articulo" pathBase="almacen">
                        <nav>
                            <ul className="d-flex flex-wrap" style={{ listStyle: "none", padding: "0" }}>
                                <li>
                                    <Link className={menu.link} url="" to="Home" data={this.data} titulo="Titulo Almacén">Inicio</Link>
                                </li>
                                <li>
                                    <Link className={menu.link} to="Tetas" titulo="Tetas" >Tetas</Link>
                                </li>
                            </ul>
                        </nav>
                    </Router>
                </header >

                <article id="articulo"></article>

                <article>

                    <button
                        className="btn btn-primary"
                        onclick={() => {
                            if (this.state.saludo === "hola") {
                                this.setState({ saludo: "Luis" })
                            } else {
                                this.setState({ saludo: "hola" })
                            }
                        }}
                    >Saludar
                    </button>

                    <p>{props.saludo}</p>

                </article>
            </>
        )
    }
}