import { useState, useEffect } from 'react';
import { Group, GameState } from './types';
import { saveGameState, loadGameState, clearGameState } from './storage';
import React from 'react';

const groups = [
  { id: 1, words: ["RING", "FINGER", "GRASS", "ONION"] },
  { id: 2, words: ["BUCK", "MILL", "GRAND", "CENT"] },
  { id: 3, words: ["CRICKET", "POLO", "RUGBY", "TENNIS"] },
  { id: 4, words: ["PHONE", "VIDEO", "FIRE", "HOUSE"] }
];

const words = groups.flatMap(group => group.words);

function shuffle(array: string[]): string[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Game() {
  const [board, setBoard] = useState<string[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [foundGroups, setFoundGroups] = useState<Group[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const savedState = loadGameState();
    
    // If we have a saved game, load it regardless of date
    if (savedState) {
      setBoard(savedState.board);
      setSelectedTiles(savedState.selectedTiles);
      setFoundGroups(savedState.foundGroups);
      setMistakes(savedState.mistakes);
      setIsComplete(savedState.isComplete);
    } else {
      // Initialize new game
      const shuffledWords = shuffle([...words]);
      setBoard(shuffledWords);
      
      // Save initial state
      saveGameState({
        board: shuffledWords,
        selectedTiles: [],
        foundGroups: [],
        mistakes: 0,
        isComplete: false
      });
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (board.length > 0) {
      saveGameState({
        board,
        selectedTiles,
        foundGroups,
        mistakes,
        isComplete
      });
    }
  }, [board, selectedTiles, foundGroups, mistakes, isComplete]);

  // Function to reset game and start a new one
  const resetGame = () => {
    clearGameState();
    const shuffledWords = shuffle([...words]);
    setBoard(shuffledWords);
    setSelectedTiles([]);
    setFoundGroups([]);
    setMistakes(0);
    setIsComplete(false);
    
    // Save initial state of new game
    saveGameState({
      board: shuffledWords,
      selectedTiles: [],
      foundGroups: [],
      mistakes: 0,
      isComplete: false
    });
  };

  const handleTileClick = (index: number) => {
    if (isComplete || foundGroups.some(group => group.tiles.includes(index))) {
      return;
    }

    if (selectedTiles.includes(index)) {
      setSelectedTiles(selectedTiles.filter(i => i !== index));
    } else if (selectedTiles.length < 4) {
      const newSelectedTiles = [...selectedTiles, index];
      setSelectedTiles(newSelectedTiles);

      if (newSelectedTiles.length === 4) {
        checkSelection(newSelectedTiles);
      }
    }
  };

  const checkSelection = (selection: number[]) => {
    const selectedWords = selection.map(index => board[index]);
    
    const matchingGroup = groups.find(group => 
      selectedWords.every(word => group.words.includes(word)) &&
      group.words.every(word => selectedWords.includes(word))
    );

    if (matchingGroup) {
      const newFoundGroups = [...foundGroups, { id: matchingGroup.id, tiles: selection }];
      setFoundGroups(newFoundGroups);
      setSelectedTiles([]);

      if (newFoundGroups.length === groups.length) {
        setIsComplete(true);
      }
    } else {
      setMistakes(mistakes + 1);
      setTimeout(() => {
        setSelectedTiles([]);
      }, 1000);
    }
  };

  const getTileClassName = (index: number) => {
    const foundGroup = foundGroups.find(group => group.tiles.includes(index));
    
    if (foundGroup) {
      return `tile group-${foundGroup.id}`;
    }
    
    if (selectedTiles.includes(index)) {
      return "tile selected";
    }
    
    return "tile";
  };

  return (
    <div className="game-container">
      <h1>Connections</h1>
      
      <div className="board">
        {board.map((word, index) => (
          <div 
            key={index}
            className={getTileClassName(index)}
            onClick={() => handleTileClick(index)}
          >
            {word}
          </div>
        ))}
      </div>
      
      <div className="status">
        <div>Mistakes: {mistakes}/4</div>
        <div>Groups Found: {foundGroups.length}/4</div>
      </div>
      
      {isComplete && (
        <div className="message">
          <h2>Congratulations!</h2>
          <p>You've completed the puzzle!</p>
        </div>
      )}
      
      <div className="controls">
        <button 
          className="reset-button" 
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
}