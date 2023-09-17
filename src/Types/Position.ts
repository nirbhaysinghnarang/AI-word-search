
export type Position = {
    row: number,
    col: number
}

export function isValidPosition(pos: Position, rows:number, cols:number):boolean{
    return pos.row >= 0 && pos.row < rows && pos.col > 0 && pos.col < cols;
}

export function getRandomPos(rows:number, cols:number):Position{
    return {
        row: Math.floor(Math.random() * rows),
        col:Math.floor(Math.random() * cols),
    }
}