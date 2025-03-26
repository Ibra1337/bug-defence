import Sprite from "../GUI/Sprite";

export abstract class Movable extends Sprite{

    private angle =0;

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
    
        const oldx = this.x;
        const oldy = this.y
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
        
        let rad = Math.atan2(this.y - oldy, this.x - oldy); 
        this.angle = rad * (180 / Math.PI);
        return distance;
    }

    abstract move() :void


    public getAngle(){
        return this.angle;
    }
}
