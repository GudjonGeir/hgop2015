// ******************************************
// Tests for creating games
// ******************************************


var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('create game command', () => {
	var given, when, then;

	it('should create game', () => {
		given = [];
		when = {
			cmd        : 'CreateGame',
			gameId     : 1,
			gameName   : 'game1',
			playerName : 'Player1',
			timeStamp  : '2015.01.01T10:00:00'
		};
		then = [
			{
				event      : 'GameCreated',
				gameId     : 1,
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			}
		];
		var actual = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	});

	it('should create a game when there is an existing game', () => {
		given = [
			{
				event      : 'GameCreated',
				gameId     : 2,
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			}
		];
		when = {
			cmd        : 'CreateGame',
			gameId     : 3,
			gameName   : 'game2',
			playerName : 'Player2',
			timeStamp  : '2015.01.01T11:00:00'
		};
		then = [
			{
				event      : 'GameCreated',
				gameId     : 3,
				gameName   : 'game2',
				playerName : 'Player2',
				timeStamp  : '2015.01.01T11:00:00'
			}
		];

		var actual = tictactoeCommandHandler(given).executeCommand(when);

		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	});
});
