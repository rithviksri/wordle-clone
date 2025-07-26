/**
 * This file contains the functionality for a tile row. This will include five tiles and also
 * handle determining the state for each tile in the row.
 */

import Tile, { TileState } from "./Tile";

type TileRowProps = {
  target: string; // goal word
  guess: string;
  guessed: boolean; // green or yellow if letter in target word
};

export default function TileRow({ target, guess, guessed }: TileRowProps) {
  return (
    <div className="w-full flex flex-row gap-2 justify-center">
      {[0, 1, 2, 3, 4].map((i) => (
        <Tile
          key={i}
          letter={i < guess.length ? guess[i] : null} // cannot guess letter at index > 4
          state={
            guessed ? stateForTile(target, guess[i], i) : TileState.Default
          }
        />
      ))}
    </div>
  );
}

/**
 * TODO: We need to determine the state for each tile based on the target word, letter in the tile, and the letter's 
 * position in the guessed word. If the letter is in the target word, but not in the correct position, it should be
 * marked as partially correct. If the letter is in the correct position, it should be marked as correct.
 * If the letter is not in the target word, it should be marked as incorrect.
 * 
 * Note that the letter position is 0-indexed, so the first letter in the word is at position 0.
 * 
 * @returns {TileState} The state of the tile.
 * // partially correct = yellow
 * correct = green
 */
function stateForTile(target: string, letter: string, letterPosition: number) {
    if (target[letterPosition] === letter){
      return TileState.Correct;
    }
    else if (target.includes(letter)){
      return TileState.PartiallyCorrect;
    }
    else{
      return TileState.Incorrect;
    }
  // Solution here...
  return TileState.Default;
}
