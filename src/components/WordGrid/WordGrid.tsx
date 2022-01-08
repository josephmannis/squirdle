import React from "react";
import { GuessState } from "../../containers/Game/Game";
import { GridCell, GridRow, GridWrapper } from "./WordGrid.styled";

export type GridUnit = {
  value: string;
  state: GuessState;
};

export type GridState = {
  grid: GridUnit[][];
};

interface IWordGridProps {
  gridState: GridState;
  wordLength: number;
  maxTries: number;
}

export const WordGrid: React.FC<IWordGridProps> = ({
  gridState,
  wordLength,
  maxTries,
}) => {
  const getColumn = (rowIndex: number) => {
    const cols = [];
    for (let j = 0; j < wordLength; j++) {
      const cellState = gridState.grid?.[rowIndex]?.[j];
      cols.push(
        <GridCell key={j} state={cellState?.state ?? "UNKNOWN"}>
          {cellState?.value ? cellState.value : ""}
        </GridCell>
      );
    }
    return cols;
  };

  const getRows = () => {
    const rows = [];
    for (let i = 0; i < maxTries; i++) {
      rows.push(<GridRow key={i}>{getColumn(i)}</GridRow>);
    }
    return rows;
  };

  return <GridWrapper>{getRows()}</GridWrapper>;
};
