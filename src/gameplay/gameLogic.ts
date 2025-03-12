import { Movable, xDirection, yDirection } from "../geometry/Movable";
import IGameMediator from "./igameMediator";
import { Tester } from "../geometry/Tester";

export default class GameLogic {

    private path :{x:number , y:number}[]

    constructor(private movingObjects :Map<number , Movable> , private board :number[][] , private mediator :IGameMediator){
        this.path = [{x:50,y:50} , {x:50, y:700} ,{x:700, y:700}];
        console.log(this.board)
    }

    //veorra
    // need a way to enter curr x,y
    //get currnent box 
    private generateTester(): Tester {
        let t = new Tester(100, 100, 100, 100, 1, this.path);
        this.movingObjects.set(t.id, t);
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