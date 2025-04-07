export interface Group {
  id: number;
  tiles: number[];
}

export interface GameState {
  board: string[];
  selectedTiles: number[];
  foundGroups: Group[];
  mistakes: number;
  isComplete: boolean;
}