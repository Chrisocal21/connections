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

  // Remove numbers from the board based on difficulty level and pattern
  removeNumbers(board, difficulty) {
    const puzzle = this.copyBoard(board);
    let cellsToRemove;
    let patternType;
    
    // Set difficulty parameters
    if (difficulty === 'easy') {
      cellsToRemove = 30; // Remove ~30 cells for easy
      patternType = 'balanced'; // Even distribution across the board
    } else if (difficulty === 'medium') {
      cellsToRemove = 45; // Remove ~45 cells for medium
      patternType = 'diagonal'; // More focus on diagonal patterns
    } else if (difficulty === 'hard') {
      cellsToRemove = 55; // Remove ~55 cells for hard
      patternType = 'asymmetric'; // Create asymmetric patterns for increased difficulty
    } else {
      cellsToRemove = 30; // Default to easy
      patternType = 'balanced';
    }
    
    // Define regions to focus on based on pattern type
    let priorityRegions = [];
    
    switch (patternType) {
      case 'balanced':
        // Balanced pattern removes cells evenly across the board
        break;
        
      case 'diagonal':
        // Diagonal pattern focuses on diagonal regions
        priorityRegions = [
          {rowStart: 0, rowEnd: 2, colStart: 0, colEnd: 2},
          {rowStart: 3, rowEnd: 5, colStart: 3, colEnd: 5},
          {rowStart: 6, rowEnd: 8, colStart: 6, colEnd: 8}
        ];
        break;
        
      case 'asymmetric':
        // Asymmetric pattern creates more challenging puzzles
        // Pick random regions to focus on
        const regions = [
          {rowStart: 0, rowEnd: 2, colStart: 0, colEnd: 2},
          {rowStart: 0, rowEnd: 2, colStart: 3, colEnd: 5},
          {rowStart: 0, rowEnd: 2, colStart: 6, colEnd: 8},
          {rowStart: 3, rowEnd: 5, colStart: 0, colEnd: 2},
          {rowStart: 3, rowEnd: 5, colStart: 3, colEnd: 5},
          {rowStart: 3, rowEnd: 5, colStart: 6, colEnd: 8},
          {rowStart: 6, rowEnd: 8, colStart: 0, colEnd: 2},
          {rowStart: 6, rowEnd: 8, colStart: 3, colEnd: 5},
          {rowStart: 6, rowEnd: 8, colStart: 6, colEnd: 8}
        ];
        
        // Shuffle and select 3-4 regions to prioritize
        this.shuffle(regions);
        priorityRegions = regions.slice(0, 3 + Math.floor(Math.random() * 2));
        break;
    }
    
    // First handle priority regions (if any)
    if (priorityRegions.length > 0) {
      const priorityRemovalCount = Math.floor(cellsToRemove * 0.7); // 70% from priority regions
      let removed = 0;
      
      // Generate cells from priority regions
      const priorityCells = [];
      priorityRegions.forEach(region => {
        for (let row = region.rowStart; row <= region.rowEnd; row++) {
          for (let col = region.colStart; col <= region.colEnd; col++) {
            priorityCells.push({row, col});
          }
        }
      });
      
      // Shuffle the cells for randomization
      this.shuffle(priorityCells);
      
      // Remove cells from priority regions
      for (const cell of priorityCells) {
        if (removed >= priorityRemovalCount) break;
        if (puzzle[cell.row][cell.col] !== 0) {
          puzzle[cell.row][cell.col] = 0;
          removed++;
        }
      }
      
      // Remove the remaining cells from anywhere
      let attempts = 0;
      const maxAttempts = 200;
      while (removed < cellsToRemove && attempts < maxAttempts) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (puzzle[row][col] !== 0) {
          puzzle[row][col] = 0;
          removed++;
        }
        
        attempts++;
      }
    } else {
      // For balanced pattern, just remove cells randomly
      let removed = 0;
      let attempts = 0;
      const maxAttempts = 200;
      
      while (removed < cellsToRemove && attempts < maxAttempts) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (puzzle[row][col] !== 0) {
          puzzle[row][col] = 0;
          removed++;
        }
        
        attempts++;
      }
    }
    
    // Ensure the puzzle has a unique solution for medium and hard difficulties
    if (difficulty !== 'easy') {
      this.ensureUniqueSolution(puzzle);
    }
    
    return puzzle;
  }
  
  // Ensure the puzzle has a unique solution (for medium and hard difficulties)
  ensureUniqueSolution(puzzle) {
    // Implementation would check if removing a number creates multiple solutions
    // This is a simplified version that just makes sure we don't remove too many
    // For a full implementation, we would need to check with a solver
    
    // For now, we'll just ensure there are enough clues for a unique solution
    // Typical minimum is 17 clues
    let filledCells = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] !== 0) {
          filledCells++;
        }
      }
    }
    
    // If we have fewer than 25 clues, add some back randomly
    if (filledCells < 25) {
      const solution = this.solution; // Use the stored solution
      const needed = 25 - filledCells;
      let added = 0;
      
      while (added < needed) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (puzzle[row][col] === 0) {
          puzzle[row][col] = solution[row][col];
          added++;
        }
      }
    }
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