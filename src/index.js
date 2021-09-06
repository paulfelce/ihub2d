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
		
}

function addWall(o)
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
			ruler.setStart(pointer,snapTarget); // set the ruler to start on the NEW snaptarget					
		}
	
	}
}
		
	appStart();

		canvas.on('mouse:move', function(o)
		{
            canvas.remove(text);
			var pointer = canvas.getPointer(o.e);
			
			if(!(snapTarget===undefined))//don't try and use the ruler until first point placed
			{
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
				}
		
			}
			canvas.renderAll();
		});	


		canvas.on('mouse:up', function(o){            
			 var pointer = canvas.getPointer(o.e);
			 
			//We've clicked a measurement so update it
			//Only allow on last wall ( or they all need updating).  For now user can enforce this logic


			 //We've clicked the second point so draw the rectangle
			if(o.button ===1)
			{
				if(snapTarget===undefined)
				{
					//ruler and first snapTarget now added with first click. If it's undefined we know we can't draw the ruler or add a wall
					
					//align the snap target to top left
					let snapX = pointer.x - pointer.x % 50;
					let snapY = pointer.y - pointer.y % 50;

					snapTarget = new fabric.Rect({left:snapX,top:snapY,width:25,height:25,fill:"rgba(0,0,0,0)",stroke:'blue'});	
					snapTarget.set({tag:'first'});				
					canvas.add(snapTarget);
					ruler = new Ruler(canvas,snapTarget);
		
				}
				else
				{
					addWall(o);
				}
				
			}
			 /* right click to update dimesion on the last walld*/
			if(o.button ===3)
			{
				wallCollection.changeDimension();
	        }				
			
		});
		//if user presses d-delete the last wall
		document.onkeyup = function(e) 
		{	
			switch (e.key) 
			{
				case 'd':
				{
					var snapTarget = wallCollection.delete();
					ruler.setStart(snapTarget.left,snapTarget.top);
				}
				
			}
		
			canvas.renderAll();			  
		}



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
