import { Componente } from "../../vdom/Componente";
import cls from "../estilos/clientes.module.css"
import { Fragment } from "../../vdom/VDom";
import { cambio, eliminarCliente, erroresClientes, submitCliente } from "./utils/clientesErrores";

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
            .then(users => users.map(user => {
                return { edad: user.id, nombre: user.name, email: user.email }
            }))
            .then(data => this.update({ clientes: data }))
    }

    render(props) {

        const { nombre, edad, email, clientes, error, chk } = props;

        return (
            <>
                <form $ref="formulario" action="post" className={`d-flex flex-column p-2 mt-2 ${cls.form}`} autocomplete="off">

                    {error?.nombre && <spam className="text-danger d-block">{error.nombre}</spam>}

                    <input
                        $ref="nombre"
                        type="text"
                        required
                        pattern=".{3,}"
                        className="form-control text-light bg-dark"
                        placeholder="nombre"
                        name="nombre"
                        value={nombre.trim()}
                        onchange={cambio.bind(this, erroresClientes)} />

                    {error?.edad && <spam className="text-danger d-block">{error.edad}</spam>}

                    <input
                        type="number"
                        required min={18} max={50}
                        className="form-control text-light bg-dark"
                        placeholder="edad"
                        value={edad}
                        name="edad"
                        onchange={cambio.bind(this, erroresClientes)} />

                    {error?.email && <spam className="text-danger d-block">{error.email}</spam>}

                    <div className="d-flex gap-3">
                        <input
                            autocomplete="off"
                            pattern="[a-zA-z0-9_\-]{4,}@[a-zA-Z]{4,}\.[a-zA-z]{3,4}"
                            required
                            className="form-control text-light bg-dark"
                            type="email"
                            placeholder="email"
                            value={email.trim()}
                            name="email"
                            onchange={cambio.bind(this, erroresClientes)} />
                        <div className="d-flex align-items-center justify-content-center gap-1">
                            <label htmlFor="miCheck">Seleccion</label>
                            <input type="checkbox" id="miCheck" checked={chk}
                                onclick={() => this.update({ chk: !this.state.chk })} />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            onclick={submitCliente.bind(this)}
                        >Click Me!
                        </button>
                    </div>

                </form>

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