import Wall from './wall.js';
export default  class FileObject {

/* load a JSON file stored on the 'browser pc' */

constructor()
{

}

load(wallCollection)
    {

    
	let reader = new FileReader();
	reader.addEventListener('load',function(e){
	let jsondata = e.target.result;

	let savedWalls = JSON.parse(jsondata);
    
    for(let savedWallIndex in savedWalls)
    {
        let savedWall = savedWalls[savedWallIndex];
        wallCollection.add(savedWall,savedWall.snapTarget);
    }
    

    //Dispatch an event
    var evt = new CustomEvent("fileLoadedEvent", {detail: wallCollection});
    document.dispatchEvent(evt);

	});



	reader.readAsText(document.querySelector("#file-input").files[0]);


}

 save(wallCollection)
{		

		let saveblocks=[]
        
	    let blob = new Blob( [ JSON.stringify(wallCollection.walls) ], {
			type: 'application/octet-stream'
		    });

            let url = URL.createObjectURL( blob );
            let link = document.createElement('a');
            link.setAttribute( 'href', url );
            link.setAttribute( 'download', 'Insulhub.json' );
            link.click();


}
}

