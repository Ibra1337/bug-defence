import Sprite from "../../../GUI/Sprite";
import ProjectileFactory from "../../factories/projectileFactory";
import GameState from "../../GameState";
import SpatialHash from "../../SpatialHash";
import Projectile from "../projectiles/projectile";

export default abstract  class Tower extends Sprite{
    
    private lastShootTimer = 0;

    constructor(  x :number,  y :number, 
          width :number ,  height :number ,
          image:string , 
         public range :number ,   protected cooldown :number,
         protected projectileFactory :ProjectileFactory ){
            super(x,y,width,height,image)
         }

    
    //todo add stategy patern to choose target

    abstract  shoot(gameTimer :number , targets :Array<[number, number]> , gameState :GameState):Projectile|null
    
    isRedy(currentTime :number): boolean{
        return  this.lastShootTimer +this.cooldown < currentTime
    }
        
    getLastSootTimer() :number{
        return this.lastShootTimer;
    }
    setLastShootTimer(gameTimer: number) {
        this.lastShootTimer = gameTimer;
    }
}