import { Componente } from "../../vdom/Componente";
import { CreateContext } from "../../vdom/Context";
import { Lista } from "./lista";

export const ContextoProveedor = new CreateContext();

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
        ContextoProveedor.children.proveedores = this;
    }

    agregar(e) {

        e?.preventDefault();
        e?.stopPropagation();

        const { lista } = ContextoProveedor.children;
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
            <ContextoProveedor.Provider>

                {!props.quitarRef && <h1 $ref="h1">Prueba de $Referencia</h1>}

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
                        onchange={e => this.update({ nombre: e.target.value.trim() })} />

                    <button
                        className="btn btn-success"
                        onclick={this.agregar.bind(this)}
                    >Agregar</button>

                    <button
                        className="btn btn-warning"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.update({ quitarRef: !this.state.quitarRef })
                        }}
                    >{!props.quitarRef ? "Quitar Referencia" : "Agregar Referencia"}</button>

                    <button
                        className="btn btn-primary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            if (this.h1) {
                                this.h1.textContent = this.state.nombre
                            }
                        }}
                    >Test Referencia</button>

                    <button
                        className="btn btn-info"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            ContextoProveedor.children.lista.cambiarColor();
                        }}
                    >Cambia Color</button>
                </form>

                {this.lista ?? (this.lista = <Lista contextoNombre="lista" />)}

            </ContextoProveedor.Provider >
        )
    }

}
