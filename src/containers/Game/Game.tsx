import React, { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import wordList from "../../assets/all-words.json";
import "../../assets/keyboard.css";
import LoseImage from "../../assets/lose.svg";
import PlayImage from "../../assets/play.svg";
import pokeList from "../../assets/pokenames.json";
import WinImage from "../../assets/win.svg";
import {
  GridState,
  GridUnit,
  WordGrid,
} from "../../components/WordGrid/WordGrid";
import { gameConfig } from "../../gameConfig";
import useEventListener from "../../hooks/useEventListener";
import theme from "../../theme";
import {
  Button,
  EndWrapper,
  GameStatus,
  LetterHighlighter,
  MainGame,
  SquirtleImage,
  Title,
  Wrapper,
} from "./Game.styled";

export type GuessState = "UNKNOWN" | "CORRECT" | "DISPLACED" | "INCORRECT";
type GameState = "WIN" | "LOSE" | "PLAYING";
export type GuessDictionary = Record<string, GuessState>;

const defaultDictionary: GuessDictionary = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, "UNKNOWN"])
);

const winStatements = [
  "Wow. Look at you.",
  "You must be tickled.",
  "Are you sure you didn't cheat. I thought I saw you cheat.",
  "Ohohooho looks like we have an ENGLISH SPEAKER over here.",
  "Someone has read at least one book in their life.",
  "Squirtle is pleased with your performance.",
  "gucci guuci prada prada my wordle score is more than nada (im fire)",
  "damn girl are u a book because that shit was wordy",
];

const loseStatements = [
  "Well, that was cringe.",
  "Oop there goes that.",
  "It's okay, we all fail sometimes. Most of us. Mostly you. Right now.",
  "gucci guuci prada prada my wordle score is now nada",
  "Jesus weeps.",
  "Squirtle is dissappointed.",
  "Well shuckle :(",
];

const highWinStreakStatements = [
  "That's a mighty big streak you got there. Shame if something were to happen to it...",
  "Boy what a streak. how does it feel to have death waiting over your shoulder",
];

const tryAgainStatements = [
  "Go gettem tiger",
  "Believe in yourself",
  "Play your heart out",
  "Think of the kids",
  "Squirtle awaits",
  "This is no time for a break",
];

const SCORE_KEY = "SQUIRDLE_SCORE";
const validWords = new Set(wordList);
const validPokemon = new Set(pokeList);

