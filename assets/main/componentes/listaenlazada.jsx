import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { cListaEnlazada } from "../controladores/listaenlazada";

export class ListaEnlazada extends Componente {

    constructor() {
        super({ cabeza: null, valor: "", cola: null, pos: 0 })
        this.size = 0;
    }

    preRender() {
        if (!this.ctrl) {
            this.ctrl = cListaEnlazada(this);
        }
    }

    render(props) {

        this.preRender();

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
                            onclick={this.ctrl.agregarCola}>
                            Agregar Cola
                        </button>

                        <button
                            className="btn btn-primary"
                            type="button"
                            onclick={this.ctrl.agregarCabeza}>
                            Agregar Cabeza
                        </button>

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
                            onclick={this.ctrl.agregarEn}>
                            Agregar en
                        </button>

                    </section>
                </header>
                <article className="p-3">
                    <ol className="list-group">
                        {this.leerCabeza(props.cabeza)}
                    </ol>
                </article>
            </>
        )
    }

    leerCabeza(nodo) {
        const tmp = []
        let tmpNodo = nodo;

        while (tmpNodo) {
            tmp.push(<li className="list-group-item bg-dark text-light" key={tmpNodo.valor}>{tmpNodo.valor}</li>)
            tmpNodo = tmpNodo.siguiente
        }

        return tmp
    }
}