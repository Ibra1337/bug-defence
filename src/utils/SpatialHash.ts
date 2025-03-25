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
 
         return this.generateKeys(xs, ys, xe, ye);
     }
 
     private generateKeys(xs: number, ys: number, xe: number, ye: number): string[] {
         let res: string[] = [];
         for (let x = xs; x <= xe; x++) {
             for (let y = ys; y <= ye; y++) {
                 res.push(`${x},${y}`);
             }
         }
         return res;
     }
 
     public insertObject(id: number, x: number, y: number, w: number, h: number) {
         this.remove(id); // Ensure no duplicate before inserting
         const keys = this.hash(x, y, w, h);
         this.keyMap.set(id, new Set(keys));
 
         for (const key of keys) {
             if (!this.spaceMap.has(key)) this.spaceMap.set(key, new Set<number>());
             this.spaceMap.get(key)!.add(id);
         }
     }
 
     public remove(id: number) {
        const keys = this.keyMap.get(id);
        if (!keys) return;
 
        for (const key of keys) {
            const cell = this.spaceMap.get(key);
            if (cell) {
                cell.delete(id);
                if (cell.size === 0) this.spaceMap.delete(key);
            }
        }
        this.keyMap.delete(id);
    }
 
    public updateObject(id: number, x: number, y: number, w: number, h: number) {
        const newKeys = this.hash(x, y, w, h);
        const oldKeys = this.keyMap.get(id);

        if (!oldKeys || !this.areSetsEqual(new Set(newKeys), oldKeys)) {
            this.insertObject(id, x, y, w, h);
        }
    }
 
    public getNearbyObjects(x: number, y: number, w: number, h: number): Set<number> {
        const keys = this.hash(x, y, w, h);
        const result = new Set<number>();
 
        for (const key of keys) {
            const cell = this.spaceMap.get(key);
            if (cell) {
                cell.forEach(id => result.add(id));
            }
        }
        return result;
    }
    

    public getObejctsInRange(centerX: number, centerY: number, radius: number): Set<number> {
        const keys = this.hash(centerX - radius, centerY - radius, radius * 2, radius * 2);
        const result = new Set<number>();
        const radiusSquared = radius * radius;

        for (const key of keys) {
            const cell = this.spaceMap.get(key);
            if (!cell) continue;

            for (const id of cell) {
                if (this.isObjectInCircle(id, centerX, centerY, radiusSquared)) {
                    result.add(id);
                }
            }
        }

        return result;
    }

    private isObjectInCircle(id: number, centerX: number, centerY: number, radiusSquared: number): boolean {
        const objKeys = this.keyMap.get(id);
        if (!objKeys) return false;

        for (const key of objKeys) {
            const [cellX, cellY] = key.split(',').map(Number);
             const objMinX = cellX * this.chunkSize;
             const objMinY = cellY * this.chunkSize;
            const objMaxX = objMinX + this.chunkSize;
            const objMaxY = objMinY + this.chunkSize;

            const closestX = Math.max(objMinX, Math.min(centerX, objMaxX));
            const closestY = Math.max(objMinY, Math.min(centerY, objMaxY));

            const dx = closestX - centerX;
            const dy = closestY - centerY;
            
             if (dx * dx + dy * dy <= radiusSquared) {
                return true;
            }
        }
        return false;
    }
    
    public getTotalObjects(): number {
        return this.keyMap.size;
    }
    
    public getTotalCells(): number {
        return this.spaceMap.size;
    }

    private areSetsEqual(setA: Set<string>, setB: Set<string>): boolean {
        if (setA.size !== setB.size) return false;
        for (const item of setA) {
            if (!setB.has(item)) return false;
        }
        return true;
    }
}

export function getMobsSortedByDistance(
    mobs: Map<number, Mob>,
    ids: Set<number>,
    x: number,
    y: number,
    maxDistance?: number
): { mob: Mob; distance: number }[] {  
    const maxDistanceSquared = maxDistance !== undefined ? maxDistance * maxDistance : Infinity;

    return Array.from(ids)
        .map(id => {
            const mob = mobs.get(id);
            if (!mob) return null; 

            const dx = mob.x - x;
            const dy = mob.y - y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared > maxDistanceSquared) return null;

            return { mob, distance: Math.sqrt(distanceSquared) };  
        })
        .filter((entry): entry is { mob: Mob; distance: number } => entry !== null) 
        .sort((a, b) => a.distance - b.distance);  
}
