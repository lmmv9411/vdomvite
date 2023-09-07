import { Componente } from "../../vdom/Componente";

export class Tabla extends Componente {
    constructor(props) {
        super({ filas: [], ...props });
    }

    prepend(rows = []) {
        this.setState(s => ({ filas: [...rows, ...s.filas] }))
    }

    append(rows = []) {
        this.setState(s => ({ filas: [...s.filas, ...rows] }))
    }

    delete(key) {
        const filas = this.state.filas.filter(f => f.key !== key);
        this.setState({ filas })
    }

    update(row, index) {
        const filas = [... this.state.filas];
        filas.splice(index, 1, row);
        this.setState({ filas })
    }

    render(props) {
        return (
            <table {...props.pTabla}>
                <thead>
                    <tr>
                        {props.titulos?.map(t => <th>{t}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.filas}
                </tbody>
            </table>
        )
    }
}