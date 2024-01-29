import { k } from "./VDom";

export class Contexto {
    constructor() {
        this.Provider = ({ children, ...props }) => {
            return { type: k.Fragment, is: k.Contexto, children, props, padre: this }
        }
    }
}