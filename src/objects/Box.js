import generateColor from "../helpers/generateColors";
import BoxCreator from "./BoxCreator";


class Box extends BoxCreator {
    constructor({width, height, last}){
        super({width, height, color: generateColor()});
        this.last=last;

        this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height/2;

    }
    update(){

    }
}

export default  Box;