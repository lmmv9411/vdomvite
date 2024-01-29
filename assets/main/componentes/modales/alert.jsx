import style from "../../estilos/alerta.module.css"
import { VDOM } from "../../../vdom/Render";
import { Portal } from "../../../vdom/Portal";

export class Alerta extends Portal {
    constructor(props) {
        super({
            parent: document.getElementById("portal"),
            mostrar: false,
            mensaje: "",
            ...props
        })
        this.alertas = [];
    }

    abrir(data) {
        const alerta = new Alerta({ ...data });
        alerta.cerrar = this.cerrar.bind(alerta, this.alertas);
        this.alertas.push(alerta);

        VDOM.render(alerta);

        setTimeout(() => {
            if (this.alertas.length === 0) {
                return
            }
            const peek = this.alertas[0];
            if (peek.alerta !== alerta.alerta) {
                return;
            }
            const portal = this.alertas.shift();
            portal.alerta.remove();
        }, 5000);
    }

    cerrar(alertas) {
        const i = alertas.findIndex(a => a.alerta === this.alerta);
        const portal = alertas[i];
        alertas.splice(i, 1);
        portal.alerta.remove();
    }

    getNodo(props) {
        return (
            <article>
                {
                    props.mostrar &&

                    <div
                        $ref="alerta"
                        class={`${props.estilo} ${style.alerta} ${props.mostrar ? style.show : style.hidden}`}
                        role="alert">
                        {props.mensaje}
                        <button
                            onclick={this.cerrar}
                            className={style["btn-close"]}>
                            ❌
                        </button>
                    </div>
                }
            </article>

        )
    }
}