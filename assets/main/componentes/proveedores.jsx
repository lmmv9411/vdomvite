import { Componente } from "../../vdom/Componente";
import { ContextoProveedor as CP } from "../contextos/proveedores";
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
        CP.children.proveedores = this;
    }

    agregar(e) {

        e?.preventDefault();
        e?.stopPropagation();

        const { lista } = CP.children;
        const { nombre } = this.state;

        if (!nombre) {
            this.update({ error: "¡Item vacío!" })
            return;
        }

        lista.agregarItem(nombre);

        this.update({ nombre: "" })

        this.nombre.focus();
    }

    render(props) {

        return (
            <CP.Provider>

                <form className="d-flex gap-2 p-3 flex-wrap" autocomplete="off">

                    {
                        props.error && <span className="text-danger d-block">{props.error}</span>
                    }

                    <input
                        $ref="nombre"
                        name="nombre"
                        type="text"
                        value={props.nombre}
                        className="form-control bg-dark text-light"
                        onchange={e => this.update({ nombre: e.target.value.trim() })} />

                    <button
                        className="btn btn-primary"
                        onclick={this.agregar.bind(this)}>Click Me!</button>

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
                            if (this.h1) {
                                this.h1.textContent = this.state.nombre
                            }
                        }}>Test Referencia</button>

                    <button
                        className="btn btn-secondary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            CP.children.lista.cambiarColor();
                        }}>Cambia Color</button>
                </form>

                <Lista contextoNombre="lista" />

                {!props.quitarRef && <h1 $ref="h1">Prueba</h1>}

            </CP.Provider >
        )
    }

}
