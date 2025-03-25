import GameState from "../../GameState";
import IGameMediator from "../../igameMediator";
import SpatialHash from "../../SpatialHash";
import Mob from "../mobs/Mob"; 
import Projectile from "../projectiles/projectile";
import Tower from "./tower";

export default class MageTower extends Tower {


    public shoot(gameTimer :number , targets :{ mob: Mob; distance: number; }[] , gameState :GameState ): Projectile|null {
        if (!this.isRedy(gameTimer))
            return null;

        const target = targets[0].mob;
        if (target)
            return this.projectileFactory.createMageProjectile(this.x , this.y , this.findTarget({x:target!.xGetCenter() , y:target!.yGetCenter()}));

        return null;
    }

    private findTarget(target :{x:number,y:number}):{x:number,y:number} {

        const xd = this.x - target.x;
        const yd = this.y - target.y
        
        const d = Math.sqrt( xd*xd + yd*yd )
        const proportion = this.range/(d);
        const res =  {x:- xd * proportion +this.x, y: target.y+ -yd * proportion }
        // console.log("=====================")
        // console.log(d)
        // console.log(xd , " " , yd)
        // console.log(this.range)
        // console.log("prpo: " , proportion)
        // console.log(target," <???> " ,res)
        return res;
    }

}