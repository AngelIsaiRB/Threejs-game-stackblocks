import { Scene, Color, DirectionalLight, HemisphereLight } from 'three';
import BoxCreator from '../objects/BoxCreator';
import { Cube } from '../objects/Cube';

class Scene1 extends Scene {
	constructor() {
		super();
		this.background = new Color('skyblue').convertSRGBToLinear();
		this.create();
	}

	create() {
		
		this.baseCube = new BoxCreator({
			width:200,
			height:200,
			alt:200,
			color: 0x2c3e50
		});
		this.add(this.baseCube);

		// luces
		const ambientLight = new HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	update() {

	}
}

export default Scene1;
