import { Componente } from "../../vdom/Componente";
import { render } from "../../vdom/Render";
import { reemplazarElemento } from "../../vdom/VDom";

export class Proveedores extends Componente {
    constructor(props) {
        super(props)
    }

    render(props) {
        return (
            <div>
                <h1>Saludos a ti {props.nombre}</h1>
                <button className="btn btn-primary" onclick={async () => {
                    const p = await import("./clientes.jsx")
                    reemplazarElemento(document.getElementById("app"),
                        render(new p.Clientes({ nombre: this.state.nombre })));
                }}>Regresar</button>
            </div>
        )
    }

}