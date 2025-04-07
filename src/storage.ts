// Game storage utility to save and load game progress
import { GameState } from './types';

export const STORAGE_KEY = 'connections-game-state';

// Save current game state to localStorage
export const saveGameState = (gameState: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// Load saved game state from localStorage
export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

// Clear saved game state
export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};