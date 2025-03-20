
import PriorityQueue from "../utils/PriorityQueue";

test("" , () => {
    const p =  new PriorityQueue<number>();
    p.enqueue(50,3);
    p.enqueue(40,1);
    p.enqueue(20,2);
    p.enqueue(29,31)

    expect(p.dequeue()).toBe(40);
    expect(p.dequeue()).toBe(20);
    expect(p.dequeue()).toBe(50);
    expect(p.dequeue()).toBe(29);

})

