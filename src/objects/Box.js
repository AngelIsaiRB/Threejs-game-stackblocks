import generateColor from "../helpers/generateColors";
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