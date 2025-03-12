const enum xDirection {LEFT = -1 ,STAY =0 ,  RIGHT = 1}
const enum yDirection {UP = -1 ,STAY=0 , DOWN =1}

export abstract class Movable{


    private static lastId =0;

    public readonly id :number;
    constructor( public x:number , public y :number , public width:number , public height: number , public speed :number ){
        this.id = Movable.lastId ;
        Movable.lastId++;
    }


    abstract move( xDirection:xDirection , yDirection: yDirection) :void

}

export {xDirection , yDirection}