import SingleTartgetTower from "../gameElements/towers/singleTargetTower";
import ProjectileFactory from "./projectileFactory";
export default class TowerFactory {
    constructor(mediator) {
        this.mediator = mediator;
    }
    createTower(x, y) {
        return new SingleTartgetTower(x, y, 45, 45, "./public/images/inferno bow static.png", 1000, 100, new ProjectileFactory(this.mediator));
    }
}
