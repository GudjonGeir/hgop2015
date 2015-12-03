module.exports = function tictactoeCommandHandler(events) {
	return {
		executeCommand: function executeCommand(command) {
			return [
				{
					event     : 'GameCreated',
					userName  : 'User1',
					timeStamp : '2015.01.01T10:00:00'
				}
			];
		}
	}
};
