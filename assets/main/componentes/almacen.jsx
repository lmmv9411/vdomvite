import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";

export class Almacen extends Componente {
    constructor(props) {
        super(props)
    }

    render(props) {
        return (
            <>
                <section>
                    <h1 $ref="alm">Soy Almacén</h1>
                    <p>hola Soy una prueba para el Almacen</p>
                    <button className="btn btn-primary" onclick={(e) => {
                        this.alm.textContent = "Di"
                    }}>test ref</button>
                </section>

                <section>
                    <h1>Soy Almacén II</h1>
                    <p>hola Soy una prueba para el Almacen II</p>
                </section>
            </>
        )
    }
}