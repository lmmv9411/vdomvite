import { Componente } from "../../vdom/Componente";
import { Boton } from "./utils/boton";
import { Tabla } from "./tabla";

export class Test extends Componente {
    constructor(props) {
        super({
            btnShowStyles: "btn-primary",
            showII: false,
            showIII: false,
            showIV: false,
            txt: '',
            btnShow: 'Show',
            btnShowIIStyles: 'btn-success',
            nameShowII: 'Show II',
            nameShowIII: 'Show III',
            filas: [],
            show: false, ...props
        })
    }

    render(props) {
        return (
            <>
                {
                    props.showII &&
                    <>
                        {
                            props.showIV
                            &&
                            <>
                                <h1>Hola 3000</h1>
                            </>
                        }
                        <div>Div Variable I</div>
                        <div>Div Variable II</div>
                        <Boton
                            name="Saludar"
                            bg="bg-success"
                            onClick={() => this.setState(s => ({ showIV: !s.showIV }))}
                        />
                    </>
                }

                <article className="d-flex gap-1" style={{ border: "1px solid white", padding: "1rem", borderRadius: "5px" }}>

                    <header>
                        <h1>Título Fijo</h1>
                    </header>

                    <Boton
                        bg={props.btnShowStyles}
                        onClick={this.handleBtnShow.bind(this)}
                        name={props.btnShow}
                    />

                    <Boton
                        name={props.nameShowII}
                        bg={props.btnShowIIStyles}
                        onClick={() => {
                            this.setState((s) => {
                                const name = s.showII ? 'Show II' : 'Hidden II';
                                const bg = s.showII ? 'bg-success' : 'bg-danger';
                                return { showII: !s.showII, nameShowII: name, btnShowIIStyles: bg }
                            });
                        }}
                    />
                </article>

                <article style={{ border: "1px solid white", padding: "1rem", borderRadius: "5px" }}>

                    <section>
                        <h2>H2 Section Fija</h2>
                        <p>Párrafo Section Fijo</p>
                    </section>

                    {
                        props.show &&
                        <>
                            <h3>H3 variable</h3>

                            <input
                                placeholder="Variable"
                                autoComplete="off"
                                $ref='txt'
                                name="txt"
                                className="entrada ajustar-ancho"
                                type="text" value={props.txt}
                                onChange={e => this.setState({ txt: e.target.value })}
                            />

                            <Boton
                                bg="bg-primary"
                                name="Agregar"
                                onClick={this.handleBtnAgregar.bind(this)}
                            />

                            <Boton
                                name={props.nameShowIII}
                                bg="bg-primary"
                                onClick={() => this.setState(s => {
                                    return {
                                        showIII: !s.showIII,
                                        nameShowIII: !s.showIII ? 'Hidden III' : 'Show III'
                                    }
                                })}
                            />

                            <Tabla titulos={["Id", "Name", "Acciones"]} filas={props.filas} />


                            {
                                props.showIII &&
                                <>
                                    <header>
                                        <h1>Somos Una Nación</h1>
                                    </header>
                                    <article>
                                        <p>La nación de sion</p>
                                    </article>
                                </>
                            }
                        </>

                    }

                    <div style={{ border: "1px solid white", padding: "1rem", borderRadius: "5px" }}>
                        <p>Marcos Fijo después de 'ShowIII' 'Somos Una Nación'</p>
                        <p>David Fijo</p>
                    </div>

                </article>
            </>
        )
    }

    handleBtnShow() {
        this.setState(s => {
            return {
                show: !s.show,
                btnShow: !s.show ? 'Hidden' : 'Show',
                btnShowStyles: !s.show ? "bg-success" : "bg-primary"
            }
        });
    }

    handleBtnAgregar() {
        if (this.state.txt.trim() !== '') {
            this.setState(s => {
                return {
                    txt: '',
                    filas: [
                        ...s.filas,
                        <tr key={s.filas.length + 1}>
                            <td>{s.filas.length + 1}</td>
                            <td>{s.txt}</td>
                            <td>
                                <button
                                    type="button"
                                    className="boton bg-success ajustar-ancho d-flex"
                                    onClick={this.handleBtnAgregar.bind(this)}
                                >
                                    <span class="material-icons-outlined">
                                        done
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ]
                }
            });
        }
        this.txt.focus();
    }

}