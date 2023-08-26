const erroresClientes = {
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

function eliminarCliente(cliente, e) {

    e.preventDefault();
    const filtro = this.state.clientes.filter(c => c !== cliente);
    this.update({ clientes: filtro })

}

function submitCliente(errores, e) {

    e.preventDefault();
    e.stopPropagation();

    const form = this.formulario;

    if (!form.checkValidity()) {

        const erroresII = {};

        form.querySelectorAll("input").forEach(inp => {
            if (!inp.checkValidity()) {

                let msj;
                const inpErr = errores[inp.name];
                for (let error of Object.keys(inpErr)) {
                    if (inp.validity[error]) {
                        msj = inpErr[error];
                        break;
                    }
                }

                erroresII[inp.name] = msj;
            }
        })

        this.update({ error: erroresII })

    } else {
        const { nombre, edad, email, clientes } = this.state
        clientes.unshift({ nombre, edad, email })
        //this.update({ nombre: "", edad: "", email: "" })
        form.reset();
        this.update({});
        this.nombre.focus();
    }
}

function cambio(errores, e) {

    const input = e.target

    const error = this.state.error;
    const newState = { [input.name]: input.value };

    if (input.checkValidity()) {
        delete error[input.name]
    } else {

        let msj;

        const inpErr = errores[input.name];

        for (let error of Object.keys(inpErr)) {
            if (input.validity[error]) {
                msj = inpErr[error];
                break;
            }
        }

        newState.error = { ...error, [input.name]: msj }
        input?.focus();
    }

    this.update(newState);

}

export { eliminarCliente, erroresClientes, cambio, submitCliente };
