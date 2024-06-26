/** @typedef {import("https://unpkg.com/three@0.164.1/build/three.module.js")} THREE */
import * as THREE from "three";

import { PCDLoader } from "https://unpkg.com/three@0.164.1/examples/jsm/loaders/PCDLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.1/examples/jsm/controls/OrbitControls.js";

export default () => ({
	camera: new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 40),
	loader: new PCDLoader(),
	renderer: new THREE.WebGLRenderer({ antialias: true, canvas: window.glcanvas, alpha: true }),
	scene: new THREE.Scene(),
	raycaster: new THREE.Raycaster(),
	points: null,
	cubes: {},

	init() {
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.camera.position.set(0, 0, 1);
		this.scene.add(this.camera);

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		const controls = new OrbitControls(this.camera, this.renderer.domElement);
		controls.addEventListener("change", this.render.bind(this));
		controls.minDistance = 0.5;
		controls.maxDistance = 10;
		this.render();
	},

	render() {
		this.scene.clear();
		this.scene.add(new THREE.AxesHelper(0.1));
		if (this.points != null) this.scene.add(this.points);
		Object.values(this.cubes).forEach((c) => {
			this.scene.add(c);
		});
		this.renderer.render(this.scene, this.camera);
	},

	/**
	 * @param {string} dataURI
	 */
	load(dataURI) {
		this.loader.load(dataURI, (points) => {
			this.points = points;
			this.render();
		});
	},

	addCube(id, cube) {
		this.cubes[id] = cube;
	},
	removeCube(id) {
		this.cubes = Object.fromEntries(Object.entries(this.cubes).filter(([current]) => current !== id));
	},
	clearCubes() {
		this.cubes = {};
	},

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {THREE.Object3D|undefined} - first found object or undefined
	 */
	findAt(x, y) {
		const direction = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
		this.raycaster.setFromCamera(direction, this.camera);

		const intersects = this.raycaster.intersectObjects(this.scene.children.filter(({ type }) => type === "Mesh"));
		return intersects[0]?.object;
	},
});
