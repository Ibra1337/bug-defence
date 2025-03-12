import {xDirection , yDirection , Movable} from "./Movable";


export class Tester extends Movable{

    
    private readonly path :{x:number , y:number}[]
    private destination =0;
    constructor( x:number ,  y :number ,  width:number ,  height: number ,  speed :number , path :{x:number , y:number}[] ){
        super(x, y , width , height, speed)
        this.path = path;
    }


    move(xDirection :xDirection , yDirection : yDirection): void {

        let target = this.path[this.destination]

        let direction = {
            x: target.x - this.x ,
            y: target.y - this.y
        };

        let distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);

        if (distance > 0) {
            direction.x /= distance;  
            direction.y /= distance;
        }

        this.x += direction.x * this.speed;
        this.y += direction.y * this.speed;
        
        if (distance < this.speed) {
            this.destination++;
        }
    }




}