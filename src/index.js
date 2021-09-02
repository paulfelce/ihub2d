import Grid from './grid.js'
import Ruler from './ruler.js'
import Wall from './wall.js'
const fabric = require("fabric").fabric;

function appStart(){
	
	var grid = new Grid(canvas);
	
	DebugText = new fabric.Text('Debug Text ', { left: 0, top: 0, fontSize: 12 });					
	canvas.add(DebugText);		

	var snapStart = new fabric.Rect({top:50,left:25,width:25,height:25,fill:"#000fff"});
	canvas.add(snapStart);
	snapTarget = snapStart;
	
	mouseCircle = new fabric.Circle({left:0,top:0,radius:2,stroke:'red'})
	canvas.add(mouseCircle);

	ruler = new Ruler(canvas);

	
}

var rect;
var DebugText , Debug2, DebugSnap,DebugOrientation;
		var arr = new Array();		
		var walls = new Array();
		var wallCount = 0;
		var graphtype; 
        var text;
		var pxLineLength;
		
		
		var snapTarget;
		var mouseOffColour; //store the colour of a connector so we can restore it when we mouse off
		var mouseCircle;//visual clue of where the pointer is
        var c = document.getElementById('canvas');
        var canvas  = new fabric.Canvas('canvas', {  hoverCursor: 'pointer',selection: false,fireRightClick:true,stopContextMenu:true});     
        
		fabric.Object.prototype.transparentCorners = false;      		
     	var ruler;
		var ObjectOrientation='horizontal'; // track if we are moving horizontally or vertically and with an opening.
						//(first cut assumes we have to go horizontal then vertical etc)
		appStart();

		function getObjectByTag(tag){
			canvas.getObjects().forEach(function (targ) {
				if(targ.hasOwnProperty('tag')){
					if(targ.tag ==tag)
					{
						return targ;
					}
				}
			})
		}


		canvas.on('mouse:move', function(o){
            canvas.remove(text);
			var pointer = canvas.getPointer(o.e);
			mouseCircle.set({left:pointer.x,top:pointer.y});


			if(!ruler.completed)
			{
				ruler.setEnd(pointer,snapTarget);
			}
			
			canvas.renderAll();

		});	


		canvas.on('mouse:up', function(o){
            
			 var pointer = canvas.getPointer(o.e);
			 
			 /* right click to delete a wall */
			 if(o.button ===3)
			 {

				
				if(walls.length>1)
				{
					let wallContainer = walls[walls.length-1];
					snapTarget = walls[walls.length-2].snapTarget;//update the snaptarget to the prev wall
					ruler.flipOrientation();//because we delete one wall at a time (not a random one) we can get away with flipping.
					ruler.setStart(snapTarget.left,snapTarget.top);
					canvas.remove(wallContainer.wall);
					canvas.remove(wallContainer.snapTarget);
					canvas.remove(wallContainer.text);
					walls.pop();
				}
					
			}


			 //We've clicked the second point so draw the rectangle
			if(o.button ===1)
			{
				if(!ruler.completed)
				{
                    
					var pointer = canvas.getPointer(o.e);

					if(ruler.loopComplete(pointer.x,pointer.y))
					{
						ruler.completed = true;
					}
					var wall = new Wall(canvas);			
					
					var wallContainer = wall.add(ruler)	;

					snapTarget = wallContainer.snapTarget;
					walls.push(wallContainer);
					wallCount++;
					ruler.flipOrientation();	
					ruler.setStart(snapTarget.left,snapTarget.top);

				}
			}
			
			
		});
		
		//canvas.on('mouse:over', function(e) {				
		canvas.on('mouse:over', function(e) {
			return;	 // new version always snaps
			if(e.target!==null)			
			{
				snapTarget = e.target; //set this  so we can delete.
			}
		});
		

				

		//	http://fabricjs.com/fabric-intro-part-3  -- groups


/* move the edge of the exterior of the object */
function changeExterior(obj){
	if(obj.wallOrientation=="horizontal"){



	}
}

		//https://stackoverflow.com/questions/35141349/resizing-width-height-properties-of-fabricjs-rects