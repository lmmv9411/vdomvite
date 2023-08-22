import { Componente } from "../../vdom/Componente";
import { CrearContexto } from "../../vdom/Contexto";
import { Fragment } from "../../vdom/VDom";
import { cListaEnlazada } from "../controladores/listaenlazada";
import { Contenedor } from "./modales/contenedor";
import { ModalClientes } from "./modales/modalClientes";

export const ctx = new CrearContexto();

export class ListaEnlazada extends Componente {

    constructor() {
        super({ cabeza: null, valor: "", cola: null, pos: 0, mostrar: false })
        this.size = 0;
        this.c = ctx.children;
    }

    render(props) {

        !this.ctrl && (this.ctrl = cListaEnlazada(this));

        return (
            <ctx.Provider>
                <header className="p-3">
                    <h1>{`Cabeza: ${props.cabeza?.valor ?? ""}`}</h1>
                    <h1>{`Cola: ${props.cola?.valor ?? ""}`}</h1>
                    <h2>{`Tamaño: ${this.size ?? 0}`}</h2>
                </header>

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

                    <button
                        className="btn btn-primary"
                        type="button"
                        onclick={() => this.c.modalClientes.abrir()}>
                        Mostrar
                    </button>

                </section>

                <article className="p-3">
                    <ol className="list-group">
                        {this.leerCabeza(props.cabeza)}
                    </ol>
                </article>

                {
                    this.c?.contenedor
                    ??
                    <Contenedor contextoNombre="contenedor">
                        <ModalClientes contextoNombre="modalClientes" />
                    </Contenedor>
                }
            </ctx.Provider>
        )
    }

    leerCabeza(nodo) {
        const tmp = []
        let tmpNodo = nodo;

        while (tmpNodo) {
            const nodo = tmpNodo;
            const li =
                <li
                    className="list-group-item bg-dark text-light"
                    key={tmpNodo.valor}>
                    <span className="me-2">{tmpNodo.valor}</span>
                    <button
                        className="btn btn-danger"
                        type="button"
                        onclick={() => this.ctrl.eliminar(nodo.valor)}
                    >Eliminar
                    </button>
                </li>;

            tmp.push(li);
            tmpNodo = tmpNodo.siguiente
        }

        return tmp
    }
}