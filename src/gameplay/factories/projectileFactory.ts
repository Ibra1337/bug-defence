import Projectile from "../gameElements/projectiles/projectile";
import StraightProjectile from "../gameElements/projectiles/strightProjectile";
import IGameMediator from "../igameMediator";

export default class ProjectileFactory{

    constructor(private mediator :IGameMediator){
        console.log("factory created")
    }

    public createProjectile(x :number , y :number ,target  :{x:number , y:number}) :Projectile {
        console.log("projectile created")
        return new StraightProjectile(x,y, 40,20,"./public/images/arrow_stratight.png",10,50 , this.mediator , target)
    }

    
} 