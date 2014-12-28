var stage = new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", stage);

var gameView = new createjs.Container();
gameView.x = 30;
gameView.y = 30;
stage.addChild(gameView);

var circleArr = [[], [], [], [], [], [], [], [], []];
var currentCat;
var MOVE_NONE = -1, MOVE_LEFT = 0, MOVE_UPLEFT = 1, MOVE_UPRIGHT = 2, MOVE_RIGHT = 3, MOVE_DOWNRIGHT = 4, MOVE_DOWNLEFT = 5;

function getMoveDir(cat)
{
	var distanceMap = [];
	//left
	var can = true;
	for (var x = cat.indexX; x >= 0; x--)
	{
		if (circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED)
		{
			can = false;
			distanceMap[MOVE_LEFT] = cat.indexX - x;
			break;
		}
	}
	if (can) return MOVE_LEFT;
	//left up
	can = true;
	var x = cat.indexX, y = cat.indexY;
	while (true)
	{
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
		{
			can = false;
			distanceMap[MOVE_UPLEFT] = cat.indexY - y;
			break;
		}
		if (y % 2 == 0)x--;
		y--;
		if (y < 0 || x < 0) break;
	}
	if (can)return MOVE_UPLEFT;
	//rightup
	can = true;
	x = cat.indexX, y = cat.indexY;
	while (true)
	{
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
		{
			can = false;
			distanceMap[MOVE_UPRIGHT] = cat.indexY - y;
			break;
		}
		if (y % 2 == 1) x++;
		y--;
		if (y < 0 || x > 8) break;
	}
	if (can) return MOVE_UPRIGHT;
	//right
	can = true;
	for (var x = cat.indexX; x < 9; x++)
	{
		if (circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED)
		{
			can = false;
			distanceMap[MOVE_RIGHT] = x - cat.indexX;
			break;
		}
	}
	
	if (can) return MOVE_RIGHT;
	//right down
	can = true;
	x = cat.indexX;
	y = cat.indexY;
	while (true)
	{
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
		{
			can = false;
			distanceMap[MOVE_DOWNRIGHT] = y - cat.indexY;
			break;
		}
		if (y % 2 == 1)x++;
		y++;
		if (y > 8 || x > 8) break;
	}
	if (can) return MOVE_DOWNRIGHT;
	//left down
	can = true;
	x = cat.indexX;
	y = cat.indexY;
	while (true)
	{
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
		{
			can = false;
			distanceMap[MOVE_DOWNLEFT] = y - cat.indexY;
			break;
		}
		if (y % 2 == 0) x--;
		y++;
		if (y > 8 || x < 0) break;
	}
	if (can) return MOVE_DOWNLEFT;
	var maxDir = -1, maxValue = -1;
	for (var dir = 0; dir < distanceMap.length; dir++)
	{
		if (distanceMap[dir] > maxValue)
		{
			maxValue = distanceMap[dir];
			maxDir = dir;
		}
	}
	if (maxValue > 1) return maxDir;
	else return MOVE_NONE;
}

function circleClicked(event)
{
	if (event.target.getCircleType() != Circle.TYPE_CAT)
	{
		event.target.setCircleType(Circle.TYPE_SELECTED);
	}
	else
	{
		return;
	}
	if (currentCat.indexX == 0 || currentCat.indexX == 8 || currentCat.indexY == 0 || currentCat.indexY == 8)
	{
		alert("game over");
		return;
	}
	var dir = getMoveDir(currentCat);
	switch (dir)
	{
		case MOVE_LEFT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexX - 1][currentCat.indexY];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_UPLEFT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX : currentCat.indexX - 1][currentCat.indexY - 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_UPRIGHT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX + 1 : currentCat.indexX][currentCat.indexY - 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_RIGHT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexX + 1][currentCat.indexY];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_DOWNRIGHT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX + 1 : currentCat.indexX][currentCat.indexY + 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_DOWNLEFT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX : currentCat.indexX - 1][currentCat.indexY + 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		default :
			alert("game over");
	}
}

function addCircles()
{
	for (var indexY = 0; indexY < 9; indexY++)
	{
		for (var indexX = 0; indexX < 9; indexX++)
		{
			var c = new Circle();
			gameView.addChild(c);
			circleArr[indexX][indexY] = c;
			c.x = indexY % 2 ? indexX * 55 + 25 : indexX * 55;
			c.y = indexY * 55;
			c.indexX = indexX;
			c.indexY = indexY;
			if (indexX == 4 && indexY == 4)
			{
				c.setCircleType(3);
				currentCat = c;
			}
			else if (Math.random() < 0.1)
			{
				c.setCircleType(Circle.TYPE_SELECTED);
			}
			c.addEventListener("click", circleClicked);
		}
	}
}

addCircles();
