export const Contextos = {};

export const Contexto = (props) => {
    if (Contextos.hasOwnProperty(props.name)) {
        return;
    }
    Contextos[props.name] = {};
}