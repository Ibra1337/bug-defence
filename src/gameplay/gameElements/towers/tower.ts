import Sprite from "../../../GUI/sprite";
import ProjectileFactory from "../../factories/projectileFactory";
import Projectile from "../projectiles/projectile";

export default abstract  class Tower extends Sprite{
    
    constructor(  x :number,  y :number, 
          width :number ,  height :number ,
          image:string , 
         public range :number ,   public damage :number,
         protected projectileFactory :ProjectileFactory ){
            super(x,y,width,height,image)
         }


    abstract  shoot():Projectile|null
    
        

}