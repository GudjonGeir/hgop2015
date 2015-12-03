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
			} else if (command.cmd === 'JoinGame') {
				if (events[0] && events[0].gameName === command.gameName) {
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
			}
		}
	};
};
