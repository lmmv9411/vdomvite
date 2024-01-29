import { Portal } from '../../../vdom/Portal'
import modal from "../../estilos/modal.module.css"

export class Contenedor extends Portal {
    constructor(props) {
        super({
            parent: document.getElementById("portal"),
            mostrar: false,
            ...props
        });
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


    getNodo(props) {

        return (
            <article
                id="contenedorModal"
                onclick={this.handleClick.bind(this)}
                className={`${modal.contenedor} ${props.mostrar ? modal["contenedor-show"] : ""}`}>
                {...props.children}
            </article>
        )
    }

}