import StraightProjectile from "../gameElements/projectiles/strightProjectile";
export default class ProjectileFactory {
    constructor(mediator) {
        this.mediator = mediator;
        console.log("factory created");
    }
    createProjectile(x, y, target) {
        console.log("projectile created");
        return new StraightProjectile(x, y, 40, 20, "./public/images/arrow_stratight.png", 10, 50, this.mediator, target);
    }
}
