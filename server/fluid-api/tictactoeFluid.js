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
			expectations[expectations.length-1].playerName = winnerName;
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

module.exports.user = user;
module.exports.given = given;
