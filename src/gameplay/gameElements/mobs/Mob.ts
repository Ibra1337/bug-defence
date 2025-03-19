import { Movable } from "../../../geometry/movable";
import { PathFollower } from "../../../geometry/pathFollower";

export default  class Mob extends PathFollower {

    constructor( x:number ,  y :number ,  width:number ,  height: number , image:string ,  speed :number , private hp: number,   path :{x:number , y:number}[] , public readonly dmg:number )
    {
        super(x, y  , width , height, image,  speed, path )
    }

    public getHp() :number{
        return this.hp;
    }


    /**
     * subtracts demage and returns the current healthPoints of mob
     * @param dmg 
     * @returns 
     **/
    public subtractHp(dmg :number) :number{
        this.hp -= dmg;
        return this.hp;
    }

}