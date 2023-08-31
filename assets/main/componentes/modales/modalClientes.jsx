import { Componente } from "../../../vdom/Componente";
import { ctx } from "../listaenlazada";
import modal from "../../estilos/modal.module.css"
import { Fragment } from "../../../vdom/VDom";
import { erroresClientes } from "../utils/modalClientes";
import { cambio } from "../utils/clientesErrores";
import { Alerta } from "./alert";

export class ModalClientes extends Componente {

    constructor(props) {
        super({ ...props, mostrar: false, error: {} })
        this.c = ctx.children;
    }

    abrir() {
        this.c.contenedor.mostrarContenedor(() => {
            this.update({ mostrar: true })
            this.nombre?.focus();
            this.update({ animar: true })
        });
    }

    cerrar() {
        this.c.contenedor.cerrarContenedor(() => {
            this.update({ animar: false });
            setTimeout(() => {
                this.update({ mostrar: false });
            }, 300);
        });
    }

    render(props) {

        const { error, animar } = props;

        return (
            <>

                <section className={`card p-3 bg-dark text-light ${modal.modal} ${animar ? modal["modal-show"] : ''}`}>

                    <header className="d-flex justify-content-between">
                        <h1 className="card-title">Clientes</h1>
                        <button
                            className="btn text-light bg-danger p-1 d-flex justify-content-center align-items-center rounded"
                            style={{ width: "20px", height: "25px" }}
                            onclick={this.cerrar.bind(this)}
                        >X</button>
                    </header>

                    <form
                        $ref="modalCliente"
                        id="modalCliente"
                        className="card-body d-flex flex-column gap-3 p-0 mb-3">

                        {error?.name && <spam className="text-danger d-block">{error.name}</spam>}

                        <input
                            autocomplete="off"
                            className="form-control bg-dark text-light"
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            $ref="nombre"
                            required
                            minLength={4}
                            onchange={cambio.bind(this, erroresClientes)}
                            value={props.name ?? ""} />


                        {error?.phone && <spam className="text-danger d-block">{error.phone}</spam>}

                        <input
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
                            onchange={cambio.bind(this, erroresClientes)} />

                        <div className="d-flex gap-2 flex-wrap">

                            <button
                                className="btn btn-primary"
                                type="submit"
                                onclick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation();

                                    const form = this.modalCliente;

                                    if (!form.checkValidity()) {

                                        let erroresII = {};

                                        form.querySelectorAll("input").forEach(inp => {
                                            let msj;
                                            const inpErr = erroresClientes[inp.name];
                                            for (let error of Object.keys(inpErr)) {
                                                if (inp.validity[error]) {
                                                    msj = inpErr[error];
                                                    break;
                                                }
                                            }

                                            erroresII[inp.name] = msj;
                                        })

                                        this.update({ error: erroresII })
                                    } else {
                                        this.c.alerta.abrir({
                                            mensaje:
                                                <span
                                                    style={{
                                                        wordWrap: "break-word",
                                                        overflow: "auto"
                                                    }}>
                                                    {JSON.stringify(this.state)}
                                                </span>,
                                            estilo: "bg-warning",
                                            mostrar: true
                                        })
                                    }
                                }}
                            >Submit</button>

                            <button
                                className="btn btn-warning"
                                type="reset"
                            >Reset</button>

                            <button
                                className={`btn ${!props.showAlert ? "btn-success" : "btn-danger"}`}
                                type="button"
                                onclick={() => {

                                    this.update({ showAlert: !this.state.showAlert })

                                    if (this.state.showAlert) {
                                        this.c.alerta.abrir({
                                            mensaje: <span>Desde Modal</span>,
                                            estilo: "bg-danger text-light",
                                            mostrar: true
                                        })
                                    }
                                }}
                            >{props.showAlert ? "Ocultar Alerta" : "Mostrar Alerta"}
                            </button>

                            <button
                                type="button"
                                onclick={() => this.update({
                                    ocultarSeccion: !this.state.ocultarSeccion
                                })}
                                className={`btn ${!props.ocultarSeccion ? "btn-danger" : "btn-warning"}`}
                            >{!props.ocultarSeccion ?
                                "Reemplazar Seccion I" :
                                "Regresar Seccion I"}
                            </button>

                        </div>
                    </form>

                    {
                        props.showAlert
                        &&
                        <>
                            <header>
                                <h3> El Impacto de la Meditación en la Salud Mental</h3>
                            </header>
                            <article>
                                {
                                    props.ocultarSeccion ?
                                        <article>
                                            <h4>Introducción:</h4>
                                            <p>En la actualidad, el estrés y la ansiedad son desafíos comunes que enfrentamos en nuestra vida cotidiana. Ante esta realidad, la meditación ha emergido como una herramienta poderosa para promover la salud mental y el bienestar emocional. En este artículo, exploraremos cómo la práctica regular de la meditación puede tener un impacto positivo en nuestra salud mental.</p>
                                        </article> :
                                        <section>
                                            <h4>Beneficios de la Meditación</h4>
                                            <p>La meditación ofrece una serie de beneficios para la salud mental. En primer lugar, ayuda a reducir el estrés al permitirnos desconectar de las preocupaciones y las tensiones del día a día. A través de técnicas de respiración y enfoque mental, la meditación fomenta la relajación y la calma interior, lo que contribuye a disminuir los niveles de cortisol, la hormona del estrés.</p>
                                        </section>

                                }
                                <section>
                                    <h4>Meditación y Bienestar Emocional</h4>
                                    <p>La meditación también tiene un impacto significativo en nuestro bienestar emocional. A través de la autorreflexión y la autoaceptación, podemos desarrollar una mayor comprensión de nuestras emociones y patrones de pensamiento. Esto puede llevar a una mayor resiliencia emocional, ya que aprendemos a manejar de manera más efectiva los desafíos emocionales que enfrentamos.</p>
                                </section>
                            </article>
                        </>
                    }

                </section>

                <Alerta contextoNombre="alerta" />

            </>

        )
    }
}