import React, { useEffect, useState } from 'react';
import { BaseGrid } from './Components/Base/base.grid.tsx';
import { initializeMultiBoard } from './Handler/board.handler.ts';
import { words as wordData } from './Data/Word'; // Rename the import to avoid conflict

function App() {
    const [wordList, setWordList] = useState([]); // Renamed the state variable to avoid conflict
    const [board, setBoard] = useState(null);

    function getRandomSample(array, n) {
        if (n >= array.length) {
            return array.slice();
        }
        const shuffledArray = array.slice();
        const sample = [];
        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * (shuffledArray.length - i));
            const selectedItem = shuffledArray[randomIndex];
            shuffledArray[randomIndex] = shuffledArray[shuffledArray.length - 1 - i];
            shuffledArray[shuffledArray.length - 1 - i] = selectedItem;
            sample.push(selectedItem);
        }

        return sample;
    }

    function getLongestWord(words) {
        if (!words || words.length === 0) {
            return null;
        }

        let longestWord = words[0];
        for (let i = 1; i < words.length; i++) {
            const currentWord = words[i];
            if (currentWord.word.length > longestWord.word.length) {
                longestWord = currentWord;
            }
        }

        return longestWord;
    }

    useEffect(() => {
        // Using a different variable name to avoid conflict
        setWordList(getRandomSample(wordData, 10));
    }, []);

    useEffect(() => {
        if (wordList && wordList.length) {
            const longest = getLongestWord(wordList);
            // Add a condition to handle empty words array
            if (longest) {
                setBoard(initializeMultiBoard(wordList, 10, 10));
            }
        }
    }, [wordList]);

    if (!board || !wordList) {
        return null; // Early return when board or wordList is not ready
    }

    return (
        <>
            <BaseGrid board={board} words={wordList} />
        </>
    );
}

export default App;
