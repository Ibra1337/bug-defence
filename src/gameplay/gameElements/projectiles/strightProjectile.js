import Projectile from "./projectile.ts";
export default class StraightProjectile extends Projectile {
    constructor(x, y, width, height, image, speed, dmg, gameMediator, dest) {
        super(x, y, width, height, image, speed, dmg, gameMediator);
        this.dest = dest;
    }
    move() {
        let distance = this.moveToPoint(this.dest);
        if (distance <= 5) {
            console.log("remove");
            this.onDestinationReached();
        }
    }
    onCollision(mob) {
        const rem = mob.subtractHp(this.dmg);
        if (rem < 1) {
            console.log("removing");
            this.gameMediator.notify("projectile", "remove-mob", mob.id);
        }
        this.onRemove();
    }
    onRemove() {
        this.gameMediator.notify("projectile", "remove-projectile", this.id);
    }
    onDestinationReached() {
        this.onRemove();
    }
}
