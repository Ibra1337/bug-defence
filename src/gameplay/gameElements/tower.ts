import ProjectileFactory from "../factories/projectileFactory";

export default abstract class Tower{
    
    constructor(private x :number, private y :number, 
        private width :number , private height :number , 
        range :number ,
        private projectileFactory :ProjectileFactory ){}


    public abstract shoot():void

        

}