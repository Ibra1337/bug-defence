import { Movable } from "../../../geometry/movable.ts";
export default class Projectile extends Movable {
    constructor(x, y, width, height, image, speed, dmg, gameMediator) {
        super(x, y, width, height, image, speed);
        this.speed = speed;
        this.dmg = dmg;
        this.gameMediator = gameMediator;
    }
}
