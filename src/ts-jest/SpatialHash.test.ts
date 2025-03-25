import SpatialHash from "../utils/SpatialHash";

describe("SpatialHash", () => {
    let spatialHash: SpatialHash;

    beforeEach(() => {
        spatialHash = new SpatialHash(10);
    });

    test("getObjectsInCircle should return objects fully inside the circle", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5); // Inside
        spatialHash.insertObject(2, 20, 20, 5, 5); // Inside
        spatialHash.insertObject(3, 50, 50, 5, 5); // Outside

        let result = spatialHash.getObejctsInRange(15, 15, 10);

        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(false);
    });

    test("getObjectsInCircle should return objects touching the circle boundary", () => {
        spatialHash.insertObject(1, 15, 15, 5, 5); // Fully inside
        spatialHash.insertObject(2, 25, 15, 5, 5); // Right on the edge
        spatialHash.insertObject(3, 40, 40, 5, 5); // Well outside

        let result = spatialHash.getObejctsInRange(15, 15, 10);

        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(false);
    });

    test("getObjectsInCircle should handle large objects spanning the circle boundary", () => {
        spatialHash.insertObject(1, 5, 5, 20, 20); // Large, overlapping the circle
        spatialHash.insertObject(2, 30, 30, 10, 10); // Outside
        spatialHash.insertObject(3, 0, 0, 5, 5); // Fully inside

        let result = spatialHash.getObejctsInRange(15, 15, 10);

        expect(result.has(1)).toBe(true); // Large object should be included
        expect(result.has(2)).toBe(false);
        expect(result.has(3)).toBe(true);
    });

    test("getObjectsInCircle should return an empty set if no objects are inside", () => {
        spatialHash.insertObject(1, 50, 50, 10, 10);
        spatialHash.insertObject(2, 60, 60, 5, 5);

        let result = spatialHash.getObejctsInRange(10, 10, 5);

        expect(result.size).toBe(0);
    });

    test("getObjectsInCircle should work with a small radius", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5);
        spatialHash.insertObject(2, 15, 15, 5, 5);
        spatialHash.insertObject(3, 30, 30, 5, 5);
        spatialHash.insertObject(4, 20, 20, 10, 10);

        let result = spatialHash.getObejctsInRange(12, 12, 3);

        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(false);
        expect(result.has(4)).toBe(false);
    });

    test("getObjectsInCircle should work with a very large radius", () => {
        spatialHash.insertObject(1, 10, 10, 5, 5);
        spatialHash.insertObject(2, 30, 30, 5, 5);
        spatialHash.insertObject(3, 100, 100, 5, 5);

        let result = spatialHash.getObejctsInRange(50, 50, 100);

        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(true);
    });

});
