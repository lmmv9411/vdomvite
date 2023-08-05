export const Contextos = {};

export function Contexto(props) {
    if (Contextos.hasOwnProperty(props.name)) {
        return;
    }
    Contextos[props.name] = {};
}