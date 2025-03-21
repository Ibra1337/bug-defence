import { PathFollower } from "../geometry/pathFollower";
import { xDirection, yDirection, Movable } from "../geometry/movable.ts";
import IGameMediator from "../gameplay/igameMediator.ts";
import GameState from "../gameplay/GameState.ts";
import Sprite from "./Sprite.ts";
import Config from "../Config.ts";
import { CellStatus } from "../types/CellStatus.ts";



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

    private imageCache: Map<string, HTMLImageElement>; 

    constructor(gameState: GameState, private board: number[][], mediator: IGameMediator) {
        this.gameState = gameState;
        this.mediator = mediator;
        this.imageCache = new Map<string, HTMLImageElement>();

        this.mapCanvas = this.createCanvas(Config.width, Config.height, "mapCanvas");
        this.mapCtx = this.mapCanvas.getContext("2d")!;

        this.gameCanvas = this.createCanvas(Config.width, Config.height, "gameCanvas");
        this.gameCtx = this.gameCanvas.getContext("2d")!;

        this.uiCanvas = this.createCanvas(Config.width, Config.height, "uiCanvas");
        this.uiCtx = this.uiCanvas.getContext("2d")!;

        this.inputCanvas = this.createCanvas(Config.width, Config.height, "inputCanvas");
        this.inputCtx = this.inputCanvas.getContext("2d")!;

        this.setupCanvasStyles();
        this.setupTowerMenu();
        this.setupInputHandlers();
    }


    private createCanvas(width: number, height: number, id: string): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.id = id;
        document.body.appendChild(canvas);
        return canvas;
    }


    private getImage(src: string, callback: (img: HTMLImageElement) => void): void {
        if (this.imageCache.has(src)) {
            callback(this.imageCache.get(src)!);
        } else {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.imageCache.set(src, img);
                callback(img);
            };
        }
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
            #mapCanvas { z-index: 1;
            background: url('./images/grass.png') center center ;
            }

            #towerMenu {
                position: absolute;
                left: 820px;
                top: 0;
                width: 180px;
                background: #222;
                color: white;
                padding: 10px;
                font-family: Arial;
                background: url('./images/menu_bg.png') center center no-repeat;
                background-size: cover;
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
    private setupTowerMenu() {
        const menuContainer = document.createElement("div");
        menuContainer.id = "towerMenu";
        menuContainer.innerHTML = `
            <h3>Select Tower</h3>
            <button class="tower-btn" data-type="Archer">🏹 Archer</button>
            <button class="tower-btn" data-type="Mage">🪄 Mage</button>
            <button class="tower-btn" data-type="Cannon">💣 Cannon</button>
        `;
        document.body.appendChild(menuContainer);

        let selectedTower: string | null = null;

        menuContainer.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("tower-btn")) {
                selectedTower = target.getAttribute("data-type");
                this.mediator.notify("renderer" , "tower-selected" , selectedTower)
            }
        });

        this.inputCanvas.addEventListener("click", (event) => {
            const rect = this.inputCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (selectedTower) {
                console.log(`Place ${selectedTower} tower at (${x}, ${y})`);
                this.mediator.notify("renderer", "tower-place", { x: x, y: y });
            }
        });
    }

    drawMob(object: Sprite) {
        this.getImage(object.color, (img) => {
            this.gameCtx.drawImage(img, object.x, object.y, object.width, object.height);
        });
    }

    private drawMapSquare(x: number, y: number, w: number, h: number): void {
        const v = this.board[y][x];
        let imgSrc: string; 
        
        switch (v) {
            case CellStatus.Start:
                imgSrc = "./images/path.png";
                break;
            case CellStatus.Path:
                imgSrc = "./images/path1.png";
                break;
            case CellStatus.End:
                imgSrc = "./images/path.png";
                break;
            default:
                imgSrc = "./images/grass.png";
        }
    
        this.getImage(imgSrc, (img) => {
            this.mapCtx.drawImage(img, x * w, y * h, w, h);
            this.mapCtx.strokeRect(x * w, y * h, w, h);
        });
    }
    

    public drawMap() {
        console.log("Drawing map...");
        console.log(this.board)
        this.mapCtx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
        this.mapCtx.strokeStyle = "black";

        const xRectWidth = this.mapCanvas.width / this.board.length;
        const yRectWidth = this.mapCanvas.height / this.board[0].length;

        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                this.drawMapSquare(x,y,xRectWidth,yRectWidth);
            }
        }
    }

    public updateHP(){
        this.uiCtx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
        this.uiCtx.fillStyle = "white";
        this.uiCtx.font = "30px Arial";
        const text = JSON.stringify("Player HP: "+ this.gameState.getPlayerHealth())
        this.uiCtx.fillText(text, 10, 30);
        this.uiCtx.strokeStyle = "black";
        this.uiCtx.strokeText("Player HP: 100", 10, 30);
    }

    private drawUI() {
        this.uiCtx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
        this.uiCtx.fillStyle = "white";
        this.uiCtx.font = "30px Arial";
        this.uiCtx.fillText("Player HP: 100", 10, 30);
        this.uiCtx.strokeStyle = "black";
        this.uiCtx.strokeText("Player HP: 100", 10, 30);
    }

    private animate = () => {
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
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

    
    
    private setupInputHandlers() {
        this.inputCanvas.addEventListener("click", (event) => {
            const rect = this.inputCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
     
        });
    }
}
