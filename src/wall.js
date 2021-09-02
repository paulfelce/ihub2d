//import { ids } from "webpack";

export default class Wall
{

	 wallOrientation="";
	 startX=0;
	 startY=0;
	 endX=0;
	 endY=0;	 
	 canvas;
	 wallWidth=25;
	 constructor(Canvas)	 
	{
		this.canvas = Canvas;
	}

	/* user has placed the end of the wall. Put a wall in*/
	/* pass the previous wall so we know if it's an opening or not */

	add(ruler,prevWall,snapTarget) 
	{
		
		ruler.setExactEnd(snapTarget);

		this.startX = ruler.x1;
		this.startY = ruler.y1;
		this.endX = ruler.x2;
		this.endY = ruler.y2;
		this.lineLength = ruler.lineLength();
		this.wallOrientation = ruler.orientation;
		
		var midPointX = this.startX;
		var midPointY = this.startY;

		if (this.startY== this.endY) {
			midPointX = this.startX + (this.endX - this.startX) / 2;
		}
		else {
			midPointY = this.startY + (this.endY - this.startY) / 2;
		}

		
		var rectConnectWidth = this.wallWidth;
		var rectConnectHeight = this.wallWidth;
		
		var rectWallWidth = this.wallWidth;
		var rectWallHeight = this.wallWidth;
		
		
		/* 	we make a wall from two parts, Wall and connector
			we can use the orientation and the the start and end locations to determine which way the wall is
			and therefore where to put the connector.
			We overlay the connector at the end of the wall (original version hid the connector, but now we pass it back as an object to use)
			(also as the line is continuous we don't have to look for it)
		*/
		
		/* this is the rectangle that covers the majority of the wall */
		var rectWallX = this.startX;		
		var rectWallY = this.startY;
		
		/* this is the connector */
		var rectConnectX;
		var rectConnectY;

		//calculate the small wall and the two ends
		if (this.wallOrientation=="h") 
		{// Wall is horizontal
			if(this.endX > this.startX)
			{
				rectWallWidth = this.endX - this.startX;
				rectWallX = this.startX ;
				rectConnectX = this.endX - this.wallWidth;
			}
			else
			{
				rectWallWidth = this.startX - this.endX;
				rectWallX = this.endX ;
				rectConnectX = this.endX;
			}
			
			rectConnectY = this.startY;			
		}

		else { //vertical wall

			if (this.endY>this.startY){				
				rectWallHeight = this.endY - this.startY;
				rectWallY = this.startY;
				rectConnectY = this.endY - this.wallWidth;
			}
			else
			{
				rectWallHeight = this.startY - this.endY;
				rectWallY = this.endY;
				rectConnectY = this.endY;
			}

			rectConnectX = this.startX;
		}

		//Add our wall and connector to the canvas
		var fillColour = "#44d63c";

		if(!(prevWall===undefined))
		{
			// when a wall continues in the same direction we need to flip between wall and opening
			if(prevWall.orientation == this.wallOrientation)

			if (prevWall.wall.fill == fillColour)
			{
				fillColour = '#7aa7f0';
			}
			else
			{
				fillColour = '#44d63c';
			}
		}



		//fill same as border so can't see overlaps
		var rectWall = new fabric.Rect({ stroke:fillColour,strokeWidth:1,fill:fillColour, selectable: false, width: rectWallWidth, height: rectWallHeight, left: rectWallX, top: rectWallY, selectable: false });		
		this.canvas.add(rectWall);

		/* the last wall doesn't need a snapTarget */
		if(!ruler.completed)
		{
		var rectConnect = new fabric.Rect({ stroke:'red',strokeWidth:1,fill:'white', selectable: false, width: this.wallWidth, height: this.wallWidth, left: rectConnectX, top: rectConnectY, selectable: false });		
		this.canvas.add(rectConnect);
		}
		
		var textX = new fabric.Text(this.lineLength, { left: midPointX, top: midPointY, fontSize: 12, selectable: false });				
		this.canvas.add(textX);

		//Return an array of the objects so we can delete them if need be

		var wallContainer = new WallContainer(rectWall,rectConnect,textX,this.wallOrientation);
		//var snapTarget = rectConnect;  //lets the ruler know where the start point is

		return wallContainer;

	}




}

/*items that make up a wall so we can delete as one */
class WallContainer
{
	wall;
	snapTarget;
	text;
	orientation;

	constructor(Wall,Snap,Text,wallOrientation)
	{
		this.wall=Wall;
		this.snapTarget=Snap;
		this.text = Text;
		this.orientation = wallOrientation;
	}

}
