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
		

		let rulerCoordinates = new RulerCoordinates(this.startX,this.endX,this.startY,this.endY);

		//set up values for a first wall
		if(prevWall === undefined)
		{
			prevWall = new Object();
			prevWall.orientation = 'N'; //NEW wall, bypass the offseting for the first wall
			prevWall.wallStyle = 'opening'; //this will get flipped to being a wall

			let leftSide = new Object();
			leftSide.x1 = snapTarget.left;

			prevWall.leftSide = leftSide;

			let bottomSide = new Object();
			bottomSide.y1 = snapTarget.top;

			prevWall.bottomSide = bottomSide;
			

		}

		//updated ruler means we need to start wall at an offset from the ruler
		// (the ruler will be at the midpoint of the end of the connecting side)
		let w = this.wallWidth;
		if(this.wallOrientation=='h')
		{
			if(prevWall.orientation=='v' && this.startX < this.endX) //LR wall
			{	
				if(snapTarget.stroke=='blue')
				{ // first section is always horizontal and a special case
					this.startX  = this.startX - this.wallWidth;				
					this.startY  = this.startY - this.wallWidth/2;
				}
				else
				{									
					this.startY  = this.startY - this.wallWidth/2;
					if(prevWall.exteriorSide == prevWall.rightSide)
					{
						this.startX = this.startX - w;
					}
				}
			}
			if(prevWall.orientation=='h' && this.startX < this.endX) //LR section
			{
				
					this.startX = prevWall.rightSide.x1;
					this.startY = prevWall.topSide.y1;

			}

			if(prevWall.orientation=='v' && this.startX > this.endX) //RL wall
			{
				
				if(prevWall.exteriorSide===prevWall.leftSide)
				{
				this.startX = this.startX + this.wallWidth;
				}
				this.startY = this.startY - this.wallWidth/2;				
			}

			if(prevWall.orientation=='h' && this.startX > this.endX) //RL-section
			{
				
				//this.startX = this.startX + this.wallWidth;
			
				this.startY = this.startY - this.wallWidth/2;			
			}



		}
		if(this.wallOrientation=='v') //adding a vertical wall
		{
			if(prevWall.orientation == 'h' && this.startY < this.endY) //TB
			{			
				this.startX = this.startX - this.wallWidth/2;				
			}

			if(prevWall.orientation == 'v' && this.startY < this.endY) //TB-section
			{			
				this.startX = this.startX - this.wallWidth/2;				
			}


			if(prevWall.orientation == 'h' && this.endY<this.startY)//BT wall
			{
				this.startX = this.startX - this.wallWidth/2;
				if(prevWall.exteriorSide === prevWall.topSide)
				{
					this.startY= this.startY + this.wallWidth ;
				}
				
			}
			if(prevWall.orientation == 'v' && this.endY<this.startY)//BT-section
			{
				this.startX = this.startX - this.wallWidth/2;
				//this.startY= this.startY - this.wallWidth;
			}
			
		}
		/* Special offsetting for the first wall of a building */
		if(prevWall.orientation=='N')
		{			
			this.startY  = this.startY - this.wallWidth/2;
		}

		if (savedWall.orientation == prevWall.orientation) // the ruler has determined the orientation and passed it in as savedWall
		{
			this.wallStyle = (prevWall.wallStyle=="wall") ? "opening":"wall" ;
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
			textX.set({angle:90}); // looks sharper unrotated
			textX.set({left:textX.left+15});// rotated will start outside the wall (and wall is narrow)
		}


		this.canvas.add(textX);

		/* implement iff we decided to go with change any wall, not just last
		textX.on('mouseover', function () {
			textX.set({fill:'#00ff00'});   			
			this.canvas.renderAll();
			console.log(textX.text);
			//Dispatch an event			
			var evt = new CustomEvent("dimensionChangedEvent", {detail: textX});
			document.dispatchEvent(evt);			
				
		});

		textX.on('mouseout', function () {
			textX.set({fill:'#000000'});    		
			this.canvas.renderAll();
			console.log('mouseout');
		});
		*/
		
		//Return an array of the objects so we can delete them if need be
		var wallContainer = new WallContainer(rulerCoordinates,topside,bottomside,leftside,rightside,rectConnect,textX,this.wallOrientation,this.wallStyle,direction);
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
	x1;//need to save these co-ordinates so we cen reload
	x2;
	y1;
	y2;
	constructor(rulerCoordinates,topSide,bottomSide,leftSide,rightSide,Snap,Text,wallOrientation,wallStyle,direction)
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
		this.x1 = rulerCoordinates.x1;
		this.y1 = rulerCoordinates.x2;
		this.x2 = rulerCoordinates.y1;
		this.y2 = rulerCoordinates.y2;
	}




	refreshExteriorSide()
	{
		this.exteriorSide.set({strokeWidth:3});

	}



}

class RulerCoordinates{
	x1;
	y1;
	x2;
	y2;
	constructor(x1,y1,x2,y2)
	{
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
	}
}


