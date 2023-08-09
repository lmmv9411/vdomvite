import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";

export class ListaEnlazada extends Componente {
    constructor() {
        super({ cabeza: null, valor: "", cola: null, pos: 0 })
        this.size = 0;
    }

    render(props) {
        return (
            <>
                <header>
                    <h1>Cabeza: {props.cabeza?.valor}</h1>
                    <h1>Cola: {props.cola?.valor}</h1>
                    <h2>Tamaño: {this.size ?? 0}</h2>
                    <section>
                        <input type="text" id="txtValor" $ref="txtValor"
                            placeholder="Valor" value={props.valor}
                            onchange={(e) => { this.update({ valor: e.target.value }) }} />
                        <button type="button" onclick={() => {

                            this.size++;

                            let { cabeza, cola, valor } = this.state;

                            if (cola === null) {
                                cola = nodo(valor)
                                cabeza = cola;
                                this.update({ cabeza, cola, valor: "" })
                            } else {
                                const tmp = nodo(valor)
                                tmp.anterior = cola
                                cola.siguiente = tmp;
                                this.update({ cola: tmp, valor: "" })
                            }

                            this.txtValor.focus()

                        }}>Agregar Cola</button>

                        <button type="button" onclick={() => {

                            this.size++;

                            let { cabeza, valor, cola } = this.state;

                            if (cabeza === null) {
                                cabeza = nodo(valor)
                                cola = cabeza
                                this.update({ cabeza, cola, valor: "" })
                            } else {
                                let tmp = nodo(valor);
                                tmp.siguiente = cabeza;
                                cabeza.anterior = tmp;
                                this.update({ cabeza: tmp, valor: "" })
                            }
                            this.txtValor.focus()

                        }}>Agregar Cabeza</button>


                        <input
                            type="number"
                            placeholder="posición"
                            value={props.pos}
                            min={0}
                            max={this.size ?? 0}
                            onchange={(e) => this.update({ pos: e.target.value })}
                        />

                        <button type="button" onclick={() => {
                            
                            let tmp = this.state.cabeza;
                            let idx = 0;
                            const pos = Number(this.state.pos);

                            while (tmp) {
                                if (idx === pos) {
                                    const tmpNodo = nodo(this.state.valor);
                                    tmpNodo.siguiente = tmp.siguiente
                                    tmpNodo.anterior = tmp;
                                    tmp.siguiente = tmpNodo;
                                    this.update({})
                                    break;
                                } else {
                                    tmp = tmp.siguiente;
                                }
                                idx++;
                            }

                        }}>Agregar en</button>

                    </section>
                </header>
                <article>
                    <ul>
                        {leerCabeza(props.cabeza)}
                    </ul>
                </article>
            </>
        )
    }
}

function leerCabeza(nodo) {
    const tmp = []
    let tmpNodo = nodo;

    while (tmpNodo) {
        tmp.push(<li key={tmpNodo.valor}>{tmpNodo.valor}</li>)
        tmpNodo = tmpNodo.siguiente
    }

    return tmp
}

const nodo = (valor, siguiente, anterior) => {
    return {
        anterior,
        siguiente,
        valor
    }
}