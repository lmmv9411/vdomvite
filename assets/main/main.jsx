import { insertarElemento } from "../vdom/VDom"
import { App } from "./componentes/app";

insertarElemento(document.getElementById("app"), <App />)