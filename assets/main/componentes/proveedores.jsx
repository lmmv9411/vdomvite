import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { Lista } from "./lista";

export class Proveedores extends Componente {

    constructor(props) {
        super({
            ...props,
            nombre: "",
            crear: false,
            quitarRef: true
        })
    }

    montado() {
        this.nombre.focus();
    }

    preRender() {
        if (!this.lista) {
            this.lista = <Lista />
        }
    }

    render(props) {

        this.preRender();

        return (
            <>
                <form className="d-flex gap-2" style={"max-width:50%"}>
                    <input
                        $ref="nombre"
                        name="nombre"
                        type="text"
                        value={props.nombre}
                        className="form-control"
                        onchange={e => this.update({ nombre: e.target.value })} />
                    <button
                        className="btn btn-primary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            this.lista.agregarItem(this.state.nombre);

                            this.update({ nombre: "" })

                            this.nombre.focus();

                        }}>Click Me!</button>

                    <button
                        className="btn btn-secondary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.update({ quitarRef: !this.state.quitarRef })
                        }}>{!props.quitarRef ? "Quitar Referencia" : "Agregar Referencia"}</button>

                    <button
                        className="btn btn-secondary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.h1.textContent = this.state.nombre
                        }}>Test Referencia</button>
                </form>

                {this.lista}

                {!props.quitarRef && <h1 $ref="h1">Prueba</h1>}
            </>
        )
    }

}