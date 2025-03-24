export default class SpatialHash {
    private cellSize: number;
    private grid: Map<string, Set<number>>;
    private objectPositions: Map<number, { x: number, y: number, width: number, height: number, cellKeys: Set<string> }>;

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
            let cellSet = this.grid.get(key);
            if (!cellSet) {
                cellSet = new Set();
                this.grid.set(key, cellSet);
            }
            cellSet.add(id);
        }
        this.objectPositions.set(id, { x, y, width, height, cellKeys });
    }

    public updateObject(id: number, newX: number, newY: number) {
        const obj = this.objectPositions.get(id);
        if (!obj) return;
    
        const newCellKeys = this.getCellKeys(newX, newY, obj.width, obj.height);
    
        const oldCellKeys = obj.cellKeys;
        const sameCells = oldCellKeys.size === newCellKeys.size &&
            [...oldCellKeys].every(key => newCellKeys.has(key));
    
        if (!sameCells) {

            for (const key of oldCellKeys) {
                const cellSet = this.grid.get(key);
                if (cellSet) {
                    cellSet.delete(id);
                    if (cellSet.size === 0) {
                        this.grid.delete(key);
                    }
                }
            }
    

            for (const key of newCellKeys) {
                let cellSet = this.grid.get(key);
                if (!cellSet) {
                    cellSet = new Set();
                    this.grid.set(key, cellSet);
                }
                cellSet.add(id);
            }
    
            obj.cellKeys = newCellKeys;
        }
    
        obj.x = newX;
        obj.y = newY;
    }
    
    public removeObject(id: number): boolean {
        const obj = this.objectPositions.get(id);
        if (!obj) {
            console.warn(`removeObject: ID ${id} not found.`);
            return false;
        }
    

        for (const key of obj.cellKeys) {
            const cellSet = this.grid.get(key);
            if (cellSet) {
                if (!cellSet.delete(id)) {
                    console.warn(`removeObject: ID ${id} was not in cell ${key}.`);
                }
                if (cellSet.size === 0) {
                    this.grid.delete(key);
                }
            }
        }

        this.objectPositions.delete(id);
        return true;
    }

    public getNearbyObjects(x: number, y: number, width: number, height: number): Set<number> {
        const nearbyObjects = new Set<number>();
        const cellKeys = this.getCellKeys(x, y, width, height);

        for (const key of cellKeys) {
            const cellSet = this.grid.get(key);
            if (cellSet) {
                cellSet.forEach(id => nearbyObjects.add(id));
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
        const radiusSquared = radius * radius;

        for (const key of searchCells) {
            const cellSet = this.grid.get(key);
            if (cellSet) {
                for (const id of cellSet) {
                    const obj = this.objectPositions.get(id);
                    if (obj) {
                        const objCenterX = obj.x + obj.width / 2;
                        const objCenterY = obj.y + obj.height / 2;

                        const dx = objCenterX - centerX;
                        const dy = objCenterY - centerY;

                        const distanceSquared = dx * dx + dy * dy;
                        if (distanceSquared <= radiusSquared) {
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
