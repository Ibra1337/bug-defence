
import { xDirection, yDirection } from "../../../geometry/movable.ts";
import IGameMediator from "../../igameMediator.ts";
import Mob from "../mobs/Mob.ts";

import Projectile from "./projectile.ts";

export default class StraightProjectile  extends Projectile{
    
    
    constructor( x:number , y :number ,  width:number ,  height: number , image: string , speed :number ,
                dmg :number , gameMediator: IGameMediator , private dest :{x:number , y:number} ) {
        
                super(x,y,width,height, image , speed,dmg, gameMediator)
    }
    
    move(): void {
        let distance = this.moveToPoint(this.dest);
        if(distance===0)
        {
            this.onDestinationReached()
        }
    }

    onCollision(mob: Mob): void {
        const rem = mob.subtractHp(this.dmg) 
        console.log(rem)
        if (rem < 1){
            this.gameMediator.notify("projectile" , "remove-mob" , mob.id)
        }
        this.onRemove();

    }
    
    onRemove(): void {
        this.gameMediator.notify("projectile" , "remove-projectile" , this.id)
    }
    onDestinationReached(): void {
        this.onRemove()
    }



}