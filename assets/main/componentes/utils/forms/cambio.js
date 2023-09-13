export function cambio(e, errores, view) {

    const input = e.target

    const error = view.state.error;
    const newState = { [input.name]: input.value };

    if (input.checkValidity()) {
        delete error[input.name]
        if (view.formulario.checkValidity()) {
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

    view.setState(newState);

}