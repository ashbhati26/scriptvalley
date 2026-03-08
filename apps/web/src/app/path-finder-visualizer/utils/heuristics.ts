import { MAX_COLS, MAX_ROWS } from "./constants";
import { GridType, TileType } from "./types";

const retrieveHeuristiCost = (currentTile: TileType, endTile: TileType) => {
    const manhattanDIstance = 1;
    const row = Math.abs(currentTile.row - endTile.row);
    const col =  Math.abs(currentTile.col - endTile.col);
    return manhattanDIstance * (row +col)
}

export const initHeuristicCost = (
    grid: GridType,
    endTile: TileType
)=> {
    const heuristicCost = [];
    for(let i = 0; i < MAX_ROWS; i++){
       const row = [];
       for( let j = 0; j < MAX_COLS; j++){
          row.push(retrieveHeuristiCost(grid[i][j], endTile)); 
       }
       heuristicCost.push(row);
    }
    return heuristicCost;
}

export const initFunctionCost = () => {
    const functionCost = []
    for(let i = 0; i < MAX_ROWS; i++){
       const row = [];
       for(let j = 0; j < MAX_COLS; j++){
          row.push(Infinity)
        }
        functionCost.push(row);
    }
    return functionCost;
}