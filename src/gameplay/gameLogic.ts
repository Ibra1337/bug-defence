import { Movable, xDirection, yDirection } from "../geometry/movable.ts";
import IGameMediator from "./igameMediator";
import { PathFollower } from "../geometry/pathFollower";
import StraightProjectile from "../geometry/strightProjectile.ts";

export default class GameLogic {

    private path :{x:number , y:number}[]

    constructor(private movingObjects :Map<number , Movable> , private board :number[][] , private mediator :IGameMediator){
        this.path = [{x:50,y:50} , {x:50, y:700} ,{x:700, y:700}];
        console.log(this.board)
    }

    private generateTester(): PathFollower {
        let t = new PathFollower(100, 100, 100, 100, 1, this.path);
        this.movingObjects.set(t.id, t);
        let p = new StraightProjectile(10,10,40,40,10,{x:800,y:800})
        this.movingObjects.set(p.id , p);
        return t;
    }

    public init(){
        this.generateTester()
    }

    public movePhase(){


        for (let object of this.movingObjects.values()){


            object.move(xDirection.LEFT , yDirection.STAY);
        }
        
        this.mediator.notify("GameLogic" , "MovePhaseEnd")
    }


}