import styled from "styled-components";
import { GuessState } from "../../containers/Game/Game";

export const GridRow = styled.div`
  display: flex;
`;

interface IGridCellProps {
  state: GuessState;
}

const getGridColor = (state: GuessState) => {
  switch (state) {
    case "UNKNOWN":
      return "#9DD9D2";
    case "CORRECT":
      return "#52df8c";
    case "DISPLACED":
      return "#F4D06F";
    case "INCORRECT":
      return "#DE3C4B";
  }
};

export const GridCell = styled.div<IGridCellProps>`
  border: 2px solid
    ${({ state }) => (state === "UNKNOWN" ? "transparent" : "transparent")};

  background-color: ${({ state }) => getGridColor(state)};
  border-radius: 100%;
  box-shadow: rgb(0 35 70 / 26%) 0px 8px 24px;
  width: 70px;
  height: 70px;
  margin: 10px;
  color: black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  font-weight: bolder;
`;
