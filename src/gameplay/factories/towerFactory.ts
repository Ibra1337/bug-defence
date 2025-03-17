import StraightProjectile from "../gameElements/projectiles/strightProjectile";
import Tower from "../gameElements/towers/tower";
import SingleTartgetTower from "../gameElements/towers/singleTargetTower";
import ProjectileFactory from "./projectileFactory";
import IGameMediator from "../igameMediator";

export default class TowerFactory{

    constructor(private mediator :IGameMediator){}


    public createTower(x:number , y: number) :Tower{
        return new SingleTartgetTower(x , y,45,45,"./public/images/inferno bow static.png", 1000,100, new ProjectileFactory( this.mediator) )
    }
    

}