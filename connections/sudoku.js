/**
 * Sudoku Game Logic
 * Provides the core functionality for generating and solving Sudoku puzzles
 */
export class SudokuGame {
  constructor() {
    this.board = [];
    this.solution = [];
  }

  // Create an empty 9x9 board
  createEmptyBoard() {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push(0);
      }
    }
    return board;
  }

  // Check if placing num at (row, col) is valid
  isSafe(board, row, col, num) {
    // Check row and column
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Solve Sudoku using backtracking
  solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isSafe(board, row, col, num)) {
              board[row][col] = num;
              
              if (this.solveSudoku(board)) {
                return true;
              }
              
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Shuffle an array (Fisher-Yates)
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Fill a 3x3 subgrid starting at (row, col) with shuffled numbers
  fillDiagonalBox(board, row, col) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffle(nums);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[row + i][col + j] = nums[i * 3 + j];
      }
    }
  }

  // Generate a complete, solved board
  generateCompleteBoard() {
    const board = this.createEmptyBoard();
    
    // Fill diagonal boxes first to help randomize
    for (let i = 0; i < 9; i += 3) {
      this.fillDiagonalBox(board, i, i);
    }
    
    // Solve the rest of the board
    this.solveSudoku(board);
    
    return board;
  }

  // Deep copy a board
  copyBoard(board) {
    return board.map(row => [...row]);
  }

  // Remove numbers from the board based on difficulty level
  removeNumbers(board, difficulty) {
    const puzzle = this.copyBoard(board);
    let cellsToRemove;
    
    if (difficulty === 'easy') {
      cellsToRemove = 30; // Remove ~30 cells for easy
    } else if (difficulty === 'medium') {
      cellsToRemove = 40; // Remove ~40 cells for medium
    } else if (difficulty === 'hard') {
      cellsToRemove = 50; // Remove ~50 cells for hard
    } else {
      cellsToRemove = 30; // Default to easy
    }
    
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops
    
    while (cellsToRemove > 0 && attempts < maxAttempts) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        cellsToRemove--;
      }
      
      attempts++;
    }
    
    return puzzle;
  }

  // Create a puzzle based on selected difficulty
  createPuzzle(difficulty) {
    // Generate a complete solution
    this.solution = this.generateCompleteBoard();
    
    // Remove numbers to create the puzzle
    this.board = this.removeNumbers(this.solution, difficulty);
    
    return this.board;
  }

  // Check if a user's solution is valid and complete
  checkSolution(userBoard) {
    // Check if the board is complete (no empty cells)
    let complete = true;
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userBoard[i][j] === 0) {
          complete = false;
        }
      }
    }
    
    // If incomplete, just return that it's incomplete
    if (!complete) {
      return { complete, valid: false };
    }
    
    // Check if the solution is valid
    let valid = true;
    
    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const num = userBoard[row][col];
        if (seen.has(num)) {
          valid = false;
          break;
        }
        seen.add(num);
      }
    }
    
    // Check columns
    if (valid) {
      for (let col = 0; col < 9; col++) {
        const seen = new Set();
        for (let row = 0; row < 9; row++) {
          const num = userBoard[row][col];
          if (seen.has(num)) {
            valid = false;
            break;
          }
          seen.add(num);
        }
      }
    }
    
    // Check 3x3 boxes
    if (valid) {
      for (let boxRow = 0; boxRow < 9; boxRow += 3) {
        for (let boxCol = 0; boxCol < 9; boxCol += 3) {
          const seen = new Set();
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const num = userBoard[boxRow + i][boxCol + j];
              if (seen.has(num)) {
                valid = false;
                break;
              }
              seen.add(num);
            }
          }
        }
      }
    }
    
    return { complete, valid };
  }
}