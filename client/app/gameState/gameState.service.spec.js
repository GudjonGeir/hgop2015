'use strict';

describe('Factory: TictacToeState', function () {

	var gameState;
	// load the controller's module
	beforeEach(module('tictactoeApp'));


	// Initialize the controller and a mock scope
	beforeEach(inject(function (_gameState_) {
		gameState = _gameState_();
	}));

	it('Should add other player to game state when gameJoined', function () {
		gameState.mutate([{
				event: 'GameJoined',
				playerName: 'Gummi',
				gameName: 'TheFirstGame',
				timeStamp: '2014-12-02T11:29:29'
			}]
		);

		expect(gameState.joiningUser).toBe('Gummi');
	});

	it('Should store gameid and name from game created in game state.', function () {
		gameState.mutate([{
				event: 'GameCreated',
				gameId: '198299',
				playerName: 'Gummi',
				gameName: 'TheFirstGame',
				timeStamp: '2014-12-02T11:29:29'
			}]
		);

		expect(gameState.gameId).toBe('198299');
		expect(gameState.gameName).toBe('TheFirstGame');
		expect(gameState.creatingUser).toBe('Gummi');
	});

	it('Should add moves 0,1 to game board', function () {

		gameState.mutate([{
				event: 'MoveMade',
				playerName: 'Gummi',
				gameName: 'TheFirstGame',
				timeStamp: '2014-12-02T11:29:29',
				col: 0,
				row: 1,
			}]
		);
		expect(gameState.board[0][1]).toBe('X');

	});

	it('Should add move 2,2 to board.', function () {

		gameState.mutate([{
				event: 'MoveMade',
				playerName: 'Gummi',
				name: 'TheFirstGame',
				timeStamp: '2014-12-02T11:29:29',
				col: 2,
				row: 2
			}]
		);
		expect(gameState.board[2][2]).toBe('X');

	});

	it('Should mark nextTurn as opposite from last event.', function () {
		gameState.me = {side: 'O'};
		gameState.mutate([{
				event: 'MoveMade',
				playerName: 'Gummi',
				name: 'TheFirstGame',
				timeStamp: '2014-12-02T11:29:29',
				col: 2,
				row: 2
			}]
		);

		expect(gameState.nextTurn).toBe('O');
	});

	it('Nextturn should default to X', function () {
		gameState.me = {side: 'X'};
		gameState.mutate([{
				event: 'GameCreated',
				playerNameName: 'Gummi',
				gameName: 'TheFirstGame',
				timeStamp: '2014-12-02T11:29:29'
			}]
		);

		expect(gameState.nextTurn).toBe('X');
	});

	it('GameOver should set nextTurn to GameOver',function(){
		gameState.me = {side: 'X'};
		gameState.mutate([{
				event: 'GameOver',
				winnerName: 'Gummi',
				timeStamp: '2015.01.01T11:05:00'
			}]
		);

		expect(gameState.nextTurn).toBe('GameOver');
		expect(gameState.winner).toBe('Gummi');
	});

	it('Draw should set nextTurn to GameOver',function(){
		gameState.me = {side: 'X'};
		gameState.mutate([{
				event: 'Draw',
				timeStamp: '2015.01.01T11:09:00'
			}]
		);

		expect(gameState.nextTurn).toBe('GameOver');
		expect(gameState.gameDraw).toBe(true);
	});
});
