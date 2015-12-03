module.exports = function tictactoeCommandHandler(events) {
	return {
		executeCommand: function executeCommand(command) {
			return [
				{
					event     : 'GameCreated',
					userName  : command.userName,
					timeStamp : command.timeStamp
				}
			];
		}
	}
};
