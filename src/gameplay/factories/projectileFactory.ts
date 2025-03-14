import Projectile from "../gameElements/projectiles/projectile";
import StraightProjectile from "../gameElements/projectiles/strightProjectile";

export default class ProjectileFactory{

    constructor(){
        console.log("factory created")
    }

    public createProjectile(x :number , y :number) :Projectile {
        return new StraightProjectile(x,y, 40,20,"red",10, {x:0 , y:0})
    }

    
} 