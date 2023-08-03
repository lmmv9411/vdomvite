import { Componente } from "../../vdom/Componente";
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
            <div>
                <form>
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
                            this.update({
                                crear: !this.state.crear
                            })
                            this.lista.agregarItem(this.state.nombre);
                        }}>Click Me!</button>
                    <button
                        className="btn btn-warning"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.spam.textContent = this.state.nombre
                        }}>Spam</button>

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

                {props.crear && <spam $ref="spam">{props.msj ?? "Hola"}</spam>}

                {!props.quitarRef && <h1 $ref="h1">Prueba</h1>}
            </div>
        )
    }

}