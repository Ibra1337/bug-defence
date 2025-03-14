export default abstract class Sprite {

    private static lastId =0;

    public readonly id :number;


    constructor( public x:number , public y :number , public width:number , public height: number, public color:string ){
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
}

