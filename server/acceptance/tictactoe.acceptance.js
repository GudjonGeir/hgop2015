'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;


describe('TEST ENV GET /api/gameHistory', function () {
	console.log(acceptanceUrl);
	it('Should have ACCEPTANCE_URL environment variable exported.', function () {
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


	it('Should execute fluid API test', function (done) {
		/*
		given(user("YourUser").createsGame("TheFirstGame"))
		.expect("GameCreated").withName("TheFirstGame").isOk(done);
		*/
		done();
	});

});
