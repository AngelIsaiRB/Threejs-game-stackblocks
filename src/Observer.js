import EventEmitter from "eventemitter3";

export const EVENTS = {
    START: 'START',
    CLICK : "CLICK",
    GAME_OVER: "GAME_OVER",
    STACK: "STACK",
}

const Observer = new EventEmitter();
export default Observer;
