import Projectile from "../projectiles/projectile";
import Tower from "./tower";

export default class SingleTartgetTower extends Tower {

    public shoot(): Projectile {
        return this.projectileFactory.createProjectile();
    }

}