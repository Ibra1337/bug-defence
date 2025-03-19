import Tower from "./tower";
export default class SingleTartgetTower extends Tower {
    shoot(gameTimer, targets, gameState) {
        console.log(gameTimer, " ", this.getLastSootTimer(), this.isRedy(gameTimer));
        if (!this.isRedy(gameTimer))
            return null;
        const target = gameState.getMobs().get(targets[0][1]);
        if (target)
            return this.projectileFactory.createProjectile(this.x, this.y, { x: target.xGetCenter(), y: target.yGetCenter() });
        console.log("target does not exists");
        return null;
    }
}
