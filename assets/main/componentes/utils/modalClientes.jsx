const erroresClientes = {
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

function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation();

    const form = this.formulario;

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

        this.setState({ error: errores })
    } else {
        this.c.alerta.abrir({
            mensaje:
                <span
                    style={{
                        wordWrap: "break-word",
                        overflow: "auto"
                    }}
                >
                    {JSON.stringify(this.state)}
                </span>,
            estilo: "bg-warning",
            mostrar: true
        })
    }
}

function showAlert() {
    this.setState(s => ({ showAlert: !s.showAlert }))

    if (this.state.showAlert) {
        this.c.alerta.abrir({
            mensaje: <span>Desde Modal</span>,
            estilo: "bg-danger text-light",
            mostrar: true
        })
    }
}

export { erroresClientes, handleSubmit, showAlert }