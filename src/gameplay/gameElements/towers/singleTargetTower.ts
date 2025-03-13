import Tower from "./tower";

export default class SingleTartgetTower extends Tower {

    public shoot(): void {
        this.projectileFactory.createProjectile();
    }

}