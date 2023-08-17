import { Componente } from "../../vdom/Componente";
import { ContextoProveedor } from "../contextos/proveedores";
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
        ContextoProveedor.children.Proveedores = this;
        this.ctx = ContextoProveedor.children;
    }

    agregar(e) {

        e?.preventDefault();
        e?.stopPropagation();

        const { Lista } = ContextoProveedor.children;
        const { nombre } = this.state;

        if (!nombre) {
            this.update({ error: true })
            return;
        }

        Lista.agregarItem(nombre);

        this.update({ nombre: "", error: false })

        this.nombre.focus();
    }

    render(props) {

        return (
            <ContextoProveedor.Provider>

                <form className="d-flex gap-2 p-3 flex-wrap" autocomplete="off">

                    {
                        props.error && <span className="text-danger d-block">Nombre Vacío</span>
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
                            this.ctx.Lista.cambiarColor();
                        }}>Cambia Color</button>
                </form>

                <Lista />

                {!props.quitarRef && <h1 $ref="h1">Prueba</h1>}

            </ContextoProveedor.Provider >
        )
    }

}
