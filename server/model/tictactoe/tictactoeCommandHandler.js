module.exports = function tictactoeCommandHandler(events) {
	return {
		executeCommand: function executeCommand(command) {
			if (command.cmd === "CreateGame") {
				return [
					{
						event     : 'GameCreated',
						gameName  : command.gameName,
						userName  : command.userName,
						timeStamp : command.timeStamp
					}
				];
			}
			return [
				{
					event: 'GameJoined',
					gameName: command.gameName,
					userName: command.userName,
					timeStamp: command.timeStamp
				}
			];
		}
	};
};
