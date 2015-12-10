'use strict';

const should = require('should');
const request = require('supertest');
const _ = require('lodash');
const acceptanceUrl = process.env.ACCEPTANCE_URL;
const given = require('../fluid-api/tictactoeFluid.js').given;
const user = require('../fluid-api/tictactoeFluid.js').user;

describe('TEST ENV GET /api/gameHistory', () => {
	it('Should have ACCEPTANCE_URL environment variable exported.', () => {
		acceptanceUrl.should.be.ok;
	});

	it('should execute same test using old style', (done) => {

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
		.end((err, res) => {
			if (err) return done(err);
			request(acceptanceUrl)
			.get('/api/gameHistory/999')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
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

	it('Should play game until drawn', (done) => {
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

	it('Should play game until won', (done) => {
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
