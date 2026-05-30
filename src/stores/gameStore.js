import { defineStore } from 'pinia'
import wordDict from '../words.json'

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      wordLength: 5,
      board: [],
      colors: [],
      currentRow: 0,
      currentCol: 0,
      gameStatus: "playing", 
      solution: "",
      meaning: "",
      dictionary: [],
      errorMessage: "" // <-- 1. Tambah state baru untuk mesej ralat
    }
  },
  
  actions: {
    // 2. Buat fungsi baru untuk tunjuk mesej dan auto-hilang
    showError(msg) {
      this.errorMessage = msg;
      setTimeout(() => {
        this.errorMessage = "";
      }, 2000); // Hilang lepas 2 saat
    },

    initGame(length = this.wordLength) {
      this.wordLength = length;
      this.board = Array(5).fill("").map(() => Array(length).fill(""));
      this.colors = Array(5).fill("").map(() => Array(length).fill(""));
      this.currentRow = 0;
      this.currentCol = 0;
      this.gameStatus = "playing";
      this.errorMessage = ""; // Reset error kalau ada

      const wordObjects = wordDict[length] || [];
      this.dictionary = wordObjects.map(obj => obj.word.toUpperCase());
      
      const randomIndex = Math.floor(Math.random() * wordObjects.length);
      this.solution = wordObjects[randomIndex].word.toUpperCase();
      this.meaning = wordObjects[randomIndex].meaning;
    },

    addLetter(letter) {
      if (this.gameStatus !== 'playing') return;
      if (this.currentCol < this.wordLength) {
        this.board[this.currentRow][this.currentCol] = letter.toUpperCase();
        this.currentCol++;
      }
    },
    
    removeLetter() {
      if (this.gameStatus !== 'playing') return;
      if (this.currentCol > 0) {
        this.currentCol--;
        this.board[this.currentRow][this.currentCol] = "";
      }
    },

    submitWord() {
      if (this.gameStatus !== 'playing') return;
      
      if (this.currentCol !== this.wordLength) {
        // 3. Guna showError, buang alert()
        this.showError(`Kena isi ${this.wordLength} huruf!`);
        return;
      }

      const guess = this.board[this.currentRow].join(""); 
      const solutionArray = this.solution.split("");
      let correctCount = 0;

      for (let i = 0; i < this.wordLength; i++) {
        if (guess[i] === solutionArray[i]) {
          this.colors[this.currentRow][i] = "correct";
          solutionArray[i] = null;
          correctCount++;
        }
      }

      for (let i = 0; i < this.wordLength; i++) {
        if (this.colors[this.currentRow][i] !== "correct") {
          const letterIndex = solutionArray.indexOf(guess[i]);
          if (letterIndex !== -1) {
            this.colors[this.currentRow][i] = "present";
            solutionArray[letterIndex] = null;
          } else {
            this.colors[this.currentRow][i] = "absent";
          }
        }
      }

      if (correctCount === this.wordLength) {
        setTimeout(() => { this.gameStatus = "won"; }, 300);
      } else {
        this.currentRow++;
        this.currentCol = 0;
        
        if (this.currentRow > 4) {
          setTimeout(() => { this.gameStatus = "lost"; }, 300);
        }
      }
    }
  }
})