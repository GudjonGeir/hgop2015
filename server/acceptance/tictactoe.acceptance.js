'use strict';

const should = require('should');
const request = require('supertest');
const _ = require('lodash');
const acceptanceUrl = process.env.ACCEPTANCE_URL;

// Recursively sends requests until commands array is empty, then it
// calls the callback and returns
function sendRequest(commands, done, callback) {
	if (commands.length === 0) {
		callback();
		return;
	}

	var currCommand = commands.shift();

	var route = '';
	if (currCommand.cmd === 'CreateGame') {
		route = '/api/createGame'
	} else if (currCommand.cmd === 'JoinGame') {
		route = '/api/joinGame'
	} else if (currCommand.cmd === 'MakeMove') {
		route = '/api/makeMove'
	}

	request(acceptanceUrl)
	.post(route)
	.type('json')
	.send(currCommand)
	.end((err, res) => {
		if (err) return done(err);
		sendRequest(commands, done, callback);
	});
}

function user(userName) {
	var command = {
		playerName : userName,
		timeStamp  : '2015.01.01T11:00:00'
	};
	var userApi = {
		createsGame: (gameId) => {
			command.cmd = 'CreateGame';
			command.gameId = gameId;
			return userApi;
		},
		joinsGame: (gameId) => {
			command.cmd = 'JoinGame';
			command.gameId = gameId;
			return userApi;
		},
		named : (gameName) => {
			command.gameName = gameName;
			return userApi;
		},
		makesMove: (col, row, gameId) => {
			command.cmd = 'MakeMove';
			command.gameId = gameId;
			command.col = col;
			command.row = row;
			return userApi;
		},
		getCommand: () => {
			return command;
		}
	};
	return userApi;
}

function given(commandApi) {
	var commands = [];
	commands.push(commandApi.getCommand());
	var expectations = [];
	var givenApi = {
		expect: (eventName) => {
			expectations.push({
				event: eventName
			});
			return givenApi
		},
		withName: (name) => {
			expectations[expectations.length-1].gameName = name;
			return givenApi;
		},
		withWinner: (winnerName) => {
			expectations[expectations.length-1].winnerName = winnerName;
			return givenApi;
		},
		and: (andCommandApi) => {
			commands.push(andCommandApi.getCommand());
			return givenApi;
		},
		isOk: (done) => {
			var gameId = commands[0].gameId;
			var numberOfCommands = commands.length;
			sendRequest(commands, done, () => {
				request(acceptanceUrl)
				.get('/api/gameHistory/' + gameId)
				.expect(200)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err);
					res.body.should.be.instanceof(Array).and.have.lengthOf(numberOfCommands);

					_.each(expectations, (expectation) => {
						res.body[res.body.length - 1].should.match(expectation);
					});
					return done();
				});
			});
		}
	}
	return givenApi;
}


describe('TEST ENV GET /api/gameHistory', () => {
	it('Should have ACCEPTANCE_URL environment variable exported.', () => {
		acceptanceUrl.should.be.ok;
	});

	it('should execute same test using old style', function (done) {

		var command = {
			cmd        : 'CreateGame',
			gameId     : 999,
			gameName   : 'TheFirstGame',
			playerName : 'Gulli',
			timeStamp  : '2015.01.01T10:00:00'
		};

		var req = request(acceptanceUrl);
		req
		.post('/api/createGame')
		.type('json')
		.send(command)
		.end(function (err, res) {
			if (err) return done(err);
			request(acceptanceUrl)
			.get('/api/gameHistory/999')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				should(res.body).eql(
				[{
					event      : 'GameCreated',
					gameId     : 999,
					gameName   : 'TheFirstGame',
					playerName : 'Gulli',
					timeStamp  : '2015.01.01T10:00:00'
				}]);
				done();
			});
		});
	});


	it('Should execute fluid API test', (done) => {
		given(user("YourUser").createsGame(1).named("TheFirstGame"))
		.expect("GameCreated").withName("TheFirstGame").isOk(done);
	});

	it('Should play game until drawn', function (done) {
		given(user("YourUser").createsGame(2).named("DrawGame"))
		.and(user("OtherUser").joinsGame(2).named("DrawGame"))
		.and(user("YourUser").makesMove(0,0, 2))
		.and(user("OtherUser").makesMove(0,2, 2))
		.and(user("YourUser").makesMove(0,1, 2))
		.and(user("OtherUser").makesMove(1,0, 2))
		.and(user("YourUser").makesMove(1,2, 2))
		.and(user("OtherUser").makesMove(1,1, 2))
		.and(user("YourUser").makesMove(2,0, 2))
		.and(user("OtherUser").makesMove(2,2, 2))
		.and(user("YourUser").makesMove(2,1, 2))
		.expect("Draw").isOk(done);
	});

	it('Should play game until won', function (done) {
		given(user("YourUser").createsGame(3).named("WinGame"))
		.and(user("OtherUser").joinsGame(3).named("WinGame"))
		.and(user("YourUser").makesMove(0,0, 3))
		.and(user("OtherUser").makesMove(0,1, 3))
		.and(user("YourUser").makesMove(1,1, 3))
		.and(user("OtherUser").makesMove(0,2, 3))
		.and(user("YourUser").makesMove(2,2, 3))
		.expect("GameOver").withWinner("YourUser").isOk(done);
	});
});
