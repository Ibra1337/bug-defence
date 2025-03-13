import { Movable, xDirection, yDirection } from "./movable.ts.ts";

export default class StraightProjectile  extends Movable{
    
    
    constructor( x:number , y :number ,  width:number ,  height: number , speed :number ,
                private dest :{x:number , y:number} ) {
        
                super(x,y,width,height,speed)
    }
    
    move(xDirection: xDirection, yDirection: yDirection): void {
        let distance = this.moveToPoint(this.dest);
        if(distance===0)
        {
            console.log("remember to implement projectile romval")
        }

    }



}