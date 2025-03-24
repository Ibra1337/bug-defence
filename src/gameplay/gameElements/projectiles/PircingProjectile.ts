
import { xDirection, yDirection } from "../../../geometry/movable.ts";
import IGameMediator from "../../igameMediator.ts";
import Mob from "../mobs/Mob.ts";

import Projectile from "./projectile.ts";

export default class PircingProjectile  extends Projectile{
    
    private pirced = new Set<number>();

    constructor( x:number , y :number ,  width:number ,  height: number , image: string , speed :number ,
                dmg :number , gameMediator: IGameMediator , private dest :{x:number , y:number} , private targetCapacity : number | null) {
        
                super(x,y,width,height, image , speed,dmg, gameMediator)
                console.log("pirce")
    }
    
    move(): void {
        let distance = this.moveToPoint(this.dest);

        if(distance <=this.speed+1)
        {
            console.log("remove on distance")
            this.onDestinationReached()
        }
    }
    //TODO: implement targeting strategies
    onCollision(mob: Mob): void {
        
        if(this.targetCapacity === null && !this.pirced.has(mob.id)){
            const rem = mob.subtractHp(this.dmg) 
            if (rem < 1){
                this.gameMediator.notify("projectile" , "remove-mob" , mob.id)
            }else{
                this.pirced.add(mob.id)
            }
        }else if (this.targetCapacity! <= this.pirced.size && !this.pirced.has(mob.id)) {
            console.log("DMG?")
            const rem = mob.subtractHp(this.dmg) 
            if (rem < 1){
                this.gameMediator.notify("projectile" , "remove-mob" , mob.id)
            }else{
                this.pirced.add(mob.id)
            }
        }else if (this.targetCapacity! >= this.pirced.size)
            this.onRemove()
    }
    
    onRemove(): void {
        console.log("?????: " , this.id);
        console.log("<>: ", this.gameMediator)
        this.gameMediator.notify("projectile" , "remove-projectile" , this.id)
    }
    onDestinationReached(): void {
        this.onRemove()
    }



}