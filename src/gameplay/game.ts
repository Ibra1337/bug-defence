import { Movable } from "../geometry/Movable";
import { Renderer } from "../GUI/Renderer";
import GameLogic from "./gameLogic";
import IGameMediator from "./igameMediator";
import { Tester } from "../geometry/Tester";
export default class Game implements IGameMediator{

    private renderer :Renderer
    private gameLogic :GameLogic
    private movingObjects :Map<number , Movable>
    private board :number[][];
    
    constructor(){
        this.movingObjects = new Map<number , Movable>
        this.gameLogic = new GameLogic(this.movingObjects , this.board, this);
        this.renderer = new Renderer(this.movingObjects ,this.board , this );
        this.board = Array.from({ length: 10 }, () => Array(10).fill(0));
        for (let i=0 ; i<10; i++ ){
            this.board[i][0] = 1;
        }
        for (let i=0 ; i<10; i++ ){
            this.board[9][i] = 1;
        }

    }
    notify(sender: string, event: string, data?: any): void {
        
        if(event ==="animate"){
            this.gameLogic.movePhase();
        }
    }

    private generateTester(): Tester {
        let t = new Tester(100, 100, 100, 100, 1);
        this.movingObjects.set(t.id, t);
        return t;
    }

    public startGame(){
        this.generateTester();
        this.renderer.startAnimation();
    }

}