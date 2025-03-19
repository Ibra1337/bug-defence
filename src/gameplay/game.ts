import { Movable } from "../geometry/movable.ts";
import { Renderer } from "../GUI/Renderer";
import { TowerType } from "./gameElements/towers/TowerType.ts";
import GameLogic from "./gameLogic.ts";
import GameState from "./GameState.ts";
import IGameMediator from "./igameMediator.ts";
import Config from "../Config.ts";
import { CellStatus } from "../types/CellStatus.ts";


export default class Game implements IGameMediator{

    private renderer :Renderer
    private gameLogic :GameLogic
    private gameState :GameState

    private board :number[][];

    private selectedTower  = TowerType.None;
    

    constructor(){
        this.board = Array.from({ length: Config.blockNumber  }, () => Array(Config.blockNumber).fill(CellStatus.Free));
        for (let i=0 ; i<10; i++ ){
            this.board[i][0] = CellStatus.Path;
        }
        for (let i=0 ; i<10; i++ ){
            this.board[9][i] = CellStatus.Path;
        }
        this.board[0][0] = CellStatus.Start;
        this.gameState = new GameState();
        this.gameLogic = new GameLogic(this.gameState , this.board, this);
        this.renderer = new Renderer(this.gameState ,this.board , this );

    }
    notify(sender: string, event: string, data?: any): void {
        
        switch(event){
        case "animate":
            this.gameLogic.movePhase();
            break;
        case "tower-place":
            console.log("tower placed at - from game" , data)
            this.gameLogic.createTower(data.x, data.y , this.selectedTower)
            break;
        case "tower-selected":
            console.log("tower-selection: " , data)
            let datas = data as string;
            this.selectedTower = TowerType[data as keyof typeof TowerType];
            console.log("after selection: " , this.selectedTower)
            break;
        }
    }



    public startGame(){
        this.gameLogic.init()
        this.renderer.startAnimation();
    }

}