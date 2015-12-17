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
							gameState.creatingUser = event.playerName;
						},
						'GameJoined': function (event, gameState) {
							gameState.joiningUser = event.playerName;
						},
						'MoveMade': function (event, gameState) {
							var x = event.col, y = event.row;
							gameState.board[x][y] = gameState.nextTurn;
							gameState.nextTurn = gameState.nextTurn === 'X' ? 'O' : 'X';
						},
						'GameOver': function (event, gameState) {
							gameState.nextTurn = 'GameOver';
							gameState.winner = event.winnerName;
						},
						'Draw': function (event, gameState) {
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
