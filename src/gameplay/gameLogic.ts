import { Movable, xDirection, yDirection } from "../geometry/Movable";
import IGameMediator from "./igameMediator";


export default class GameLogic {

    constructor(private movingObjects :Map<number , Movable> , private board :number[][] , private mediator :IGameMediator){


        console.log(this.board)
    }


    public movePhase(){
        
        for (let object of this.movingObjects.values()){
            //todo divide the screatnint 10/10 array
            //then find nearest 1 
            //go in this direction
            //when reached 
            //repeat

            object.move(xDirection.LEFT , yDirection.STAY);
        }
        
        this.mediator.notify("GameLogic" , "MovePhaseEnd")
    }


}