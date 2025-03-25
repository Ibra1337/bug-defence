import GameState from "../../GameState";
import IGameMediator from "../../igameMediator";
import SpatialHash from "../../SpatialHash";
import Projectile from "../projectiles/projectile";
import Tower from "./tower";
import Mob from "../mobs/Mob";

export default class SingleTartgetTower extends Tower {


    public shoot(gameTimer :number , targets :{ mob: Mob; distance: number; }[], gameState :GameState ): Projectile|null {
       
        if (!this.isRedy(gameTimer))
            return null;

        const target = targets[0].mob
        if (target)
            return this.projectileFactory.createProjectile(this.x , this.y , {x:target!.xGetCenter() , y:target!.yGetCenter()});

        return null;
    }

}