import styled from "styled-components";
import { getGridColor } from "../../components/WordGrid/WordGrid.styled";
import theme from "../../theme";
import { GuessDictionary } from "./Game";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100%;
  justify-content: center;
  font-family: ${theme.font};
  color: ${theme.textPrimaryColor};
`;

export const MainGame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  @media only screen and (max-width: 900px) {
    width: 90%;
  }
`;

export const SquirtleImage = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 20vw;
  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

export const Title = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 60px;
  margin: 0;
  margin-bottom: 2vh;
  font-weight: 800;
  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

export const GameStatus = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 97%;
  font-size: 18px;
  font-weight: bold;
  padding: 0 6px;
  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const Button = styled.button`
  background-color: ${theme.unknownColor};
  padding: 14px 24px;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  font-family: ${theme.font};
  font-weight: bold;
  color: ${theme.textPrimaryColor};
  width: fit-content;

  &:hover {
    transition: all 0.1s linear;
    transform: scale(1.05);
  }
`;

export const EndWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60%;
  text-align: center;
  align-items: center;
  & ${Button} {
    margin-top: 2em;
  }
`;

interface LetterHighlighterProps {
  guessState: GuessDictionary;
}

export const LetterHighlighter = styled.div<LetterHighlighterProps>`
  ${({ guessState }) => {
    return Object.keys(guessState)
      .map((letter) => {
        return `
          & div[data-skbtn=${letter}] {
            background-color: ${getGridColor(guessState[letter])};
            
          }
        `;
      })
      .join("\n");
  }}
  width: 100%;
`;
