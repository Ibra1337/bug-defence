import {xDirection , yDirection , Movable} from "./movable.ts";


export class PathFollower extends Movable{

    
    private readonly path :{x:number , y:number}[]
    private destination =0;


    constructor( x:number ,  y :number ,  width:number ,  height: number , image :string,   speed :number , path :{x:number , y:number}[] ){
        super(x, y , width , height,image, speed)
        this.path = path;
    }


    move(): void {

        let target = this.path[this.destination];

        let distance = this.moveToPoint(target);
        if (distance < this.speed) {
            this.destination++;
        }
    }




}