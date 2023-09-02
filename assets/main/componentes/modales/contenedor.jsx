import { Componente } from "../../../vdom/Componente";
import { crearPortal } from "../../../vdom/Portal";
import modal from "../../estilos/modal.module.css"

export class Contenedor extends Componente {
    constructor(props) {
        super({ mostrar: false, ...props });
        this.portal = document.getElementById("portal");
    }

    mostrarContenedor(cll) {
        this.setState({ mostrar: true });
        cll();
    }

    cerrarContenedor(cll) {
        cll();

        if (this.state.mostrar) {
            setTimeout(() => {
                this.setState({ mostrar: false });
            }, 600);
        }

    }

    handleClick(e) {
        if (e.target.id === "contenedorModal") {
            this.state.children.forEach(modal => {
                modal.cerrar();
            })
        }
    }

    render(props) {

        return crearPortal(
            <article
                id="contenedorModal"
                onclick={this.handleClick.bind(this)}
                className={`${modal.contenedor} ${props.mostrar ? modal["contenedor-show"] : ""}`}>
                {props.children}
            </article>
            , this.portal)

    }

}