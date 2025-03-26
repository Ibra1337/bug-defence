import { Movable } from "../geometry/movable.ts";
import { Renderer } from "../GUI/Renderer.ts";
import { TowerType } from "./gameElements/towers/TowerType.ts";
import GameLogic from "./gameLogic.ts";
import GameState from "./GameState.ts";
import IGameMediator from "./igameMediator.ts";
import Config from "../Config.ts";
import { CellStatus } from "../types/CellStatus.ts";
import Shop from "./Shop.ts";


export default class Game implements IGameMediator{

    private renderer :Renderer
    private gameLogic :GameLogic
    private gameState :GameState

    
    private board :number[][];
    private shop: Shop;
    private selectedTower  = "none";

    private gameOver = false;    

    constructor(){
        this.board = Array.from({ length: Config.blockNumber  }, () => Array(Config.blockNumber).fill(CellStatus.Free));
        this.board[0][0] = CellStatus.Start;
        this.board[Config.blockNumber-2][Config.blockNumber-1] = CellStatus.End;
        console.log(this.board)
        this.gameState = new GameState();
        this.gameLogic = new GameLogic(this.gameState , this.board, this);
        this.renderer = new Renderer(this.gameState ,this.board , this );
        this.shop = new Shop()
    }
    notify(sender: string, event: string, data?: any): void {
        
        switch(event){
        case "animate":
            this.gameLogic.movePhase();
            break;
        case "tower-place":
            console.log("tower placed at - from game" , data)

            if (!this.shop.validateAndPurchase(this.gameState , this.selectedTower))
                break
            const xs = Config.width / Config.blockNumber;
            const ys = Config.height / Config.blockNumber; 
            console.log("<>?<>: " ,this.selectedTower)
            this.gameLogic.createTower(Math.floor(data.x /xs ),Math.floor( data.y /ys), this.selectedTower);
            break;
        case "tower-selected":
            console.log("tower-selection: " , data)
            this.selectedTower = data
            console.log("after selection: " , this.selectedTower)
            break;
        case "map-update":
            this.renderer.drawMap(); 
            break;
        case "game-over":
            console.log("handle game over");
            this.renderer.stopAnimation();
            break
        case "dmg-take":
            this.renderer.updateHP();
            break
    }
    }



    public startGame(){
        this.gameLogic.init()
        this.renderer.startAnimation();
    }

}