import Mob from "../gameElements/mobs/Mob";
import Config from "../../Config";
export default class MobFactory{

    constructor(private readonly path :{x:number , y:number}[] ,
        private spawnPoint :{x: number , y: number}
    ){}

    public createSlime():Mob {
        let size = Math.floor(Config.width/Config.blockNumber *0.75)
        return new Mob(this.spawnPoint.x , this.spawnPoint.y ,size ,size ,
            "./images/slime.png",10,10,this.path,1);
    }


}