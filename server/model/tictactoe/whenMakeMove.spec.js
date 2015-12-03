// ******************************************
// Tests for making moves in a game
// ******************************************

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('make move command', () => {
	var given, when, then;

	beforeEach(() => {
		given = [
			{
				event     : 'GameCreated',
				gameName  : 'game1',
				userName  : 'User1',
				timeStamp : '2015.01.01T10:00:00'
			},
			{
				event     : 'GameJoined',
				gameName  : 'game1',
				userName  : 'User2',
				timeStamp : '2015.01.01T10:01:00'
			}
		];
	});

	it('should allow player one to make first move', () => {
		when = {
			cmd       : 'MakeMove',
			userName  : 'User1',
			row       : 0,
			col       : 0,
			timeStamp : '2015.01.01T10:01:00'
		};
		then = [
			{
				event     : 'MoveMade',
				userName  : 'User1',
				row       : 0,
				col       : 0,
				timeStamp : '2015.01.01T10:01:00'
			}
		];

		var actual = tictactoeCommandHandler(given).executeCommand(when);

		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	})
})
