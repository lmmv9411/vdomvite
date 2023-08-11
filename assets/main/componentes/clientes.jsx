import { Componente } from "../../vdom/Componente";
import cls from "../estilos/clientes.module.css"
import { Fragment } from "../../vdom/VDom";

export class Clientes extends Componente {
    constructor(props) {
        super({
            nombre: "",
            edad: 0,
            email: "",
            clientes: [],
            error: {},
            chk: true,
            ...props,
        })
    }

    montado() {

        this.nombre.focus();

        fetch("https://jsonplaceholder.typicode.com/users")
            .then(data => data.json())
            .then(users => users.map(user => { return { edad: user.id, nombre: user.name, email: user.email } }))
            .then(data => this.update({ clientes: data }))
    }

    cambio(e) {

        const input = e.target

        const error = this.state.error;
        const newState = { [input.name]: input.value };

        if (input.checkValidity()) {
            delete error[input.name]
        } else {
            newState.error = { ...error, [input.name]: input.validity }
        }

        this.update(newState);

        if (Object.keys(newState.error).length > 0 &&
            newState.error[input.name] !== undefined) {
            this[input.name]?.focus();
        }
    }

    render(props) {

        const { nombre, edad, email, clientes, error, chk } = props;

        return (
            <>
                <form $ref="formulario" action="post" className={`d-flex flex-column p-2 mt-2 ${cls.form}`} autocomplete="off">

                    {error?.nombre && <spam className="text-danger d-block">{
                        error.nombre.valueMissing ? "Nombre obligatorio" :
                            error.nombre.patternMismatch ? "Mínimo 3 caracteres" : "Error"
                    }</spam>}

                    <input
                        $ref="nombre"
                        type="text"
                        required
                        pattern=".{3,}"
                        className="form-control text-light bg-dark"
                        placeholder="nombre"
                        name="nombre"
                        value={nombre.trim()}
                        onchange={this.cambio.bind(this)} />

                    {error?.edad && <spam className="text-danger d-block">{
                        error.edad.valueMissing ? "Edad obligatoria" :
                            error.edad.rangeUnderflow ? "Mínimo 18" :
                                error.edad.rangeOverflow ? "Máximo 50" : "Error"
                    }</spam>}

                    <input
                        $ref="edad"
                        type="number"
                        required min={18} max={50}
                        className="form-control text-light bg-dark"
                        placeholder="edad"
                        value={edad}
                        name="edad"
                        onchange={this.cambio.bind(this)} />

                    {error?.email && <spam className="text-danger d-block">{
                        error.email.valueMissing ? "Email obligatorio" :
                            error.email.patternMismatch ? "Email inválido" : "Error"}
                    </spam>}

                    <div className="d-flex gap-3">
                        <input
                            $ref="email"
                            pattern="[a-zA-z0-9_\-]{4,}@[a-zA-Z]{4,}\.[a-zA-z]{3,4}"
                            required
                            className="form-control text-light bg-dark"
                            type="email"
                            placeholder="email"
                            value={email.trim()}
                            name="email"
                            onchange={this.cambio.bind(this)} />
                        <div className="d-flex align-items-center justify-content-center gap-1">
                            <label htmlFor="miCheck">Seleccion</label>
                            <input type="checkbox" id="miCheck" checked={chk}
                                onclick={() => this.update({ chk: !this.state.chk })} />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            onclick={submit.bind(this)}
                        >Click Me!
                        </button>
                    </div>

                </form>

                <div className={`overflow-x-auto overflow-y-hidden mt-3 p-2 
                    ${clientes.length == 0 ? "d-flex justify-content-center" : ""}`.trim()}>
                    {
                        clientes.length == 0
                            ?
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            <table className="table table-dark w-95">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                        <th>Email</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        clientes.map(cliente =>
                                            <tr key={cliente.edad}>
                                                <td>{cliente.nombre}</td>
                                                <td>{cliente.edad}</td>
                                                <td>{cliente.email}</td>
                                                <td>
                                                    <a className="btn btn-danger"
                                                        href="#"
                                                        onclick={e => eliminar(e, cliente, this)}
                                                    >Eliminar</a>
                                                </td>
                                            </tr>)
                                    }
                                </tbody>
                            </table>
                    }
                </div>
            </>
        )
    }

}

function eliminar(e, cliente, a) {

    e.preventDefault();
    const filtro = a.state.clientes.filter(c => c !== cliente);
    a.update({ clientes: filtro })

}

function submit(e) {

    e.preventDefault();
    e.stopPropagation();

    const form = this.formulario;

    if (!form.checkValidity()) {

        const errores = {};

        form.querySelectorAll("input").forEach(inp => {
            if (!inp.checkValidity()) {
                errores[inp.name] = inp.validity
            }
        })

        this.update({ error: errores })

    } else {
        const { nombre, edad, email, clientes } = this.state
        console.log(this.state);
        clientes.unshift({ nombre, edad, email })
        this.update({ nombre: "", edad: "", email: "" })
        //form.reset();
        this.nombre.focus();
    }
}
