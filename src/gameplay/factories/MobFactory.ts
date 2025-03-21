import Mob from "../gameElements/mobs/Mob";
import Config from "../../Config";
import IGameMediator from "../igameMediator";
export default class MobFactory{

    constructor(private readonly path :{x:number , y:number}[] ,
        private spawnPoint :{x: number , y: number}, 
        private mediator: IGameMediator
    ){}

    public createSlime():Mob {
        let size = Math.floor(Config.width/Config.blockNumber *0.75)
        return new Mob(this.spawnPoint.x , this.spawnPoint.y ,size ,size ,
            "./images/slime.png",10,10,this.path,1,this.mediator,3);
    }


}