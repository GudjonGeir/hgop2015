var user = require('../fluid-api/tictactoeFluid').user;
var given = require('../fluid-api/tictactoeFluid').given;

it('Should play 1000 games in x seconds.', function (done) {
	var doneCount = 0;
	var gamesToPlay = 1000;
	var x = 30;

	this.timeout(x * 1000);

	var QED = function () {
		if (gamesToPlay === ++doneCount) {
			done();
		}
	};

	for (var gameId = 0; gameId < gamesToPlay; gameId++) {
		given(user("TestUserOne").createsGame("CapacityTest" + gameId).named("TestGame" + gameId))
		.and(user("TestUserTwo").joinsGame("CapacityTest" + gameId).named("TestGame" + gameId))
		.and(user("TestUserOne").makesMove(0,0, "CapacityTest" + gameId))
		.and(user("TestUserTwo").makesMove(0,1, "CapacityTest" + gameId))
		.and(user("TestUserOne").makesMove(1,1, "CapacityTest" + gameId))
		.and(user("TestUserTwo").makesMove(0,2, "CapacityTest" + gameId))
		.and(user("TestUserOne").makesMove(2,2, "CapacityTest" + gameId))
		.expect("GameOver").withWinner("TestUserOne").isOk(QED);

	}
});
