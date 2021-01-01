import { Scene, Color, DirectionalLight, HemisphereLight, Group, AxesHelper } from 'three';
import * as TWEEN from "@tweenjs/tween.js/dist/tween.amd"
import Box from '../objects/Box';
import BoxCreator from '../objects/BoxCreator';
import { Cube } from '../objects/Cube';
import SliceBox from '../objects/SlicesBox';
import Observer, { EVENTS } from '../Observer';


class Scene1 extends Scene {
	constructor() {
		super();
		this.background = new Color('skyblue').convertSRGBToLinear();
		this.stackPoints=0;
		this.gameOver= true;
		this.create();
		this.events();
	}

	create() {
		
		this.baseCube = new BoxCreator({
			width:200,
			height:200,
			alt:200,
			color: 0x2c3e50
		});
		this.add(this.baseCube);

		// grupo de cajas 

		this.boxesGroup = new Group();
		this.add(this.boxesGroup);

		this.newBox({
			width:200,
			height:200,
			last:this.baseCube
		});
		
		

		//helpers

		this.add(new AxesHelper(800));

		// luces
		const ambientLight = new HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	events(){
		Observer.on(EVENTS.CLICK,()=>{
			this.getlastBox().place();
			// this.newBox({
			// 	width:200,
			// 	height:200,
			// 	last:this.getlastBox()
			// })
		});

		Observer.on(EVENTS.STACK,(newBox)=>{
			this.stackPoints ++;
			// remover el bloque prinsiapl
			this.boxesGroup.remove(this.getlastBox());
			// espacio para cortar el bloque
			const actualBaseCut = new SliceBox(newBox);
			this.boxesGroup.add(actualBaseCut.getBase());
			this.add(actualBaseCut.getCut());

			// efecto desvanecimiento de espacio cortado
			const tweenCut = new TWEEN.Tween(actualBaseCut.getCut().position)
				.to({
					[newBox.axis]: actualBaseCut.getCut().position[newBox.axis] + (200 * newBox.direction)
				},500)
				.easing(TWEEN.Easing.Quadratic.Out); 
			tweenCut.start();
			
			actualBaseCut.getCut().material.transparent = true;
			const tweenCutAlpha = new TWEEN.Tween(actualBaseCut.getCut().material)
			.to({
				opacity:0
			},600)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onComplete(()=>{
				this.remove(actualBaseCut.getCut())
			});
			tweenCutAlpha.start();



			// new block
			this.newBox({
				width: newBox.base.width,
				height: newBox.base.height,
				last:this.getlastBox()
			});

		});
		Observer.on(EVENTS.GAME_OVER,()=>{
			console.log("game over")
		});
		
		
	}

	newBox({width , height, last}){
		const actualBox = new Box({width, height,last});
		this.boxesGroup.add(actualBox);
	}
	getlastBox(){		
		return this.boxesGroup.children[this.boxesGroup.children.length-1];
	}

	update() {
		this.getlastBox().update();
		TWEEN.update();
	}
}

export default Scene1;
