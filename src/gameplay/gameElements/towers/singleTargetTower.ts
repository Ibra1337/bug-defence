import IGameMediator from "../../igameMediator";
import Projectile from "../projectiles/projectile";
import Tower from "./tower";

export default class SingleTartgetTower extends Tower {


    //todo find a good way to proprly abstarct finding the right target
    public shoot(gameTimer :number , targets :Array<[number, number]>  ): Projectile|null {
        if (this.isRedy(gameTimer))
            return null;
        return this.projectileFactory.createProjectile(targets);
    }

}