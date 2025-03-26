import { Movable } from "../../../geometry/movable.ts";
import IGameMediator from "../../igameMediator.ts";
import Mob from "../mobs/Mob.ts";

export default abstract class Projectile extends Movable {


    constructor(  x:number ,  y :number ,  width:number ,  height: number , image:string , public speed :number , public dmg :number, protected gameMediator :IGameMediator ){
        super(x,y,width,height,image, speed  );
        
    }

    protected moveToPoint(target: { x: number; y: number; }): number {
        const oldx = this.x;
        const oldy = this.y;
        let rad = Math.atan2(this.y - oldy, this.x - oldy); 
        
        super.rotate(rad * (180 / Math.PI))

        return super.moveToPoint(target)
    }


    abstract onCollision(mob: Mob  ) :void

    abstract onDestinationReached() :void
    
    abstract onRemove() :void


}