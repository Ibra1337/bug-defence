import Config from "../Config";
import { CellStatus } from "../types/CellStatus";
import PriorityQueue from "./PriorityQueue";

export type Point = { x: number; y: number };

class Cell {
    public parent: Point;
    public f: number;
    public g: number;
    public h: number;

    constructor(parent: Point, f: number, g: number, h: number) {
        this.parent = parent;
        this.f = f;
        this.g = g;
        this.h = h;
    }
}

const DIRECTIONS = [
    { x: 1, y: 0 },  
    { x: -1, y: 0 }, 
    { x: 0, y: 1 }, 
    { x: 0, y: -1 } 
];

function isValid(cell: Point, map: number[][]): boolean {
    return cell.y >= 0 && cell.y < map.length &&
           cell.x >= 0 && cell.x < map[cell.y].length;
}

function isBlocked(cell: Point, map: number[][]): boolean {
    return map[cell.y][cell.x] === CellStatus.Obstacle;
}

function calculateHValue(current: Point, goal: Point): number {
    
    return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y);
}

function create2DArray<T>(rows: number, cols: number, initialValue: () => T): T[][] {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => initialValue())
    );
}

function validate(map: number[][], src: Point, dest: Point): boolean {
    if (!isValid(src, map)) {
        console.log("Invalid source:", src);
        return false;
    }
    if (!isValid(dest, map)) {
        console.log("Invalid destination:", dest);
        return false;
    }
    if (isBlocked(src, map) || isBlocked(dest, map)) {
        console.log("Source or destination is blocked");
        return false;
    }
    return true;
}

function tracePath(cellDetails: Cell[][], dest: Point): Point[] {
    const path: Point[] = [];
    let cell = dest;

    path.push(cell);

    while (!(cellDetails[cell.y][cell.x].parent.x === cell.x &&
             cellDetails[cell.y][cell.x].parent.y === cell.y)) {
        cell = cellDetails[cell.y][cell.x].parent;
        path.push(cell);
    }


    for (let i = 1; i < path.length; i++) {
        const a = path[i - 1];
        const b = path[i];
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        if (dx + dy !== 1) {
            console.warn("⚠️ Diagonal move detected between", a, "and", b);
        }
    }

    return path.reverse();  
}

export default function findPath(map: number[][], src: Point, dest: Point): Point[] | null {
    if (!validate(map, src, dest)) return null;

    const rows = map.length;
    const cols = map[0].length;
    const closedList = create2DArray(rows, cols, () => false);
    const cellDetails = create2DArray(rows, cols, () => new Cell({ x: -1, y: -1 }, Infinity, Infinity, Infinity));


    cellDetails[src.y][src.x] = new Cell(src, 0, 0, 0);

    const openList = new PriorityQueue<Point>();
    openList.enqueue(src, 0);

    while (openList.size() > 0) {
        const current = openList.dequeue()!;
        const { x, y } = current;
        closedList[y][x] = true;

        for (const dir of DIRECTIONS) {
            const neighbor = { x: x + dir.x, y: y + dir.y };

            if (isValid(neighbor, map) && !isBlocked(neighbor, map) && !closedList[neighbor.y][neighbor.x]) {
                if (neighbor.x === dest.x && neighbor.y === dest.y) {
                    cellDetails[neighbor.y][neighbor.x].parent = { x, y };
                    return tracePath(cellDetails, dest);
                }

                const gNew = cellDetails[y][x].g + 1;
                const hNew = calculateHValue(neighbor, dest);
                const fNew = gNew + hNew;

                if (cellDetails[neighbor.y][neighbor.x].f > fNew) {
                    openList.enqueue(neighbor, fNew);
                    cellDetails[neighbor.y][neighbor.x] = new Cell({ x, y }, fNew, gNew, hNew);
                }
            }
        }
    }

    console.log("No path found.");
    return null;
}

export interface StartEndPositions {
    start: Point | null;
    end: Point | null;
}

export function findStartAndEnd(board: number[][]): StartEndPositions {
    let start: Point | null = null;
    let end: Point | null = null;

    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const cell = board[y][x];
            if (cell === CellStatus.Start) start = { x, y };
            else if (cell === CellStatus.End) end = { x, y };
        }
    }
    return { start, end };
}

export function boardToPixelCoords(path: Point[]): Point[] {
    const res: Point[] = [];
    const xs = Config.height / Config.blockNumber;
    const ys = Config.width / Config.blockNumber;

    for (const el of path) {
        res.push({
            x: xs * el.x + xs / 2,
            y: ys * el.y + ys / 2
        });
    }
    return res;
}
