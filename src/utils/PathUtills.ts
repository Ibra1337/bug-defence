
import Config from "../Config";
import { CellStatus } from "../types/CellStatus";

import PriorityQueue  from "./PriorityQueue";

class Cell {
    
    public parent: Point
    public f: number  | null;
    public g: number | null;
    public h: number | null;

    constructor( parent: {x: number , y: number} , f: number, g: number, h: number ){
        this.parent = parent;
        this.f = f;
        this.g = g;
        this.h = h;
    }
}

type Point = { x: number; y: number };

const DIRECTIONS = [{x:1,y:0} , {x:-1 , y: 0} , {x:0 , y:1} , {x:0 , y:-1}]



function isValid(cell: Point , map:number[][]): boolean{
    return cell.y < map.length && cell.y >= 0 && cell.x>=0 && cell.x <map[cell.y].length;  
}

function isBlocked(cell :Point, map: number[][]): boolean{
    return map[cell.y][cell.x] === CellStatus.Obstacle;
}


// function isBlockedAllDirs(cell :Point, map: number[][]): boolean{
//     let counter = 0;
//     for (const dir of DIRECTIONS){
//         const p = {y: cell.y +dir.y , x: cell.x + dir.x}
//         if(isValid(p , map)){
//             if(map[cell.y + dir.y] [ cell.x + dir.x] === CellStatus.Obstacle )
//                 {
//                     counter++;
//                 }
//             }else 
//                 counter++;
//     } 
//         if (counter ===4)
//             console.log("blocked 4 dir", cell);
//     return counter ===4;
// }

function calculateHValue( current_cell: Point, goal: Point){
    const dx = Math.abs(current_cell.x - goal.x)
    const dy = Math.abs(current_cell.y - goal.y)
    const D = 1;
    const D2 = Math.SQRT2
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
}
function create2DArray<T>(rows: number, cols: number, initialValue: () => T): T[][] {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => initialValue())
    );
}

function validate(map: number[][] , src: Point , dest: Point): boolean{
    if(!isValid(src, map))
    {console.log("ser not val")
        return false
    }
    if (!isValid(dest , map) )
        {console.log("dest not val: " , dest)
        return false}
    
    return !isBlocked(src , map) && !isBlocked(dest , map);
}

//  function destReached(cell: Point, dest: Point): boolean{
//     return cell === dest
//  }

 function tracePath(cellDetails: Cell[][] , dest: Point): Point[]{
    console.log("==============Path====================");
    let path: Point[] = [];
    let cell = dest;

    while ( cellDetails[cell.y][cell.x].parent != cell ){
        path.push(cell);
        cell = cellDetails[cell.y][cell.x].parent   ;
    }
    return path;    
}
//finding paht using A* alg 
export default function findPath(map: number[][] , src: Point , dest: Point): Point[] | null{
    if(!validate(map , src , dest)){
        console.log("Duck")
        return null;
    }

    let closed_list = create2DArray(map.length, map[0].length, () => false);
    let cellDetails = create2DArray(map.length, map[0].length, () => new Cell({x:-1,y:-1},-1,-1,-1,));
    
    let x =src.x;
    let y = src.y;

    cellDetails[x][y].f = 0;
    cellDetails[x][y].g = 0;
    cellDetails[x][y].h = 0;
    cellDetails[x][y].parent = src

    const openedList =  new PriorityQueue<Point>((a:number, b:number) => b - a);
    openedList.enqueue(src ,0)
    while (openedList.size() !=0){
        const c = openedList.dequeue();
        x = c!.x;
        y = c!.y;
        console.log("curr: " , c)
    for (const dir of DIRECTIONS){
        let nc ={
            x: x + dir.x,
            y: y + dir.y
        }
        console.log("== " , nc)
        if (isValid(nc, map) && !isBlocked(nc , map) && !closed_list[nc.y][nc.x]){
            if( nc.x === dest.x && nc.y ===dest.y ){
                
                cellDetails[nc.y][nc.x].parent = {x: x , y: y};
                const path = tracePath(cellDetails,dest)
                console.log("dest Reached, nc: ", nc , " " , cellDetails[nc.x][nc.y].parent)
                console.log(JSON.stringify(cellDetails))
                return path;
            }
            const g  = cellDetails[y][x].g! + 1;
            const h = calculateHValue(nc, dest);
            const f = h+g;
            if (cellDetails[nc.y][nc.x].f === -1 || cellDetails[nc.y][nc.x].f!> f ){
                
                openedList.enqueue(nc , f)
                
                cellDetails[nc.y][nc.x].f = f;
                cellDetails[nc.y][nc.x].g = g;
                cellDetails[nc.y][nc.x].h = h;
                cellDetails[nc.y][nc.x].parent = {x:x , y:y};
            }
        }
    }
    }
    console.log()
    return null;
}

export interface StartEndPositions {
    start: Point | null;
    end: Point | null;
}
export function findStartAndEnd(board: number[][]): StartEndPositions {
    let start: Point | null = null;
    let end: Point | null = null;

    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            const cellValue = board[x][y];
            if (cellValue === CellStatus.Start) {
                start = { x, y };
            } else if (cellValue === CellStatus.End) {
                end = { x, y };
            }
        }
    }
    return { start, end };
}
export function boardToPixelCoords(path: Point[]): Point[]{
    let res :Point[] = []
    console.log(path)
    const xs = Config.height/Config.blockNumber;
    const ys = Config.width/Config.blockNumber;
    for(const el of path){
        let r = {
            x: xs*el.x+ xs/2,
            y: ys*el.y +ys/2
        }
        res.push(r);
    }
    return res;
}