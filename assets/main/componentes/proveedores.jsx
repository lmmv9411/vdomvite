import { Componente } from "../../vdom/Componente";

export class Proveedores extends Componente {
    constructor(props) {
        super({
            ...props,
            nombre: ""
        })
    }

    render(props) {
        return (
            <div>
                <form>
                    <input
                        name="nombre"
                        type="text"
                        value={props.nombre}
                        className="form-control"
                        onchange={e => this.update({ nombre: e.target.value })} />
                    <button className="btn btn-primary"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.update({ data: this.state.nombre })
                        }}>Click Me!</button>
                </form>
                {props.data !== undefined ? <h1>{props.data}</h1> : null}
            </div>
        )
    }

}