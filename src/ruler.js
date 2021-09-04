/* create  line for measuring walls. Only need one, we just move it around for the current wall. */
export default class Ruler
{
    x1=0;
    y1=50;
    x2=150;
    y2=50;
    line;
    label;
    canvas;
    orientation;
    wallWidth=25;
    completed=false;
    angleDegrees=0;
    constructor(Canvas)
    {
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
        


        this.label = new fabric.Text('Length ' + this.lineLength(), { left: this.x2, top: this.y2, fontSize: 12,selectable:false });					        
        this.canvas.add(this.label);	

    }
    flipOrientation()    
    {
        this.orientation = (this.orientation =='h') ? 'v' : 'h';        
    }

    setStart(x,y)
    {
        this.x1 = x;
        this.y1 = y;
        this.line.set({x1:this.x1,y1:this.y1})
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


    setEnd(pointer,snapTarget)
    {
        /*Set orientation based on angle so we can add openings */
        
        this.setOrientation(pointer);
        
        if(!this.completed)
        {
            this.drawRuler(pointer, snapTarget);
        }
        
    }

    /* prompt user for exact line length based on current ruler length */
    setExactEnd(snapTarget)
    {
        
        
        let pointer = this.canvas.getPointer();
        this.setOrientation(pointer);
        let orientation = this.orientation;//don't allow it to change when mouse moves to input box
        
        let exactSize = window.prompt("Enter size in mm");
        
        var rulerPointer = new RulerPointer(pointer.x,pointer.y);
        
        if(orientation=='h')
        {
            if(this.x2 > this.x1)
            {
                rulerPointer.x = this.x1 +  parseInt(exactSize);
            }
            else
            {
                rulerPointer.x = this.x1 - parseInt(exactSize);
            }
        }
        else
        {
            if(this.y2 > this.y1)
            {
                rulerPointer.y = this.y1 +  parseInt(exactSize);
            }
            else
            {
                rulerPointer.y = this.y1 - parseInt(exactSize);
            }
        }

        this.setEnd(rulerPointer,snapTarget);
    }

    drawRuler(pointer, snapTarget) {
        var x = pointer.x;
        var y = pointer.y;



        if (this.orientation == "h") {
            y = this.y1;
            /* Set start of line depending if we are drawing right or left */
            if (x >= snapTarget.left) {
                this.x1 = snapTarget.left;            }

            else {
                this.x1 = snapTarget.left + this.wallWidth;
            }

            rulerx1 = this.x1;
            rulerx2 = this.x2;

        }

        else {
            x = this.x1;
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
        this.label.set({ text: 'Length ' + this.lineLength(), left: this.x2, top: this.y2 });
    }

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
    lineLength()
    {				
        //return this.angleDegrees;

        /*lines are vertical or horizontal so this is easy */
        //return Math.sqrt(Math.pow(x2*1-x1*1, 2)+Math.pow(y2*1-y1*1, 2));
        
        if(this.x1!=this.x2)
        {
            return Math.abs(this.x2-this.x1).toFixed(1);
        }
        else
        {
            return Math.abs(this.y2-this.y1).toFixed(1);
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