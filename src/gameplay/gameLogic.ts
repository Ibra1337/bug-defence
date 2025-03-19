import { Movable, xDirection, yDirection } from "../geometry/movable.ts";
import IGameMediator from "./igameMediator.ts";
import { PathFollower } from "../geometry/pathFollower.ts";
import StraightProjectile from "./gameElements/projectiles/strightProjectile.ts";
import GameState from "./GameState.ts";
import SingleTartgetTower from "./gameElements/towers/singleTargetTower.ts";
import ProjectileFactory from "./factories/projectileFactory.ts";
import SpatialHash from "./SpatialHash.ts";
import TowerFactory from "./factories/towerFactory.ts";
import Tower from "./gameElements/towers/tower.ts";
import Projectile from "./gameElements/projectiles/projectile.ts";
import Sprite from "../GUI/Sprite.ts";
import Mob from "./gameElements/mobs/Mob.ts";
import TestMob from "./gameElements/mobs/TestMob.ts";
import { TowerType } from "./gameElements/towers/TowerType.ts";
export default class GameLogic implements IGameMediator {

    private path :{x:number , y:number}[];
    private spatialHash :SpatialHash;
    private towerFactroy :TowerFactory
    private gameTimer =0;

    constructor(private gameState:GameState , private board :number[][] , private mediator :IGameMediator){
        this.path = [{x:50,y:50} , {x:50, y:700} ,{x:700, y:700}];
        console.log(this.board)
        this.spatialHash = new SpatialHash(25);
        this.towerFactroy = new TowerFactory(this);

    }

    

    private generateMob(): PathFollower {
        let m = new TestMob(100, 100, 50, 50,"./public/images/slime3.png", 1, 100, this.path , 1);
        this.gameState.addMob(m.id, m);
        this.spatialHash.insertObject(m.id , m.x , m.y , m.width , m.height);
        return m;
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
                projectile.onCollision( mob )
                
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

