// Copy of gameLogic.js in the connections directory
export class GameLogic {
    constructor(wordBank) {
        this.wordBank = wordBank;
        this.currentLevel = 1;
        this.maxLevels = 50;
        this.lives = 4;
        this.foundGroups = [];
        this.usedWords = new Set();
        this.levelWords = [];
    }

    getGameState() {
        return {
            level: this.currentLevel,
            maxLevels: this.maxLevels,
            lives: this.lives
        };
    }

    generateLevel() {
        // Reset found groups
        this.foundGroups = [];
        
        // Get 4 random word categories that haven't been used yet
        const availableCategories = this.wordBank.filter(category => {
            return category.words.some(word => !this.usedWords.has(word));
        });

        if (availableCategories.length < 4) {
            // If we're running out of categories, reset the used words
            this.usedWords = new Set();
        }

        const selectedCategories = [];
        const categoriesPool = [...this.wordBank];
        
        // Adjust difficulty based on level
        const difficultyFactor = Math.min(1, this.currentLevel / 25); // Maxes out at level 25
        
        // Shuffle categories
        for (let i = categoriesPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [categoriesPool[i], categoriesPool[j]] = [categoriesPool[j], categoriesPool[i]];
        }
        
        // Select categories with preference to ones not used yet
        for (const category of categoriesPool) {
            if (selectedCategories.length >= 4) break;
            
            // Calculate how many words are still available in this category
            const availableWords = category.words.filter(word => !this.usedWords.has(word));
            
            if (availableWords.length >= 4) {
                selectedCategories.push({
                    ...category,
                    availableWords
                });
            }
        }
        
        if (selectedCategories.length < 4) {
            // Reset used words if we can't find enough categories
            this.usedWords = new Set();
            return this.generateLevel();
        }
        
        // For each selected category, pick 4 words
        const selectedWords = [];
        
        selectedCategories.forEach((category, categoryIndex) => {
            const difficulty = categoryIndex + 1; // Difficulty 1-4 based on category index
            
            // Shuffle available words
            const availableWords = [...category.availableWords];
            for (let i = availableWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableWords[i], availableWords[j]] = [availableWords[j], availableWords[i]];
            }
            
            // Take 4 random words from the category
            const words = availableWords.slice(0, 4);
            
            // Add words to selected words with metadata
            words.forEach(word => {
                selectedWords.push({
                    word,
                    category: category.category,
                    categoryIndex,
                    difficulty
                });
                
                // Mark word as used
                this.usedWords.add(word);
            });
        });
        
        // Shuffle the selected words
        for (let i = selectedWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selectedWords[i], selectedWords[j]] = [selectedWords[j], selectedWords[i]];
        }
        
        this.levelWords = selectedWords;
        return selectedWords;
    }

    checkGuess(guessedWords) {
        if (guessedWords.length !== 4) {
            return {
                success: false,
                message: "Please select exactly 4 words."
            };
        }
        
        // Get the word objects for the guessed words
        const guessedWordObjects = guessedWords.map(word => 
            this.levelWords.find(w => w.word === word)
        );
        
        // Check if all words are from the same category
        const categories = new Set(guessedWordObjects.map(word => word.category));
        
        if (categories.size === 1) {
            // Success! All words are from the same category
            const category = guessedWordObjects[0].category;
            
            // Remove the guessed words from levelWords
            this.levelWords = this.levelWords.filter(word => 
                !guessedWords.includes(word.word)
            );
            
            // Add to found groups
            this.foundGroups.push({
                category,
                words: guessedWords
            });
            
            return {
                success: true,
                message: `Correct! "${category}" group found.`
            };
        } else {
            // Incorrect guess
            this.lives--;
            
            return {
                success: false,
                message: this.lives > 0 
                    ? `Incorrect. ${this.lives} tries remaining.` 
                    : "Game over! No more tries."
            };
        }
    }

    isLevelComplete() {
        return this.levelWords.length === 0;
    }
    
    isGameOver() {
        return this.lives <= 0;
    }
    
    isGameComplete() {
        return this.currentLevel >= this.maxLevels;
    }
}