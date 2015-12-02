##Test Examples

###Illegal moves
Player makes a move when it's not his turn

* Given [ Placed(0, 0, X) ]
* When [ Placed(0, 1, X) ]
* Then [ NotPlayersTurn ]

Player places his mark on an occupied tile

* Given [ Placed(0, 0, X) ]
* When [ Placed(0, 0, O) ]
* Then [ TileOccupied ]

###Win scenarios
Horizontal win

* Given [ Placed(0, 0, X), Placed(1, 0, O), Placed(0, 2, X), Placed(1, 2, O) ]
* When [ Placed(0, 1, X) ]
* Then [ X Wins ]

Vertical win

* Given [ Placed(0, 0, X), Placed(0, 1, O), Placed(2, 0, X), Placed(0, 2, O) ]
* When [ Placed(1, 0, X) ]
* Then [ X Wins ]

Diagonal win

* Given [ Placed(0, 0, X), Placed(0, 1, O), Placed(1, 1, X), Placed(0, 2, O) ]
* When [ Placed(2, 2, X) ]
* Then [ X Wins ]

###Draw scenarios

* Given[ Placed(0, 0, X), Placed(0, 1, O), Placed(0, 2, X), Placed(1, 1, O), Placed(0, 1, X), Placed(1, 2, O), Placed(2, 1, X), Placed(2, 0, O) ]
* When [ Placed(2, 2, X) ]
* Then [ Draw ]