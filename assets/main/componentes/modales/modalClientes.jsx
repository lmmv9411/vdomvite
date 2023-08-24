import { Componente } from "../../../vdom/Componente";
import { ctx } from "../listaenlazada";
import modal from "../../estilos/modal.module.css"
import { Fragment } from "../../../vdom/VDom";
import { erroresClientes } from "../utils/modalClientes";
import { cambio } from "../utils/clientesErrores";

export class ModalClientes extends Componente {

    constructor(props) {
        super({ ...props, mostrar: false, error: {} })
        this.c = ctx.children;
    }

    abrir() {
        this.c.contenedor.mostrarContenedor(() => {
            this.update({ mostrar: true });
            this.nombre?.focus();
            this.update({ animar: true });
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
                {
                    props.mostrar
                    &&
                    <section className={`card p-3 bg-dark text-light w-75 ${modal.modal} ${animar ? modal["modal-show"] : ""}`}>

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
                            className="card-body d-flex flex-column gap-2">

                            <div>

                                {error?.name && <spam className="text-danger d-block">{error.name}</spam>}

                                <label htmlFor="name">Name:</label>
                                <input
                                    autocomplete="off"
                                    className="form-control bg-dark text-light"
                                    type="text"
                                    name="name"
                                    id="name"
                                    $ref="nombre"
                                    required
                                    minLength={4}
                                    onchange={cambio.bind(this, erroresClientes)}
                                    value={props.name ?? ""} />
                            </div>
                            <div>

                                {error?.phone && <spam className="text-danger d-block">{error.phone}</spam>}

                                <label htmlFor="phone">Telephone</label>
                                <input
                                    autocomplete="off"
                                    className="form-control bg-dark text-light"
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    pattern="[0-9\+\-\(\)]*"
                                    minLength={10}
                                    maxLength={10}
                                    required
                                    value={props.phone ?? ""}
                                    onchange={cambio.bind(this, erroresClientes)} />
                            </div>
                            <div className="d-flex gap-2">

                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onclick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation();

                                        const errores = {};

                                        const form = this.modalCliente;

                                        if (!form.checkValidity()) {

                                            form.querySelectorAll("input").forEach(inp => {
                                                if (!inp.checkValidity()) {
                                                    errores[inp.name] = inp.validity
                                                }
                                            })

                                            this.update({ error: errores })
                                        } else {
                                            console.log(this.state);
                                        }
                                    }}
                                >Submit</button>

                                <button
                                    className="btn btn-warning"
                                    type="reset"
                                >Reset</button>
                            </div>
                        </form>
                    </section>
                }
            </>

        )
    }
}