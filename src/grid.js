export default class Grid
{

    constructor(canvas)
    {
	
        var points;//#d4d4d4
        for(var i =0;i<=1000;i=i+25)
        {
            points = [0,i,1000,i];

            gridLine = new fabric.Line(points,{
            strokeWidth: .3,					
            stroke:'red'	,
            originX: 'center',
            originY: 'center',
            selectable:false
            });
        
            canvas.add(gridLine);
            
            
        }

        for(var i =0;i<=1000;i=i+25)
        {
            var points = [i,0,i,1000];
            var gridLine = new fabric.Line(points,{
            strokeWidth: .3,			
            stroke: 'blue',
            originX: 'center',
            originY: 'center',
            selectable:false
            
        });
            canvas.add(gridLine);
        }


        }


}