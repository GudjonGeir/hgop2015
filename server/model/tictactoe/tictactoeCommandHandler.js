const _ = require('lodash');

module.exports = function tictactoeCommandHandler(events) {

	var gameState = {
		board     : [['','',''],['','',''],['','','']],
		playerOne : null,
		playerTwo : null,
		nextMark  : 'X',
		movesMade : 0
	};

	function checkForWin() {
		for (var i = 0; i < 3; i++) {
			if (gameState.board[i][0] === gameState.board[i][1] &&
				gameState.board[i][1] === gameState.board[i][2] &&
				gameState.board[i][0] !== '') {
				return true;
			}
			if (gameState.board[0][i] === gameState.board[1][i] &&
				gameState.board[1][i] === gameState.board[2][i] &&
				gameState.board[0][i] !== '') {
				return true;
			}
		}
		if (gameState.board[0][0] === gameState.board[1][1] &&
			gameState.board[1][1] === gameState.board[2][2] &&
			gameState.board[0][0] !== '') {
			return true;
		}
		if (gameState.board[2][0] === gameState.board[1][1] &&
			gameState.board[1][1] === gameState.board[0][2] &&
			gameState.board[2][0] !== '') {
			return true;
		}
		return false;
	}

	// Handles previous events, i.e. given events.
	// Updates the game state to the current state.
	const eventHandlers = {
		GameCreated: function CreateGame(event) {
			gameState.playerOne = event.playerName;
		},
		GameJoined: function JoinGame(event) {
			gameState.playerTwo = event.playerName;
		},
		MoveMade: function MakeMove(event) {
			gameState.board[event.col][[event.row]] = gameState.nextMark;
			gameState.nextMark = gameState.nextMark === 'X' ? 'O' : 'X';
			gameState.movesMade++;
		}
	};

	_.each(events, (event) => {
		const eventHandler = eventHandlers[event.event];
		if (eventHandler) {
			eventHandler(event);
		}
	});

	// Handles the current command
	const commandHandlers = {

		CreateGame : function CreateGame(command) {
			return [
				{
					event      : 'GameCreated',
					gameId     : command.gameId,
					gameName   : command.gameName,
					playerName : command.playerName,
					timeStamp  : command.timeStamp
				}
			];
		},
		JoinGame : function JoinGame(command) {
			if (events[0] && events[0].gameName === command.gameName) {
				if (events[1] !== undefined) {
					return [
						{
							event     : 'GameFull',
							gameId    : command.gameId,
							gameName  : command.gameName,
							timeStamp : command.timeStamp
						}
					]
				}
				return [
					{
						event      : 'GameJoined',
						gameId     : command.gameId,
						gameName   : command.gameName,
						playerName : command.playerName,
						timeStamp  : command.timeStamp
					}
				];
			} else {
				return [
					{
						event     : 'NonExistingGame',
						gameId    : command.gameId,
						gameName  : command.gameName,
						timeStamp : command.timeStamp
					}
				];
			}
		},
		MakeMove : function MakeMove(command) {
			// Check if it's the players turn
			const playersMark = command.playerName === gameState.playerOne ? 'X' : 'O';
			if (playersMark === gameState.nextMark) {
				var retEvent = {
					event      : '',
					gameId     : command.gameId,
					playerName : command.playerName,
					side       : playersMark,
					col        : command.col,
					row        : command.row,
					timeStamp  : command.timeStamp,
				};
				if (gameState.board[command.col][command.row] === '') {
					gameState.board[command.col][command.row] = playersMark;
					gameState.movesMade++;
					if (checkForWin()) {
						retEvent.event = 'GameOver';
					}
					else if (gameState.movesMade === 9) {
						retEvent.event = 'Draw';
					}
					else {
						retEvent.event = 'MoveMade';
					}
				} else {
					retEvent.event = 'TileOccupied';
				}
				return [ retEvent ];
			} else {
				return [
					{
						event      : 'NotPlayersTurn',
						gameId     : command.gameId,
						playerName : command.playerName,
						timeStamp  : command.timeStamp
					}
				]
			}
		}
	}

	return {
		executeCommand: function executeCommand(command) {
			return commandHandlers[command.cmd](command);
		}
	};
};
