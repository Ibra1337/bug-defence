import { CellStatus } from "../types/CellStatus";
import findPath from "../utils/PathFinder";


test("path found with obstacles" , () => {
    const g: CellStatus[][] = [
        [CellStatus.Start, CellStatus.Obstacle, CellStatus.Free],
        [CellStatus.Free,  CellStatus.Free, CellStatus.Free],
        [CellStatus.Free,  CellStatus.Obstacle, CellStatus.End]
    ];
    let res = findPath(g , {x:0 , y:0} , {x:2,y:2})
    let c =[
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 }
    ]
    expect(res?.length === c.length).toBe(true);
    for(let i =0; i<res!.length ; i++){
        expect(res![i].x ).toBe(c[i].x)
        expect(res![i].y).toBe(c[i].y)    
    }   

})


test("no path avaliable" , () =>{
    const g: CellStatus[][] = [
        [CellStatus.Start, CellStatus.Obstacle, CellStatus.Free],
        [CellStatus.Free,  CellStatus.Obstacle, CellStatus.Free],
        [CellStatus.Free,  CellStatus.Obstacle, CellStatus.End]
    ];
    let res = findPath(g , {x:0 , y:0} , {x:2,y:2})
    expect(res).toBeNull();
})