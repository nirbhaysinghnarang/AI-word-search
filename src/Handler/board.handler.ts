import { Position, getRandomPos } from "../Types/Position";
import { Word } from "../Types/Word";
import { Direction } from "../Types/Direction";

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


const Directions: Direction[] = [
    { row_delta: -1, col_delta: 0 },
    { row_delta: 1, col_delta: 0 },
    { row_delta: 0, col_delta: -1 },
    { row_delta: 0, col_delta: 1 },
]


type WordColorMapping = Map<Word, string>;


function generateWordColorMapping(words: Word[]): WordColorMapping {
    const colors: string[] = [
        "#FFA07A", // Light Salmon (Red)
        "#98FB98", // Pale Green (Green)
        "#ADD8E6", // Light Blue (Blue)
        "#FFB6C1", // Light Pink (Purple)
        "#FFFFE0", // Light Yellow (Yellow)
    ];
    const wordColorMapping: WordColorMapping = new Map();
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const color = colors[i % colors.length]; // Cycle through colors
        wordColorMapping.set(word, color);
    }
    return wordColorMapping;
}

export function initializeMultiBoard(
    words: Word[],
    cols: number,
    rows: number
) {
    function positionToString(position: Position): string {
        return `${position.row},${position.col}`;
    }

    function getRandomChar(): string {
        return 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    }

    function isValidPosition(position: Position, rows: number, cols: number) {
        return position.row >= 0 && position.row< rows && position.col >= 0 && position.col < cols
    }

    function embedWord(
        word: Word,
        currentIndex: number,
        currentPosition: Position,
        visited: Set<String>,
        alreadyUsed: Set<String>,
        indexMapping: Map<number, Position>
    ): Map<number, Position> | null {
    
        if (currentIndex >= word.word.length) return indexMapping;
        
        for (const direction of Directions) {
            const newRow = currentPosition.row + direction.row_delta;
            const newCol = currentPosition.row + direction.col_delta;
            const newPosition: Position = {row:newRow, col:newCol};
            const toString = positionToString(newPosition);
            if (isValidPosition(newPosition, rows, cols) && !visited.has(toString) && !alreadyUsed.has(toString)) {
                visited.add(toString);
                indexMapping.set(currentIndex, newPosition);
                const updatedWordIndices: Map<number, Position> | null = embedWord(
                    word,
                    currentIndex + 1,
                    newPosition,
                    visited,
                    alreadyUsed,
                    indexMapping
                );
                if (updatedWordIndices) {
                    return updatedWordIndices;
                }
                visited.delete(toString); 
            }
        }
        indexMapping.delete(currentIndex); 
        return null;
    }
    
    function iterate(word: Word, alreadyUsed: Set<String>): Map<number, Position> | null {
        const maxAttempts = rows * cols * 2;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let startPosition: Position;
            do {
                startPosition = {
                    row:Math.floor(Math.random() * rows),
                    col:Math.floor(Math.random() * cols),
                };
            } while (alreadyUsed.has(positionToString(startPosition)));
            let visited: Set<String> = new Set();
            visited.add(positionToString(startPosition));

            let result: Map<number, Position> | null = embedWord(
                word,
                0,
                startPosition,
                visited,
                alreadyUsed,
                new Map<number, Position>()
            );
            if (result) {
                return result; // Successful embedding
            }
        }
        return null;
    }



    function embedWords(words: Word[]): Map<Word, (Map<number, Position>) | null> {
        let alreadyUsed: Set<String> = new Set();
        let wordIndexMapping: Map<Word, Map<number, Position> | null> = new Map();
        for (const word of words) {
            let embedAttempt: Map<number, Position> | null = iterate(word, alreadyUsed);
            if (embedAttempt) {
                wordIndexMapping.set(word, embedAttempt)
                embedAttempt.forEach((value: Position, key: number) => alreadyUsed.add(positionToString(value)));
            } else {
                wordIndexMapping.set(word, null);
            }
        }
        return wordIndexMapping
    }

    let contents: string[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => getRandomChar()));

    const result:Map<Word, Map<number, Position>|null> = embedWords(words);

    result.forEach((value: Map<number,Position>|null , word: Word) => {
        if(value){
            value.forEach((posValue:Position, key:number)=>{
                contents[posValue.row][posValue.col] = word.word.charAt(key)
            })
        }
    });

    const initialWordToCurrentIndexMapping: Map<Word, number> = new Map();
    words.forEach((word:Word)=>initialWordToCurrentIndexMapping.set(word, 0));

    return {
        content:contents,
        words:words,
        currentPosition: getRandomPos(rows, cols),
        rows:rows,
        cols:cols,
        exploredPositions: [],
        wordToColorMapping:generateWordColorMapping(words),
        wordMapping:result,
        wordToCurrentIndexMapping: initialWordToCurrentIndexMapping
    }
}

export function printMultiBoard(multiBoard: MultiBoard): void {
   console.log(multiBoard.content)
   console.log(multiBoard.wordMapping)
}