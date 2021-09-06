/* Class to handle a collection of walls */
import Wall from './wall'
export default class WallCollection
{
	
	walls;
	canvas;
	saves;
	 constructor(canvas)
	 {
		 this.walls = new Array();
		 this.saves = new Array(); //track all the params we have added, so we can rebuild 
		 this.canvas = canvas;
	 }


	 //return the last wall in the array
	 lastWall()
	 {
		return this.walls[this.walls.length-1];
	 }


	 //Create a new wall
	 add(ruler,snapTarget){		
		let savedWall = new  SavedWall(ruler.x1,ruler.y1,ruler.x2,ruler.y2,ruler.orientation,snapTarget,ruler.lineLength);//save so we can rebuild
		
		var prevWall = this.walls[this.walls.length-1]; //capture this so we can remove overlaps (also needed by add to determine if an opening)

		var wall = new Wall(this.canvas);	
		var wallContainer = wall.add(savedWall,prevWall,snapTarget);
	
		savedWall.direction = wallContainer.direction;//wall.add calculates direction, so run after wall Created
		this.saves.push(savedWall);

		if (this.walls.length>0 ) // don't check for the first wall 
		{
			let sharedCorner = this.sharedCorner(wallContainer,prevWall);

			if (wallContainer.wallStyle == 'wall') // allow overlaps for openings
			{	
				if(prevWall.wallStyle=='wall') //an opening is shifted so there are no overlaps.
				{
					this.removeOverlaps(wallContainer,prevWall,snapTarget.width,sharedCorner);
				}
			}			

			
			let exteriorWall = getExteriorWall(wallContainer);

			wallContainer.exteriorSide = exteriorWall;
			

			//need to remeasure the previous exterior wall (beacuse there are no angled walls, it's simply across OR up so we can add them)
			let newLength = (prevWall.exteriorSide.x2-prevWall.exteriorSide.x1);
			newLength = newLength + (prevWall.exteriorSide.y2-prevWall.exteriorSide.y1);
			newLength = newLength.toFixed(1);
			prevWall.text.set({text:newLength});

	 	}
		else{ //no shared corner, but we always want the first to be horizontal
			wallContainer.exteriorSide = wallContainer.topSide;
		 }
		

		wallContainer.refreshExteriorSide();

		this.walls.push(wallContainer);

		 ruler.f

		return wallContainer.snapTarget;
	 }
	 
	 


	 //determine which corner of the snapTarget is shared by the new wall
	 //we need this so we can eliminate overlaps and to determine the exterior wall.
	 sharedCorner(wallContainer,prevWall)
	 {
		var result = ''
		if(wallContainer.orientation != prevWall.orientation)
		{
			if(wallContainer.orientation=='v')
			{
				if(prevWall.topSide.y1 == wallContainer.topSide.y1)
				{	
					if(prevWall.leftSide.x1 == wallContainer.leftSide.x1) //join top left
					{
						result = 'topleft';
					}
					else
					{
						result = 'topright';
					}
				}
				else // vertical connected at bottom 
				{
					if(prevWall.leftSide.x1 == wallContainer.leftSide.x1)
					{
						result = 'bottomleft';
					}
					else //join bottom right
					{
						result = 'bottomright';
					}
					
				}
			}
			if(wallContainer.orientation=='h') // horizontal wall
			{
				if(prevWall.leftSide.x1 == wallContainer.leftSide.x1) //share at left
				{	
					if(prevWall.leftSide.y1 == wallContainer.leftSide.y1) //connected at top left
					{
						result = 'topleft';
						
					}
					else //join  bottom left
					{
						result = 'bottomleft';
					}
				}
				else // horizontal share at right
				{
					if(prevWall.leftSide.y1 == wallContainer.leftSide.y1) //share at top right
					{
						result = 'topright';
					}
					else //share at bottom right
					{
						result = 'bottomright';
					}
					
				}
			}
		}	//continued walls are connected differently
		if(wallContainer.orientation == prevWall.orientation)	
		{
			if(wallContainer.orientation =='h' )
			{
				if( wallContainer.leftSide.x1 > prevWall.leftSide.x1)
				{
					result='topleft';
				}
				else
				{
					result='topright';
				}
			}

			if(wallContainer.orientation =='v' )
			{
				if( wallContainer.topSide.y1 > prevWall.topSide.y1)
				{
					result='topleft';
				}
				else
				{
					result='topright';
				}
			}
		}
	
		
		return result;
	 }

