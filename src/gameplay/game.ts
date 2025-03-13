import { Movable } from "../geometry/movable.ts";
import { Renderer } from "../GUI/Renderer";
import GameLogic from "./gameLogic";
import IGameMediator from "./igameMediator";

export default class Game implements IGameMediator{

    private renderer :Renderer
    private gameLogic :GameLogic
    private movingObjects :Map<number , Movable>
    private board :number[][];
    
    constructor(){
                this.board = Array.from({ length: 10 }, () => Array(10).fill(0));
        for (let i=0 ; i<10; i++ ){
            this.board[i][0] = 1;
        }
        for (let i=0 ; i<10; i++ ){
            this.board[9][i] = 1;
        }
        this.movingObjects = new Map<number , Movable>
        this.gameLogic = new GameLogic(this.movingObjects , this.board, this);
        this.renderer = new Renderer(this.movingObjects ,this.board , this );


    }
    notify(sender: string, event: string, data?: any): void {
        
        if(event ==="animate"){
            this.gameLogic.movePhase();
        }
    }

    public startGame(){
        this.gameLogic.init()
        this.renderer.startAnimation();
    }

}