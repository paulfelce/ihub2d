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
		
		//ruler.setExactEnd(snapTarget);

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
		var wallStyle = "wall";		

		if(!(prevWall===undefined))
		{
			// when a wall continues in the same direction we need to flip between wall and opening
			if(prevWall.orientation == this.wallOrientation)
			wallStyle = (prevWall.wallStyle=="wall") ? "opening":"wall" ;
		}


		//Line to hide on overap
		/*Vertical wall */
		if(this.wallOrientation=='v')
		{
			if(prevWall.leftSide.x1 < rectWallX ) 
			{
				if(this.endY>this.startY) /* need to cover at top left */
				{
					
					var hideLine;
					var points = [rectWallX+5,rectWallY, rectWallX+5,rectWallY+25];
					
					hideLine= new fabric.Line(points, {
						strokeWidth: 18,			
						stroke: 'blue',
						originX: 'center',
						originY: 'center'	});
	
//					fillColour='#ff0000';
//					this.canvas.add(hideLine);
				}
			}
		}

		
		/* draw four walls instead of a rectangle so we can hide overlaps */
		var topside = this.drawWallLine([rectWallX,rectWallY,rectWallX + rectWallWidth,rectWallY],wallStyle);
		var bottomside = this.drawWallLine([rectWallX,rectWallY+rectWallHeight,rectWallX + rectWallWidth,rectWallY+rectWallHeight],wallStyle);		
		var leftside = this.drawWallLine([rectWallX,rectWallY,rectWallX ,rectWallY+rectWallHeight],wallStyle);			
		var rightside = this.drawWallLine([rectWallX+rectWallWidth,rectWallY,rectWallX + rectWallWidth,rectWallY+rectWallHeight],wallStyle);


		/* the last wall doesn't need a snapTarget */
		if(!ruler.completed)
		{
		var rectConnect = new fabric.Rect({ stroke:'red',strokeWidth:1,fill:'white', selectable: false, width: this.wallWidth, height: this.wallWidth, left: rectConnectX, top: rectConnectY, selectable: false });		
		this.canvas.add(rectConnect);
		}
		
		var textX = new fabric.Text(this.lineLength, { left: midPointX, top: midPointY, fontSize: 12, selectable: false });				
		this.canvas.add(textX);



		//Return an array of the objects so we can delete them if need be
		var wallContainer = new WallContainer(topside,bottomside,leftside,rightside,rectConnect,textX,this.wallOrientation,wallStyle);
		//var snapTarget = rectConnect;  //lets the ruler know where the start point is

		return wallContainer;

	}

	/*Draw all sides of the wall in the same style */
	drawWallLine(points,wallStyle)
	{

		var strokeColour = (wallStyle=='wall') ? 'black' : 'blue';

		var wallLine= new fabric.Line(points, {
			strokeWidth: 1,			
			stroke: strokeColour,
			originX: 'center',
			originY: 'center'	});
		this.canvas.add(wallLine);

		return wallLine;
	}
}

/*items that make up a wall so we can delete as one */
class WallContainer
{
	topSide;
	bottomSide;
	leftSide;
	rightSide;
	snapTarget;
	text;
	orientation;
	wallStyle; /*Wall or opening*/

	constructor(topSide,bottomSide,leftSide,rightSide,Snap,Text,wallOrientation,wallStyle)
	{
		this.topSide=topSide;
		this.bottomSide=bottomSide;
		this.leftSide=leftSide;
		this.rightSide=rightSide;
		this.snapTarget=Snap;
		this.text = Text;
		this.orientation = wallOrientation;
		this.wallStyle = wallStyle;
	}

}



