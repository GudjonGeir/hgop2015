'use strict';

const should = require('should');
const request = require('supertest');
const _ = require('lodash');
const acceptanceUrl = process.env.ACCEPTANCE_URL;



function user(userName) {
	given = [];
	var userApi = {
		createsGame: (gameName) => {
			given.push({
				cmd        : 'CreateGame',
				gameId     : 1000,
				gameName   : gameName,
				playerName : userName,
				timeStamp  : '2015.01.01T10:00:00'
			});
			return userApi;
		},
		getCommands: () => {
			return given;
		}
	};
	return userApi;
}

function given(givenCommands) {
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
		isOk: (done) => {
			var commands = givenCommands.getCommands();

			var req = request(acceptanceUrl);
			req
			.post('/api/createGame')
			.type('json')
			.send(commands[0])
			.end((err, res) => {
				if (err) return done(err);
				request(acceptanceUrl)
				.get('/api/gameHistory/1000')
				.expect(200)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err);
					res.body.should.be.instanceof(Array);
					_.each(expectations, (expectation) => {
						for (var prop in expectation) {
							if (expectation.hasOwnProperty(prop)) {
								if (expectation[prop] !== res.body[0][prop]) {
									throw new Error("property '" + prop + "' does not match the expected value '" + expectation[prop] + "', actual '" + res.body[0][prop] + "'");
								}
							}
						}
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
		given(user("YourUser").createsGame("TheFirstGame"))
		.expect("GameCreated").withName("TheFirstGame").isOk(done);
	});

});
