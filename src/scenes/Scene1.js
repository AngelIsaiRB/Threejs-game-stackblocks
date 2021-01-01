import { Scene, Color, DirectionalLight, HemisphereLight, Group, AxesHelper } from 'three';
import * as TWEEN from "@tweenjs/tween.js/dist/tween.amd"
import Box from '../objects/Box';
import BoxCreator from '../objects/BoxCreator';
import { Cube } from '../objects/Cube';
import SliceBox from '../objects/SlicesBox';
import Observer, { EVENTS } from '../Observer';
import UserInterface from '../objects/UserInterface';


class Scene1 extends Scene {
	constructor() {
		super();
		const userInterface = new UserInterface();
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

		
		
		

		//helpers

		// this.add(new AxesHelper(800));

		// luces
		const ambientLight = new HemisphereLight(0xffffbb, 0x080820, .5);
		const light = new DirectionalLight(0xffffff, 1.0);
		this.add(light, ambientLight);
	}

	events(){
		Observer.emit(EVENTS.NEW_GAME);
		Observer.on(EVENTS.CLICK,()=>{
			if(this.gameOver){
				Observer.emit(EVENTS.START);
			}
			else{
				this.getlastBox().place();
			}
			
		});

		Observer.on(EVENTS.START,()=>{
			this.resetGoup();
			Observer.emit(EVENTS.UPDATE_POINTS,this.stackPoints)
			this.newBox({
				width:200,
				height:200,
				last:this.baseCube,
			});
			this.gameOver=false;
		})

		Observer.on(EVENTS.STACK,(newBox)=>{
			this.stackPoints ++;
			Observer.emit(EVENTS.UPDATE_POINTS,this.stackPoints);
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
			if(!this.gameOver){
				this.stackPoints=0;
				const tween_gameover = new TWEEN.Tween(this.getlastBox().position)
				.to({y:this.getlastBox().position.y+300},1000)
				.easing(TWEEN.Easing.Bounce.Out);
				tween_gameover.start();
			}
			this.gameOver=true;
		});
		
		
	}

	newBox({width , height, last}){
		const actualBox = new Box({width, height,last});
		this.boxesGroup.add(actualBox);
	}

	resetGoup(){
		this.boxesGroup.children.map((box,i)=>{
			const tween_destroy= new TWEEN.Tween(box.scale)
			.to({
				x:0.5,
				y:0.5,
				z:0.5,
			},80*i)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onComplete(()=>{
				this.boxesGroup.remove(box);
			});
			tween_destroy.start();
		})
	}

	getlastBox(){		
		return this.boxesGroup.children[this.boxesGroup.children.length-1];		
	}

	update() {
		TWEEN.update();
		if(!this.gameOver){
			this.getlastBox().update();
		}
	}

}

export default Scene1;
