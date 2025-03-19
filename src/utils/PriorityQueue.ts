export default class PriorityQueue<T> {
    private heap: { value: T, priority: number }[] = [];
    private comparator: (a: number, b: number) => number;

    constructor(comparator?: (a: number, b: number) => number) {
        this.comparator = comparator || ((a, b) => a - b);
    }

    private swap(i: number, j: number): void {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    private heapifyUp(index: number): void {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.comparator(this.heap[currentIndex].priority, this.heap[parentIndex].priority) >= 0) break;
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
        }
    }

    private heapifyDown(index: number): void {
        let currentIndex = index;
        const lastIndex = this.heap.length - 1;

        while (currentIndex * 2 + 1 <= lastIndex) {
            const leftChildIndex = currentIndex * 2 + 1;
            const rightChildIndex = currentIndex * 2 + 2;
            let childIndexToCompare = leftChildIndex;

            if (rightChildIndex <= lastIndex && this.comparator(this.heap[rightChildIndex].priority, this.heap[leftChildIndex].priority) < 0) {
                childIndexToCompare = rightChildIndex;
            }

            if (this.comparator(this.heap[currentIndex].priority, this.heap[childIndexToCompare].priority) <= 0) break;

            this.swap(currentIndex, childIndexToCompare);
            currentIndex = childIndexToCompare;
        }
    }

    enqueue(value: T, priority: number): void {
        const newNode = { value, priority };
        this.heap.push(newNode);
        this.heapifyUp(this.heap.length - 1);
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) return undefined;

        const minValue = this.heap[0].value;
        const lastNode = this.heap.pop();

        if (!this.isEmpty()) {
            this.heap[0] = lastNode!;
            this.heapifyDown(0);
        }

        return minValue;
    }

    peek(): T | undefined {
        return this.isEmpty() ? undefined : this.heap[0].value;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    size(): number {
        return this.heap.length;
    }
}
