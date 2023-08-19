import { Componente } from "../../vdom/Componente";
import { ContextoProveedor as CP } from "../contextos/proveedores";

export class Lista extends Componente {
    constructor(props) {
        super({ ...props, values: [] });
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
        ];

        this.map = new Map();
    }

    cambiarColor() {

        this.map.forEach((v, k) => {
            this.map.set(k, this.color.call(this, v));
        });

        this.update({ values: Array.from(this.map.values()) })
    }

    color(item) {
        const i = Math.floor((Math.random() * this.items?.length));

        const color = this.items[i];

        if (typeof item === "object") {
            item.c = color;
            return item;
        }

        return { v: item, c: color }
    }

    agregarItem(item) {

        item = this.color(item);
        const { proveedores } = CP.children;

        if (!this.map.has(item.v.toLowerCase())) {
            this.map.set(item.v.toLowerCase(), item);
            this.update({ values: Array.from(this.map.values()) })
            proveedores.update({ error: null });
        } else {
            proveedores.update({ error: `¡Ya existe el item "${item.v}"!` })
        }

    }

    render(props) {

        return (
            <ul class="list-group list-group-flush p-3">
                {props.values.map(item => {
                    return (
                        <li key={item.v} class={item.c}>
                            <spam>{item.v}</spam>
                            <button class="btn btn-warning" onclick={() => {
                                CP.children.proveedores.agregar();
                            }}>Saludar</button>
                        </li>
                    )
                })}
            </ul>
        )
    }
}