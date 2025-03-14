export default class SpatialHash {
    private cellSize: number;
    private grid: Map<string, Set<number>>; 
    private objectPositions: Map<number, { x: number, y: number, width: number, height: number, cellKeys: Set<string> }>; // Track occupied cells

    constructor(cellSize: number) {
        this.cellSize = cellSize;
        this.grid = new Map();
        this.objectPositions = new Map();
    }

    private getCellKeys(x: number, y: number, width: number, height: number): Set<string> {
        const cellKeys = new Set<string>();

        const startX = Math.floor(x / this.cellSize);
        const startY = Math.floor(y / this.cellSize);
        const endX = Math.floor((x + width) / this.cellSize);
        const endY = Math.floor((y + height) / this.cellSize);

        for (let cx = startX; cx <= endX; cx++) {
            for (let cy = startY; cy <= endY; cy++) {
                cellKeys.add(`${cx},${cy}`);
            }
        }
        return cellKeys;
    }

    public insertObject(id: number, x: number, y: number, width: number, height: number) {
        const cellKeys = this.getCellKeys(x, y, width, height);
        for (const key of cellKeys) {
            if (!this.grid.has(key)) this.grid.set(key, new Set());
            this.grid.get(key)!.add(id);
        }
        this.objectPositions.set(id, { x, y, width, height, cellKeys });
    }

    public updateObject(id: number, newX: number, newY: number) {
        const obj = this.objectPositions.get(id);
        if (!obj) return;

        const newCellKeys = this.getCellKeys(newX, newY, obj.width, obj.height);
        
        if (![...obj.cellKeys].every(key => newCellKeys.has(key))) { 
            for (const key of obj.cellKeys) this.grid.get(key)?.delete(id);
            for (const key of newCellKeys) {
                if (!this.grid.has(key)) this.grid.set(key, new Set());
                this.grid.get(key)!.add(id);
            }
            obj.cellKeys = newCellKeys;
        }

        obj.x = newX;
        obj.y = newY;
    }

    public removeObject(id: number) {
        const obj = this.objectPositions.get(id);
        if (!obj) return;
        for (const key of obj.cellKeys) {
            this.grid.get(key)?.delete(id);
        }
        this.objectPositions.delete(id);
    }

    public getNearbyObjects(x: number, y: number, width: number, height: number): Set<number> {
        const nearbyObjects = new Set<number>();
        const cellKeys = this.getCellKeys(x, y, width, height);
        
        for (const key of cellKeys) {
            if (this.grid.has(key)) {
                this.grid.get(key)!.forEach(id => nearbyObjects.add(id));
            }
        }
        return nearbyObjects;
    }
    /**
     * Return the sorted array as a list of pairs (distance, object ID).
     * @param centerX 
     * @param centerY 
     * @param radius 
     * @returns 
     */
    public getObjectsInCircle(centerX: number, centerY: number, radius: number): Array<[number, number]> {
        const nearbyObjects: Array<[number, number]> = []; 
        const searchCells = this.getCellKeys(centerX - radius, centerY - radius, radius * 2, radius * 2);
    
        for (const key of searchCells) {
            if (this.grid.has(key)) {
                for (const id of this.grid.get(key)!) {
                    const obj = this.objectPositions.get(id);
                    if (obj) {
                        const objCenterX = obj.x + obj.width / 2;
                        const objCenterY = obj.y + obj.height / 2;
    
                        const dx = objCenterX - centerX;
                        const dy = objCenterY - centerY;
    
                        const distanceSquared = dx * dx + dy * dy;
                        if (distanceSquared <= radius * radius * 1.1) {     
                            nearbyObjects.push([Math.sqrt(distanceSquared), id]);
                        }
                    }
                }
            }
        }
    

        nearbyObjects.sort((a, b) => a[0] - b[0]);
    
        return nearbyObjects;
    }
}
