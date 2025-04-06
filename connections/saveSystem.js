// filepath: d:\dev\games\connections\connections\saveSystem.js
// Save system for Connections game with multiple save slots

const SAVE_KEY_PREFIX = 'connectionsGameSave_';
const AUTOSAVE_KEY = 'connectionsGameAutosave';
const MAX_SAVE_SLOTS = 3;
const CURRENT_VERSION = '1.0';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

// Variable to hold the autosave timer
let autosaveTimer = null;

/**
 * Save game state to a specific slot
 * @param {Object} gameState - The game state to save
 * @param {number|string} slotId - The save slot ID (1-3) or 'auto' for autosave
 * @returns {boolean} - Whether the save was successful
 */
export function saveGame(gameState, slotId = 'auto') {
    try {
        // Add metadata to the save
        const saveData = {
            ...gameState,
            version: CURRENT_VERSION,
            timestamp: Date.now(),
            slotId
        };

        // Use appropriate key based on slot
        const key = slotId === 'auto' ? AUTOSAVE_KEY : `${SAVE_KEY_PREFIX}${slotId}`;
        
        localStorage.setItem(key, JSON.stringify(saveData));
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

/**
 * Load game state from a specific slot
 * @param {number|string} slotId - The save slot ID (1-3) or 'auto' for autosave
 * @returns {Object|null} - The loaded game state or null if no save exists
 */
export function loadGame(slotId = 'auto') {
    try {
        // Use appropriate key based on slot
        const key = slotId === 'auto' ? AUTOSAVE_KEY : `${SAVE_KEY_PREFIX}${slotId}`;
        
        const savedData = localStorage.getItem(key);
        if (!savedData) return null;
        
        const gameState = JSON.parse(savedData);
        
        // Version compatibility check
        if (!gameState.version) {
            console.log('Legacy save detected, upgrading...');
            gameState.version = '1.0';
        }
        
        return gameState;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
}

/**
 * Get information about all save slots
 * @returns {Array} - Array of save info objects
 */
export function getSaveSlotInfo() {
    const saveInfo = [];
    
    // Check each save slot
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
        const saved = loadGame(i);
        
        saveInfo.push({
            slotId: i,
            isEmpty: saved === null,
            timestamp: saved?.timestamp || null,
            level: saved?.currentLevel || null,
            displayName: `Save ${i}${saved ? ` - Level ${saved.currentLevel}` : ' - Empty'}`
        });
    }
    
    // Check autosave
    const autosave = loadGame('auto');
    if (autosave) {
        saveInfo.push({
            slotId: 'auto',
            isEmpty: false,
            timestamp: autosave.timestamp,
            level: autosave.currentLevel,
            displayName: `Autosave - Level ${autosave.currentLevel}`
        });
    }
    
    return saveInfo;
}

/**
 * Start autosave timer
 * @param {Function} getGameStateFn - Function that returns the current game state
 */
export function startAutosave(getGameStateFn) {
    stopAutosave(); // Clear any existing timer
    
    autosaveTimer = setInterval(() => {
        const currentState = getGameStateFn();
        if (currentState) {
            saveGame(currentState, 'auto');
        }
    }, AUTOSAVE_INTERVAL);
}

/**
 * Stop autosave timer
 */
export function stopAutosave() {
    if (autosaveTimer) {
        clearInterval(autosaveTimer);
        autosaveTimer = null;
    }
}

/**
 * Delete a saved game
 * @param {number|string} slotId - The save slot ID to delete
 */
export function deleteSave(slotId) {
    try {
        const key = slotId === 'auto' ? AUTOSAVE_KEY : `${SAVE_KEY_PREFIX}${slotId}`;
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Failed to delete save:', error);
        return false;
    }
}

/**
 * Check if the browser supports saving
 * @returns {boolean} - Whether localStorage is available
 */
export function isStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Enable offline play by caching necessary files
 */
export function setupOfflineSupport() {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}