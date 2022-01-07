import React, { useEffect, useState } from "react";
import LoseImage from "../../assets/lose.svg";
import PlayImage from "../../assets/play.svg";
import WinImage from "../../assets/win.svg";
import {
  GridState,
  GridUnit,
  WordGrid,
} from "../../components/WordGrid/WordGrid";
import { gameConfig } from "../../gameConfig";
import useEventListener from "../../hooks/useEventListener";
import { MainGame, SquirtleImage, Wrapper } from "./Game.styled";

export type GuessState = "UNKNOWN" | "CORRECT" | "DISPLACED" | "INCORRECT";
type GameState = "WIN" | "LOSE" | "PLAYING";
type GuessDictionary = Record<string, GuessState>;

const defaultDictionary: GuessDictionary = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, "UNKNOWN"])
);

const answer = ["g", "a", "m", "e", "r"];

export const GameContainer: React.FC = () => {
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState<GameState>("PLAYING");
  const [letterguessState, setGuessState] =
    useState<GuessDictionary>(defaultDictionary);

  useEffect(() => {
    setCurrentGuess("");
    checkWin();
  }, [guessHistory]);

  const gameIsOver = () => gameState !== "PLAYING";

  const onChange = (event: Event) => {
    const { key } = event as KeyboardEvent;

    if (gameIsOver()) {
      return;
    }

    if (key === "Enter" && currentGuess.length === gameConfig.wordLength) {
      submitGuess();
    } else if (key === "Backspace") {
      setCurrentGuess((g) => (g.length === 0 ? g : g.slice(0, g.length - 1)));
    } else if (
      key in defaultDictionary &&
      currentGuess.length !== answer.length
    ) {
      setCurrentGuess((g) => g + key);
    }
  };

  const getUnitState = (char: string, colIdx: number): GuessState => {
    if (answer[colIdx] === char) {
      return "CORRECT";
    }

    if (answer.includes(char)) {
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
    if (guessHistory.length < gameConfig.maxTries - 1) {
      const guessState = { ...letterguessState };

      currentGuess.split("").forEach((c, i) => {
        guessState[c] = getUnitState(c, i);
      });

      setGuessState(guessState);
      setGuessHistory((h) => [...h, currentGuess]);
    }
  };

  const checkWin = () => {
    const atMaxGuesses = guessHistory.length === gameConfig.maxTries - 1;
    const guessedIt =
      guessHistory.length > 0 &&
      guessHistory[guessHistory.length - 1] === answer.join("");

    setGameState(guessedIt ? "WIN" : atMaxGuesses ? "LOSE" : "PLAYING");
  };

  useEventListener("keydown", onChange);

  const resetGame = () => {
    setGuessHistory([]);
    setGameState("PLAYING");
  };

  return (
    <Wrapper>
      <MainGame>
        <h1>squirdle</h1>
        <WordGrid
          gridState={generateGridState()}
          wordLength={gameConfig.wordLength}
          maxTries={gameConfig.maxTries}
        />
        {(gameState === "LOSE" || gameState === "WIN") && (
          <button onClick={resetGame}>{gameState} Play again bitch</button>
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
