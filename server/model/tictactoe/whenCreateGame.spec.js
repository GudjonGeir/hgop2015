var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('create game command', () => {
	var given, when, then;

	it('should create game', () =>{
		given = [];
		when = {
			cmd       : 'CreateGame',
			userName  : 'User1',
			gameName  : 'game1',
			timeStamp : '2015.01.01T10:00:00'
		};
		then = [
			{
				event     : 'GameCreated',
				userName  : 'User1',
				timeStamp : '2015.01.01T10:00:00'
			}
		];

		var actual = tictactoeCommandHandler(given).executeCommand(when);

		JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
	});
});
