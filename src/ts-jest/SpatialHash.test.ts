import SpatialHash from "../utils/SpatialHash";

describe("SpatialHash Tests", () => {
    let spatialHash: SpatialHash;

    beforeEach(() => {
        spatialHash = new SpatialHash(10); 
    });

    test("Insert and retrieve an object", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5);
        const objects = spatialHash.getNearbyObjects(10, 10, 5, 5);
        expect(objects.has(1)).toBe(true);
        expect(spatialHash.getTotalObjects()).toBe(1);
    });

    test("Remove an object", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5);
        spatialHash.remove(1);
        expect(spatialHash.getTotalObjects()).toBe(0);
        expect(spatialHash.getNearbyObjects(10, 10, 5, 5).size).toBe(0);
    });

    test("Update an object's position", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5);
        spatialHash.updateObject(1, 30, 30, 5, 5);

        expect(spatialHash.getNearbyObjects(10, 10, 5, 5).has(1)).toBe(false);
        expect(spatialHash.getNearbyObjects(30, 30, 5, 5).has(1)).toBe(true);
    });

    test("Get nearby objects", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5);
        spatialHash.insertObject(2, 15, 15, 5, 5);
        spatialHash.insertObject(3, 50, 50, 5, 5);

        const nearby = spatialHash.getNearbyObjects(10, 10, 10, 10);
        expect(nearby.has(1)).toBe(true);
        expect(nearby.has(2)).toBe(true);
        expect(nearby.has(3)).toBe(false);
    });



    test("Grid size should update correctly", () => {
        expect(spatialHash.getTotalCells()).toBe(0);
        
        spatialHash.insertObject(1, 10, 10, 5, 5);
        expect(spatialHash.getTotalCells()).toBeGreaterThan(0);
        
        spatialHash.remove(1);
        expect(spatialHash.getTotalCells()).toBe(0);
    });
});
