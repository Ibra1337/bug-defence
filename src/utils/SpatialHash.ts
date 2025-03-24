interface Point {x: number , y:number}

class SpatialHash {

    private stored = new Map<Point, Set<number>>


    constructor(private chunkSize: number){}
    

    //the idea is to take make it so 
    private hash(id: number , x: number,y: number,w: number,h: number) {    

        const xs = Math.ceil(x/this.chunkSize);
        const xe = Math.ceil((x+w) / this.chunkSize);

        const ys = Math.ceil(y/this.chunkSize);
        const ye = Math.ceil((y+h)/ this.chunkSize);
        
        const dx = xe - xs
        const dy = ye - ys
        
    }

    private generateKeys(x: number , y: number , dx: number, dy: number): Point[]{
        let res : Point[] = []

        for (let i = 0; i<= dx ; i++)
            for(let j=0;j<=dy; j++)
            {
                res.push({x: x+i, y: y+j})
            }
        
        return res;
    }

    public updateObject(id: number , x: number , y: number , w: number, h: number ){
        
    }
}   