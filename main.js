import controls from "./modules/controls.mjs";

document.addEventListener("alpine:init", () => {
	Alpine.data("controls", controls);
});
