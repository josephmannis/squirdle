import styled from "styled-components";
import { GuessState } from "../../containers/Game/Game";
import theme from "../../theme";

export const GridRow = styled.div`
  display: flex;
`;

interface IGridCellProps {
  state: GuessState;
}

export const getGridColor = (state: GuessState) => {
  switch (state) {
    case "UNKNOWN":
      return theme.unknownColor;
    case "CORRECT":
      return theme.correctColor;
    case "DISPLACED":
      return theme.displacedColor;
    case "INCORRECT":
      return theme.incorrectColor;
  }
};

export const GridCell = styled.div<IGridCellProps>`
  border: 2px solid
    ${({ state }) => (state === "UNKNOWN" ? "transparent" : "transparent")};

  background-color: ${({ state }) => getGridColor(state)};
  color: ${theme.textPrimaryColor};

  border-radius: 100%;
  box-shadow: rgb(0 35 70 / 26%) 0px 8px 24px;
  width: 50px;
  height: 50px;
  margin: 8px 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  font-weight: bolder;

  @media only screen and (max-width: 1600px) {
    width: 45px;
    height: 45px;
    font-size: 1em;
    margin: 4px 8px;
  }
`;

export const GridWrapper = styled.div`
  border: 6px solid ${theme.unknownColor};
  padding: 16px;
  border-radius: 60px;

  @media only screen and (max-width: 900px) {
    border: none;
    padding: 0px;
    border-radius: 0;
    margin-top: 2em;
  }
`;
