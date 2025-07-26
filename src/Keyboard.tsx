/**
 * DO NOT MODIFY.
 * 
 * This component stores the functionality for the keyboard. The keyboard component
 * contains all of the keys, including the enter and backspace keys.
 */

import { CornerDownLeft, Delete } from "lucide-react";

type KeyboardProps = {
  target: string;
  onKeyPress: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  guesses: string[];
};
export default function Keyboard({
  target,
  onKeyPress,
  onEnter,
  onBackspace,
  guesses,
}: KeyboardProps) {

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex flex-row gap-2">
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
          <KeyboardKey
            key={letter}
            target={target}
            letter={letter}
            onKeyPress={() => onKeyPress(letter)}
            guesses={guesses}
          />
        ))}
      </div>
      <div className="flex flex-row gap-2">
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
          <KeyboardKey
            key={letter}
            target={target}
            letter={letter}
            onKeyPress={() => onKeyPress(letter)}
            guesses={guesses}
          />
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <EnterKey onEnter={onEnter} />
        {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
          <KeyboardKey
            key={letter}
            target={target}
            letter={letter}
            onKeyPress={() => onKeyPress(letter)}
            guesses={guesses}
          />
        ))}
        <BackspaceKey onBackspace={onBackspace} />
      </div>
    </div>
  );
}

/** State to handle if a key should show as disabled (dark grey), correct (green), or default. */
export enum KeyboardKeyState {
  Default,
  Disabled,
  Correct,
}

/** Function that computes the correct Tailwind classes for a key given its state. */
const colorForKey = (state: KeyboardKeyState) => {
  switch (state) {
    case KeyboardKeyState.Default:
      return "text-black bg-slate-300";
    case KeyboardKeyState.Disabled:
      return "text-white bg-slate-500";
    case KeyboardKeyState.Correct:
      return "text-white bg-lime-600";
  }
};

/** Component to encapsulate the functionality for a single keyboard key. */
type KeyboardKeyProps = {
  target: string;
  letter: string;
  onKeyPress: () => void;
  guesses: string[];
};
export function KeyboardKey({
  target,
  letter,
  onKeyPress,
  guesses,
}: KeyboardKeyProps) {
  const state = stateForKeyboardKey(target, guesses)(letter);
  return (
    <div
      className={`w-7 sm:w-11 h-14 rounded-lg flex items-center justify-center text-2xl font-bold ${colorForKey(
        state
      )}`}
      onClick={onKeyPress}
    >
      {letter}
    </div>
  );
}

/** Component to encapsulate the enter key. */
type EnterKeyProps = { onEnter: () => void };
export function EnterKey({ onEnter }: EnterKeyProps) {
  return (
    <>
      <div
        className={`hidden sm:w-16 h-14 rounded-lg sm:flex items-center justify-center text-sm font-bold text-black bg-slate-300`}
        onClick={onEnter}
      >
        ENTER
      </div>
      <div
        className={`flex w-8 h-14 rounded-lg sm:hidden items-center justify-center text-sm font-bold text-black bg-slate-300`}
        onClick={onEnter}
      >
        <CornerDownLeft />
      </div>
    </>
  );
}

/** Component to encapsulate the backspace key. */
type BackspaceKeyProps = { onBackspace: () => void };
export function BackspaceKey({ onBackspace }: BackspaceKeyProps) {
  return (
    <div
      className={`w-8 sm:w-16 h-14 rounded-lg flex items-center justify-center text-sm font-bold text-black bg-slate-300`}
      onClick={onBackspace}
    >
      <Delete />
    </div>
  );
}

/** Function that generates a function to determine the state of a key given its letter. */
function stateForKeyboardKey(target: string, guesses: string[]) {
  const correctLetters = new Set<string>();
  const disabledLetters = new Set<string>();

  for (let guess of guesses) {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      if (target[i] === letter) {
        correctLetters.add(letter);
      } else if (!target.includes(letter)) {
        disabledLetters.add(letter);
      }
    }
  }

  return (letter: string) => {
    if (correctLetters.has(letter)) {
      return KeyboardKeyState.Correct;
    } else if (disabledLetters.has(letter)) {
      return KeyboardKeyState.Disabled;
    } else {
      return KeyboardKeyState.Default;
    }
  };
}
