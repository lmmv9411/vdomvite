import { Componente } from "../../vdom/Componente";
import { Contexto, Contextos } from "../../vdom/Contexto";
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
        Contextos.actions.agregar = this.agregar.bind(this)
    }

    agregar(e) {

        e?.preventDefault();
        e?.stopPropagation();

        this.lista.agregarItem(this.state.nombre);

        this.update({ nombre: "" })

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
            <Contexto name="actions">

                <form class="d-flex gap-2 p-3 flex-wrap" autocomplete="off">

                    <input
                        $ref="nombre"
                        name="nombre"
                        type="text"
                        value={props.nombre}
                        class="form-control bg-dark text-light"
                        onchange={e => this.update({ nombre: e.target.value.trim() })} />

                    <button
                        class="btn btn-primary"
                        onclick={this.agregar.bind(this)}>Click Me!</button>

                    <button
                        class="btn btn-secondary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.update({ quitarRef: !this.state.quitarRef })
                        }}>{!props.quitarRef ? "Quitar Referencia" : "Agregar Referencia"}</button>

                    <button
                        class="btn btn-secondary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            if (this.h1) {
                                this.h1.textContent = this.state.nombre
                            }
                        }}>Test Referencia</button>
                </form>

                {this.lista}

                {!props.quitarRef && <h1 $ref="h1">Prueba</h1>}

            </Contexto >
        )
    }

}
