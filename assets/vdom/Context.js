import { Contexto, Fragment } from "./VDom";

export class CreateContext {
    constructor() {
        this.children = {};

        this.Provider = ({ children }) => {
            return { type: Fragment, is: Contexto, children, props: null, padre: this }
        }
    }
}