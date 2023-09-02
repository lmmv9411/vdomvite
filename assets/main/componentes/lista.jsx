import { Componente } from "../../vdom/Componente";
import { Fragment } from "../../vdom/VDom";
import { ContextoProveedor } from "./proveedores";

export class Lista extends Componente {
    constructor(props) {
        super({ ...props, values: [] });
        this.cp = ContextoProveedor.children;
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

        const valores = this.state.values.map(v => this.color(v));

        this.setState({ values: valores })
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
            this.setState({ values: [item, ...values] })
            proveedores.setState({ error: null });
        } else {
            proveedores.setState({ error: `¡Ya existe el item "${item.v}"!` })
        }

    }

    eliminar(key) {

        if (this.map.has(key.toLowerCase())) {
            const valores = this.state.values.filter(item => item.v !== key);
            this.setState({ values: valores });
            this.map.delete(key.toLowerCase());
        }

    }

    editar(key) {

        const { proveedores } = this.cp;

        if (this.map.has(key.toLowerCase())) {

            const newValue = proveedores.state.nombre;

            if (!newValue) {
                proveedores.setState({ error: `¡Valor vacío!` })
                return;
            } else if (this.map.has(newValue.toLowerCase())) {
                proveedores.setState({ error: `¡El valor "${newValue}" ya existe!` })
                return;
            }

            const newItems = this.state.values.map(item => {
                if (item.v === key) {
                    item.v = newValue;
                }
                return item
            });

            this.setState({ values: newItems });
            this.map.delete(key.toLowerCase());
            this.map.set(newValue.toLowerCase(), newValue);
            proveedores.setState({ error: null, nombre: "" });
            proveedores.nombre.focus();
        }
    }

    render(props) {

        return (

            <ul className="list-group list-group-flush p-3">

                {props.values.map(item => (

                    <Fragment key={item.v}>

                        <li className={item.c}>

                            <span className="me-1">{item.v}</span>

                            <button
                                className="btn btn-warning me-1"
                                onclick={() => this.cp.proveedores.agregar()}>
                                Saludar
                            </button>

                            <button
                                className="btn btn-danger me-1"
                                onclick={() => this.eliminar(item.v)}>
                                Eliminar
                            </button>

                            <button
                                className="btn btn-primary"
                                onclick={() => this.editar(item.v)}>
                                Editar
                            </button>

                        </li>

                    </Fragment>
                ))}
            </ul>
        )
    }
}