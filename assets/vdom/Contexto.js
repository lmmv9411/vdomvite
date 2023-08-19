export class CrearContexto {
    constructor() {

        this.children = {};

        /**
         *
         * @param {Object} props
         * @param {Array.<{type:string, children:Array.<Object>, props:Object}>} children
         */
        this.Provider = (props, children) => {
            if (Object.keys(this.children).length > 0) {
                return;
            }
            children.forEach(ch => {
                const name = ch.state?.contextoNombre;
                if (name !== undefined) {
                    this.children[name] = ch;
                }
            });
        };
    }
}