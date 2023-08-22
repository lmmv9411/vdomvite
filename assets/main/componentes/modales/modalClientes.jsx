import { Componente } from "../../../vdom/Componente";
import { ctx } from "../listaenlazada";
import modal from "../../estilos/modal.module.css"

export class ModalClientes extends Componente {
    constructor(props) {
        super({ ...props, mostrar: false })
        this.c = ctx.children;
    }

    abrir() {
        this.c.contenedor.mostrarContenedor(() => {
            this.update({ mostrar: true });
            this.nombre.focus();
        })
    }

    cerrar() {
        this.c.contenedor.cerrarContenedor(() => {
            this.update({ mostrar: false });
        })
    }

    render(props) {
        return (
            <section className={`card p-3 bg-dark text-light w-75 ${modal.modal} ${props.mostrar ? modal["modal-show"] : ""}`}>

                <header className="d-flex justify-content-between">
                    <h1 className="card-title">Clientes</h1>
                    <button
                        className="btn text-light bg-danger p-1 d-block rounded"
                        onclick={this.cerrar.bind(this)}
                    >X</button>
                </header>

                <form
                    className="card-body d-flex flex-column gap-2"
                    onsubmit={(e) => {

                        e.preventDefault()
                        e.stopPropagation();

                        const form = e.target;

                        const inputs = Array.from(form.elements)
                            .filter(elem => elem.tagName === "INPUT");

                        console.log(inputs);
                    }}>

                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            className="form-control bg-dark text-light"
                            type="text"
                            id="name" $ref="nombre" />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input className="form-control bg-dark text-light" type="text" id="phone" />
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            type="submit">Submit</button>
                        <button
                            className="btn btn-warning"
                            type="reset">Reset</button>
                    </div>
                </form>
            </section>
        )
    }
}