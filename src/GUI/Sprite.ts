export default abstract class Sprite {

    private static lastId =0;

    protected readonly id :number;
    
    private angle =0;

    constructor( public x:number , public y :number , public width:number , public height: number, public image:string ){
        this.id = Sprite.lastId ;
        Sprite.lastId++;
    }

    public xGetCenter() :number{
        return this.x + this.width/2
    }

    public yGetCenter() :number{
        return this.y + this.height/2
    }

    public static toRect(sprite :Sprite){
        return {x: sprite.x , y: sprite.y , width: sprite.width , height :sprite.height}
    }

    protected rotate(deg: number){
        this.angle = deg;
    }

    public getAngle(){
        return this.angle;
    }
}

