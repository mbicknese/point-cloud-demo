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
	current: 0,
	controlPosition: { x: 0, y: 0 },

	init() {
		local.init();
		this.fileReader.addEventListener(
			"load",
			() => {
				local.load(this.fileReader.result);
			},
			false,
		);
		this.$watch("mutations", () => {
			this.current = this.mutations.length;
		});
	},

	add() {
		const id = crypto.randomUUID();
		this._add(id);
		this.mutations = [...this.mutations.slice(0, this.current), { action: "add", id: id }];

		local.render();
	},
	_add(id) {
		const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
		const material = new THREE.MeshBasicMaterial({ color: colorDefault, opacity: 0.5 });
		const cube = new THREE.Mesh(geometry, material);
		cube.uuid = id;
		local.addCube(id, cube);
	},
	remove() {
		if (!this.selected) return;

		this._remove(this.selected.uuid);
		this.selected = null;

		local.render();
	},
	_remove(id) {
		this.mutations = [...this.mutations.slice(0, this.current), , { action: "remove", id }];
		local.removeCube(id);
	},
	storeMutation() {
		if (!this.selected) return;

		this.controlPosition = { x: +this.selected.position.x, y: +this.selected.position.y };
		const { position, rotation, scale } = this.selected;
		this.mutations = [
			...this.mutations.slice(0, this.current),
			{
				action: "alter",
				id: this.selected.uuid,
				values: {
					position: position.clone(),
					rotation: rotation.clone(),
					scale: scale.clone(),
				},
			},
		];
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
			this.controlPosition = { x: this.selected.position.x, y: this.selected.position.y };
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

	undo() {
		this.current = Math.max(this.current - 1, 0);
		this.timeTravel();
	},
	redo() {
		this.current = Math.min(this.current + 1, this.mutations.length);
		this.timeTravel();
	},
	timeTravel() {
		local.clearCubes();
		this.mutations.slice(0, this.current).forEach((mutation) => {
			switch (mutation.action) {
				case "add":
					this._add(mutation.id);
					break;
				case "remove":
					this._remove(mutation.id);
					break;
				case "alter":
					const cube = local.cubes[mutation.id];
					cube.rotation.set(
						mutation.values.rotation.x,
						mutation.values.rotation.y,
						mutation.values.rotation.z,
					);
					cube.scale.set(mutation.values.scale.x, mutation.values.scale.y, mutation.values.scale.z);
					cube.position.set(
						mutation.values.position.x,
						mutation.values.position.y,
						mutation.values.position.z,
					);
					break;
			}
		});
		local.render();
	},
});
