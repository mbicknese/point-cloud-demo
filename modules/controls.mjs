import renderer from "./renderer.mjs";

// Workaround as putting the renderer in the AlpineJS store fights Three.js internals
const local = renderer();

export default () => ({
	fileReader: new FileReader(),
	mutations: [],

	init() {
		local.init();
		this.fileReader.addEventListener(
			"load",
			() => {
				local.load(this.fileReader.result);
			},
			false,
		);
	},

	add() {
		this.mutations = [...this.mutations, { action: "add" }];
	},
	/**
	 * @param {Event} event
	 */
	handleLoad(event) {
		if (event.target.files[0]) {
			this.fileReader.readAsDataURL(event.target.files[0]);
			event.target.value = null;
		}
	},
});
