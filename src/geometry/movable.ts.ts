const enum xDirection {LEFT = -1 ,STAY =0 ,  RIGHT = 1}
const enum yDirection {UP = -1 ,STAY=0 , DOWN =1}

export abstract class Movable{


    private static lastId =0;

    public readonly id :number;
    constructor( public x:number , public y :number , public width:number , public height: number , public speed :number ){
        this.id = Movable.lastId ;
        Movable.lastId++;
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
    protected moveToPoint(target :{x:number, y:number}) :number {
        let direction = {
            x: target.x - this.x ,
            y: target.y - this.y
        };

        let distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);

        if (distance > 0) {
            direction.x /= distance;  
            direction.y /= distance;
        }

        this.x += direction.x * this.speed;
        this.y += direction.y * this.speed;
        
        return distance;
    }

    abstract move( xDirection:xDirection , yDirection: yDirection) :void

}

export {xDirection , yDirection}