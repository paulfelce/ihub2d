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
	 exteriorWall;
	 wallStyle;
	 constructor(Canvas)	 
	{
		this.canvas = Canvas;
		this.wallStyle='wall';
	}

	/* user has placed the end of the wall. Put a wall in*/
	/* pass the previous wall so we know if it's an opening or not */
	/* savedWall used to be the ruler object which we used for co-ordinates. This is replaced with savedWall*/
	add(savedWall,prevWall,snapTarget) 
	{
		
		this.startX = savedWall.x1;
		this.startY = savedWall.y1;
		this.endX = savedWall.x2;
		this.endY = savedWall.y2;		
		this.lineLength = savedWall.lineLength;// ruler.lineLength(snapTarget);
		this.wallOrientation = savedWall.orientation;
		
		
		//need to shift if adding a  wall/opening along the same direction
		if(prevWall === undefined)//first wall
		{
			this.wallStyle = 'wall';
		}
		else
		{
			if(prevWall.orientation == savedWall.orientation)
			{
				this.wallStyle = (prevWall.wallStyle=="wall") ? "opening":"wall" ;
				if(savedWall.orientation =='h')
				{
					if(this.endX > prevWall.leftSide.x1)//new section is to right of prev section (use endX , because ruler.startX is to right of start of wall, even when moving left)
					{
						this.startX = this.startX + this.wallWidth;					
					}
					else//new section is to left of prev section
					{
						this.startX = this.startX - this.wallWidth;					
					}
				}
				else //wall is Vertical
				{
					{
						if(this.endY > prevWall.bottomSide.y1)//new section below the prev one
						{
							this.startY = this.startY + this.wallWidth;					
						}
						else //new section above prev one
						{
							this.startY = this.startY - this.wallWidth;					
						}
					}
				}
			}
		}




		
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

		let direction ='?';
		//calculate the small wall and the two ends
		if (this.wallOrientation=="h") 
		{// Wall is horizontal
			if(this.endX > this.startX)
			{
				rectWallWidth = this.endX - this.startX;
				rectWallX = this.startX ;
				rectConnectX = this.endX - this.wallWidth;
				direction='LR' //best stage to track which way wall is going
			}
			else
			{
				rectWallWidth = this.startX - this.endX;
				rectWallX = this.endX ;
				rectConnectX = this.endX;
				direction='RL'
			}
			
			rectConnectY = this.startY;			
		}

		else { //vertical wall

			if (this.endY>this.startY){				
				rectWallHeight = this.endY - this.startY;
				rectWallY = this.startY;
				rectConnectY = this.endY - this.wallWidth;
				direction='TB'
			}
			else
			{
				rectWallHeight = this.startY - this.endY;
				rectWallY = this.endY;
				rectConnectY = this.endY;
				direction='BT'
			}

			rectConnectX = this.startX;
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

				}
			}
		}

		
		/* draw four walls instead of a rectangle so we can hide overlaps */		

		var topside = this.drawWallLine([rectWallX,rectWallY,rectWallX + rectWallWidth,rectWallY],this.wallStyle);
		var bottomside = this.drawWallLine([rectWallX,rectWallY+rectWallHeight,rectWallX + rectWallWidth,rectWallY+rectWallHeight],this.wallStyle);		
		var leftside = this.drawWallLine([rectWallX,rectWallY,rectWallX ,rectWallY+rectWallHeight],this.wallStyle);			
		var rightside = this.drawWallLine([rectWallX+rectWallWidth,rectWallY,rectWallX + rectWallWidth,rectWallY+rectWallHeight],this.wallStyle);


		/* the last wall doesn't need a snapTarget */
		if(true)//!ruler.completed)
		{/*rgba fill for 'none' */
		var rectConnect = new fabric.Rect({ stroke:'rgba(0,0,0,0)',fill:'rgba(0,0,0,0)',strokeWidth:1, selectable: false, width: this.wallWidth, height: this.wallWidth, left: rectConnectX, top: rectConnectY, selectable: false });		
		this.canvas.add(rectConnect);
		}
		

		var midPointX;
		var midPointY;
		if(this.wallOrientation == 'h')
		{
			midPointX = rectWallX + rectWallWidth/2;
			midPointY = (rectWallY + rectWallHeight/2)-8;
		}
		else //vertical wall
		{
			midPointX = rectWallX + rectWallWidth/2-12;
			midPointY = (rectWallY + rectWallHeight/2)-8;
		}


		var textX = new fabric.Text(this.lineLength, { left: midPointX, top: midPointY, fontSize: 12, selectable: false });				
		if(direction == 'TB' || direction == 'BT')
		{
			textX.set({angle:0}); // looks sharper unrotated
		}

		textX.set({tag:'Dimension'});
		this.canvas.add(textX);



		//Return an array of the objects so we can delete them if need be
		var wallContainer = new WallContainer(topside,bottomside,leftside,rightside,rectConnect,textX,this.wallOrientation,this.wallStyle,direction);
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
			originY: 'center',
			selectable:false	});
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
	direction;//now we have direction, we could dervive orientation
	wallStyle; /*Wall or opening*/
	exteriorSide;
	savedWall;
	constructor(topSide,bottomSide,leftSide,rightSide,Snap,Text,wallOrientation,wallStyle,direction)
	{
		this.topSide=topSide;
		this.bottomSide=bottomSide;
		this.leftSide=leftSide;
		this.rightSide=rightSide;
		this.snapTarget=Snap;
		this.text = Text;
		this.orientation = wallOrientation;
		this.wallStyle = wallStyle;				
		this.direction = direction;
	}




	refreshExteriorSide()
	{
		this.exteriorSide.set({strokeWidth:3});

	}



}



