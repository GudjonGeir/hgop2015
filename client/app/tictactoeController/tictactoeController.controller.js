'use strict';

angular.module('tictactoeApp')
	.controller('TictactoeController', function ($scope, $http, gameState, guid, $location, $interval) {

		$scope.gameState = gameState();

		var thenHandleEvents = function (postPromise) {
			postPromise.then(function (data) {
				$scope.gameState.mutate(data.data);
			});

			postPromise.then(function(){
				if (mySide() === 'X'){

					$scope.me = $scope.gameState.creatingUser;
					$scope.other = $scope.gameState.joiningUser;
				} else {
					$scope.other = $scope.gameState.creatingUser;
					$scope.me = $scope.gameState.joiningUser;
				}

				$scope.joinUrl = 'http://' + $location.host() +( $location.port() ? ':' + $location.port() :'') + '/join/' + $scope.gameState.gameId;

			});
		};


		var gameId = $location.search().gameId;

		function refresh() {
			thenHandleEvents($http.get('/api/gameHistory/' + gameId));
		}

		refresh();
		$interval(refresh, 2000);

		function mySide() {
			return $location.search().gameSide;
		}

		$scope.myTurn = function () {
			return mySide() === $scope.gameState.nextTurn;
		};

		$scope.makeMove = function (coords) {
			if(!$scope.myTurn()){
				return;
			}
			thenHandleEvents($http.post('/api/makeMove/', {
					gameId: $scope.gameState.gameId,
					cmd: 'MakeMove',
					playerName: $scope.me,
					timeStamp: '2014-12-02T11:29:29',
					col: coords.x,
					row: coords.y
				}
			));
		};
	});
