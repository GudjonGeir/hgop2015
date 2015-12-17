'use strict';

angular.module('tictactoeApp')
	.controller('CreateGameCtrl', function ($scope, $http, guid, $location) {
		$scope.createGame = function () {

			var gameId = guid();
			var createPost = $http.post('/api/createGame/', {
				'cmd'        : 'CreateGame',
				'gameId'     : gameId,
				'gameName'   : $scope.gameName,
				'playerName' : $scope.playerName,
				'timeStamp'  : '2014-12-02T11:29:29'
			});

			createPost.then(function (response) {
				$location.url('/tictactoe');
				$location.search('gameId', response.data[0].gameId);
				$location.search('gameSide', 'X');
			});

		};

	});
