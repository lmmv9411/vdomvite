import { insertarElemento } from "../vdom/VDom"
import { App } from "./componentes/app";

const app = document.getElementById("app")

insertarElemento(app, <App />)