import Sprite from "../../../GUI/sprite";
import ProjectileFactory from "../../factories/projectileFactory";
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


    abstract  shoot(gameTimer :number , targets :Array<[number, number]>):Projectile|null
    
    isRedy(currentTime :number): boolean{
        return currentTime - this.lastShootTimer > 0
    }
        
    getLastSootTimer() :number{
        return this.lastShootTimer;
    }
    setLastShootTimer(gameTimer: number) {
        this.lastShootTimer = gameTimer;
    }
}