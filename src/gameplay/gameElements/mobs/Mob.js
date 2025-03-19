import { PathFollower } from "../../../geometry/pathFollower";
export default class Mob extends PathFollower {
    constructor(x, y, width, height, image, speed, hp, path, dmg) {
        super(x, y, width, height, image, speed, path);
        this.hp = hp;
        this.dmg = dmg;
    }
    getHp() {
        return this.hp;
    }
    /**
     * subtracts demage and returns the current healthPoints of mob
     * @param dmg
     * @returns
     **/
    subtractHp(dmg) {
        this.hp -= dmg;
        return this.hp;
    }
}
