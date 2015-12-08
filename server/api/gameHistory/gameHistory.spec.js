'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/gameHistory', function () {

	it('should respond with JSON array with created events for game', function (done) {
		var command = {
			cmd        : 'CreateGame',
			gameId     : 999,
			gameName   : 'TheFirstGame',
			playerName : 'Gulli',
			timeStamp  : '2015.01.01T10:00:00'
		};

		var req = request(app);
		req
		.post('/api/createGame')
		.type('json')
		.send(command)
		.end(function(err, res) {
			if (err) return done(err);
			request(app)
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
});
