/* create  line for measuring walls. Only need one, we just move it around for the current wall. */
export default class Ruler
{
    x1=0;
    y1=50;
    x2=150;
    y2=50;
    line;
    lineGuide;
    label;
    canvas;
    orientation;
    wallWidth=25;
    completed=false;
    angleDegrees=0;
    constructor(Canvas,snapStart)
    {
        this.x1 = snapStart.left;
        this.x2 = snapStart.left+50;
        this.y1 = snapStart.top + snapStart.width/2;
        this.y2 = snapStart.top + snapStart.width/2;
        this.canvas = Canvas;
        this.orientation = "h"; //default
        var points = [this.x1,this.y1, this.x2, this.y2];
		
        this.line = new fabric.Line(points, {
            strokeWidth: 1,			
            stroke: 'red',
            originX: 'center',
            originY: 'center'					
        });
        this.canvas.add(this.line);

        //add a guide as an indicator of where the wall may line up
        //We know the ruler is initially horizontal so the guide is vertical
        points = [this.x2,0,this.x2,1200];
        this.lineGuide= new fabric.Line(points, {
            strokeWidth: .3,			
            stroke: 'blue',
            originX: 'center',
            originY: 'center',			
            strokeDashArray: [5, 5]
        });

        this.canvas.add(this.lineGuide);

        
        
        this.label = new fabric.Text('Length ' + this.lineLength(snapStart), { left: this.x2, top: this.y2, fontSize: 12,selectable:false });					        
        this.canvas.add(this.label);	

    }

    setStart(x,y)
    {
        this.x1 = x;
        this.y1 = y;
        this.line.set({x1:this.x1,y1:this.y1})
    }



    setOrientation(pointer,lastWall)
    {
        let angleDegrees= Math.atan2(pointer.y-this.y1,pointer.x-this.x1) * 180/Math.PI ;
        this.angleDegrees=angleDegrees;// just debugging. Show in debug text
        
        if (Math.abs(angleDegrees)<20 || Math.abs(angleDegrees)>150)
        {
            this.orientation='h';
        }
        else
        {
            this.orientation = 'v';
        }

        if(lastWall.wallStyle=='opening')  //can't go round a corner on an opening
        {
            this.orientation = lastWall.orientation;
        }

    }

    //setEnd(pointer,snapTarget)
    setEnd(pointer,lastWall)
    {
        /*Set orientation based on angle so we can add openings */
        var snapTarget = lastWall.snapTarget;
        this.setOrientation(pointer,lastWall);
        
        
        
        if(!this.completed)
        {
            this.drawRuler(pointer, snapTarget);
            this.drawGuide(pointer);
        }
        
    }

    //draw a line showing where pointer would line up
    drawGuide(pointer)
    {
            //redraw the guide-line
            if(this.orientation=='h')
            {
                this.lineGuide.set({x1:pointer.x,x2:pointer.x,y1:0,y2:1200});
            }
            else
            {
                this.lineGuide.set({y1:pointer.y,y2:pointer.y,x1:0,x2:1200});
            }

    }


    drawRuler(pointer, snapTarget) {
        var x = pointer.x;
        var y = pointer.y;


        if (this.orientation == "h") 
        {
            y = snapTarget.top;
            this.y1 = y; //reset the position to the snap target
            // Set start of line depending if we are drawing right or left
            if (x >= snapTarget.left) {
                this.x1 = snapTarget.left;            }

            else {
                this.x1 = snapTarget.left + this.wallWidth;
            }

            rulerx1 = this.x1;
            rulerx2 = this.x2;

        }

        else {
            x = snapTarget.left ;
            this.x1 = x; // if we'moved across, then down, the line start may have been moved to the far edge so reset it.
            
            if (y >= snapTarget.top) {
                this.y1 = snapTarget.top;
            }

            else {
                this.y1 = snapTarget.top + this.wallWidth;
            }
        }



        this.x2 = x;
        this.y2 = y;

        //The co-ords for the ruler are top left for a wall going left to right
        //but we want to visualuse the line through the middle of the wall. Rulerx and y are the corods for the line, not the wall
        var rulerx1; 
        var rulerx2;
        var rulery1;
        var rulery2;

        if (this.orientation == "h") {
            rulerx1 = this.x1;
            rulerx2 = this.x2;
            rulery1 = this.y1 + this.wallWidth / 2;
            rulery2 = this.y2 + this.wallWidth / 2;
        }
        else {
            rulerx1 = this.x1 + this.wallWidth / 2;
            rulerx2 = this.x2 + this.wallWidth / 2;
            rulery1 = this.y1;
            rulery2 = this.y2;
        }

        let lineColour = 'red'      ;
        if(this.loopComplete(pointer.x,pointer.y)){
            lineColour = 'green';
        }
        this.line.set({ x1: rulerx1, y1: rulery1, x2: rulerx2, y2: rulery2,stroke:lineColour });
        this.label.set({ text: 'Length ' + this.lineLength(snapTarget), left: this.x2, top: this.y2 });
    }/* end draw ruler */

        /* Check to see if the loop has been completed*/
        loopComplete(x,y)
        {
            let result = false;
            if (x>25 && x < 50  && y>60 && y<70)
            {                
                result = true;                
            }
            else
            {
                /* when we are done, we are done.*/
                if(!this.completed)
                {             
                    result = false;
                }
            }
            return result;
        }

    
    

    /*return the length of the current line */
    lineLength(snapTarget)
    {				
        //return this.angleDegrees;

        /*lines are vertical or horizontal so this is easy */
        //return Math.sqrt(Math.pow(x2*1-x1*1, 2)+Math.pow(y2*1-y1*1, 2));
        
        var rulerStart=new RulerPointer(this.x1,this.y1);

        //Figure out where the line should start
        //This will vary where we are relative to the snap Target
        // (x2 and y2 are the pointer location)

        //Horizontal lines
        if(this.orientation=='h')
        {
            //Left of snapTarget
            if(this.x2<snapTarget.left)
            {
                rulerStart.x = snapTarget.left;   
            }
            //Right of snapTarget
            if(this.x2>snapTarget.left)
            {
                rulerStart.x = snapTarget.left+snapTarget.width;   
            }
        }
        //Vertical Lines
        if(this.orientation=='v')
        {
            //Up from snap
            if(this.y2<snapTarget.top)
            {
                rulerStart.y = snapTarget.top;
            }
        
            //down from snap
            if(this.y>snapTarget.top)
            {
                rulerStart.y = snapTarget.top+snapTarget.width;
            }
        }

        //special case on the first wall
        if(snapTarget.left == 50 && snapTarget.top == 50)
        {
            rulerStart.x = snapTarget.left;
        }


        if(this.x1!=this.x2)
        {
            return Math.abs(this.x2-rulerStart.x).toFixed(1);
        }
        else
        {
            return Math.abs(this.y2-rulerStart.y).toFixed(1);
        }
        
     
    }
    


}


class RulerPointer
{
    x;
    y;
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}