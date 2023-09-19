import { Direction } from "../Types/Direction";
function shuffle(array:any[]) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  export const Directions: Direction[] = shuffle([
    { row_delta: -1, col_delta: 0 },
    { row_delta: 1, col_delta: 0 },
    { row_delta: 0, col_delta: -1 },
    { row_delta: 0, col_delta: 1 },
 
]);