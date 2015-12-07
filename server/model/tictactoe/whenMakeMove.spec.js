// ******************************************
// Tests for making moves in a game
// ******************************************

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('make move command', () => {
	var given, when, then;

	beforeEach(() => {
		given = [
			{
				event      : 'GameCreated',
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			},
			{
				event      : 'GameJoined',
				gameName   : 'game1',
				playerName : 'Player2',
				timeStamp  : '2015.01.01T10:01:00'
			}
		];
	});

	describe('first moves', () => {

		it('should allow player one to make first move', () => {
			when = {
				cmd        : 'MakeMove',
				playerName : 'Player1',
				col        : 0,
				row        : 0,
				timeStamp  : '2015.01.01T10:02:00'
			};
			then = [
				{
					event      : 'MoveMade',
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T10:02:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});

		it('should allow player two to make the second move', () => {
			given.push({
				event      : 'MoveMade',
				playerName : 'Player1',
				col        : 0,
				row        : 0,
				timeStamp  : '2015.01.01T10:02:00'
			});
			when = {
				cmd        : 'MakeMove',
				playerName : 'Player2',
				col        : 1,
				row        : 1,
				timeStamp  : '2015.01.01T10:03:00'
			}
			then = [
				{
					event      : 'MoveMade',
					playerName : 'Player2',
					col        : 1,
					row        : 1,
					timeStamp  : '2015.01.01T10:03:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});
	});

	describe('illegal moves', () => {
		it('should not allow players to make a move when it\'s not their turn', () =>{

			when = {
				cmd        : 'MakeMove',
				playerName : 'Player2',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T10:02:00'
			};
			then = [
				{
					event      : 'NotPlayersTurn',
					playerName : 'Player2',
					timeStamp  : '2015.01.01T10:02:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});

		it('should not allow players to place a mark on an occupied tile', () => {
			given.push({
				event      : 'MoveMade',
				playerName : 'Player1',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T10:04:00'
			});
			when = {
				cmd        : 'MakeMove',
				playerName : 'Player2',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T10:05:00'
			}
			then = [
				{
					event      : 'TileOccupied',
					playerName : 'Player2',
					col        : 2,
					row        : 1,
					timeStamp  : '2015.01.01T10:05:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});
	});

	describe('win moves', () => {
		it('should anounce a win if three horizontal marks match', () => {
			const prevMoves = [
				{
					event      : 'MoveMade',
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T11:01:00'
				},
				{
					event      : 'MoveMade',
					playerName : 'Player2',
					col        : 1,
					row        : 0,
					timeStamp  : '2015.01.01T11:02:00'
				},
				{
					event      : 'MoveMade',
					playerName : 'Player1',
					col        : 0,
					row        : 2,
					timeStamp  : '2015.01.01T11:03:00'
				},
				{
					event      : 'MoveMade',
					playerName : 'Player2',
					col        : 1,
					row        : 2,
					timeStamp  : '2015.01.01T11:04:00'
				}
			];
			given = given.concat(prevMoves);
			when = {
				cmd        : 'MakeMove',
				playerName : 'Player1',
				col        : 0,
				row        : 1,
				timeStamp  : '2015.01.01T11:05:00'
			};
			then = [
				{
					event      : 'GameOver',
					winnerName : 'Player1',
					timeStamp  : '2015.01.01T11:05:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});

		it('should anounce a win if three vertical marks match', () => {
			/*
			* Given [ Placed(0, 0, X), Placed(0, 1, O), Placed(2, 0, X), Placed(0, 2, O) ]
			* When [ Place(1, 0, X) ]
			* Then [ PlayerWins(X) ]*/
			const prevMoves = [
				{
					event      : 'MoveMade',
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T11:01:00'
				},
				{
					event      : 'MoveMade',
					playerName : 'Player2',
					col        : 0,
					row        : 1,
					timeStamp  : '2015.01.01T11:02:00'
				},
				{
					event      : 'MoveMade',
					playerName : 'Player1',
					col        : 2,
					row        : 0,
					timeStamp  : '2015.01.01T11:03:00'
				},
				{
					event      : 'MoveMade',
					playerName : 'Player2',
					col        : 0,
					row        : 2,
					timeStamp  : '2015.01.01T11:04:00'
				}
			];
			given = given.concat(prevMoves);
			when = {
				cmd        : 'MakeMove',
				playerName : 'Player1',
				col        : 1,
				row        : 0,
				timeStamp  : '2015.01.01T11:05:00'
			};
			then = [
				{
					event      : 'GameOver',
					winnerName : 'Player1',
					timeStamp  : '2015.01.01T11:05:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});
	})
});
