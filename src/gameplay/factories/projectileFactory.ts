import PircingProjectile from "../gameElements/projectiles/PircingProjectile";
import Projectile from "../gameElements/projectiles/projectile";
import StraightProjectile from "../gameElements/projectiles/strightProjectile";
import IGameMediator from "../igameMediator";

export default class ProjectileFactory{

    constructor(private mediator :IGameMediator){
        console.log("factory created")
    }

    public createProjectile(x :number , y :number ,target  :{x:number , y:number}) :Projectile {
        console.log("projectile created")
        return new StraightProjectile(x,y, 40,20,"./public/images/arrow_stratight.png",10,0 , this.mediator , target)
    }

    public createMageProjectile(x :number , y :number ,target  :{x:number , y:number}){
        return new PircingProjectile(x,y, 40,40,"./public/images/fireball.png",50,50 , this.mediator , target,null)
    }
} 