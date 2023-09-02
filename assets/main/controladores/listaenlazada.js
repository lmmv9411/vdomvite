export default (() => {

    const nodo = function (valor, siguiente, anterior) {
        return {
            anterior,
            siguiente,
            valor
        }
    }

    return {
        eliminar: function (nodo) {

            let tmp = this.state.cabeza;

            while (tmp) {
                if (tmp.valor === nodo) {
                    this.size--;

                    //cola
                    if (tmp.siguiente === undefined && tmp.anterior !== undefined) {
                        tmp.anterior.siguiente = undefined;
                        this.setState({ cola: tmp.anterior })
                    } else if (tmp.siguiente !== undefined && tmp.anterior === undefined) {
                        //cabeza
                        tmp.siguiente.anterior = undefined;
                        this.setState({ cabeza: tmp.siguiente })
                    } else {
                        tmp.anterior.siguiente = tmp.siguiente;
                        tmp.siguiente.anterior = tmp.anterior;
                        this.setState({})
                    }

                    break;
                }

                tmp = tmp.siguiente;
            }
        },

        agregarCola: function () {

            this.size++;

            let { cabeza, cola, valor } = this.state;

            if (cola === null) {
                cola = nodo(valor)
                cabeza = cola;
                this.setState({ cabeza, cola, valor: "" })
            } else {
                const tmp = nodo(valor)
                tmp.anterior = cola
                cola.siguiente = tmp;
                this.setState({ cola: tmp, valor: "" })
            }

            this.txtValor.focus()
        },

        agregarEn: function () {

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
                        this.setState({ cola: tmpNodo })
                    } else if (tmp.anterior === undefined && tmp.siguiente !== undefined) {
                        //cabeza
                        const c = this.state.cabeza;
                        c.anterior = tmpNodo
                        tmpNodo.siguiente = c;
                        this.size++;
                        this.setState({ cabeza: tmpNodo })
                    } else {
                        tmpNodo.siguiente = tmp;
                        tmpNodo.anterior = tmp.anterior;
                        tmp.anterior.siguiente = tmpNodo
                        tmp.anterior = tmpNodo;
                        this.size++;
                        this.setState({})
                    }
                    this.setState({ valor: "" })
                    this.txtValor.focus()
                    break;
                } else {
                    tmp = tmp.siguiente;
                }
                idx++;
            }


        },

        agregarCabeza: function () {

            this.size++;

            let { cabeza, valor, cola } = this.state;

            if (cabeza === null) {
                cabeza = nodo(valor)
                cola = cabeza
                this.setState({ cabeza, cola, valor: "" })
            } else {
                let tmp = nodo(valor);
                tmp.siguiente = cabeza;
                cabeza.anterior = tmp;
                this.setState({ cabeza: tmp, valor: "" })
            }
            this.txtValor.focus()
        },
        nodo
    }
})();