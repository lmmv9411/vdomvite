import { Clientes } from "../clientes";
import { cambio } from "./forms/cambio";

export class Controlador {

    errores = {
        nombre: {
            valueMissing: "Nombre obligatorio",
            patternMismatch: "Mínimo 3 caracteres"
        },
        edad: {
            valueMissing: "Edad obligatoria",
            rangeUnderflow: "Mínimo 18",
            rangeOverflow: "Máximo 50"
        },
        email: {
            valueMissing: "Email obligatorio",
            patternMismatch: "Email inválido"
        }
    }

    /**
     * 
     * @param {Clientes} view 
     */
    constructor(view) {
        this.view = view;
    }

    submitCliente(e) {

        e.preventDefault();
        e.stopPropagation();

        const form = this.view.formulario;

        if (!form.checkValidity()) {

            const erroresII = {};

            form.querySelectorAll("input").forEach(inp => {
                if (!inp.checkValidity()) {

                    let msj;
                    const inpErr = this.errores[inp.name];
                    for (let error of Object.keys(inpErr)) {
                        if (inp.validity[error]) {
                            msj = inpErr[error];
                            break;
                        }
                    }

                    erroresII[inp.name] = msj;
                }
            })

            this.view.setState({ error: erroresII })

        } else {

            const { nombre, edad, email } = this.view.state

            form.reset();
            this.add([{ nombre, edad, email }]);
            this.view.setState({ disable: true });
            this.view.nombre.focus();
        }
    }

    add(clientes) {
        clientes = clientes.map(cliente => {
            return (
                <tr key={cliente.edad}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.edad}</td>
                    <td>{cliente.email}</td>
                    <td>
                        <a
                            className="btn btn-danger"
                            href="#"
                            onclick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.view.instancias.tabla.delete(cliente.edad)
                            }}
                        >Eliminar</a>
                    </td>
                </tr>
            )
        })

        this.view.instancias.tabla.prepend(clientes);
    }

    cambio(e) {
        cambio(e, this.errores, this.view);
    }

}
