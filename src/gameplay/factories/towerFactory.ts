import StraightProjectile from "../gameElements/projectiles/strightProjectile";
import Tower from "../gameElements/towers/tower";
import SingleTartgetTower from "../gameElements/towers/singleTargetTower";
import ProjectileFactory from "./projectileFactory";
import IGameMediator from "../igameMediator";

export default class TowerFactory {
    constructor(private mediator: IGameMediator) {}

    public createTower(x: number, y: number): Tower {
        const width = 45;
        const height = 45;

        const adjustedX = x - width / 2;
        const adjustedY = y - height / 2;

        return new SingleTartgetTower(
            adjustedX,
            adjustedY,
            width,
            height,
            "./images/inferno bow static.png",
            1000,
            100,
            new ProjectileFactory(this.mediator)
        );
    }
}
