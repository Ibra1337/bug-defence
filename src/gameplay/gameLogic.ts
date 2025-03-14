import { Movable, xDirection, yDirection } from "../geometry/movable.ts.ts";
import IGameMediator from "./igameMediator.ts";
import { PathFollower } from "../geometry/pathFollower.ts";
import StraightProjectile from "./gameElements/projectiles/strightProjectile.ts";
import GameState from "./gameState.ts";
import SingleTartgetTower from "./gameElements/towers/singleTargetTower.ts";
import ProjectileFactory from "./factories/projectileFactory.ts";
import SpatialHash from "./SpatialHash.ts";
import TowerFactory from "./factories/towerFactory.ts";
import Tower from "./gameElements/towers/tower.ts";
import Projectile from "./gameElements/projectiles/projectile.ts";
import Sprite from "../GUI/sprite.ts";
export default class GameLogic {

    private path :{x:number , y:number}[];
    private spatialHash :SpatialHash;
    private towerFactroy :TowerFactory
    private gameTimer =0;

    constructor(private gameState:GameState , private board :number[][] , private mediator :IGameMediator){
        this.path = [{x:50,y:50} , {x:50, y:700} ,{x:700, y:700}];
        console.log(this.board)
        this.spatialHash = new SpatialHash(100);
        this.towerFactroy = new TowerFactory();
    }

    private generateMob(): PathFollower {
        let m = new PathFollower(100, 100, 100, 100,"blue", 1, this.path);
        this.gameState.addMob(m.id, m);
        this.spatialHash.insertObject(m.id , m.x , m.y , m.width , m.height);
        return m;
    }

    private generateProjectile(): Projectile{
        let p = new StraightProjectile(100,800,10,20,"red" , 1 , {x:30,y:0})
        this.gameState.addProjectile(p.id , p);
        return p;
    }

    public init(){
        this.generateMob();
        this.generateProjectile();
    }

    private checkAndHanleCollisons(l :Set<number> , projectile :Projectile ){
        for(const id of l ){
            let mob = this.gameState.getMobs().get(id);
            if (!mob)
                continue
            if(this.isColliding(
                Sprite.toRect(mob) ,
                Sprite.toRect(projectile)
            )){
                console.log("collison");
            }
        }
    }

    private handleTower(tower: Tower): void {
        if (tower.isRedy(this.gameTimer)) {
            const targets = this.spatialHash.getObjectsInCircle(tower.xGetCenter() , tower.yGetCenter() , tower.range)
            if (targets.length > 0) {

                let p = tower.shoot(this.gameTimer, targets);
                if (p!==null){
                    tower.setLastShootTimer(this.gameTimer); 
                }
            }
        }
    }


    private handleProjectiles() :void{        
        for (let object of this.gameState.getProjectiles().values()){
            object.move(xDirection.LEFT , yDirection.STAY);
            const l = this.spatialHash.getNearbyObjects(object.x , object.y , object.width , object.height)
            if (l.size>0){
                this.checkAndHanleCollisons(l , object)

            }
        }


    }

    private handleMobs() :void{
        for (let object of this.gameState.getMobs().values())
        {
            object.move(xDirection.LEFT, yDirection.DOWN);
            this.spatialHash.updateObject(object.id , object.x , object.y);
        
        }
    }

    public movePhase(){
        this.handleProjectiles();
        this.handleMobs();
        this.mediator.notify("GameLogic" , "MovePhaseEnd")
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


    

}