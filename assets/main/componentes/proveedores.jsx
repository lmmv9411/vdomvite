import { Componente } from "../../vdom/Componente";
import { Contexto } from "../../vdom/Context";
import { Lista } from "./lista";

export const ctxProveedor = new Contexto();

export class Proveedores extends Componente {

    constructor(props) {
        super({
            ...props,
            nombre: "",
            crear: false,
            quitarRef: true
        });
        ctxProveedor.proveedores = this;
    }

    montado() {
        this.nombre.focus();
    }

    agregar(e) {

        e?.preventDefault();
        e?.stopPropagation();

        const { nombre } = this.state;

        if (!nombre) {
            this.setState({ error: "¡Item vacío!" })
            return;
        }

        ctxProveedor.lista.agregarItem(nombre);

        this.setState({ nombre: "" })

        this.nombre.focus();
    }

    render(props) {

        return (
            <ctxProveedor.Provider>

                {!props.quitarRef && <h3 $ref="h1">Prueba de $Referencia</h3>}

                <form className="d-flex gap-2 p-3 flex-wrap" autocomplete="off">

                    {
                        props.error && <span className="text-danger d-block">{props.error}</span>
                    }

                    <input
                        $ref="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Valor"
                        value={props.nombre}
                        className="form-control bg-dark text-light"
                        onchange={e => this.setState({ nombre: e.target.value.trim() })}
                    />

                    <button
                        className="btn btn-success"
                        onclick={this.agregar.bind(this)}>
                        Agregar
                    </button>

                    <button
                        className="btn btn-warning"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.setState(s => ({ quitarRef: !s.quitarRef }))
                        }}
                    >
                        {!props.quitarRef ? "Quitar Referencia" : "Agregar Referencia"}
                    </button>

                    <button
                        className="btn btn-primary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            if (this.h1) {
                                this.h1.textContent = this.state.nombre
                            }
                        }}
                    >
                        Test Referencia
                    </button>

                    <button
                        className="btn btn-info"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            ctxProveedor.lista.cambiarColor();
                        }}
                    >
                        Cambia Color
                    </button>
                </form>

                <Lista ctx="lista" />

            </ctxProveedor.Provider >
        )
    }

}
