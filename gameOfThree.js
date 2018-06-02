class GameOfThree {
  constructor(player1, player2, startingNumber) {
    this._initGame(player1, player2, startingNumber);
    this._sendWelcomeMsgs(startingNumber);
    this._setupTurnHandler();
  }

  _initGame(player1, player2, startingNumber) {
    this._currentNumber = startingNumber;
    this._players = [player1, player2];
    this._waitingPlayer = this._players[0];
    this._currentPlayer = this._players[1];
  }

  _sendWelcomeMsgs(startingNumber) {
    this._sendMsgToPlayer(1, startingNumber); // Ask Player 2 to Make the first Move
    this._sendMsgToPlayer(1, "Make your Move!"); // Ask Player 2 to Make the first Move
    this._sendMsgToPlayer(0, "Wait for your turn"); // Ask Player 1 to Wait for his turn
  }

  _setupTurnHandler() {
    this._players.forEach((player, playerIndex) => {
      player.on("turn", turn => {
        this._onTurn(playerIndex, turn);
      });
    });
  }

  _sendMsgToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit("message", msg);
  }

  _sendMsgToPlayers(msg) {
    this._players.forEach(player => {
      player.emit("message", msg);
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
        this._sendMsgToPlayer(playerIndex, `You sent ${turn}`);

        this._getNumberForNextMove();
        this._togglePlayer(playerIndex);
        this._endGameIfRequired();
      } else {
        this._sendMsgToPlayer(
          playerIndex,
          `${turn} is not a right choice! Retry!`
        );
      }
    } else {
      this._waitingPlayer.emit("message", "Please wait for your turn!");
    }
  }

  _isRightTurn(playerIndex) {
    return this._players[playerIndex] === this._currentPlayer;
  }

  _endGameIfRequired() {
    if (this._isGameOver()) {
      this._sendWinMessage(this._waitingPlayer, this._currentPlayer);
      this._sendMsgToPlayers("Game Over! Refresh Page to start a New Game!");
      this._sendMsgToPlayers("404");
    }
  }

  _isGameOver() {
    return this._currentNumber === 1;
  }

  _togglePlayer(playerIndex) {
    this._currentPlayer = this._waitingPlayer;
    this._waitingPlayer = this._players[playerIndex];
    this._currentPlayer.emit("message", "Make your Move!");
    this._currentPlayer.emit("message", this._currentNumber);
  }

  _getNumberForNextMove() {
    let sum = this._addNumbers(this._currentMove);
    this._currentNumber = Math.round(sum / 3);
  }

  _isValidMove() {
    let sum = this._addNumbers(this._currentMove);
    return sum % 3 === 0;
  }

  _sendWinMessage(winner, loser) {
    winner.emit("message", "You Won!");
    loser.emit("message", "You Lost!");
  }

  _addNumbers(turn) {
    let startingNumber = this._currentNumber;
    let sum = parseInt(startingNumber) + parseInt(turn);
    return sum;
  }
}

module.exports = GameOfThree;
