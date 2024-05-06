import points from "./modules/points.mjs";

document.addEventListener("alpine:init", () => {
	Alpine.data("points", points);
});

/** @type WebGL2RenderingContext */
const gl = window.glcanvas.getContext("webgl");
function render(mutations) {
	console.debug("mutations: %o", mutations.length);
}
window.render = render;
