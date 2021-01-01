import {WebGLRenderer, sRGBEncoding, OrthographicCamera } from 'three';
import * as TWEEN from "@tweenjs/tween.js/dist/tween.amd";

import Scene1 from './scenes/Scene1';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Observer, { EVENTS } from './Observer';

export class App {
	constructor(container) {
		this.container = container;

		this.cameraPanUp=40;
		this.camera_y = 300;


		this.scene = new Scene1();

		// ## Camera's config
		this.camera = new OrthographicCamera(
			this.container.clientWidth/-2,
			this.container.clientWidth/2,
			this.container.clientHeight/2,
			this.container.clientHeight/-2,
			-10000,
			10000
		)
		this.camera.position.set(10, 10+this.camera_y, 10);
		this.camera.lookAt(0, this.camera_y, 0);

		// this.control = new OrbitControls(this.camera, this.container);
		// ## Renderer's config
		this.renderer = new WebGLRenderer({
			antialias: true,
		})
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// sRGBEncoding
		this.renderer.outputEncoding = sRGBEncoding;

		// ## Light's config
		this.renderer.physicallyCorrectLights = true;

		this.container.appendChild(this.renderer.domElement);
		this.onResize();
		this.render();
		this.events();
	}

	events(){
		Observer.on(EVENTS.STACK,()=>{
			this.camera_y += this.cameraPanUp;

			const camera_up = new TWEEN.Tween(this.camera.position)
			.to({
				y:10+this.camera_y
			},500)
			.easing(TWEEN.Easing.Sinusoidal.In);		
			camera_up.start();	
		});
	}	

	onResize() {
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.camera.left =this.container.clientWidth/-2;
		this.camera.right =this.container.clientWidth/2;
		this.camera.top =this.container.clientHeight/2;
		this.camera.bottom =this.container.clientHeight/-2;
		this.camera.updateProjectionMatrix();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	
		// Updates here
		this.scene.update();

		this.renderer.setAnimationLoop(() => this.render());
	}
}
