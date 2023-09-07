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

        this.setState({ error: erroresII })

    } else {

        const { nombre, edad, email } = this.state

        form.reset();
        add.call(this, [{ nombre, edad, email }]);
        this.setState({ disable: true });
        this.nombre.focus();
    }
}

function add(clientes) {
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
                        onclick={() => this.tabla.delete(cliente.edad)}
                    >Eliminar</a>
                </td>
            </tr>
        )
    })

    this.tabla.prepend(clientes);
}

function cambio(errores, e) {

    const input = e.target

    const error = this.state.error;
    const newState = { [input.name]: input.value };

    if (input.checkValidity()) {
        delete error[input.name]
        if (this.formulario.checkValidity()) {
            newState.disable = false;
        }
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
        newState.disable = true;
        input?.focus();
    }

    this.setState(newState);

}

export { erroresClientes, cambio, submitCliente, add };
