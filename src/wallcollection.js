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
		var wall = new Wall(this.canvas);	
		var wallContainer = wall.add(ruler,this.walls[this.walls.length-1],snapTarget);
		this.walls.push(wallContainer);
		
		return wallContainer.snapTarget;
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