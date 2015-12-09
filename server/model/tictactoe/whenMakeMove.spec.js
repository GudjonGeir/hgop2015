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
				gameId     : 7,
				gameName   : 'game1',
				playerName : 'Player1',
				timeStamp  : '2015.01.01T10:00:00'
			},
			{
				event      : 'GameJoined',
				gameId     : 7,
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
				gameId     : 7,
				playerName : 'Player1',
				col        : 0,
				row        : 0,
				timeStamp  : '2015.01.01T10:02:00'
			};
			then = [
				{
					event      : 'MoveMade',
					gameId     : 7,
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
				gameId     : 7,
				playerName : 'Player1',
				col        : 0,
				row        : 0,
				timeStamp  : '2015.01.01T10:02:00'
			});
			when = {
				cmd        : 'MakeMove',
				gameId     : 7,
				playerName : 'Player2',
				col        : 1,
				row        : 1,
				timeStamp  : '2015.01.01T10:03:00'
			}
			then = [
				{
					event      : 'MoveMade',
					gameId     : 7,
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
				gameId     : 7,
				playerName : 'Player2',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T10:02:00'
			};
			then = [
				{
					event      : 'NotPlayersTurn',
					gameId     : 7,
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
				gameId     : 7,
				playerName : 'Player1',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T10:04:00'
			});
			when = {
				cmd        : 'MakeMove',
				gameId     : 7,
				playerName : 'Player2',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T10:05:00'
			}
			then = [
				{
					event      : 'TileOccupied',
					gameId     : 7,
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
					gameId     : 7,
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T11:01:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 1,
					row        : 0,
					timeStamp  : '2015.01.01T11:02:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 0,
					row        : 2,
					timeStamp  : '2015.01.01T11:03:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 1,
					row        : 2,
					timeStamp  : '2015.01.01T11:04:00'
				}
			];
			given = given.concat(prevMoves);
			when = {
				cmd        : 'MakeMove',
				gameId     : 7,
				playerName : 'Player1',
				col        : 0,
				row        : 1,
				timeStamp  : '2015.01.01T11:05:00'
			};
			then = [
				{
					event      : 'GameOver',
					gameId     : 7,
					winnerName : 'Player1',
					timeStamp  : '2015.01.01T11:05:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});

		it('should anounce a win if three vertical marks match', () => {
			const prevMoves = [
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T11:01:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 0,
					row        : 1,
					timeStamp  : '2015.01.01T11:02:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 2,
					row        : 0,
					timeStamp  : '2015.01.01T11:03:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 0,
					row        : 2,
					timeStamp  : '2015.01.01T11:04:00'
				}
			];
			given = given.concat(prevMoves);
			when = {
				cmd        : 'MakeMove',
				gameId     : 7,
				playerName : 'Player1',
				col        : 1,
				row        : 0,
				timeStamp  : '2015.01.01T11:05:00'
			};
			then = [
				{
					event      : 'GameOver',
					gameId     : 7,
					winnerName : 'Player1',
					timeStamp  : '2015.01.01T11:05:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});

		it('should anounce a win if three diagonal marks match', () => {
			const prevMoves = [
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T11:01:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 0,
					row        : 1,
					timeStamp  : '2015.01.01T11:02:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 1,
					row        : 1,
					timeStamp  : '2015.01.01T11:03:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 0,
					row        : 2,
					timeStamp  : '2015.01.01T11:04:00'
				}
			];
			given = given.concat(prevMoves);
			when = {
				cmd        : 'MakeMove',
				gameId     : 7,
				playerName : 'Player1',
				col        : 2,
				row        : 2,
				timeStamp  : '2015.01.01T11:05:00'
			};
			then = [
				{
					event      : 'GameOver',
					gameId     : 7,
					winnerName : 'Player1',
					timeStamp  : '2015.01.01T11:05:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});
	});

	describe('draw moves', () => {
		it('should anounce a draw if all tiles are full with no winner', () => {
			/*
			* Given[ Placed(0, 0, X), Placed(0, 1, O), Placed(0, 2, X), Placed(1, 1, O),
			Placed(0, 1, X), Placed(1, 2, O), Placed(2, 1, X), Placed(2, 0, O) ]
			* When [ Place(2, 2, X) ]
			* Then [ Draw ]*/
			const prevMoves = [
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 0,
					row        : 0,
					timeStamp  : '2015.01.01T11:01:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 0,
					row        : 2,
					timeStamp  : '2015.01.01T11:02:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 0,
					row        : 1,
					timeStamp  : '2015.01.01T11:03:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 1,
					row        : 0,
					timeStamp  : '2015.01.01T11:04:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 1,
					row        : 2,
					timeStamp  : '2015.01.01T11:05:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 1,
					row        : 1,
					timeStamp  : '2015.01.01T11:06:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player1',
					col        : 2,
					row        : 0,
					timeStamp  : '2015.01.01T11:07:00'
				},
				{
					event      : 'MoveMade',
					gameId     : 7,
					playerName : 'Player2',
					col        : 2,
					row        : 2,
					timeStamp  : '2015.01.01T11:08:00'
				}
			];
			given = given.concat(prevMoves);
			when = {
				cmd        : 'MakeMove',
				gameId     : 7,
				playerName : 'Player1',
				col        : 2,
				row        : 1,
				timeStamp  : '2015.01.01T11:09:00'
			};
			then = [
				{
					event      : 'Draw',
					gameId     : 7,
					timeStamp  : '2015.01.01T11:09:00'
				}
			];

			var actual = tictactoeCommandHandler(given).executeCommand(when);

			JSON.stringify(actual).should.be.exactly(JSON.stringify(then));
		});
	});
});
