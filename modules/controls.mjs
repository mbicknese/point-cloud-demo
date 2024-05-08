import renderer from "./renderer.mjs";
import * as THREE from "three";

// Workaround as putting the renderer in the AlpineJS store fights Three.js internals
const local = renderer();

const colorDefault = 0xced4da;
const colorSelected = 0x40c057;

export default () => ({
	fileReader: new FileReader(),
	mutations: [],
	selected: null,

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

		const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		const material = new THREE.MeshBasicMaterial({ color: colorDefault, opacity: 0.5 });
		const cube = new THREE.Mesh(geometry, material);
		local.addCube(cube);
		local.render();
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
	/**
	 * @param {MouseEvent} event
	 */
	setActive(event) {
		this.selected?.material?.color.set(colorDefault);
		this.selected = local.findAt(event.clientX, event.clientY);
		if (this.selected) {
			this.selected.material.color.set(colorSelected);
		}
		local.render();
	},

	translate() {
		this.selected.position.needsUpdate = true;
		local.render();
	},

	rotate() {
		this.selected.rotation.needsUpdate = true;
		local.render();
	},

	scale() {
		this.selected.scale.needsUpdate = true;
		local.render();
	},
});
