import { Componente } from "../../../vdom/Componente";

export class Boton extends Componente {

    constructor(props) {
        super(props);
    }

    render({ name, bg, onClick }) {
        return (
            <button
                type="button"
                className={'boton ajustar-ancho ' + bg}
                onClick={onClick}
            >
                {name}
            </button>
        )
    }

}