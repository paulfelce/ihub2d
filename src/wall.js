export default class Wall
{

	 orientation="";
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
/* WallID is the identifier we tag the object with so we can find it under the mouse pointer (via object.tag) */
	add(ruler) /* line length is how long the wall is */
	{
		
		this.startX = ruler.x1;
		this.startY = ruler.y1;
		this.endX = ruler.x2;
		this.endY = ruler.y2;
		this.lineLength = ruler.lineLength();
		this.wallOrientation = ruler.orientation;
		var wallID = 1;		
		
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
		var fillColour = "#bdd7ee";

		//fill same as border so can't see overlaps
		var rectWall = new fabric.Rect({ stroke:'green',strokeWidth:1,fill:'green', selectable: false, width: rectWallWidth, height: rectWallHeight, left: rectWallX, top: rectWallY, selectable: false });
		rectWall.tag = "objRef=" + wallID;  //label all objects created, so we can delete them a group.
		rectWall.tag2 = "objRef2=a";
		this.canvas.add(rectWall);

		/* the last wall doesn't need a snapTarget */
		if(!ruler.completed)
		{
		var rectConnect = new fabric.Rect({ stroke:'red',strokeWidth:1,fill:'white', selectable: false, width: this.wallWidth, height: this.wallWidth, left: rectConnectX, top: rectConnectY, selectable: false });
		rectConnect.tag = "objRef=" + wallID;
		rectConnect.tag2 = "objRef2=b";
		this.canvas.add(rectConnect);
		}
		

		var exteriorCircle;
		if(this.wallOrientation=="horizontal"){
			//alert('working on exterior circle');
		}
		else{
			//alert('working on exterior circle');
		}

		var textX = new fabric.Text(this.lineLength, { left: midPointX, top: midPointY, fontSize: 12, selectable: false });		
		textX.tag = "objRef=" + wallID;
		textX.tag2 = "objRef2=d";
		this.canvas.add(textX);

		//Return an array of the objects so we can delete them if need be

		var wallContainer = new WallContainer(rectWall,rectConnect,textX);
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

	constructor(Wall,Snap,Text)
	{
		this.wall=Wall;
		this.snapTarget=Snap;
		this.text = Text;
	}

}
