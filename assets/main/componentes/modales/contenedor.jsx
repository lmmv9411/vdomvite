import { Componente } from "../../../vdom/Componente";
import { crearPortal } from "../../../vdom/Portal";
import modal from "../../estilos/modal.module.css"

export class Contenedor extends Componente {
    constructor(props) {
        super({ mostrar: false, ...props });
    }

    mostrarContenedor() {
        this.update({ mostrar: true });
        this.state.modal.abrir();
    }

    cerrarContenedor() {
        this.state.modal.cerrar();
        setTimeout(() => {
            this.update({ mostrar: false });
        }, 600);
    }

    render(props) {

        this.portal ?? (this.portal = document.getElementById("portal"));

        return crearPortal(
            <article className={`${modal.contenedor} ${props.mostrar ? modal["contenedor-show"] : ""}`}>
                {props.children}
            </article>
            , this.portal
        );
    }

}