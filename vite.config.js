// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    esbuild: {
        jsxFactory: 'k.h',
        jsxFragment: 'k.Fragment',
        jsxInject: `import {k} from "/assets/vdom/VDom.js"`
    },
    build: {
        outDir: "dist"
    }
})