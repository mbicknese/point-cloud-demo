/** @typedef {import("https://unpkg.com/three@0.164.1/build/three.module.js")} THREE */
import * as THREE from "three";

import { PCDLoader } from "https://unpkg.com/three@0.164.1/examples/jsm/loaders/PCDLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.1/examples/jsm/controls/OrbitControls.js";

export default () => ({
	camera: new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 40),
	loader: new PCDLoader(),
	renderer: new THREE.WebGLRenderer({ antialias: true, canvas: window.glcanvas, alpha: true }),
	scene: new THREE.Scene(),

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
		this.renderer.render(this.scene, this.camera);
	},

	/**
	 * @param {string} dataURI
	 */
	load(dataURI) {
		this.loader.load(dataURI, (points) => {
			this.scene.clear();
			this.scene.add(points);
			this.render();
		});
	},
});
