class GameOfThree {
  constructor(player1, player2, startingNumber) {
    this._initGame(player1, player2, startingNumber);
    this._setupAvatars(player1, player2);
    this._sendWelcomeMsgs(startingNumber);
    this._setupTurnHandler();
  }

  _initGame(player1, player2, startingNumber) {
    this._currentNumber = startingNumber;
    player1["avatar"] = "player1";
    player2["avatar"] = "player2";
    this._players = [player1, player2];
    this._waitingPlayer = this._players[0];
    this._currentPlayer = this._players[1];
  }

  _setupAvatars(player1, player2) {
    this._players[0].emit("avatar", "mario");
    this._players[1].emit("avatar", "mushroom");
  }

  _sendWelcomeMsgs(startingNumber) {
    this._sendMsgToPlayers(startingNumber, "player1"); // Inform Players the first random number
    this._sendMsgToPlayer(1, "Make your First Move!", "alert"); // Ask Player 2 to Make the first Move
    this._sendMsgToPlayer(0, "Wait for your turn", "alert"); // Ask Player 1 to Wait for his turn
  }

  _setupTurnHandler() {
    this._players.forEach((player, playerIndex) => {
      player.on("turn", turn => {
        this._onTurn(playerIndex, turn);
      });
    });
  }

  _sendMsgToPlayer(playerIndex, msg, msgType = "") {
    this._players[playerIndex].emit("message", msg, msgType);
  }

  _sendMsgToPlayers(msg, msgType = "") {
    this._players.forEach(player => {
      player.emit("message", msg, msgType);
    });
  }

  _onTurn(playerIndex, turn) {
    if (this._isGameOver()) {
      this._sendMsgToPlayers("404");
      return;
    }

    if (this._isRightTurn(playerIndex)) {
      this._currentMove = turn;
      if (this._isValidMove()) {
        this._sendMsgToPlayers(turn, this._players[playerIndex].avatar);
        this._sendMsgToPlayers(
          `[ (${turn} + ${
            this._currentNumber
          }) / 3 ] = ${this._getNumberForNextMove()}`,
          "alert"
        );

        // this._getNumberForNextMove();
        this._togglePlayer(playerIndex);
        this._endGameIfRequired();
      } else {
        this._sendMsgToPlayer(
          playerIndex,
          `${turn} is not a right choice! Retry!`,
          "warning"
        );
      }
    } else {
      this._waitingPlayer.emit(
        "message",
        "Please wait for your turn!",
        "warning"
      );
    }
  }

  _isRightTurn(playerIndex) {
    return this._players[playerIndex] === this._currentPlayer;
  }

  _endGameIfRequired() {
    if (this._isGameOver()) {
      this._sendWinMessage(this._waitingPlayer, this._currentPlayer);
      this._sendMsgToPlayers(
        "Game Over! Refresh Page to start a New Game!",
        "alert"
      );
      this._sendMsgToPlayers("404");
    }
  }

  _isGameOver() {
    return this._currentNumber === 1;
  }

  _togglePlayer(playerIndex) {
    this._currentPlayer = this._waitingPlayer;
    this._waitingPlayer = this._players[playerIndex];
    this._sendMsgToPlayers(`${this._currentNumber}`, "alert");
  }

  _getNumberForNextMove() {
    let sum = this._addNumbers(this._currentMove);
    this._currentNumber = Math.round(sum / 3);
    return this._currentNumber;
  }

  _isValidMove() {
    let sum = this._addNumbers(this._currentMove);
    return sum % 3 === 0;
  }

  _sendWinMessage(winner, loser) {
    winner.emit("message", "", "trophy center");
    winner.emit("message", "Congrats! You Won!", "trophyText center");
    winner.emit("fireWorks");
    loser.emit("message", "", "loser");
    loser.emit("message", "Sorry! You Lost!", "loserText center");
  }

  _addNumbers(turn) {
    let startingNumber = this._currentNumber;
    let sum = parseInt(startingNumber) + parseInt(turn);
    return sum;
  }
}

module.exports = GameOfThree;
