import Mob from "../gameElements/mobs/Mob";
import Config from "../../Config";
export default class MobFactory {
    constructor(path, spawnPoint) {
        this.path = path;
        this.spawnPoint = spawnPoint;
    }
    createSlime() {
        let size = Math.floor(Config.width / Config.blockNumber * 0.75);
        return new Mob(this.spawnPoint.x, this.spawnPoint.y, size, size, "./images/slime.png", 10, 10, this.path, 1);
    }
}
