import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { add, cambio, erroresClientes, submitCliente } from "./utils/clientesErrores";
import cls from "../estilos/clientes.module.css"
import { Tabla } from "./tabla";

export class Clientes extends Componente {
    constructor(props) {
        super({
            nombre: "",
            edad: 0,
            email: "",
            montado: false,
            error: {},
            chk: true,
            disable: true,
            ...props,
        })

        this.tabla = (
            <Tabla
                pTabla={{ className: "table table-dark" }}
                titulos={["Nombre", "Edad", "Email", "Acción"]}
            />
        );
    }

    montado() {

        this.nombre.focus();

        fetch("https://jsonplaceholder.typicode.com/users")
            .then(data => data.json())
            .then(users => users.map(user => {
                return {
                    edad: user.id,
                    nombre: user.name,
                    email: user.email
                }
            }))
            .then(clientes => {
                this.setState({ montado: true })
                add.call(this, clientes);
            })
    }

    render(props) {

        const { nombre, edad, email, montado, error, chk } = props;

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
                        onchange={cambio.bind(this, erroresClientes)}
                    />

                    {error?.edad && <spam className="text-danger d-block">{error.edad}</spam>}

                    <input
                        type="number"
                        required
                        min={18}
                        max={50}
                        className="form-control bg-dark text-light"
                        placeholder="Edad"
                        value={edad}
                        name="edad"
                        onchange={cambio.bind(this, erroresClientes)}
                        onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                        onInput={(e) => {
                            const inp = e.target;
                            const val = inp.value;
                            if (val.length > 2) {
                                inp.value = val.substring(0, 2)
                            }
                        }}
                    />

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
                        disabled={props.disable}
                        onclick={submitCliente.bind(this, erroresClientes)}
                    >Agregar</button>

                </form >

                <div className={`overflow-x-auto overflow-y-hidden m-2
                    ${!montado ? "d-flex justify-content-center" : ""}`.trim()}>
                    {
                        !montado
                            ?
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            this.tabla
                    }
                </div>
            </>
        )
    }

}
