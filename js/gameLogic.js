export class GameLogic {
    constructor(wordBank) {
        this.wordBank = wordBank;
        this.usedWords = new Set();
        this.currentLevel = 1;
        this.maxLevels = 50;
        this.score = 0;
        this.lives = 4; // Player gets 4 attempts per level
        this.currentWords = [];
        // Remove foundGroups array as it's no longer needed
    }

    getDifficultyForLevel(level) {
        // Levels 1-10: mostly difficulty 1
        // Levels 11-25: mostly difficulty 2
        // Levels 26-40: mostly difficulty 3
        // Levels 41-50: mostly difficulty 4 and mixed difficulties
        if (level <= 10) {
            return { min: 1, max: 2 };
        } else if (level <= 25) {
            return { min: 1, max: 3 };
        } else if (level <= 40) {
            return { min: 2, max: 3 };
        } else {
            return { min: 2, max: 4 };
        }
    }

    generateLevel() {
        let levelWords = [];
        const difficulty = this.getDifficultyForLevel(this.currentLevel);
        
        // Filter categories by difficulty
        let availableCategories = [...new Set(
            this.wordBank
                .filter(w => w.difficulty >= difficulty.min && w.difficulty <= difficulty.max)
                .map(w => w.category)
        )];

        // Pick 4 random categories for this level
        let levelCategories = availableCategories
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        levelCategories.forEach(category => {
            // Get words for each category matching the difficulty range
            let categoryWords = this.wordBank
                .filter(w => 
                    w.category === category && 
                    !this.usedWords.has(w.word) &&
                    w.difficulty >= difficulty.min &&
                    w.difficulty <= difficulty.max
                )
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            
            // If we don't have enough words, try any difficulty
            if (categoryWords.length < 4) {
                categoryWords = this.wordBank
                    .filter(w => w.category === category && !this.usedWords.has(w.word))
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
            }
            
            categoryWords.forEach(word => {
                levelWords.push(word);
                this.usedWords.add(word.word);
            });
        });

        this.currentWords = levelWords.sort(() => 0.5 - Math.random());
        return this.currentWords;
    }

    checkGuess(selectedWords) {
        const wordObjects = selectedWords.map(word => 
            this.currentWords.find(w => w.word === word)
        );

        const categories = new Set(wordObjects.map(w => w.category));
        if (categories.size === 1) {
            const category = Array.from(categories)[0];
            
            // Remove found words from current words
            this.currentWords = this.currentWords.filter(
                word => !selectedWords.includes(word.word)
            );

            return {
                success: true,
                category: category,
                message: `Correct! You found the ${category} group!`
            };
        } else {
            // Wrong guess
            this.lives--;
            return {
                success: false,
                message: this.lives > 0 ? 
                    `Wrong combination. ${this.lives} tries remaining.` : 
                    'Game Over!'
            };
        }
    }

    isLevelComplete() {
        return this.currentWords.length === 0;
    }

    isGameOver() {
        return this.lives <= 0;
    }

    getGameState() {
        return {
            level: this.currentLevel,
            maxLevels: this.maxLevels,
            lives: this.lives,
            score: this.score,
            remainingWords: this.currentWords.length,
            difficulty: this.getDifficultyForLevel(this.currentLevel)
        };
    }

    isGameComplete() {
        return this.currentLevel > this.maxLevels;
    }
}
