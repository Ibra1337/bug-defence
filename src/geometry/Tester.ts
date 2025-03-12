import {xDirection , yDirection , Movable} from "./Movable";


export class Tester extends Movable{


    move(xDirection :xDirection , yDirection : yDirection): void {
        this.x = this.x + xDirection * this.speed;
        this.y = this.y + yDirection * this.speed;
    }




}