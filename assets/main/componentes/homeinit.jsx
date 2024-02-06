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
                    <h1>Soy el inicio de VDom</h1>
                </header>
                <article>

                    <section>
                        <p>Este es una prueba y correción de errores del anterior <em>VDOM</em></p>
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
                    <div>test</div>
                    <div>Antes que article</div>
                    {
                        props.show
                        &&
                        <>
                            <article style={{ backgroundColor: "darkcyan", display: "inline" }}>Primero Que Luis Yo "article"</article>
                        </>
                    }
                    <div>Luis despues de article</div>
                </>
            </>
        )
    }
}