	 removeOverlaps(wallContainer,prevWall,wallWidth,sharedCorner)
	 {
		//adjust the wall so there's no overlap		
		//1st cut assumes it's not an opening
		

		if(wallContainer.orientation=='v')
		{
			if(sharedCorner=='topleft')
			{
					wallContainer.rightSide.set({y1:wallContainer.rightSide.y1+wallWidth});
					prevWall.bottomSide.set({x1:prevWall.bottomSide.x1 + wallWidth});
			}
			if(sharedCorner=='topright')
			{
				wallContainer.leftSide.set({y1:wallContainer.leftSide.y1+wallWidth});
				prevWall.bottomSide.set({x2:prevWall.bottomSide.x2-wallWidth});
			}
			
			
			if(sharedCorner=='bottomleft')
			{
				wallContainer.rightSide.set({y2:wallContainer.rightSide.y2-wallWidth});					
				prevWall.topSide.set({x1:prevWall.topSide.x1+wallWidth});
			}
			if(sharedCorner=='bottomright')
			{
				wallContainer.leftSide.set({y2:wallContainer.leftSide.y2-wallWidth});					
				prevWall.topSide.set({x2:prevWall.topSide.x2-wallWidth});
			}
				
			
		}
		if(wallContainer.orientation=='h') // horizontal wall
		{
			
			if(sharedCorner=='topleft')
			{
				wallContainer.bottomSide.set({x1:wallContainer.leftSide.x1+wallWidth});
				prevWall.rightSide.set({y1:prevWall.rightSide.y1+wallWidth});				
			}
			if(sharedCorner=='bottomleft')
				{
					wallContainer.topSide.set({x1:wallContainer.leftSide.x1+wallWidth});
					prevWall.rightSide.set({y2:prevWall.rightSide.y2-wallWidth});
				}
			
			if(sharedCorner=='topright')
				{
					wallContainer.bottomSide.set({x2:wallContainer.rightSide.x2-wallWidth});					
					prevWall.leftSide.set({y1:prevWall.leftSide.y1+wallWidth});
				}
			if(sharedCorner=='bottomright')
				{
					wallContainer.topSide.set({x2:wallContainer.topSide.x2-wallWidth});		
					prevWall.leftSide.set({y2:prevWall.leftSide.y2-wallWidth});
				}
				
		}
			
	}
	 
	//change the dimension on the last wall (delete the last wall\section and re-add)
	changeDimension()
	{
		let newDimension = window.prompt("Enter new length in mm");

		//delete all wallContainers from the canvas 		
		while(this.walls.length>0)
		{			
			this.deleteWallContainer(this.walls.pop());
		}

		let tempSaves = this.saves; //adding the wall back on will add to saves.
		this.saves = Array();

		while(tempSaves.length>1) //0 based array, but leave one there as we don't want to rebuild the whole diagram (remember, we are deleting a wall)
		{
			var savedWall = tempSaves.shift();//saved wall is basically ruler  and a snapTarget
			this.add(savedWall,savedWall.snapTarget)
		}

		let finalWall = tempSaves.shift()// get the final wall\section and modify it with the new dimension
		if(finalWall.direction=="LR")
		{
			finalWall.x2 = finalWall.x1 +  newDimension;
			finalWall.lineLength = newDimension;
			this.add(finalWall,finalWall.snapTarget);
		}

		if(finalWall.direction=="RL")
		{
			finalWall.x2 = finalWall.x1 +  newDimension;
			finalWall.lineLength = newDimension;
			this.add(finalWall,finalWall.snapTarget);
		}

	}


	/* remove the last wall and send back the new snapTarget */
	 delete()
	 {
		
		//store the snapTarget of the penultimate wall ready for the next wall
		let savedSnapTarget = this.walls[this.walls.length-2].snapTarget;
		

		//delete all wallContainers from the canvas 
		while(this.walls.length>0)
		{			
			this.deleteWallContainer(this.walls.pop());
		}

		let tempSaves = this.saves; //adding the wall back on will add to saves.
		this.saves = Array();

		while(tempSaves.length>1) //0 based array, but leave one there as we don't want to rebuild the whole diagram (remember, we are deleting a wall)
		{
			var savedWall = tempSaves.shift();//saved wall is basically ruler  and a snapTarget
			this.add(savedWall,savedWall.snapTarget)
		}

		return savedSnapTarget;		
		
	 }

	 //remove wall container elements from the canvas
	 deleteWallContainer(wallContainer)
	 {
		this.canvas.remove(wallContainer.leftSide);
		this.canvas.remove(wallContainer.rightSide);
		this.canvas.remove(wallContainer.bottomSide);
		this.canvas.remove(wallContainer.topSide);
		this.canvas.remove(wallContainer.wall);
		this.canvas.remove(wallContainer.snapTarget);
		this.canvas.remove(wallContainer.text);
	 }

	 get wallCount()
	 {
		 return this.walls.length+1;
	 }


}


//store the initial parameters so we can rebuild the wall after a delete (reuse add)
//(they may lose segments due to removal overals)
class SavedWall{
	snapTarget;	//this is the snapTarget used to start the wall
	x1;
	y1
	x2;
	y2;
	orientation;
	lineLength;
	direction;	
	constructor(x1,y1,x2,y2,orientation,snapTarget,lineLength)
	{
		this.snapTarget = snapTarget;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.orientation = orientation;
		this.lineLength = lineLength;
		
	}

}
//Set the exterior wall.  Using the logic that the topSide is alway exterior for our first wall, and the exterior must follow this 
function getExteriorWall(wallContainer) {

	let exteriorWall = wallContainer.topSide;	
	
	//wall direction is determined when wall created
	let wallDirection = wallContainer.direction;
	//New wall or section -
	//surprisingly all directions have same exterior regardless of prior wall. (discovered by working on all combos)

	
	switch(wallDirection)
	{
		case "TB":
			exteriorWall = wallContainer.rightSide;
			break;
		case "LR":
			exteriorWall = wallContainer.topSide;
			break;
		case "BT":
			exteriorWall = wallContainer.leftSide;
			break;
		case "RL":
			exteriorWall = wallContainer.bottomSide;
			break;				
	}

	

	return exteriorWall;
}
