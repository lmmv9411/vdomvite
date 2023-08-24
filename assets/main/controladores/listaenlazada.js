export function cListaEnlazada(view) {

    const eliminar = (nodo) => {

        let tmp = view.state.cabeza;

        while (tmp) {
            if (tmp.valor === nodo) {
                view.size--;

                //cola
                if (tmp.siguiente === undefined && tmp.anterior !== undefined) {
                    tmp.anterior.siguiente = undefined;
                    view.update({ cola: tmp.anterior })
                } else if (tmp.siguiente !== undefined && tmp.anterior === undefined) {
                    //cabeza
                    tmp.siguiente.anterior = undefined;
                    view.update({ cabeza: tmp.siguiente })
                } else {
                    tmp.anterior.siguiente = tmp.siguiente;
                    tmp.siguiente.anterior = tmp.anterior;
                    view.update({})
                }

                break;
            }

            tmp = tmp.siguiente;
        }
    }

    const agregarCola = (e) => {
        e.preventDefault();
        view.size++;

        let { cabeza, cola, valor } = view.state;

        if (cola === null) {
            cola = nodo(valor)
            cabeza = cola;
            view.update({ cabeza, cola, valor: "" })
        } else {
            const tmp = nodo(valor)
            tmp.anterior = cola
            cola.siguiente = tmp;
            view.update({ cola: tmp, valor: "" })
        }

        view.txtValor.focus()
    }

    const agregarEn = () => {

        let tmp = view.state.cabeza;
        let idx = 0;
        const pos = view.state.pos === 0 ? 0 : view.state.pos - 1;

        while (tmp) {
            if (idx === pos) {
                const tmpNodo = nodo(view.state.valor);
                //cola
                if (tmp.siguiente === undefined && tmp.anterior !== undefined) {
                    const c = view.state.cola;
                    c.siguiente = tmpNodo
                    tmpNodo.anterior = c;
                    view.size++;
                    view.update({ cola: tmpNodo })
                } else if (tmp.anterior === undefined && tmp.siguiente !== undefined) {
                    //cabeza
                    const c = view.state.cabeza;
                    c.anterior = tmpNodo
                    tmpNodo.siguiente = c;
                    view.size++;
                    view.update({ cabeza: tmpNodo })
                } else {
                    tmpNodo.siguiente = tmp;
                    tmpNodo.anterior = tmp.anterior;
                    tmp.anterior.siguiente = tmpNodo
                    tmp.anterior = tmpNodo;
                    view.size++;
                    view.update({})
                }
                view.update({ valor: "" })
                view.txtValor.focus()
                break;
            } else {
                tmp = tmp.siguiente;
            }
            idx++;
        }


    }

    const agregarCabeza = () => {

        view.size++;

        let { cabeza, valor, cola } = view.state;

        if (cabeza === null) {
            cabeza = nodo(valor)
            cola = cabeza
            view.update({ cabeza, cola, valor: "" })
        } else {
            let tmp = nodo(valor);
            tmp.siguiente = cabeza;
            cabeza.anterior = tmp;
            view.update({ cabeza: tmp, valor: "" })
        }
        view.txtValor.focus()
    }

    const nodo = (valor, siguiente, anterior) => {
        return {
            anterior,
            siguiente,
            valor
        }
    }

    return { agregarCabeza, agregarCola, agregarEn, nodo, eliminar }
}
