import { Componente } from "../../vdom/Componente";
import { crearPortal } from "../../vdom/Portal";
import { Fragment } from "../../vdom/VDom";
import modal from "../estilos/modal.module.css"
import { ctx } from "./listaenlazada";

export class Modal extends Componente {
    constructor(props) {
        super({ mostrar: false, ...props });
    }

    render(props) {

        return (
            crearPortal(
                <>
                    {
                        props.mostrar &&

                        <article className={modal.modal}>
                            <header className={modal.centrar}>
                                <h1>Modal</h1>
                            </header>
                            <section className={modal.centrar}>
                                Soy un modal
                            </section>
                            <footer className={modal.centrar}>
                                <button className="btn btn-primary"
                                    type="button"
                                    onclick={() => {
                                        ctx.children.lista.cerrarModal();
                                    }}>
                                    Cerrar
                                </button>
                            </footer>
                        </article>
                    }
                </>
                , document.getElementById("portal"))
        );
    }
}