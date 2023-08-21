import { Componente } from "../../vdom/Componente";
import { crearPortal } from "../../vdom/Portal";
import modal from "../estilos/modal.module.css"

export class Modal extends Componente {
    constructor(props) {
        super({ mostrar: false, ...props });
    }

    abrirModal() {
        this.update({ mostrar: true });
    }

    cerrarModal() {
        this.update({ mostrar: false });
    }

    render(props) {

        this.portal ?? (this.portal = document.getElementById("portal"));

        return crearPortal(
            <article className={`${modal.modal} ${props.mostrar ? modal["modal-show"] : ""}`}>
                <header className={modal.centrar}>
                    <h1>Modal</h1>
                </header>
                <section className={modal.centrar}>
                    Soy un modal
                </section>
                <footer className={modal.centrar}>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onclick={this.cerrarModal.bind(this)}
                    >Cerrar</button>
                </footer>
            </article>
            , this.portal
        );
    }

}