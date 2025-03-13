import { Movable, xDirection, yDirection } from "../geometry/movable.ts.ts";
import IGameMediator from "./igameMediator.ts";
import { PathFollower } from "../geometry/pathFollower.ts";
import StraightProjectile from "./gameElements/projectiles/strightProjectile.ts";
import GameState from "./gameState.ts";
import SingleTartgetTower from "./gameElements/towers/singleTargetTower.ts";
import ProjectileFactory from "./factories/projectileFactory.ts";

export default class GameLogic {

    private path :{x:number , y:number}[]

    constructor(private gameState:GameState , private board :number[][] , private mediator :IGameMediator){
        this.path = [{x:50,y:50} , {x:50, y:700} ,{x:700, y:700}];
        console.log(this.board)
    }

    private generateTester(): PathFollower {
        let t = new PathFollower(100, 100, 100, 100,"blue", 1, this.path);
        this.gameState.addMob(t.id, t);
        let p = new StraightProjectile(10,10,40,40, "red" , 10,{x:800,y:800})
        this.gameState.addProjectile(p.id , p);
        let tow = new SingleTartgetTower(400,400,100,100,"green" , 100,10,new ProjectileFactory());
        tow.shoot()
        this.gameState.addTower(tow.id , tow);
        return t;
    }

    public init(){
        this.generateTester()
    }


    private handleProjectiles() :void{        
        for (let object of this.gameState.getProjectiles().values()){
            object.move(xDirection.LEFT , yDirection.STAY);
        }
    }

    private handleMobs() :void{
        for (let object of this.gameState.getMobs().values())
        {
            object.move(xDirection.LEFT, yDirection.DOWN);
        }
    }

    public movePhase(){

        this.handleProjectiles();
        this.handleMobs();
        this.mediator.notify("GameLogic" , "MovePhaseEnd")
    }
}