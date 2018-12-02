"use strict";
var timer;
var winCount = 0;
var gameStarted = false;

var displayWord = document.getElementById("wordDisplay");
var displayRemainingGuess = document.getElementById("remainingGuess");
var displayLettersGuessed = document.getElementById("lettersGuessed");
var displayAnswerText = document.getElementById("answerText");
var displayWin = document.getElementById("winCountDisplay");
var displayTimer = document.getElementById("timer");
var gameAudio = document.getElementById("gameAudio");
var displayResultText = document.getElementById("resultText");
var displayResultImg = document.getElementById("resultImg");
var modal = document.getElementById('launchModal');
gameAudio.loop = true

//main game object
var game = {
  wordObj: {},
  word: "",
  winMusic: "",
  winPicture: "",
  numberOfGuess: 12,
  guessingWord: [],
  lettersGuessed: [],
  songName: "",
  artistName: "",

  startGame() {

    //Pick a random object from the musicList
    this.wordObj = musicList[Math.floor(Math.random() * musicList.length)];
    //Pick a random word from the wordList of the selected wordObj
    this.word = this.wordObj.wordList[Math.floor(Math.random() * this.wordObj.wordList.length)];
    this.winMusic = this.wordObj.musicFile;
    gameAudio.setAttribute('src', this.winMusic)
    gameAudio.load();
    this.winPicture = this.wordObj.picture;
    this.songName = this.wordObj.songName;
    this.artistName = this.wordObj.artistName;
    this.guessingWord = [];
    for (var i = 0; i < this.word.length; i++) {
      this.guessingWord[i] = "_";
    }
    this.numberOfGuess = 12;
    displayWord.textContent = this.guessingWord.join(" ");
    displayLettersGuessed.textContent = "[ ]";
    displayRemainingGuess.textContent = this.numberOfGuess;
    displayAnswerText.textContent = "";
    displayResultText.textContent = "";
    displayResultImg.setAttribute("src", "")
    this.lettersGuessed = [];
    displayTimer.textContent = "00:00";
    this.gameStarted = true;
    this.stopTimer();
    this.startTimer();
  },

  checkGuess(playerGuess) {
    //Checks the player guess
    var correctGuess = 0;
    //if the player guess letter is not already guessed, proceed and put the letter into the guessed list
    if (this.lettersGuessed.indexOf(playerGuess) === -1) {
      this.lettersGuessed.push(playerGuess);
      for (var j = 0; j < this.word.length; j++) {
        if (this.word[j] === playerGuess) {
          this.guessingWord[j] = playerGuess;
          correctGuess++;
        }
      }
      //if no correct letter guessed, decrease the number of guesses
      if (correctGuess === 0) {
        this.numberOfGuess--;
      }
      //updat the display and check for win or lose
      this.checkProgress();
    }
  },

  checkProgress() {
    displayWord.textContent = this.guessingWord.join(" ");
    displayRemainingGuess.textContent = this.numberOfGuess;
    displayLettersGuessed.textContent = "[ " + this.lettersGuessed.join(", ") + " ]";

    if (this.guessingWord.indexOf("_") === -1) {
      this.gameWin();
    } else if (this.numberOfGuess <= 0) {
      this.gameLose();
    }
  },

  gameWin() {
    displayResultText.style.color = "#ff48c4";
    displayResultText.innerHTML = "You Win! <h4>Press any key to restart</h4>";
    //display the winPicture
    displayResultImg.setAttribute("src", this.winPicture)
    //play the winSong
    gameAudio.play();
    this.stopTimer();
    winCount += 1;
    displayWin.textContent = winCount;
    displayAnswerText.textContent = this.songName + " by " + this.artistName;
    this.gameStarted = false;
  },

  gameLose() {
    displayResultText.style.color = "brown";
    displayResultText.innerHTML = "You Lose. <h4>Press any key to restart</h4>";
    //display a game over picture
    displayResultImg.setAttribute("src", "assets\\images\\gameover.png")
    //play losing music
    gameAudio.setAttribute("src", "assets\\audio\\GameOver.mp3")
    gameAudio.play();
    displayAnswerText.textContent = this.songName + " by " + this.artistName;
    this.stopTimer();
    this.gameStarted = false;
  },

  startTimer() {
    var timeInSec = 0;
    function formatTime(val) {
      return val > 9 ? val : "0" + val;
    }
    timer = setInterval(() => {
      displayTimer.textContent =
        formatTime(parseInt(timeInSec / 60, 10)) +
        ":" +
        formatTime(++timeInSec % 60);
    }, 1000);
  },

  stopTimer() {
    clearInterval(timer);
  }
};

//main event, player press any key to start
document.onkeyup = function (event) {
  if (!game.gameStarted) {
    //close the modal box and start the game
    modal.style.display = "none"
    game.startGame();
    //if game already started, check the guess
  } else {
    var playerGuess = event.key;
    //make sure the key entered is between a-z
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      playerGuess = playerGuess.toLowerCase();
      game.checkGuess(playerGuess);
    }
  }
};
