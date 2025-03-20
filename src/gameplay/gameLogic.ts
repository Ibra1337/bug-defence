
import IGameMediator from "./igameMediator.ts";
import { PathFollower } from "../geometry/pathFollower.ts";
import GameState from "./GameState.ts";
import SpatialHash from "./SpatialHash.ts";
import TowerFactory from "./factories/towerFactory.ts";
import Tower from "./gameElements/towers/tower.ts";
import Projectile from "./gameElements/projectiles/projectile.ts";
import Sprite from "../GUI/Sprite.ts";
import TestMob from "./gameElements/mobs/TestMob.ts";
import { TowerType } from "./gameElements/towers/TowerType.ts";
import findPath, { boardToPixelCoords, findStartAndEnd, Point } from "../utils/PathUtills.ts";
import { CellStatus } from "../types/CellStatus.ts";
import Config from "../Config.ts";
export default class GameLogic implements IGameMediator {

    private path :{x:number , y:number}[];
    private spatialHash :SpatialHash;
    private towerFactroy :TowerFactory
    private board :number[][]
    private obstacles: Point[]
    private gameTimer =0;
    private start: Point;
    private end: Point;

    constructor(private gameState:GameState , board :number[][] , private mediator :IGameMediator){
        this.board = board;
        const startAndEnd = findStartAndEnd(board);
        this.start = startAndEnd.start!;
        this.end = startAndEnd.end!;
        const boardPath = findPath(board, startAndEnd.start! , startAndEnd.end!)
        this.updateBoardWithPath(boardPath!)
        const cords = boardToPixelCoords(boardPath!);
        this.path = cords;
        console.log(this.board)
        this.spatialHash = new SpatialHash(100);
        this.towerFactroy = new TowerFactory(this);
        this.obstacles = []
    }

    private updatePath(){
        let nb = Array.from({ length: Config.blockNumber  }, () => Array(Config.blockNumber).fill(CellStatus.Free));
        for(const o of this.obstacles)
            nb[o.y][o.x] =CellStatus.Obstacle;
        const boardPath = findPath(nb , this.start , this.end);
        if(boardPath ===null)
            throw console.error("handle illeagal tower placing");
            
        for (const el of boardPath!){
            nb[el.y][el.x] = CellStatus.Path;
        }
        nb[this.start.y][this.start.y] = CellStatus.Start;
        this.board[this.end.y][this.end.x] = CellStatus.End;
        this.path = boardToPixelCoords(boardPath)
        this.board = nb;
    }


    private generateMob(): PathFollower {
            
        let m = new TestMob(100, 100, 50, 50,"./public/images/slime3.png", 1, 100, this.path , 1);
        this.gameState.addMob(m.id, m);
        this.spatialHash.insertObject(m.id , m.x , m.y , m.width , m.height);
        return m;
    }

    private updateBoardWithPath(path: Point[]){
        for (const el of path)
            this.board[el.y][el.x]=CellStatus.Path
        this.board[this.start.y][this.start.x] = CellStatus.Start;
        this.board[this.end.y][this.end.x] = CellStatus.End;
        
        console.log("after actualization: " , this.board)
    }

    public init(){
        this.generateMob();
        //this.generateProjectile();
        this.generateTower(700,700)
    }

    private checkAndHanleCollisons(l :Set<number> , projectile :Projectile ){
        for(const id of l ){
            let mob = this.gameState.getMobs().get(id);
            if (!mob)
                continue
            if(this.isColliding(Sprite.toRect(mob) ,Sprite.toRect(projectile)
            )){
                projectile.onCollision(mob )
                if(!this.gameState.getProjectiles().has(projectile.id))
                    break
            }
        }
    }

    private handleTower(tower: Tower): void {
        if (tower.isRedy(this.gameTimer)) {
            const targets = this.spatialHash.getObjectsInCircle(tower.xGetCenter() , tower.yGetCenter() , tower.range)
            if (targets.length > 0) {
                
                let p = tower.shoot(this.gameTimer, targets , this.gameState);
                if (p!==null){
                    tower.setLastShootTimer(this.gameTimer); 
                    this.gameState.addProjectile(p.id , p)
                    console.log(this.gameState)
                }
            }
        }
    }
    private handleTowers():void{
        this.gameState.getTowers().forEach(t => this.handleTower(t))
    }

    private handleProjectiles() :void{        
        for (let object of this.gameState.getProjectiles().values()){
            object.move();
            const l = this.spatialHash.getNearbyObjects(object.x , object.y , object.width , object.height)
            if (l.size>0){
                this.checkAndHanleCollisons(l , object)
            }
        }
    }

    private handleMobs() :void{
        for (let object of this.gameState.getMobs().values())
        {
            object.move();
            this.spatialHash.updateObject(object.id , object.x , object.y);
        
        }
    }

    public movePhase(){
        this.handleProjectiles();
        this.handleMobs();
        this.handleTowers()
        this.mediator.notify("GameLogic" , "MovePhaseEnd")
        if(this.gameTimer%30===0){
            this.generateMob()
        }
        this.gameTimer++;

    }

    private generateTower(x :number, y :number):Tower{
        let t = this.towerFactroy.createTower(x,y)
        this.gameState.addTower(t.id , t);
        return t;
    }


    private isColliding(rect1: {x: number, y: number, width: number, height: number}, 
        rect2: {x: number, y: number, width: number, height: number}): boolean {
        return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
    }


    notify(sender: string, event: string, data?: any) {
        switch (event) {
            case "remove-mob":
                this.gameState.removeMob(data);
                break; 
            case "remove-projectile":
                this.gameState.removeProjectile(data);
                break; 
            default:
                console.log(`Unknown event: ${event}`);
        }
    }
    

    handleTowerPlacement(){
        //validate purchase 
        
    }

    createTower(x:number , y:number , towerType: TowerType){
        switch(towerType){
            case(TowerType.Archer):
                this.generateTower(x,y)
                break
            }
    }
}

