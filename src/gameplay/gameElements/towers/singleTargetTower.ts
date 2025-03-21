import GameState from "../../GameState";
import IGameMediator from "../../igameMediator";
import SpatialHash from "../../SpatialHash";
import Projectile from "../projectiles/projectile";
import Tower from "./tower";

export default class SingleTartgetTower extends Tower {


    public shoot(gameTimer :number , targets :Array<[number, number]> , gameState :GameState ): Projectile|null {
       
        if (!this.isRedy(gameTimer))
            return null;

        const target = gameState.getMobs().get(targets[0][1])
        if (target)
            return this.projectileFactory.createProjectile(this.x , this.y , {x:target!.xGetCenter() , y:target!.yGetCenter()});

        return null;
    }

}