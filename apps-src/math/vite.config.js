import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "node:fs";

const functionsRoute = () => ({name:'functions-route',closeBundle(){
  mkdirSync('dist/functions',{recursive:true});
  copyFileSync('dist/index.html','dist/functions/index.html');
}});

export default defineConfig({
  base: "/math/",
  plugins: [functionsRoute()]
});
