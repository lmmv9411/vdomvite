import { Componente } from "../../vdom/Componente";
import { Contextos } from "../../vdom/Contexto";

export class Lista extends Componente {
    constructor(props) {
        super({ ...props, items: [] })
    }

    montado() {
        this.items = [
            "list-group-item list-group-item-primary",
            "list-group-item list-group-item-secondary",
            "list-group-item list-group-item-success",
            "list-group-item list-group-item-danger",
            "list-group-item list-group-item-warning",
            "list-group-item list-group-item-info",
            "list-group-item list-group-item-light",
            "list-group-item list-group-item-dark"
        ]
    }

    agregarItem(item) {

        const i = Math.floor((Math.random() * this.items?.length));

        const color = this.items[i];

        item = { v: item, c: color }

        const { items } = this.state;

        this.update({ items: [item, ...items] })
    }

    render(props) {

        return (
            <ul class="list-group list-group-flush p-3">
                {props.items?.map(item => {
                    return (
                        <li key={item.v} class={item.c}>
                            <spam>{item.v}</spam>
                            <button class="btn btn-warning" onclick={() => {
                                Contextos.actions.agregar()
                            }}>Saludar</button>
                        </li>
                    )
                })}
            </ul>
        )
    }
}