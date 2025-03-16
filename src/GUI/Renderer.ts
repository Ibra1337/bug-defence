
import { PathFollower } from "../geometry/pathFollower";
import { xDirection , yDirection, Movable } from "../geometry/movable.ts";
import IGameMediator from "../gameplay/igameMediator.ts";
import GameState from "../gameplay/GameState.ts";
import Sprite from "./Sprite.ts";

export class Renderer {
    //mutliple canvas
    //1 for teh game
    //2 for the map
    //3 for the menu/player hp
    // move it to di 
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mediator :IGameMediator ;
    private gameState :GameState;

    constructor(gameState :GameState ,private board :number[][] , mediator :IGameMediator) {
        this.gameState = gameState;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 800;
        this.canvas.height = 800;
        document.body.appendChild(this.canvas);
        this.mediator = mediator;
        this.ctx = this.canvas.getContext("2d")!;
    }

    draw(object: Sprite) {
        this.ctx.fillStyle = object.color;
        this.ctx.fillRect(object.x, object.y, object.width, object.height);
    }


    private drawMap(){
        this.ctx.fillStyle = "red";

        let xRectWidth = this.canvas.width/ this.board.length;
        let yRectWidth = this.canvas.height / this.board[0].length

        for(let  x=0; x< this.board.length ; x++)
        for(let y=0; y< this.board[x].length; y++){
            if(this.board[y][x] ===1)
            this.ctx.strokeRect(x*xRectWidth , y*xRectWidth , xRectWidth , yRectWidth);       
        }
    }

    private animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "Grey"
        this.ctx.fillRect(0 , 0 ,this.canvas.width , this.canvas.height )
        this.mediator.notify("renderer" , "animate")
        this.drawMap();
        for (const object of this.gameState.getAllEntities()) {
            this.draw(object);
        }

        requestAnimationFrame(this.animate);
    };

    public startAnimation() {
        this.animate(); 
    }


}
