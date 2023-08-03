import { Componente } from "../../vdom/Componente";

export class Lista extends Componente {
    constructor(props) {
        super({ ...props, items: [] })
    }

    agregarItem(item) {
        const { items } = this.state;
        this.update({ items: [item, ...items] })
    }

    render(props) {

        return (
            <ul>
                {props.items?.map(item => <li key={item}>{item}</li>)}
            </ul>
        )
    }
}