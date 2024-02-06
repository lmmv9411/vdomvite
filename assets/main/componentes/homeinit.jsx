import { Componente } from "../../vdom/Componente"
import { Boton } from "./utils/boton";

export class HomeInit extends Componente {

    constructor() {
        super({ nameBtn: "Mostrar", bg: "btn-primary", show: false });
    }

    render(props) {
        return (
            <>
                <header>
                    <h1>Soy el inicio de VDom I</h1>
                </header>
                <article>

                    <section>
                        <p>Este es una prueba y correción de errores del anterior <em>VDOM II</em></p>
                    </section>

                    <Boton name={props.nameBtn} bg={props.bg} onClick={() => this.setState(s => {
                        return {
                            show: !s.show,
                            nameBtn: !s.show ? "Ocultar" : "Mostrar",
                            bg: !s.show ? "btn-success" : "btn-primary"
                        }
                    })}
                    />

                </article>
                <>
                    <div>test III Fragment</div>
                    <div>Antes que article III Fragment</div>
                    {
                        props.show
                        &&
                        <>
                            <article style={{ backgroundColor: "darkcyan", display: "inline" }}>Primero Que Luis Yo "article"</article>
                            <>
                                <div>Miracle</div>
                                <div>Oráculo</div>
                                <>
                                    <p>Mi amor</p>
                                    <p>Lorena</p>
                                </>
                            </>
                        </>
                    }
                    <div>Luis despues de article III Fragment</div>
                </>
            </>
        )
    }
}