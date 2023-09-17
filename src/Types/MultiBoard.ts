
import { Word } from "./Word"
import { Position } from "./Position"
export type MultiBoard = {
    content: string[][],
    words: Word[],
    rows:number,
    cols:number
    currentPosition: Position,
    exploredPositions: Position[],
    wordToColorMapping: Map<Word, string>,
    wordMapping: Map<Word, Map<number, Position> | null>,
    wordToCurrentIndexMapping: Map<Word, number>
}