export const GameContainer: React.FC = () => {
  const getRandomFromArray = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const restoreStreak = () => {
    const score = localStorage.getItem(SCORE_KEY);

    if (score) {
      return parseInt(score);
    }
    return 0;
  };

  const [pokemode, setPokemode] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(
    getRandomFromArray(wordList).split("")
  );
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState<GameState>("PLAYING");
  const [letterguessState, setGuessState] =
    useState<GuessDictionary>(defaultDictionary);
  const [winStreak, setWinStreak] = useState(restoreStreak());

  useEffect(() => {
    if (guessHistory.length === 0) {
      setCurrentAnswer(
        getRandomFromArray(pokemode ? pokeList : wordList)
          .toLowerCase()
          .split("")
      );
    }
  }, [guessHistory]);

  useEffect(() => {
    setCurrentGuess("");
    checkWin();
  }, [guessHistory]);

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, winStreak.toString());
  }, [winStreak]);

  useEffect(() => {
    setWinStreak((s) =>
      gameState === "WIN" ? s + 1 : gameState === "LOSE" ? 0 : s
    );
  }, [gameState]);

  const gameIsOver = () => gameState !== "PLAYING";
  const atMaxGuesses = () => guessHistory.length === gameConfig.maxTries;

  const getEndStatement = () => {
    if (gameState === "WIN") {
      if (winStreak === 5) {
        return getRandomFromArray(highWinStreakStatements);
      }
      return getRandomFromArray(winStatements);
    }
    return getRandomFromArray(loseStatements);
  };

  const onChange = (key: string) => {
    if (gameIsOver()) {
      return;
    }

    if (
      (key === "{enter}" || key === "Enter") &&
      currentGuess.length === gameConfig.wordLength
    ) {
      submitGuess();
    } else if (key === "{bksp}" || key === "Backspace") {
      setCurrentGuess((g) => (g.length === 0 ? g : g.slice(0, g.length - 1)));
    } else if (
      key in defaultDictionary &&
      currentGuess.length !== currentAnswer.length
    ) {
      setCurrentGuess((g) => g + key);
    }
  };

  const getUnitState = (char: string, colIdx: number): GuessState => {
    if (currentAnswer[colIdx] === char) {
      return "CORRECT";
    }

    if (currentAnswer.includes(char)) {
      return "DISPLACED";
    }

    return "INCORRECT";
  };

  const generateGridState = (): GridState => {
    const units: GridUnit[][] = guessHistory.map((guess) =>
      guess.split("").map((char, colIdx) => ({
        value: char,
        state: getUnitState(char, colIdx),
      }))
    );

    const currentGuessRow: GridUnit[] = currentGuess.split("").map((char) => ({
      value: char,
      state: "UNKNOWN",
    }));

    return { grid: [...units, currentGuessRow] };
  };

  const submitGuess = () => {
    // TODO: check if it's a word

    if (
      !atMaxGuesses() &&
      ((pokemode && validPokemon.has(currentGuess)) ||
        validWords.has(currentGuess))
    ) {
      const guessState = { ...letterguessState };

      currentGuess.split("").forEach((c, i) => {
        guessState[c] = getUnitState(c, i);
      });

      setGuessHistory((h) => [...h, currentGuess]);

      setGuessState(guessState);
    }
  };

  const checkWin = () => {
    const guessedIt =
      guessHistory.length > 0 &&
      guessHistory[guessHistory.length - 1] === currentAnswer.join("");

    setGameState(guessedIt ? "WIN" : atMaxGuesses() ? "LOSE" : "PLAYING");
  };

  const onPhysicalKeyboardInput = (event: Event) => {
    const { key } = event as KeyboardEvent;
    onChange(key);
  };
  useEventListener("keydown", onPhysicalKeyboardInput);

  const resetGame = () => {
    setGuessHistory([]);
    setGameState("PLAYING");
  };

  const getLetterStyles = (): string => {
    return Object.keys(letterguessState)
      .map((letter) => {
        if (letterguessState[letter] === "INCORRECT") {
          return `
          & div[data-skbtn=${letter}] {
            background-color: ${theme.keyboardWrongLetterColor};
            color: white;
          }
        `;
        }
      })
      .join("\n");
  };

  return (
    <Wrapper>
      <MainGame>
        <Title>SQUIRDLE</Title>
        <WordGrid
          gridState={generateGridState()}
          wordLength={gameConfig.wordLength}
          maxTries={gameConfig.maxTries}
        />

        <GameStatus>
          <p>Streak: {winStreak}</p>
          <span>
            <input
              type="checkbox"
              onChange={(e) => setPokemode(e.currentTarget.checked)}
            />
            <p>Pokemode {pokemode && "(haha neeerd)"}</p>
          </span>
        </GameStatus>

        {gameState === "LOSE" || gameState === "WIN" ? (
          <EndWrapper>
            <h3>Answer: {gameState === "LOSE" && currentAnswer}</h3>
            {getEndStatement()}
            <Button onClick={resetGame}>
              {getRandomFromArray(tryAgainStatements)}
            </Button>
          </EndWrapper>
        ) : (
          <LetterHighlighter styles={getLetterStyles()}>
            <Keyboard
              layout={{
                default: [
                  "q w e r t y u i o p",
                  "a s d f g h j k l",
                  "z x c v b n m",
                  ...(window.innerWidth <= 900 ? ["{bksp} {enter}"] : []),
                ],
              }}
              physicalKeyboardHighlight={true}
              onKeyPress={onChange}
            />
          </LetterHighlighter>
        )}
      </MainGame>
      <SquirtleImage
        src={
          gameState === "LOSE"
            ? LoseImage
            : gameState === "WIN"
            ? WinImage
            : PlayImage
        }
      />
    </Wrapper>
  );
};
