import BoxCreator from "./BoxCreator";


class SliceBox {
    constructor(newBox) {
        this.base = new BoxCreator({
            width:newBox.base.width,
            height:newBox.base.height,
            color:newBox.color,

        });
        const moveBaseX = newBox.cut.width /2 * newBox.direction;
        const moveBaseZ = newBox.cut.height /2 * newBox.direction;

        this.base.position.set(
            (newBox.axis === "x") ? newBox.last_position.x - moveBaseX : newBox.last_position.x,
            newBox.last_position.y,
            (newBox.axis === "z") ? newBox.last_position.z - moveBaseZ : newBox.last_position.z, 
        )
        // el corte
        this.cut = new BoxCreator({
            width:newBox.cut.width,
            height:newBox.cut.height,
            color:newBox.color,
        });
        const movecutX = newBox.base.width /2 * newBox.direction;
        const movecutZ = newBox.base.height /2 * newBox.direction;

        this.cut.position.set(
            (newBox.axis === "x") ? newBox.last_position.x + movecutX : newBox.last_position.x,
            newBox.last_position.y,
            (newBox.axis === "z") ? newBox.last_position.z + movecutZ : newBox.last_position.z, 
        )
    }
    getBase(){
        return this.base;
    }
    getCut(){
        return this.cut;

    }
}

export default SliceBox;