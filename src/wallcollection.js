/* Class to handle a collection of walls */
import Wall from './wall'
export default class WallCollection
{
	
	walls;
	canvas;
	 constructor(canvas)
	 {
		 this.walls = new Array();
		 this.canvas = canvas;
	 }

	 //Create a new wall
	 add(ruler,snapTarget){
		var prevWall = this.walls[this.walls.length-1]; //capture this so we can remove overlaps (also needed by add to determine if an opening)

		var wall = new Wall(this.canvas);	
		var wallContainer = wall.add(ruler,prevWall,snapTarget);

		if (this.walls.length>0 ) // don't check for the first wall 
		{
			if (wallContainer.wallStyle = 'wall') // allow overlaps for openings
			{
			this.removeOverlaps(wallContainer,prevWall,snapTarget.width);
			}
	 	}
		this.walls.push(wallContainer);

		return wallContainer.snapTarget;
	 }


	 removeOverlaps(wallContainer,prevWall,wallWidth)
	 {
		//adjust the wall so there's no overlap		
		//1st cut assumes it's not an opening
		if(wallContainer.orientation=='v')
		{
			if(prevWall.topSide.y1 == wallContainer.topSide.y1)
			{	
				if(prevWall.leftSide.x1 == wallContainer.leftSide.x1) //share top left
				{
					wallContainer.rightSide.set({y1:wallContainer.rightSide.y1+wallWidth});
					prevWall.bottomSide.set({x1:prevWall.bottomSide.x1 + wallWidth});
				}
				else
				{
					wallContainer.leftSide.set({y1:wallContainer.leftSide.y1+wallWidth});
					prevWall.bottomSide.set({x2:prevWall.bottomSide.x2-wallWidth});
				}
			}
			else // vertical connected at bottom 
			{
				if(prevWall.leftSide.x1 == wallContainer.leftSide.x1)
				{
					wallContainer.rightSide.set({y2:wallContainer.rightSide.y2-wallWidth});					
					prevWall.topSide.set({x1:prevWall.topSide.x1+wallWidth});
				}
				else //share bottom right
				{
					wallContainer.leftSide.set({y2:wallContainer.leftSide.y2-wallWidth});					
					prevWall.topSide.set({x2:prevWall.topSide.x2-wallWidth});
				}
				
			}
		}
		if(wallContainer.orientation=='h') // horizontal wall
		{
			if(prevWall.leftSide.x1 == wallContainer.leftSide.x1) //share at left
			{	
				if(prevWall.leftSide.y1 == wallContainer.leftSide.y1) //connected at top left
				{
					wallContainer.bottomSide.set({x1:wallContainer.leftSide.x1+wallWidth});
					prevWall.rightSide.set({y1:prevWall.rightSide.y1+wallWidth});
					
				}
				else //share  bottom left
				{
					wallContainer.topSide.set({x1:wallContainer.leftSide.x1+wallWidth});
					prevWall.rightSide.set({y2:prevWall.rightSide.y2-wallWidth});
				}
			}
			else // horizontal share at right
			{
				if(prevWall.leftSide.y1 == wallContainer.leftSide.y1) //share at top right
				{
					wallContainer.bottomSide.set({x2:wallContainer.rightSide.x2-wallWidth});					
					prevWall.leftSide.set({y1:prevWall.leftSide.y1+wallWidth});
				}
				else //share at bottom right
				{
					wallContainer.topSide.set({x2:wallContainer.topSide.x2-wallWidth});		
					prevWall.leftSide.set({y2:prevWall.leftSide.y2-wallWidth});
				}
				
			}
			
		}
	 }


	/* remove the last wall and send back the new snapTarget */
	 delete()
	 {
		
		var wallContainer = this.walls.pop();
		this.canvas.remove(wallContainer.leftSide);
		this.canvas.remove(wallContainer.rightSide);
		this.canvas.remove(wallContainer.bottomSide);
		this.canvas.remove(wallContainer.topSide);
		this.canvas.remove(wallContainer.wall);
		this.canvas.remove(wallContainer.snapTarget);
		this.canvas.remove(wallContainer.text);

		return  this.walls[this.walls.length-1].snapTarget;//-1 because walls is zero based
	 }


}