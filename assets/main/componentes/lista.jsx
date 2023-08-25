import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { ContextoProveedor } from "./proveedores";

export class Lista extends Componente {
    constructor(props) {
        super({ ...props, values: [] });
        this.cp = ContextoProveedor.children;
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
        const { proveedores } = this.cp;
        const { values } = this.state;

        if (!this.map.has(item.v.toLowerCase())) {
            this.map.set(item.v.toLowerCase(), item);
            this.update({ values: [item, ...values] })
            proveedores.update({ error: null });
        } else {
            proveedores.update({ error: `¡Ya existe el item "${item.v}"!` })
        }

    }

    render(props) {

        return (
            <ul className="list-group list-group-flush p-3">
                {props.values.map(item => (
                    <Fragment key={item.v}>
                        <li className={item.c}>
                            <spam>{item.v}</spam>
                            <button
                                className="btn btn-warning"
                                onclick={() => this.cp.proveedores.agregar()}
                            >Saludar</button>
                        </li>
                    </Fragment>
                ))}
            </ul>
        )
    }
}