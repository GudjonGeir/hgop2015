module.exports = function tictactoeCommandHandler(events) {

	var gameState = {
		board     : [['','',''],['','',''],['','','']],
		playerOne : null,
		playerTwo : null
	};

	const commandHandlers = {

		CreateGame : function CreateGame(command) {
			return [
				{
					event      : 'GameCreated',
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
							gameName  : command.gameName,
							timeStamp : command.timeStamp
						}
					]
				}
				return [
					events[0],
					{
						event      : 'GameJoined',
						gameName   : command.gameName,
						playerName : command.playerName,
						timeStamp  : command.timeStamp
					}
				];
			} else {
				return [
					{
						event     : 'NonExistingGame',
						gameName  : command.gameName,
						timeStamp : command.timeStamp
					}
				];
			}
		},
		MakeMove : function MakeMove(command) {
			return [
				{
					event      : 'MoveMade',
					playerName : command.playerName,
					row        : command.row,
					col        : command.col,
					timeStamp  : command.timeStamp
				}
			];
		}
	}

	return {
		executeCommand: function executeCommand(command) {
			return commandHandlers[command.cmd](command);
		}
	};
};
