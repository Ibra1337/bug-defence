import { Movable } from "../../../geometry/movable";
import { PathFollower } from "../../../geometry/pathFollower";
import IGameMediator from "../../igameMediator";

export default  class Mob extends PathFollower {

    private animationState =0;

    constructor( x:number ,  y :number ,  width:number ,  height: number , image:string ,  speed :number , private hp: number,   path :{x:number , y:number}[] , public readonly dmg:number, private mediator: IGameMediator , private maxAnimationStates: number)
    {
        super(x, y  , width , height, image,  speed, path )
    }

    public getHp() :number{
        return this.hp;
    }

    move(): void {
        super.move();
        this.animationState++;
        this.animationState = this.animationState%this.maxAnimationStates;
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

    onDestinationReached(): void {
        this.mediator.notify("mob" , "base-reached" , {dmg: this.dmg, id: this.id})
    }

}