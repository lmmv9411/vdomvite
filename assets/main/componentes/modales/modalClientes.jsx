import { Componente } from "../../../vdom/Componente";
import style from "../../estilos/alerta.module.css";
import modal from "../../estilos/modal.module.css";
import { ctx } from "../listaenlazada";
import { Controlador } from "../utils/modalClientes";

export class ModalClientes extends Componente {

    constructor(props) {
        super({ mostrar: false, disable: true, error: {}, ...props })
        this.controlador = new Controlador(this);
    }

    abrir() {
        ctx.contenedor.mostrarContenedor(() => {
            this.setState({ mostrar: true })
            this.nombre?.focus();
            this.setState({ animar: true })
        });
    }

    cerrar() {
        ctx.contenedor.cerrarContenedor(() => {
            this.setState({ animar: false });
            setTimeout(() => {
                this.setState({ mostrar: false });
            }, 300);
        });
    }

    render(props) {

        const { error, animar } = props;

        return (
            <>
                <section className={`card p-3 bg-dark text-light ${modal.modal} ${animar ? modal["modal-show"] : ''}`}>

                    <header className="d-flex justify-content-between align-items-start">
                        <h1 className="card-title">Clientes</h1>
                        <button
                            onclick={this.cerrar.bind(this)}
                            className={style["btn-close"]}
                        >❌</button>
                    </header>

                    <form
                        $ref="formulario"
                        id="formulario"
                        className="card-body d-flex flex-column gap-3 p-0 mb-3">

                        {error?.name && <spam className="text-danger d-block">{error.name}</spam>}

                        <input
                            $ref="name"
                            autocomplete="off"
                            className="form-control bg-dark text-light"
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            required
                            minLength={4}
                            onchange={e => this.controlador.cambio(e)}
                            value={props.name ?? ""}
                        />

                        {error?.phone && <spam className="text-danger d-block">{error.phone}</spam>}

                        <input
                            $ref="phone"
                            autocomplete="off"
                            className="form-control bg-dark text-light"
                            type="tel"
                            name="phone"
                            placeholder="Teléfono"
                            pattern="[0-9\+\-\(\)]*"
                            minLength={10}
                            maxLength={10}
                            required
                            value={props.phone ?? ""}
                            onchange={e => this.controlador.cambio(e)}
                        />

                        <div className="d-flex gap-2 flex-wrap">

                            <button
                                disabled={props.disable}
                                className="btn btn-primary"
                                type="submit"
                                onclick={e => this.controlador.handleSubmit(e)}
                            >Submit</button>

                            <button
                                className="btn btn-warning"
                                type="reset"
                                onClick={() => this.setState(s => ({ disable: !s.disable }))}
                            >
                                Reset
                            </button>

                            <button
                                className={`btn ${!props.showAlert ? "btn-success" : "btn-danger"}`}
                                type="button"
                                onclick={() => this.controlador.showAlert()}
                            >
                                {props.showAlert ? "Ocultar Alerta" : "Mostrar Alerta"}
                            </button>

                            <button
                                type="button"
                                onclick={() => this.setState(s => ({ ocultarSeccion: !s.ocultarSeccion }))}
                                className={`btn ${!props.ocultarSeccion ? "btn-danger" : "btn-warning"}`}
                            >
                                {!props.ocultarSeccion ? "Ocultar Seccion I" : "Mostrar Seccion I"}
                            </button>

                        </div>
                    </form>

                    {
                        props.showAlert &&
                        <>
                            <header>
                                <h3> El Impacto de la Meditación en la Salud Mental</h3>
                            </header>
                            <article>
                                {
                                    props.ocultarSeccion
                                        ?
                                        <>
                                            <h4>Introducción:</h4>
                                            <p>En la actualidad, el estrés y la ansiedad son desafíos comunes que enfrentamos en nuestra vida cotidiana. Ante esta realidad, la meditación ha emergido como una herramienta poderosa para promover la salud mental y el bienestar emocional. En este artículo, exploraremos cómo la práctica regular de la meditación puede tener un impacto positivo en nuestra salud mental.</p>
                                        </>
                                        :
                                        <>
                                            <h4>Beneficios de la Meditación</h4>
                                            <p>La meditación ofrece una serie de beneficios para la salud mental. En primer lugar, ayuda a reducir el estrés al permitirnos desconectar de las preocupaciones y las tensiones del día a día. A través de técnicas de respiración y enfoque mental, la meditación fomenta la relajación y la calma interior, lo que contribuye a disminuir los niveles de cortisol, la hormona del estrés.</p>
                                        </>

                                }
                                <section>
                                    <h4>Meditación y Bienestar Emocional</h4>
                                    <p>La meditación también tiene un impacto significativo en nuestro bienestar emocional. A través de la autorreflexión y la autoaceptación, podemos desarrollar una mayor comprensión de nuestras emociones y patrones de pensamiento. Esto puede llevar a una mayor resiliencia emocional, ya que aprendemos a manejar de manera más efectiva los desafíos emocionales que enfrentamos.</p>
                                </section>
                            </article>
                        </>
                    }

                </section >
            </>

        )
    }
}