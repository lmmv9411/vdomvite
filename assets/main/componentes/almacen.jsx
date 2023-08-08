import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";

export class Almacen extends Componente {
    constructor(props) {
        super({ ...props, frase: true })
    }

    render(props) {
        return (
            <>
                <section>
                    <h1 $ref="alm">Soy Almacén</h1>
                    <p>hola Soy una prueba para el Almacen</p>
                    <button class="btn btn-primary" onclick={(e) => {
                        this.alm.textContent = this.state.frase ? "Andrés" : "Soy Almacén";
                        this.update({ frase: !this.state.frase })
                    }}>{props.frase ? "Cambiar Ref" : "Restablecer Ref"}</button>
                </section>

                <section>
                    <h1>Soy Almacén II</h1>
                    <p>hola Soy una prueba para el Almacen II</p>
                </section>
            </>
        )
    }
}