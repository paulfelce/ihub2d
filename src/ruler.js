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
    lineLength; //have a copy we can read. Set it on mouse move
    firstSet=false;
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
            strokeDashArray: [5, 5],
            selectable:false
        });

        this.canvas.add(this.lineGuide);

        
        
        this.label = new fabric.Text('Length ' + this.lineLength, { left: this.x2, top: this.y2, fontSize: 12,selectable:false });					        
        this.canvas.add(this.label);	

    }

    //configure the start point based on the current direction and the previous wall
    //this makes the ruler look more natural and makes it simpler to measure
    setStart(pointer,snapTarget)
    {
        this.x1 = snapTarget.left;
        this.y1 = snapTarget.top;

        if(pointer.x>=snapTarget.left+snapTarget.width)
        {
            this.x1=snapTarget.left+snapTarget.width;
        }
        
        
        if(pointer.y>=snapTarget.top+snapTarget.width)
        {
            this.y1=snapTarget.top;
        }
        
        //the very first ruler measures from the left of the snapTarget
        if(!this.firstSet)
        {
            this.x1 = snapTarget.left;
        }

        this.line.set({x1:this.x1,y1:this.y1})

    }

    setEnd(pointer,lastWall)
    {

        /*Set orientation based on angle so we can add openings */
        var snapTarget = lastWall.snapTarget;   
        this.setStart(pointer,snapTarget);//always check the start so the line starts at the correct side of the prevWall
        this.setOrientation(pointer);

        if (this.orientation=='h')
        {
            this.y2=this.y1;
            this.x2 = pointer.x;
        }
        else
        {
            this.x2=this.x1;
            this.y2 = pointer.y;
        }

        this.lineLength = this.getlineLength(snapTarget);
        
        
        if(!this.completed)
        {
            this.drawRuler(pointer, snapTarget);
            this.drawGuide(pointer);
        }
        
    }


    setOrientation(pointer)
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

    //this.x1 and this.y1 should be set for the start of the line based on the pointer relative to the snapTarget
    drawRuler(pointer, snapTarget) {
        var x = pointer.x;
        var y = pointer.y;


        if (this.orientation == "h") 
        {
            this.y1 = snapTarget.top + snapTarget.width/2; //don't allow an angled wall
            y=this.y1;
        }
        else
        {
            this.x1 = snapTarget.left + snapTarget.width/2; //don't allow an angled wall    
            x=this.x1;
        }

        let lineColour = 'red'      ;
        //if(this.loopComplete(pointer.x,pointer.y)){
        //    lineColour = 'green';
        //}
        this.line.set({ x1: this.x1, y1: this.y1, x2: x, y2: y,stroke:lineColour });
        this.label.set({ text: 'Length ' + this.lineLength, left: this.x2, top: this.y2 });
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
    /*visual representation of line represents what we are measuring */
    /* don't assume we have fixed the line as vertical or horizontal yet */
    getlineLength(snapTarget)
    {	
        var result =  Math.abs(this.line.y2-this.line.y1);			
        if (this.orientation=='h')
        {
            result = Math.abs(this.line.x2-this.line.x1) 
        }        

        return result.toFixed(1);
    }


    
    //check conditions for creating a new wall
    allowNew(pointer,lastWall)
    {
        let result = true;
        if(this.getlineLength(lastWall.snapTarget)<25)
        {
            result = false;
        }
        //a wall cannot end with an opening
        if(lastWall.wallStyle=='opening' && lastWall.orientation != this.orientation)
        {
            result = false;
        }

        return result;

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