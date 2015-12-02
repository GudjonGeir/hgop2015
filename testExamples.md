##Test Examples
### Game creation/joining a game
Player creates a game

* Given []
* When [ CreateGame(gameName, user1) ]
* Then [ GameCreated(gameName, user1) ]

Player joins an existing game

* Given [ GameCreated(gameName, user1) ]
* When [ JoinGame(gameName, user2) ]
* Then [ GameJoined(gameName, user2) ]

Player joins a game with two players

* Given [ GameCreated(gameName, user1), GameJoined(gamename, user2) ]
* When [ JoinGame(gameName, user3) ]
* Then [ GameFull(gameName) ]

###Illegal moves
Player makes a move when it's not his turn

* Given [ Placed(0, 0, X) ]
* When [ Place(0, 1, X) ]
* Then [ NotPlayersTurn(O) ]

Player places his mark on an occupied tile

* Given [ Placed(0, 0, X) ]
* When [ Place(0, 0, O) ]
* Then [ TileOccupied(0, 0) ]

###Win scenarios
Horizontal win

* Given [ Placed(0, 0, X), Placed(1, 0, O), Placed(0, 2, X), Placed(1, 2, O) ]
* When [ Place(0, 1, X) ]
* Then [ PlayerWins(X) ]

Vertical win

* Given [ Placed(0, 0, X), Placed(0, 1, O), Placed(2, 0, X), Placed(0, 2, O) ]
* When [ Place(1, 0, X) ]
* Then [ PlayerWins(X) ]

Diagonal win

* Given [ Placed(0, 0, X), Placed(0, 1, O), Placed(1, 1, X), Placed(0, 2, O) ]
* When [ Place(2, 2, X) ]
* Then [ PlayerWins(X) ]

###Draw scenarios

* Given[ Placed(0, 0, X), Placed(0, 1, O), Placed(0, 2, X), Placed(1, 1, O), Placed(0, 1, X), Placed(1, 2, O), Placed(2, 1, X), Placed(2, 0, O) ]
* When [ Place(2, 2, X) ]
* Then [ Draw ]