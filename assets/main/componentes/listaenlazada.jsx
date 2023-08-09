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
                <header className="p-3">
                    <h1>Cabeza: {props.cabeza?.valor}</h1>
                    <h1>Cola: {props.cola?.valor}</h1>
                    <h2>Tamaño: {this.size ?? 0}</h2>
                    <section className="d-flex gap-3 align-items-end flex-wrap">

                        <input
                            className="form-control text-light bg-dark"
                            type="text"
                            id="txtValor"
                            $ref="txtValor"
                            placeholder="Valor"
                            value={props.valor}
                            onchange={e => this.update({ valor: e.target.value })}
                        />

                        <button
                            className="btn btn-primary"
                            type="button"
                            onclick={() => {

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

                        <button
                            className="btn btn-primary"
                            type="button"
                            onclick={() => {

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
                            className="form-control text-light bg-dark"
                            type="number"
                            placeholder="posición"
                            value={props.pos}
                            min={1}
                            max={this.size ?? 0}
                            onchange={(e) => this.update({ pos: Number(e.target.value) })}
                        />

                        <button
                            className="btn btn-primary"
                            type="button"
                            onclick={() => {

                                let tmp = this.state.cabeza;
                                let idx = 0;
                                const pos = this.state.pos === 0 ? 0 : this.state.pos - 1;

                                while (tmp) {
                                    if (idx === pos) {
                                        const tmpNodo = nodo(this.state.valor);
                                        //cola
                                        if (tmp.siguiente === undefined && tmp.anterior !== undefined) {
                                            const c = this.state.cola;
                                            c.siguiente = tmpNodo
                                            tmpNodo.anterior = c;
                                            this.size++;
                                            this.update({ cola: tmpNodo })
                                        } else if (tmp.anterior === undefined && tmp.siguiente !== undefined) {
                                            //cabeza
                                            const c = this.state.cabeza;
                                            c.anterior = tmpNodo
                                            tmpNodo.siguiente = c;
                                            this.size++;
                                            this.update({ cabeza: tmpNodo })
                                        } else {
                                            tmpNodo.siguiente = tmp;
                                            tmpNodo.anterior = tmp.anterior;
                                            tmp.anterior.siguiente = tmpNodo
                                            tmp.anterior = tmpNodo;
                                            this.size++;
                                            this.update({})
                                        }
                                        this.update({ valor: "" })
                                        this.txtValor.focus()
                                        break;
                                    } else {
                                        tmp = tmp.siguiente;
                                    }
                                    idx++;
                                }

                            }}>Agregar en</button>

                    </section>
                </header>
                <article className="p-3">
                    <ol className="list-group">
                        {leerCabeza(props.cabeza)}
                    </ol>
                </article>
            </>
        )
    }
}

function leerCabeza(nodo) {
    const tmp = []
    let tmpNodo = nodo;

    while (tmpNodo) {
        tmp.push(<li className="list-group-item bg-dark text-light" key={tmpNodo.valor}>{tmpNodo.valor}</li>)
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