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

        if (!this.state.nombre) {
            this.update({ error: true })
            return;
        }

        this.lista.agregarItem(this.state.nombre);

        this.update({ nombre: "", error: false })

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

                {this.lista}

                {!props.quitarRef && <h1 $ref="h1">Prueba</h1>}

            </ContextoProveedor.Provider >
        )
    }

}
