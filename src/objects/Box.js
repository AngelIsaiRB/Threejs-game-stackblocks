import generateColor from "../helpers/generateColors";
import Observer, { EVENTS } from "../Observer";
import BoxCreator from "./BoxCreator";


class Box extends BoxCreator {
    constructor({width, height, last}){
        super({width, height, color: generateColor()});
        this.last=last;

        this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height/2;
        this.maxPosition = 360;
        this.isStoped = false;
        this.direction = 1;
        this.velocity = 4;
        this.actualAxis = (Math.random() >= 0.5)? "x":"z";
        this.contaryAxis = (this.actualAxis === "x")?"z":"x";

        this.position[this.actualAxis] -= this.maxPosition * this.direction;
        this.position[this.contaryAxis] = last.position[this.contaryAxis];

    }

    place(){
        const plane = (this.actualAxis === "x")?"width" : "height";
        const distanceCenter = this.position[this.actualAxis] - this.last.position[this.actualAxis];
        const overlay = this.last.dimension[plane] - Math.abs(distanceCenter);
        if(overlay > 0){
            const cut = this.last.dimension[plane] - overlay;
            const newBox={
                base:{
                    width: (plane ==="width")? overlay: this.dimension.width,
                    height: (plane ==="height")? overlay: this.dimension.height,
                },
                cut:{
                    width: (plane ==="width")? cut: this.dimension.width,
                    height: (plane ==="height")? cut: this.dimension.height,
                },
                color: this.color,
                axis:this.actualAxis,
                last_position: this.position,
                direction: distanceCenter / Math.abs(distanceCenter) | 1,
            }
            Observer.emit(EVENTS.STACK, newBox);
        }
        else{
            Observer.emit(EVENTS.GAME_OVER);
        }
    }

    update(){
        if(!this.isStoped){
            this.position[this.actualAxis] += this.direction  * this.velocity;
            if(Math.abs(this.position[this.actualAxis]) >= this.maxPosition ){
                this.direction *= -1;
            }
        }
    }
}

export default  Box;