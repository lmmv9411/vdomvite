import { Componente } from "../../vdom/Componente"

export class HomeInit extends Componente {

    constructor() {
        super({ show: false });
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
                    <form>
                        <input type="button" value="Cambiar"
                            onClick={() => this.setState(s => ({ show: !s.show }))}
                        />
                    </form>
                </article>
                <>
                    <div>test</div>
                    <div>Antes que article</div>
                    {
                        props.show
                        &&
                        <>
                            <article>Primero Que Luis Yo "article"</article>
                        </>
                    }
                    <div>Luis despues de article</div>
                </>
            </>
        )
    }
}