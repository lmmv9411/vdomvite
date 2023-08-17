export class CrearContexto {
    constructor() {

        this.children = {};

        /**
         *
         * @param {Object} props
         * @param {Array.<{type:string, children:Array.<Object>, props:Object}>} children
         */
        this.Provider = (props, children) => {
            children.forEach(ch => {
                const name = ch.constructor.name;
                if (name !== "Object") {
                    this.children[name] = ch;
                }
            });
        };
    }
}