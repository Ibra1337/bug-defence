import SpatialHash from "../gameplay/SpatialHash";

describe('SpatialHash', () => {
    let spatialHash: SpatialHash;

    beforeEach(() => {
        spatialHash = new SpatialHash(100); 
    });

    test('insertObject adds object to correct grid cells', () => {
        spatialHash.insertObject(1, 50, 50, 50, 50); 

        const nearby = spatialHash.getNearbyObjects(0, 0, 100, 100);
        expect(nearby.has(1)).toBe(true);
    });

    test('updateObject correctly updates grid cell assignments', () => {
        spatialHash.insertObject(2, 50, 50, 50, 50);
        spatialHash.updateObject(2, 150, 150);

        const oldNearby = spatialHash.getNearbyObjects(0, 0, 100, 100);
        const newNearby = spatialHash.getNearbyObjects(150, 150, 50, 50);

        expect(oldNearby.has(2)).toBe(false);
        expect(newNearby.has(2)).toBe(true);
    });

    test('removeObject removes object from all grid cells', () => {
        spatialHash.insertObject(3, 50, 50, 50, 50);
        const removed = spatialHash.removeObject(3);
        const nearby = spatialHash.getNearbyObjects(0, 0, 100, 100);

        expect(removed).toBe(true);
        expect(nearby.has(3)).toBe(false);
    });

    test('removeObject returns false if object does not exist', () => {
        const removed = spatialHash.removeObject(999);
        expect(removed).toBe(false);
    });

    test('getNearbyObjects returns all objects in the area', () => {
        spatialHash.insertObject(4, 0, 0, 50, 50);
        spatialHash.insertObject(5, 200, 200, 50, 50);

        const nearby = spatialHash.getNearbyObjects(0, 0, 100, 100);
        expect(nearby.has(4)).toBe(true);
        expect(nearby.has(5)).toBe(false);
    });

    test('getObjectsInCircle returns sorted objects within radius', () => {
        spatialHash.insertObject(6, 50, 50, 20, 20);  
        spatialHash.insertObject(7, 200, 200, 20, 20);

        const objectsInCircle = spatialHash.getObjectsInCircle(50, 50, 100);
        const ids = objectsInCircle.map(([_, id]) => id);

        expect(ids.includes(6)).toBe(true);
        expect(ids.includes(7)).toBe(false);
        expect(objectsInCircle[0][1]).toBe(6); 
    });

    test('insertObject spanning multiple cells is retrievable from all covered cells', () => {
        spatialHash.insertObject(8, 90, 90, 30, 30); 

        const nearbyCell00 = spatialHash.getNearbyObjects(0, 0, 100, 100);
        const nearbyCell11 = spatialHash.getNearbyObjects(100, 100, 100, 100);

        expect(nearbyCell00.has(8)).toBe(true);
        expect(nearbyCell11.has(8)).toBe(true);
    });

    test('updateObject to same position does not remove/add to grid unnecessarily', () => {
        spatialHash.insertObject(9, 100, 100, 50, 50);
        const oldCellKeys = new Set(spatialHash['objectPositions'].get(9)?.cellKeys);

        spatialHash.updateObject(9, 100, 100);
        const newCellKeys = spatialHash['objectPositions'].get(9)?.cellKeys;

        expect(newCellKeys).toEqual(oldCellKeys);
    });
});
