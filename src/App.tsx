import { useEffect, useState } from "react";
import TileRow from "./TileRow";
import Keyboard from "./Keyboard";
import GameWon from "./GameWon";
import GameOver from "./GameOver";


export default function App() {

  /** State variales and their initial values are given: DO NOT MODIFY. */

  // Stores the correct answer for the game.
  const [targetWord, setTargetWord] = useState<string>("");

  // Stores a list of past guesses.
  // Invariant: This list should always remain 6 elements long.
  const [pastGuesses, setPastGuesses] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Stores the current guess (the guess that is currently being typed).
  const [currentGuess, setCurrentGuess] = useState<string>("");

  // Stores the index of the row that is currently being guessed.
  // Invariant: This variable should always be between 0 and 5.
  const [activeRow, setActiveRow] = useState<number>(0);

  // Stores whether the game has been won.
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Stores whether the game has been lost.
  const [gameOver, setGameOver] = useState<boolean>(false);

  /**
   * TODO: Load the target word from an extermal API.
   * 
   * As noted in the assignment reading, you can use the following
   * API call to get a random 5-letter word:
   * GET https://a04-wordle-api.vercel.app/api/random-word
   * 
   * This API call returns a JSON object with the following format:
   * { word: "<word here>" }
   * 
   * Remember that loading data from an API is consider a *side effect*.
   * Therefore, you will need to use the `useEffect` hook.
   */

  /* Solution here... */
  useEffect(() => {
    fetch(`https://a04-wordle-api.vercel.app/api/random-word`)
      .then((response) => response.json())
      .then((data) => {
        setTargetWord(data.word);
      })
  }, []);
  

  /** 
   * EXTRA CREDIT: In the real Wordle game, you can type on your keyboard to 
   * type characters. As noted in the assignment reading, you can add keyboard
   * support to Wordle using traditional event handlers. Remember that adding
   * event handler is considered a *side effect*.
   * 
   * Make sure that you use React's features to clean up the event handler when
   * the component is unmounted. 
   * 
   * Check out this documentation for more information:
   * https://react.dev/learn/removing-effect-dependencies
   * 
   * HINT: You can add event handlers to the `window` to apply a global event handler!
   * In addition, to explore how to add keyboard support, check out the `main.ts` 
   * file in A02: Calculator. I implemented keyboard suppport in the Calculator for you.
   */

  /* Solution here... */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key === "BACKSPACE") {
        onBackspace();
      } else if (key === "ENTER") {
        makeGuess();
      } else if (/^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, activeRow]);


  /**
   * TODO:  The <Keyboard> requires a handler for when a letter is pressed passed in as
   * a prop item. This is required so that the keyboard can update the current guess.
   * 
   * Implement this function to update the current guess with `letter`.
   * 
   * Add validation to ensure that the current guess is at most 5 letters long.
   * 
   * @param letter The letter that was pressed.
   */
  const onKeyPress = (letter: string) => {
    // Solution here...
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  /**
   * TODO: The <Keyboard> requires a handler for when the backspace key is pressed passed in as
   * a prop item. This is required so that the keyboard can backspace the current guess.
   * 
   * Implement this function.
   * 
   * Add validation to ensure that nothing happens when the current guess is already empty.
   */
  const onBackspace = () => {
    if (currentGuess.length > 0){
      setCurrentGuess(currentGuess.slice(0, -1));
    }
    // Solution here...
  };

  /**
   * TODO: We need to ensure that guesses that the user makes are valid five letter words.
   * For example, we would not want the user to be able to guess `ASDFG`. The real
   * Wordle also handles this validation.
   * 
   * As noted in the assignment reading, you can use the following  API call to 
   * ensure that a guess is valid:
   * GET https://a04-wordle-api.vercel.app/api/word-valid/[word]
   * (replace `[word]` with the word to check)
   * 
   * This API call returns a JSON object with the following format:
   * { valid: <true or false> }
   *
   * @param guess The guess to check.
   * @returns true if the guess is valid, false otherwise.
   */
  const checkGuessValidity = async (guess: string) => {
    // Solution here...
    return fetch(`https://a04-wordle-api.vercel.app/api/word-valid/${guess}`)
      .then((response) => response.json())
      .then((data) => {
        return data.valid
      })
      .catch(() => {
        return false;
      });
  };


  /**
   * TODO: The main functionality for this component is to handle when the user
   * submits guess. This happens when the user presses the "Enter" key. This
   * function must do the following things:
   * 
   * 1. If the current guess is less than five characters, show an alert to the
   *    screen that says "Please enter a 5-letter word". You can use the 
   *    `window.alert` API to do this.
   * 
   * 2. If the current guess is not a valid word, show an alert to the screen
   *    that says "This is not a valid word.".
   * 
   * 3. If the current guess is valid, update the entry for the active row in the
   *    list of past guesses to include the new guess. Clear our the current
   *    guess and increment the active row.
   * 
   * 4. If the active row is greater than or equal to 5, end the game by updating the
   *    gameOver state variable to true. This should be done after a 100ms delay.
   * 
   * 5. If the current guess is equal to the target word, end the game by updating the
   *   gameWon state variable to true. This should be done after a 100ms delay.
   */
  const makeGuess = async () => { // each row is a guess (6 guesses)
    // Solution here...
    if (currentGuess.length < 5){
      window.alert("Please enter a 5-letter word")
      return;
    }
    const isValid = await checkGuessValidity(currentGuess);
    if (!isValid){
      window.alert("This is not a valid word")
      return;
    }
    //pastGuesses[activeRow] = currentGuess
    setPastGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses]; 
      newGuesses[activeRow] = currentGuess; 
      return newGuesses; 
    });
    setCurrentGuess("")
    setActiveRow(activeRow + 1)
    if (activeRow >= 5){
      setTimeout(() => {
        setGameOver(true)
      }, 100);
    }
    if (currentGuess === targetWord){
      setTimeout(() => {
        setGameWon(true)
      }, 100);
    }
  };
  if (gameWon) {
    return (<GameWon target={targetWord} />);
  }

  if (gameOver) {
    return (<GameOver target={targetWord} />);
  }
  
  return (
    <div className="w-full h-screen max-h-[-webkit-fill-available] flex flex-col justify-between items-center">
      <p className="w-full pl-4 py-2 text-lg font-bold">a04: Wordle</p>
      <div className="w-full flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <TileRow
            key={i}
            target={targetWord}
            guess={activeRow === i ? currentGuess : pastGuesses[i]}
            guessed={activeRow > i}
          />
        ))}
      </div>
      <div className="my-12">
        <Keyboard
        
          target={targetWord}
          guesses={pastGuesses}
          onKeyPress={onKeyPress}
          onEnter={makeGuess}
          onBackspace={onBackspace}
        />
      </div>
    </div>
  );
}
