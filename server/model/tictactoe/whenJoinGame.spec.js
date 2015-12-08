// ******************************************
// Tests for joining games
// ******************************************

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('join game command', () => {
	var given, when, then;

	it('should allow a player to join an existing game', () => {
		given = [
			{
				event      : 'GameCreated',
				gameId     : 4,
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			}
		];
		when = {
			cmd        : 'JoinGame',
			gameId     : 4,
			gameName   : 'game1',
			playerName : 'Player2',
			timeStamp  : '2015.01.01T10:01:00'
		};
		then = [
			{
				event      : 'GameCreated',
				gameId     : 4,
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			},
			{
				event      : 'GameJoined',
				gameId     : 4,
				gameName   : 'game1',
				playerName : 'Player2',
				timeStamp  : '2015.01.01T10:01:00'
			}
		];

		var actual = tictactoeCommandHandler(given).executeCommand(when);

		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow a player to join a non existing game', () => {
		given = [];
		when = {
			cmd        : 'JoinGame',
			gameId     : 5,
			gameName   : 'game1',
			playerName : 'Player1',
			timeStamp  : '2015.01.01T20:00:00'
		};
		then = [
			{
				event     : 'NonExistingGame',
				gameId    : 5,
				gameName  : 'game1',
				timeStamp : '2015.01.01T20:00:00'
			}
		];

		var actual = tictactoeCommandHandler(given).executeCommand(when);

		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow a player to join a game with two players', () => {
		given = [
			{
				event      : 'GameCreated',
				gameId     : 6,
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			},
			{
				event      : 'GameJoined',
				gameId     : 6,
				gameName   : 'game1',
				playerName : 'Player2',
				timeStamp  : '2015.01.01T10:01:00'
			}
		];
		when = {
			cmd        : 'JoinGame',
			gameId     : 6,
			gameName   : 'game1',
			playerName : 'Player3',
			timeStamp  : '2015.01.01T10:03:00'
		};
		then = [
			{
				event     : 'GameFull',
				gameId    : 6,
				gameName  : 'game1',
				timeStamp : '2015.01.01T10:03:00'
			}
		];

		var actual = tictactoeCommandHandler(given).executeCommand(when);

		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	});
});
