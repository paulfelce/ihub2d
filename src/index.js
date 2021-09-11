import Grid from './grid.js'
import Ruler from './ruler.js'
import Wall from './wall.js'
import WallCollection from './wallcollection.js'
import Wallcontainer from './wall'
import FileObject from './files'
const fabric = require("fabric").fabric;


var zoomText 
//var devText
var canvas  = new fabric.Canvas('canvas', {  hoverCursor: 'pointer',selection: false,fireRightClick:true,stopContextMenu:true}); 	
var wallCollection = new WallCollection(canvas);
var text;		
var snapTarget;		         
var ruler;

//track the first point. So we can highlight end
var startX;
var startY;



function appStart(){
	
	var grid = new Grid(canvas);

	zoomText = new fabric.Text('Zoom 100 ', { left: 0, top: 0, fontSize: 12 });					
	canvas.add(zoomText);
	
	/* Save documents */
	document.querySelector("#write-button").addEventListener('click', function() {		
		let fo = new FileObject()
		fo.save(wallCollection);    
		
	});


	/* Load documents */
	document.querySelector("#read-button").addEventListener('click', function() {

        if(document.querySelector("#file-input").files.length ==0) {
            alert('Error : No file selected');
            return;
        }
        else
        {
            /* change event fires twice, so check the file has REALLY changed */
            let fileName = document.querySelector("#file-input").files[0].name;
			let fo = new FileObject();			
			fo.load(wallCollection);  			
		}

		

	});


	document.addEventListener("fileLoadedEvent", function(evt) {
		wallCollection = evt.detail;
		let lastWall =wallCollection.walls[wallCollection.wallCount-1] 		
		snapTarget =  lastWall.snapTarget;
		ruler = new Ruler(canvas,snapTarget);
		ruler.firstSet = true; //we have set the first point so no longer need special calcs
	}, false);

		
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

					if(wallCollection.wallCount==0)/* haven't got a wall collection to pass. so just pass the snapTarget */
					{
						wallContainer = new EmptyContainer(snapTarget);					
					}
					else
					{
						wallContainer = wallCollection.lastWall();					
					}
					
						ruler.setEnd(pointer,wallContainer,startX,startY);
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
				if(pointer.y>0) //Don't build a wall if we are saving.
				{
					if(snapTarget===undefined)
					{
						//ruler and first snapTarget now added with first click. If it's undefined we know we can't draw the ruler or add a wall
						
						//align the snap target to top left
						let snapX = pointer.x - pointer.x % 50;
						let snapY = pointer.y - pointer.y % 50;

						startX = snapX;
						startY = snapY;


						snapTarget = new fabric.Rect({left:snapX,top:snapY,width:25,height:25,fill:"rgba(0,0,0,0)",stroke:'blue'});	
						snapTarget.set({tag:'first'});				
						canvas.add(snapTarget);
						ruler = new Ruler(canvas,snapTarget);
						ruler.firstSet = true; //we have set the first point so no longer need special calcs
			
					}
					else
					{
						addWall(o);
					}
				}
				
			}
			 /* right click to update dimesion on the last walld*/
			if(o.button ===3)
			{
				//wallCollection.changeDimension();
				wallCollection.resize();
	        }				
			
		});
		//if user presses d-delete the last wall
		document.onkeyup = function(e) 
		{	
			switch (e.key) 
			{
				case 'Delete':
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
				  
				  if(wallCollection.wallCount==0)/* haven't got a wall collection to pass. so just pass the snapTarget */
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
					 //ensure co-ords match up with length shown on screen
					 //(I'm seeing 2000 as wall length but x2 as 251 (should be 250))

					let tempRuler =ruler;
					if (tempRuler.orientation =='h')
					{
						if (tempRuler.x2>tempRuler.x1)
						{
							tempRuler.x2 = tempRuler.x1 + ruler.lineLength/10;
						}
						else
						{
							tempRuler.x2 = tempRuler.x1 - ruler.lineLength/10;
						}
						
					}
					else
					{
						if (tempRuler.y2>tempRuler.y1)
						{
							tempRuler.y2 = tempRuler.y1 + ruler.lineLength/10;
						}
						else
						{
							tempRuler.y2 = tempRuler.y1 - ruler.lineLength/10;
						}
					}


					  snapTarget = wallCollection.add(ruler,snapTarget);	
					  ruler.setStart(pointer,snapTarget); // set the ruler to start on the NEW snaptarget					
				  }
			  
			  }
		  }

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
