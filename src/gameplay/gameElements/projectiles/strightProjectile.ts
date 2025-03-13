
import { xDirection, yDirection } from "../../../geometry/movable.ts.ts";

import Projectile from "./projectile.ts";

export default class StraightProjectile  extends Projectile{
    
    
    constructor( x:number , y :number ,  width:number ,  height: number , image: string , speed :number ,
                private dest :{x:number , y:number} ) {
        
                super(x,y,width,height, image , speed)
    }
    
    move(xDirection: xDirection, yDirection: yDirection): void {
        let distance = this.moveToPoint(this.dest);
        if(distance===0)
        {
            console.log("remember to implement projectile romval")
        }

    }



}