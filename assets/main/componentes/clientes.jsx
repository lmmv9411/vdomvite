import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { cambio, eliminarCliente, erroresClientes, submitCliente } from "./utils/clientesErrores";
import cls from "../estilos/clientes.module.css"

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
            .then(users => users.map(user => ({ edad: user.id, nombre: user.name, email: user.email })))
            .then(data => this.setState({ clientes: data }))
    }

    render(props) {

        const { nombre, edad, email, clientes, error, chk } = props;

        return (
            <>
                <form $ref="formulario" action="post" className={`gap-3 d-flex flex-column ${cls.form} card bg-dark p-3`} autocomplete="off">

                    {error?.nombre && <spam className="text-danger d-block">{error.nombre}</spam>}

                    <input
                        $ref="nombre"
                        type="text"
                        required
                        pattern=".{3,}"
                        className="form-control bg-dark text-light"
                        placeholder="Nombre"
                        name="nombre"
                        value={nombre.trim()}
                        onchange={cambio.bind(this, erroresClientes)} />

                    {error?.edad && <spam className="text-danger d-block">{error.edad}</spam>}

                    <input
                        type="number"
                        required min={18} max={50}
                        className="form-control bg-dark text-light"
                        placeholder="Edad"
                        value={edad}
                        name="edad"
                        onchange={cambio.bind(this, erroresClientes)} />

                    {error?.email && <spam className="text-danger d-block">{error.email}</spam>}

                    <div className="d-flex gap-3">
                        <input
                            autocomplete="off"
                            pattern="[a-zA-z0-9_\-]{4,}@[a-zA-Z]{4,}\.[a-zA-z]{3,4}"
                            required
                            className="form-control bg-dark text-light"
                            type="email"
                            placeholder="Email"
                            value={email.trim()}
                            name="email"
                            onchange={cambio.bind(this, erroresClientes)} />

                        <label className="d-flex align-items-center justify-content-center gap-2">
                            <span className="text-light">Seleccion</span>
                            <input
                                name="seleccion"
                                type="checkbox"
                                checked={chk}
                                defaultChecked={true}
                                onclick={() => this.setState(s => ({ chk: !s.chk }))}
                            />
                        </label>

                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={props.chk}
                        onclick={submitCliente.bind(this, erroresClientes)}>
                        Agregar
                    </button>

                </form >

                <div className={`overflow-x-auto overflow-y-hidden m-2
                    ${clientes.length == 0 ? "d-flex justify-content-center" : ""}`.trim()}>
                    {
                        clientes.length == 0
                            ?
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            <table className="table table-dark">
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
                                                        onclick={eliminarCliente.bind(this, cliente)}
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
