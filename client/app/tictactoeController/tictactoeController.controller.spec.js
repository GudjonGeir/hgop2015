'use strict';

describe('Controller: TictactoeControllerCtrl', function () {

	beforeEach(module('tictactoeApp'));

	var TictactoeControllerCtrl, scope, httpBackend, http, location, interval;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, $controller, $rootScope, $http, $location, $interval) {
		http = $http;
		interval = $interval;
		httpBackend = $injector.get('$httpBackend');
		location = $location;
		location.search('gameId', '123');
		location.search('gameSide', 'X');

		scope = $rootScope.$new();
		TictactoeControllerCtrl = $controller('TictactoeController', {
			$scope: scope
		});

	}));

	afterEach(function () {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});


	it('should generate join url', function () {
		getHistory();

		expect(scope.joinUrl).toBe('http://server:80/join/123');
	});

	it('should init creator to side X', function () {
		getHistory();
		expect(scope.me).toBe('Creator');
	});

	it('should init joiner to side O', function () {

		location.search('gameSide', 'O');

		getHistory();

		expect(scope.me).toBe('Joiner');
	});


	function getHistory() {
		httpBackend.expectGET('/api/gameHistory/123').respond([{
			event: 'GameCreated',
			name: 'Game Number one',
			gameId: '123',
			playerName: 'Creator'
		}, {
			event: 'GameJoined',
			name: 'Game Number one',
			gameId: '123',
			playerName: 'Joiner'
		}]);
		httpBackend.flush();
	}

	it('should post side from current user', function () {
		getHistory();
		httpBackend.expectPOST('/api/makeMove/', {
			gameId: '87687',
			cmd: 'MakeMove',
			playerName: 'Gummi',
			timeStamp: '2014-12-02T11:29:29',
			col: 2,
			row: 0
		}).respond([
			{
				event: 'MoveMade',
				gameId: '87687',
				timeStamp: '2014-12-02T11:29:29',
				col: 2,
				row: 0
			}
		]);

		scope.gameId = '87687';
		scope.gameName = 'TheSecondGame';

		location.search('gameSide', 'X');
		scope.me = 'Gummi';
		scope.gameState.gameId = '87687';

		scope.makeMove({x:2, y:0});
		httpBackend.flush();

		expect(scope.myTurn()).toBe(false);

	});

	it('should refresh history once every one second', function () {
		getHistory();

		httpBackend.expectGET('/api/gameHistory/123').respond([{
			event: 'GameCreated',
			name: 'Game Number one',
			gameId: '123',
			user: {
				userName: 'Creator'
			}
		}, {
			event: 'GameJoined',
			name: 'Game Number one',
			gameId: '123',
			user: {
				userName: 'Joiner'
			}
		}]);

		interval.flush(2001);

		httpBackend.flush();
	});
});
