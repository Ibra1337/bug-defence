import StraightProjectile from "../gameElements/projectiles/strightProjectile";
import Tower from "../gameElements/towers/tower";
import SingleTartgetTower from "../gameElements/towers/singleTargetTower";
import ProjectileFactory from "./projectileFactory";

export default class TowerFactory{

    public createTower(x:number , y: number) :Tower{
        return new SingleTartgetTower(x , y,45,45,"pink", 100,50, new ProjectileFactory())
    }
    

}