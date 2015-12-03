module.exports = function tictactoeCommandHandler(events) {
	const commandHandlers = {
		CreateGame : function CreateGame(command) {
			return [
				{
					event     : 'GameCreated',
					gameName  : command.gameName,
					userName  : command.userName,
					timeStamp : command.timeStamp
				}
			];
		},
		JoinGame : function JoinGame(command) {
			if (events[0] && events[0].gameName === command.gameName) {
				if (events[1] !== undefined) {
					return [
						{
							event    : 'GameFull',
							gameName : command.gameName,
							timeStamp: command.timeStamp
						}
					]
				}
				return [
					events[0],
					{
						event     : 'GameJoined',
						gameName  : command.gameName,
						userName  : command.userName,
						timeStamp : command.timeStamp
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
					event     : 'MoveMade',
					userName  : 'User1',
					row       : 0,
					col       : 0,
					timeStamp : '2015.01.01T10:01:00'
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
