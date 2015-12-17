'use strict';

angular.module('tictactoeApp')
	.controller('JoinGameCtrl', function ($scope, $http, $location, gameState, $state) {

		var thenHandleEvents = function (postPromise) {
			postPromise.then(function (data) {
				$scope.gameState.mutate(data.data);
			});
		};

		$scope.gameState = gameState();
//		var gameId = $location.search().gameId;

		thenHandleEvents($http.get('/api/gameHistory/' + $state.params.gameId));

		$scope.joinGame = function () {
			var joinPostPromise = $http.post('/api/joinGame/', {
					'cmd': 'JoinGame',
					'gameId': $scope.gameState.gameId,
					'playerName': $scope.playerName,
					'timeStamp': '2014-12-02T11:29:29'
				}
			);
			thenHandleEvents(joinPostPromise);
			joinPostPromise.then(function () {
				$location.url('/tictactoe');
				$location.search('gameSide', 'O');
				$location.search('gameId', $scope.gameState.gameId);
			});
		};
	});
