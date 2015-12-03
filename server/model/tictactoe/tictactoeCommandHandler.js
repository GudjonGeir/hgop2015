module.exports = function tictactoeCommandHandler(events) {
	return {
		executeCommand: function executeCommand(command) {
			return [
				{
					event     : 'GameCreated',
					gameName  : command.gameName,
					userName  : command.userName,
					timeStamp : command.timeStamp
				}
			];
		}
	}
};
