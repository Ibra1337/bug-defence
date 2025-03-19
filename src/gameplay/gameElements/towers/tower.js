import Sprite from "../../../GUI/Sprite";
export default class Tower extends Sprite {
    constructor(x, y, width, height, image, range, cooldown, projectileFactory) {
        super(x, y, width, height, image);
        this.range = range;
        this.cooldown = cooldown;
        this.projectileFactory = projectileFactory;
        this.lastShootTimer = 0;
    }
    isRedy(currentTime) {
        return this.lastShootTimer + this.cooldown < currentTime;
    }
    getLastSootTimer() {
        return this.lastShootTimer;
    }
    setLastShootTimer(gameTimer) {
        this.lastShootTimer = gameTimer;
    }
}
