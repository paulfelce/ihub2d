import Grid from './grid.js'
import Ruler from './ruler.js'
import Wall from './wall.js'
import WallCollection from './wallcollection.js'
const fabric = require("fabric").fabric;

function appStart(){
	
	var grid = new Grid(canvas);
	
	zoomText = new fabric.Text('Zoom 100 ', { left: 0, top: 0, fontSize: 12 });					
	canvas.add(zoomText);	
	
	devText = new fabric.Text('exterior:top', { left: 100, top: 0, fontSize: 12 });					
	canvas.add(devText);	

	snapTarget = new fabric.Rect({top:50,left:50,width:25,height:25,fill:"rgba(0,0,0,0)",stroke:'blue'});
	canvas.add(snapTarget);
	snapTarget = snapTarget;

	ruler = new Ruler(canvas,snapTarget);

	
}

	var zoomText 
	var devText
	var canvas  = new fabric.Canvas('canvas', {  hoverCursor: 'pointer',selection: false,fireRightClick:true,stopContextMenu:true}); 	
	var wallCollection = new WallCollection(canvas);
    var text;		
	var snapTarget;		         
    var ruler;
		
	appStart();
		canvas.on('mouse:move', function(o){
            canvas.remove(text);
			var pointer = canvas.getPointer(o.e);
			if(!ruler.completed)
			{
				ruler.setEnd(pointer,snapTarget);
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
					
					snapTarget = wallCollection.add(ruler,snapTarget);	
					ruler.setStart(snapTarget.left,snapTarget.top); // set the ruler to start on the NEW snaptarget					
					
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
			canvas.setZoom(zoom);
			var fs = 1/zoom *14;
			zoomText.set({text:"Zoom " + zoom.toFixed(2) , fontSize:fs});
			opt.e.preventDefault();
			opt.e.stopPropagation();
		  })
		