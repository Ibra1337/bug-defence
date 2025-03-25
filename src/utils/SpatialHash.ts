interface Point { x: number, y: number }

class SpatialHash {
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
}
