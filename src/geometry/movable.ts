import Sprite from "../GUI/Sprite";

const enum xDirection {LEFT = -1 ,STAY =0 ,  RIGHT = 1}
const enum yDirection {UP = -1 ,STAY=0 , DOWN =1}

export abstract class Movable extends Sprite{

    constructor(  x:number ,  y :number ,  width:number ,  height: number , image:string , public speed :number ){
        super(x,y,width,height,image )
    }

    public xGetCenter() :number{
        return this.x + this.width/2
    }

    public yGetCenter() :number{
        return this.y + this.height/2
    }

    /**
     * moves this object one step (depending on speed) in direction of of passed target destination
     * @param target targeted 
     * @returns distance from target
     */
    protected moveToPoint(target: { x: number; y: number }): number {

        let centerX = this.x + this.width / 2;
        let centerY = this.y + this.height / 2;
    

        let direction = {
            x: target.x - centerX,
            y: target.y - centerY,
        };
    
        let distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    
        if (distance > 0) {
            direction.x /= distance;
            direction.y /= distance;
    

            this.x += direction.x * this.speed;
            this.y += direction.y * this.speed;
        }
    
        return distance;
    }

    abstract move() :void

}

export {xDirection , yDirection}