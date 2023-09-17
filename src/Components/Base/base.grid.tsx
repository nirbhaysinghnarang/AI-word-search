import React, { useRef, useEffect, useState } from 'react';
import { Word } from '../../Types/Word';
import { MultiBoard } from '../../Types/MultiBoard';
import { getRandomPos, Position } from '../../Types/Position';
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Stack } from '@mui/material';
import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/400.css"; // Specify weight
import "@fontsource/roboto/400-italic.css"; // Specify weight and style

interface BaseGridProps {
    words: Word[],
    board: MultiBoard
}



export const BaseGrid: React.FC<BaseGridProps> = ({ words, board }: BaseGridProps) => {
    const [currentPosition, setCurrentPosition] = useState<Position>(getRandomPos(board.rows, board.cols));
    const [wordsFound, setWordsFound] = useState<Word[]>([]);
    const [embeddedWords, setEmbeddedWords] = useState<Word[]>([]);

    const [exploredGoodPositions, setExploredGoodPositions] = useState<Position[]>([]);
    function ifPosInWordGetWord(position: Position, board: MultiBoard): Word | null {
        const wordMapping = board.wordMapping
        const wordToColorMapping = board.wordToColorMapping;
        for (const [key, value] of wordMapping) {
            if (value) {
                for (const [_, cell] of value) {
                    if (cell.row === position.row && cell.col === position.col) {
                        return key
                    }
                }
            }
        }
        return null;
    }


    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const { key } = event;
            let newRow = currentPosition.row;
            let newCol = currentPosition.col;
            if (key === 'ArrowUp' && newRow > 0) {
                newRow--;
            } else if (key === 'ArrowDown' && newRow < board.rows - 1) {
                newRow++;
            } else if (key === 'ArrowLeft' && newCol > 0) {
                newCol--;
            } else if (key === 'ArrowRight' && newCol < board.cols - 1) {
                newCol++;
            }
            setCurrentPosition({ row: newRow, col: newCol })

        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [board, currentPosition]);

    useEffect(() => {

        if (board) {
            let words: Word[] = [];
            for (const [key, value] of board.wordMapping) {
                if (value) words.push(key)
            }
            setEmbeddedWords(words)
        }
    }, [board])




    useEffect(() => {
        //Want to update board here according to currentPosition
        if (currentPosition && board) {
            const exploredPositions = board.exploredPositions;
            const wordToIndexMapping = board.wordToCurrentIndexMapping;
            const wordMapping = board.wordMapping;
            //Add this position to explored positions
            exploredPositions.push(currentPosition)
            const word = ifPosInWordGetWord(currentPosition, board);
            if (word && wordMapping.get(word)) {
                const posMapping: Map<number, Position> = wordMapping.get(word)!
                const currentIndexForThisWord = wordToIndexMapping.get(word)!
                const positionForCurrentIndex = posMapping.get(currentIndexForThisWord);
                if (positionForCurrentIndex?.row === currentPosition.row && positionForCurrentIndex.col === currentPosition.col) {
                    //We have found the correct character for this word
                    if (currentIndexForThisWord === word.word.length) {
                    } else {
                        wordToIndexMapping.set(word, currentIndexForThisWord + 1)
                        setExploredGoodPositions([...exploredGoodPositions, currentPosition])
                    }

                }

            }
        }

    }, [currentPosition])

    function getColor(row: number, col: number) {
        const pos: Position = { row: row, col: col };
        const wordToColorMapping = board.wordToColorMapping;
        const wordMapping = board.wordMapping;
        if (pos.row === currentPosition.row && pos.col === currentPosition.col) {
            return "blue"
        }
        for (const [key, value] of wordMapping) {
            if (value) {
                for (const [_, cell] of value) {
                    if (cell.row === pos.row && cell.col === pos.col && exploredGoodPositions.some((pos_prime: Position) => pos_prime.row === row && pos_prime.col === col)) {
                        return wordToColorMapping.get(key)
                    }
                }
            }
        }
        for (const position of board.exploredPositions) {
            if (position.row === pos.row && position.col === pos.col) {
                return "grey"
            }
        }
    }

    return <Stack direction="column" flex={1}>
        <div style={{
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            width: '100vw',
        }}>
            <Stack direction="column" mb={2}>
                <Typography  sx={{ fontFamily: "Roboto" }}  variant='subtitle1' gutterBottom>Somewhere in this grid, I've hidden {embeddedWords.length} words. </Typography>
                <Stack direction="column">
                    {embeddedWords.map((word: Word, index:number) => {
                        const wordToCurrentIndexMapping = board.wordToCurrentIndexMapping.get(word)!;
                        if(wordToCurrentIndexMapping === word.word.length){
                            return <Typography  sx={{ fontFamily: "Roboto" }} >You've found <strong>{word.word}</strong> ✅</Typography>
                        }
                        let wordString = "";
                        for(let i = 0; i<wordToCurrentIndexMapping; i++){
                            wordString+=word.word.charAt(i)+" ";
                        }
                        for(let j=wordToCurrentIndexMapping;j<word.word.length;j++){
                            wordString+='_ '
                        }

                        return <Stack direction="row">
            
                            <Typography  sx={{ fontFamily: "Roboto" }}  >Hint for <strong>{wordString}</strong>: {word.hint}</Typography>
                        </Stack>})}
                    
                </Stack>



            </Stack>


        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            width: '100vw',


        }}>
            < Grid sx={{ width: '70%' }} container justifyContent="center">
                <Grid sx={{ width: '100%' }} item>
                    <TableContainer sx={{ width: '100%' }} component={Paper}>
                        <Table>
                            <TableBody>
                                {board.content.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <TableCell
                                                key={colIndex}
                                                style={{
                                                    border: '1px solid #000',
                                                    padding: '10px',
                                                    textAlign: 'center',
                                                    backgroundColor: getColor(rowIndex, colIndex),
                                                }}
                                            >
                                                <Typography sx={{ fontFamily: "Roboto" }} variant='subtitle1'>{cell}</Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div >
    </Stack>



}
