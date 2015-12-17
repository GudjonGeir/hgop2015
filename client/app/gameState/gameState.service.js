'use strict';

angular.module('tictactoeApp')
	.factory('gameState', function () {
		return function () {

			var gameState = {
				created: false,
				board: [['', '', ''], ['', '', ''], ['', '', '']],
				nextTurn: 'X',
				gameDraw: false,
				winner: undefined,
				mutate: function (events) {
					var handlers = {
						'GameCreated': function (event, gameState) {
							gameState.created = true;
							gameState.gameName = event.gameName;
							gameState.gameId = event.gameId;
							gameState.creatingUser = {
								playerName: event.playerName,
								side: 'X'
							};
						},
						'GameJoined': function (event, gameState) {
							gameState.joiningUser = {
								playerName: event.playerName,
								side: 'O'
							};
						},
						'MoveMade': function (event, gameState) {
							var x = event.col, y = event.row;
							gameState.board[x][y] = event.side;
							gameState.nextTurn = event.side === 'X' ? 'O' : 'X';
						},
						'GameOver': function (event, gameState) {
							var x = event.col, y = event.row;
							gameState.board[x][y] = event.side;
							gameState.nextTurn = 'GameOver';
							gameState.winner = {
								playerName: event.playerName,
								side: event.side
							};
						},
						'Draw': function (event, gameState) {
							var x = event.col, y = event.row;
							gameState.board[x][y] = event.side;
							gameState.nextTurn = 'GameOver';
							gameState.gameDraw = true;
						}
					};
					_.each(events, function (ev) {
						if(!ev) {
							return;
						}
						if(handlers[ev.event]){
							handlers[ev.event](ev, gameState);
						}
					});
				}
			};
			return gameState;
		};
	});
