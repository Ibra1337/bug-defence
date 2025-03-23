import StraightProjectile from "../gameElements/projectiles/StrightProjectile";
import Tower from "../gameElements/towers/tower";
import SingleTartgetTower from "../gameElements/towers/singleTargetTower";
import ProjectileFactory from "./projectileFactory";
import IGameMediator from "../igameMediator";
import MageTower from "../gameElements/towers/MageTower";

export default class TowerFactory {

    private projectileFactory

    constructor(private mediator: IGameMediator) {
       this.projectileFactory = new ProjectileFactory(this.mediator);
    }
    public createArcherTower(x: number, y: number): Tower {
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
            this.projectileFactory
        );
    }

    public createMageTower(x: number, y: number): Tower {
        const width = 45;
        const height = 45;

        const adjustedX = x - width / 2;
        const adjustedY = y - height / 2;

        return new MageTower(
            adjustedX,
            adjustedY,
            width,
            height,
            "./images/fireball.png",
            1000,
            100,
            this.projectileFactory
        );
    }
}
