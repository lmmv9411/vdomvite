import { Componente } from "../../../vdom/Componente";

export class Boton extends Componente {

    constructor(props) {
        super({ bg: "btn-primary", ...props });
    }

    render({ name, bg, onClick }) {
        return (
            <button
                type="button"
                className={'btn ajustar-ancho ' + bg}
                onClick={onClick}
            >
                {name}
            </button>
        )
    }

}