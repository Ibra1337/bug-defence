
import { Tester } from "../geometry/Tester";
import { xDirection , yDirection, Movable } from "../geometry/Movable";
import IGameMediator from "../gameplay/igameMediator";

export class Renderer {

    // move it to di 
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mediator :IGameMediator ;
    private movingObjects :Map<number, Movable>;

    constructor(movingOjects :Map<number , Movable> ,private board :number[][] , mediator :IGameMediator) {
        this.movingObjects = movingOjects;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 800;
        this.canvas.height = 800;
        document.body.appendChild(this.canvas);
        this.mediator = mediator;
        this.ctx = this.canvas.getContext("2d")!;
    }

    draw(object: Movable) {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(object.x, object.y, object.width, object.height);
    }


    private drawMap(){
        this.ctx.fillStyle = "red";
        console.log("map")
        let xRectWidth = this.canvas.width/ this.board.length;
        let yRectWidth = this.canvas.height / this.board[0].length

        for(let  x=0; x< this.board.length ; x++)
        for(let y=0; y< this.board[x].length; y++){
            if(this.board[y][x] ===1)
            this.ctx.strokeRect(x*xRectWidth , y*xRectWidth , xRectWidth , yRectWidth)
           
        }
    }

    private animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "Grey"
        this.ctx.fillRect(0 , 0 ,this.canvas.width , this.canvas.height )
        this.mediator.notify("renderer" , "animate")
        this.drawMap();
        for (const object of this.movingObjects.values()) {
            this.draw(object);
        }

        requestAnimationFrame(this.animate);
    };

    public startAnimation() {
        this.animate(); 
    }


}
