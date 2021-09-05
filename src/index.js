import Grid from './grid.js'
import Ruler from './ruler.js'
import Wall from './wall.js'
import WallCollection from './wallcollection.js'
import Wallcontainer from './wall'
const fabric = require("fabric").fabric;


var zoomText 
//var devText
var canvas  = new fabric.Canvas('canvas', {  hoverCursor: 'pointer',selection: false,fireRightClick:true,stopContextMenu:true}); 	
var wallCollection = new WallCollection(canvas);
var text;		
var snapTarget;		         
var ruler;


function appStart(){
	
	var grid = new Grid(canvas);

	zoomText = new fabric.Text('Zoom 100 ', { left: 0, top: 0, fontSize: 12 });					
	canvas.add(zoomText);	
	
	//devText = new fabric.Text('exterior:top', { left: 100, top: 0, fontSize: 12 });					
	//canvas.add(devText);	

	snapTarget = new fabric.Rect({top:50,left:50,width:25,height:25,fill:"rgba(0,0,0,0)",stroke:'blue'});
	canvas.add(snapTarget);

	ruler = new Ruler(canvas,snapTarget);

	
}


		
	appStart();
		canvas.on('mouse:move', function(o){
            canvas.remove(text);
			var pointer = canvas.getPointer(o.e);
			if(!ruler.completed)
			{
				var wallContainer; //ruler must have a snapTarget. usually we get this from the walls . but on the first wall we add a fake

				if(wallCollection.wallCount==1)/* haven't got a wall collection to pass. so just pass the snapTarget */
				{
					wallContainer = new EmptyContainer(snapTarget);					
				}
				else
				{
					wallContainer = wallCollection.lastWall();					
				}
				ruler.setEnd(pointer,wallContainer);
				//ruler.setEnd(pointer,snapTarget);
			}
			canvas.renderAll();
		});	


		canvas.on('mouse:up', function(o){            
			 var pointer = canvas.getPointer(o.e);
			 
			 //We've clicked the second point so draw the rectangle
			if(o.button ===1)
			{
				var pointer = canvas.getPointer(o.e);
				if(!ruler.completed)
				{	
					let rulerLoopComplete;
					rulerLoopComplete = ruler.loopComplete(pointer.x,pointer.y);
					if(rulerLoopComplete)
					{
						ruler.completed = true;
					}

					let allowNew = true;
					var wallContainer;
					if(wallCollection.wallCount==1)/* haven't got a wall collection to pass. so just pass the snapTarget */
					{
						wallContainer = new EmptyContainer(snapTarget);
					}
					else
					{
						wallContainer = wallCollection.lastWall();					
					}
					
					allowNew=ruler.allowNew(pointer,wallContainer)
					
					if(allowNew)
					{
						snapTarget = wallCollection.add(ruler,snapTarget);	
						ruler.setStart(snapTarget.left,snapTarget.top); // set the ruler to start on the NEW snaptarget					
					}
					
				}
				
			}
			 /* right click to delete a wall */
			 if(o.button ===3)
			 {
				if(ruler.loopComplete(pointer.x,pointer.y))
				{
					
					ruler.setStart(pointer.x,pointer.y)
				}
				else
				{
					snapTarget = wallCollection.delete();
					ruler.setStart(snapTarget.left,snapTarget.top);
				}
	        }				
			
		});
		
		canvas.on('mouse:wheel', function(opt) {
			var delta = opt.e.deltaY;
			var zoom = canvas.getZoom();
			zoom *= 0.999 ** delta;
			if (zoom > 20) zoom = 20;
			if (zoom < 0.01) zoom = 0.01;
			//canvas.setZoom(zoom);

			canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
			var fs = 1/zoom *14;
			zoomText.set({text:"Zoom " + (100*zoom).toFixed(0) , fontSize:fs});
			opt.e.preventDefault();
			opt.e.stopPropagation();
		  })
		
	//pass this as a wall container when building our first wall
	class EmptyContainer
	{
		snapTarget;	
		wallStyle;
		constructor(snapTarget)
		{
			this.snapTarget = snapTarget;
			this.wallStyle = 'wall';
		}
	}