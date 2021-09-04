//https://www.npmjs.com/package/node-polyfill-webpack-plugin
import Grid from './grid.js'
import Ruler from './ruler.js'
import Wall from './wall.js'
const fabric = require("fabric").fabric;

function appStart(){
	
	var grid = new Grid(canvas);
	
	DebugText = new fabric.Text('Zoom 100 ', { left: 0, top: 0, fontSize: 12 });					
	canvas.add(DebugText);		

	var snapStart = new fabric.Rect({top:50,left:25,width:25,height:25,fill:"#000fff"});
	canvas.add(snapStart);
	snapTarget = snapStart;
	
	mouseCircle = new fabric.Circle({left:0,top:0,radius:2,stroke:'red'})
	canvas.add(mouseCircle);

	ruler = new Ruler(canvas);

	
}

var DebugText 
		
		var walls = new Array();		
        var text;

		
		var snapTarget;		
		var mouseCircle;//visual clue of where the pointer is        
        var canvas  = new fabric.Canvas('canvas', {  hoverCursor: 'pointer',selection: false,fireRightClick:true,stopContextMenu:true});     
        //fabric.Object.prototype.transparentCorners = false;      		
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
					var wall = new Wall(canvas);			
										
					var wallContainer = wall.add(ruler,walls[walls.length-1],snapTarget);
					snapTarget = wallContainer.snapTarget;
					
					walls.push(wallContainer);
					
					ruler.flipOrientation();	
					ruler.setStart(snapTarget.left,snapTarget.top);
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
			DebugText.set({text:"Zoom " + zoom.toFixed(2) , fontSize:fs});
			opt.e.preventDefault();
			opt.e.stopPropagation();
		  })
		

				

		//	http://fabricjs.com/fabric-intro-part-3  -- groups




		//https://stackoverflow.com/questions/35141349/resizing-width-height-properties-of-fabricjs-rects