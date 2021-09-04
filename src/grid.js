export default class Grid
{

    constructor(canvas)
    {
	
        var points;
        //small squares
        for(var i =0;i<=1200;i=i+10)
        {
            points = [0,i,1200,i];

            gridLine = new fabric.Line(points,{
            strokeWidth: .5,					
            stroke:'#e2e2e2'	,
            originX: 'center',
            originY: 'center',
            selectable:false
            });
        
            canvas.add(gridLine);
            
            
        }

        for(var i =0;i<=1200;i=i+10)
        {
            var points = [i,0,i,1200];
            var gridLine = new fabric.Line(points,{
            strokeWidth: .5,			
            stroke: '#e2e2e2',
            originX: 'center',
            originY: 'center',
            selectable:false
            
        });
            canvas.add(gridLine);
        }

//big squares
for(var i =0;i<=1200;i=i+50)
{
    points = [0,i,1200,i];

    gridLine = new fabric.Line(points,{
    strokeWidth: .8,					
    stroke:'#e2e2e2'	,
    originX: 'center',
    originY: 'center',
    selectable:false
    });

    canvas.add(gridLine);
    
    
}

for(var i =0;i<=1200;i=i+50)
{
    var points = [i,0,i,1200];
    var gridLine = new fabric.Line(points,{
    strokeWidth: .8,			
    stroke: '#e2e2e2',
    originX: 'center',
    originY: 'center',
    selectable:false
    
});
    canvas.add(gridLine);
}



        }


}