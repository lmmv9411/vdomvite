import { Componente } from "../../vdom/Componente";

export class Proveedores extends Componente {

    constructor(props) {
        super({
            ...props,
            nombre: "",
            crear: false
        })
    }

    montado() {
        this.nombre.focus();
    }

    render(props) {
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
                            e.stopPropagation()
                            this.update({ data: this.state.nombre, crear: !this.state.crear })
                        }}>Click Me!</button>
                    <button
                        className="btn btn-warning"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.spam.textContent = this.state.nombre
                        }}>Spam</button>
                </form>
                {props.data !== undefined ? <h1>{props.data}</h1> : null}
                {props.crear ? <spam $ref="spam">{props.msj ?? "Hola"}</spam> : null}
            </div>
        )
    }

}