export class CrearContexto {
    constructor() {

        this.children = {};

        /**
         *
         * @param {Object} props
         * @param {Array.<{type:string, children:Array.<Object>, props:Object}>} children
         */
        this.Provider = ({ children }) => {
            if (Object.keys(this.children).length > 0) {
                return;
            }
            buscarNodo.call(this, children);
        };
    }
}

function buscarNodo(children) {
    for (let ch of children) {
        const name = ch.state?.contextoNombre;
        if (name !== undefined) {
            this.children[name] = ch;
        }
        if (Array.isArray(ch.children) && ch.children.length > 0) {
            buscarNodo.call(this, ch.children);
        }
    }

}