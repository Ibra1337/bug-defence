
import { PathFollower } from "../geometry/pathFollower";
import { xDirection , yDirection, Movable } from "../geometry/movable.ts";
import IGameMediator from "../gameplay/igameMediator.ts";
import GameState from "../gameplay/GameState.ts";
import Sprite from "./Sprite.ts";

export class Renderer {
    private gameCanvas: HTMLCanvasElement;
    private gameCtx: CanvasRenderingContext2D;

    private mapCanvas: HTMLCanvasElement;
    private mapCtx: CanvasRenderingContext2D;

    private uiCanvas: HTMLCanvasElement;
    private uiCtx: CanvasRenderingContext2D;

    private inputCanvas: HTMLCanvasElement;
    private inputCtx: CanvasRenderingContext2D;

    private mediator: IGameMediator;
    private gameState: GameState;

    constructor(gameState: GameState, private board: number[][], mediator: IGameMediator) {
        this.gameState = gameState;
        this.mediator = mediator;


        this.mapCanvas = this.createCanvas(800, 800, "mapCanvas");
        this.mapCtx = this.mapCanvas.getContext("2d")!;

        this.gameCanvas = this.createCanvas(800, 800, "gameCanvas");
        this.gameCtx = this.gameCanvas.getContext("2d")!;



        this.uiCanvas = this.createCanvas(800, 800, "uiCanvas");
        this.uiCtx = this.uiCanvas.getContext("2d")!;
        
        this.inputCanvas = this.createCanvas(800 , 800, "inputCanvas")
        this.inputCtx = this.inputCanvas.getContext("2d")!;

        this.inputCanvas.addEventListener('click', (event) => {
            const rect = this.inputCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log(`Clicked at: (${x}, ${y})`);
          
            // Example: Draw a red dot at the clicked position
            this.inputCtx.fillStyle = "red";
            this.inputCtx.beginPath();
            this.inputCtx.arc(x, y, 5, 0, 2 * Math.PI);
            this.inputCtx.fill();
          });

        this.setupCanvasStyles();

        //TODO: make it aautomatic
        const menuContainer = document.createElement("div");
        menuContainer.id = "towerMenu";
        menuContainer.innerHTML = `
        <h3>Select Tower</h3>
        <button class="tower-btn" data-type="archer">🏹 Archer</button>
        <button class="tower-btn" data-type="mage">🪄 Mage</button>
        <button class="tower-btn" data-type="cannon">💣 Cannon</button>
`;
document.body.appendChild(menuContainer);


let selectedTower: string | null = null;
menuContainer.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("tower-btn")) {
    selectedTower = target.getAttribute("data-type");
    console.log(`Selected Tower: ${selectedTower}`);
  }
});


this.inputCanvas.addEventListener("click", (event) => {
  if (!selectedTower) return;

  const rect = this.inputCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  console.log(`Place ${selectedTower} tower at (${x}, ${y})`);
  // TODO: Call mediator/gameState to place tower here
});

    }

    private createCanvas(width: number, height: number, id: string): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.id = id;
        document.body.appendChild(canvas);
        return canvas;
    }

    private setupCanvasStyles() {
        const style = `
            canvas {
                position: absolute;
                top: 0;
                left: 0;
            }
            #inputCanvas { z-index: 4; }
            #uiCanvas { z-index: 3; }  
            #gameCanvas { z-index: 2; }                       
            #mapCanvas { z-index: 1; }
    
            #towerMenu {
                position: absolute;
                left: 820px;
                top: 0;
                width: 180px;
                background: #222;
                color: white;
                padding: 10px;
                font-family: Arial;
                background: url('./public/images/menu_bg.png')  center center;
                bacground
            }
    
            #towerMenu button {
                display: block;
                width: 100%;
                margin: 5px 0;
                padding: 10px;
                background: #444;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }
    
            #towerMenu button:hover {
                background: #666;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);
    }
    drawMob(object: Sprite) {
        
        this.gameCtx.fillStyle = object.color;
        let img = new Image();
        img.src = object.color
        
        this.gameCtx.drawImage( img, object.x, object.y, object.width, object.height);
        this.gameCtx.fillStyle = "rgba(0, 255, 0, 0.0)";
    }

    private drawMap() {

        console.log("draw Map")
        this.mapCtx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
        this.mapCtx.strokeStyle = "black";
        
        const xRectWidth = this.mapCanvas.width / this.board.length;
        const yRectWidth = this.mapCanvas.height / this.board[0].length;

        
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                if (this.board[y][x] === 1) {
                    let img = new Image();
                    img.src = "./images/menu_bg.png"; 
                    
                    img.onload = () => {
                        this.mapCtx.drawImage(img, x * xRectWidth, y * yRectWidth, xRectWidth, yRectWidth);
                    };
                }else{
                    let img = new Image();
                    img.src = "./images/grass.png"; 
                    
                    img.onload = () => {
                        this.mapCtx.drawImage(img, x * xRectWidth, y * yRectWidth, xRectWidth, yRectWidth);
                }
            }
        }
    }

    }

    private drawUI() {
        this.uiCtx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
        this.uiCtx.fillStyle = "black";
        this.uiCtx.font = "20px Arial";
        this.uiCtx.fillText("Player HP: 100", 10, 30);
        
    }

    private animate = () => {
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    
        this.mediator.notify("renderer", "animate");
        for (const object of this.gameState.getAllEntities()) {
            this.drawMob(object);  
        }
    
        this.drawUI();  
    
        requestAnimationFrame(this.animate);
    };
    

    public startAnimation() {
        this.drawMap();
        this.animate();
        
    }
}
