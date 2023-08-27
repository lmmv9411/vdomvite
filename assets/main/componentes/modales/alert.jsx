import { Componente } from "../../../vdom/Componente";
import { crearPortal } from "../../../vdom/Portal";
import { Fragment } from "../../../vdom/VDom";
import style from "../../estilos/alerta.module.css"
import { VDOM } from "../../../vdom/Render";

export class Alerta extends Componente {
    constructor(props) {
        super({ mostrar: false, mensaje: "", ...props })
        this.alertas = [];
    }

    abrir(data) {
        const alerta = new Alerta({ ...data });
        this.alertas.push(alerta);

        VDOM.render(alerta);

        setTimeout(() => {
            const portal = this.alertas.shift();
            portal.alerta.remove();
        }, 5000);
    }

    render(props) {
        return (

            <>
                {crearPortal(
                    props.mostrar &&
                    <div
                        $ref="alerta"
                        class={`${props.estilo} ${style.alerta} ${props.mostrar ? style.show : style.hidden}`}
                        role="alert">
                        {props.mensaje}
                    </div>, document.getElementById("portal")
                )}
            </>

        )
    }
}