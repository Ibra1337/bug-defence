import GameState from "../../GameState";
import IGameMediator from "../../igameMediator";
import SpatialHash from "../../SpatialHash";
import Projectile from "../projectiles/projectile";
import Tower from "./tower";

export default class MageTower extends Tower {


    public shoot(gameTimer :number , targets :Array<[number, number]> , gameState :GameState ): Projectile|null {
        if (!this.isRedy(gameTimer))
            return null;

        const target = gameState.getMobs().get(targets[0][1])
        if (target)
            return this.projectileFactory.createMageProjectile(this.x , this.y , {x:target!.xGetCenter() , y:target!.yGetCenter()});

        return null;
    }

    private findTarget():{x:number,y:number} {
        //Todo: implemnt so the projectile will fly untill target reached at max distance;

    }

}