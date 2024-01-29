import { ModalClientes } from "../modales/modalClientes";
import { cambio } from "./forms/cambio";
import { ctx } from "../listaenlazada";

export class Controlador {

    errores = {
        name: {
            tooShort: "Mínimo 4 caracteres",
            valueMissing: "Nombre obligatorio"
        },
        phone: {
            valueMissing: "Teléfono obligatorio.",
            patternMismatch: 'Solo números del 0 al 9 y/o "+", "-", "(", ")".',
            tooShort: "Mínimo 10 números.",
            tooLong: "Máximo 10 números."
        }
    }

    /**
     * 
     * @param {ModalClientes} view 
     */
    constructor(view) {
        this.view = view;
    }

    cambio(e) {
        cambio(e, this.errores, this.view);
    }

    handleSubmit(e) {
        e.preventDefault()
        e.stopPropagation();

        const form = this.view.formulario;

        if (!form.checkValidity()) {

            let errores = {};

            form.querySelectorAll("input")
                .forEach(inp => {

                    const inpErr = erroresClientes[inp.name];

                    for (const error of Object.keys(inpErr)) {
                        if (inp.validity[error]) {
                            errores[inp.name] = inpErr[error];
                            break;
                        }
                    }

                })

            this.view.setState({ error: errores })
        } else {
            ctx.alerta.abrir({
                mensaje:
                    <span
                        style={{
                            wordWrap: "break-word",
                            overflow: "auto"
                        }}
                    >
                        {JSON.stringify(this.view.state)}
                    </span>,
                estilo: "bg-warning",
                mostrar: true
            })
        }
    }

    showAlert() {
        this.view.setState(s => ({ showAlert: !s.showAlert }))

        if (this.view.state.showAlert) {
            ctx.alerta.abrir({
                mensaje: <span>Desde Modal</span>,
                estilo: "bg-danger text-light",
                mostrar: true
            })
        }
    }

}