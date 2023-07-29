import { insertarElemento, h } from "../vdom/VDom"
import { App } from "./componentes/app";

window.h = h;

const app = document.getElementById("app")

insertarElemento(app, <App />)