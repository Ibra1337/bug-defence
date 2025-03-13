import Projectile from "../gameElements/projectiles/projectile";
import StraightProjectile from "../gameElements/projectiles/strightProjectile";

export default class ProjectileFactory{

    constructor(){
        console.log("factory created")
    }

    public createProjectile() :Projectile {
        return new StraightProjectile(800 , 800, 40,20,"red",10, {x:0 , y:0})
    }

    
} 