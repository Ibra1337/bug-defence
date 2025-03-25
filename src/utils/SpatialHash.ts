import Mob from "../gameplay/gameElements/mobs/Mob";

 export interface Point { x: number, y: number }

export default class SpatialHash {
    private spaceMap = new Map<string, Set<number>>();
    private keyMap = new Map<number, Set<string>>();

    constructor(private chunkSize: number) {}

    private hash(x: number, y: number, w: number, h: number): string[] {
        const xs = Math.floor(x / this.chunkSize);
        const xe = Math.floor((x + w) / this.chunkSize);
        const ys = Math.floor(y / this.chunkSize);
        const ye = Math.floor((y + h) / this.chunkSize);

        return this.generateKeys(xs, ys, xe - xs, ye - ys);
    }

    private generateKeys(x: number, y: number, dx: number, dy: number): string[] {
        let res: string[] = [];
        for (let i = 0; i <= dx; i++) {
            for (let j = 0; j <= dy; j++) {
                res.push(`${x + i},${y + j}`);
            }
        }
        return res;
    }

    public insertObject(id: number, x: number, y: number, w: number, h: number) {
        let keys = this.hash(x, y, w, h);
        let ref = new Set<string>();
        this.keyMap.set(id, ref);

        for (const key of keys) {
            if (!this.spaceMap.has(key)) this.spaceMap.set(key, new Set<number>());
            this.spaceMap.get(key)!.add(id);
            ref.add(key);
        }
    }

    public remove(id: number) {
        let boxes = this.keyMap.get(id);
        if (!boxes) {
            console.warn(`Warning: Tried to remove non-existent object ${id}`);
            return;
        }

        for (const key of boxes) {
            const cell = this.spaceMap.get(key);
            if (cell) {
                const removed = cell.delete(id);
                console.log(`Object ${id} ${removed ? 'removed' : 'not found'} from cell ${key}`);

                if (cell.size === 0) {
                    this.spaceMap.delete(key);
                    console.log(`Cell ${key} is now empty and removed.`);
                }
            }
        }
        this.keyMap.delete(id);
    }

    public updateObject(id: number, x: number, y: number, w: number, h: number) {
        let keys = this.hash(x, y, w, h);
        let boxes = this.keyMap.get(id);

        if (!boxes || JSON.stringify([...keys]) !== JSON.stringify([...boxes])) {
            this.remove(id);
            this.insertObject(id, x, y, w, h);
        }

        console.log(`Updated object ${id}, total tracked objects: ${this.keyMap.size}`);
    }

    public getNearbyObjects(x: number, y: number, w: number, h: number): Set<number> {
        const keys = this.hash(x, y, w, h);
        let result = new Set<number>();
    
        for (const key of keys) {
            const cell = this.spaceMap.get(key);
            if (cell) {
                for (const id of cell) {
                    result.add(id);
                }
            }
        }
    
        return result;
    }


    public getObjectsInCircle(centerX: number, centerY: number, radius: number): Set<number> {
        const keys = this.hash(centerX - radius, centerY - radius, radius * 2, radius * 2);
        let result = new Set<number>();
        const radiusSquared = radius * radius;
        console.log(keys)
        for (const key of keys) {
            const cell = this.spaceMap.get(key);
            if (cell) {
                for (const id of cell) {
                    let objKeys = this.keyMap.get(id);
                    if (objKeys) {
                        for (const objKey of objKeys) {
                            const [cellX, cellY] = objKey.split(',').map(Number);
                            const objMinX = cellX * this.chunkSize;
                            const objMinY = cellY * this.chunkSize;
                            const objMaxX = objMinX + this.chunkSize;
                            const objMaxY = objMinY + this.chunkSize;

                            const closestX = Math.max(objMinX, Math.min(centerX, objMaxX));
                            const closestY = Math.max(objMinY, Math.min(centerY, objMaxY));
    
                            const dx = closestX - centerX;
                            const dy = closestY - centerY;
    
                            if (dx * dx + dy * dy <= radiusSquared) {
                                result.add(id);
                                break;
                            }
                        }
                    }
                }
            }
        }
    
        return result;
    }
    

    

    public getTotalObjects(): number {
        return this.keyMap.size;
    }
    
    public getTotalCells(): number {
        return this.spaceMap.size;
    }
    
}
export function getMobsSortedByDistance(
    mobs: Map<number, Mob>,
    ids: Set<number>,
    x: number,
    y: number
): { mob: Mob; distance: number }[] {  
    return Array.from(ids)
        .map(id => {
            const mob = mobs.get(id);
            if (!mob) return null; 
            const dx = mob.x - x;
            const dy = mob.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return { mob, distance };  
        })
        .filter((entry): entry is { mob: Mob; distance: number } => entry !== null) 
        .sort((a, b) => a.distance - b.distance);  
}