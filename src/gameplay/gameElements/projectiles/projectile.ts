import { Movable } from "../../../geometry/movable.ts";
import IGameMediator from "../../igameMediator.ts";
import Mob from "../mobs/Mob.ts";

export default abstract class Projectile extends Movable {


    constructor(  x:number ,  y :number ,  width:number ,  height: number , image:string , public speed :number , public dmg :number, protected gameMediator :IGameMediator ){
        super(x,y,width,height,image, speed  );
        
    }


    abstract onCollision(mob: Mob  ) :void

    abstract onDestinationReached() :void
    
    abstract onRemove() :void


}