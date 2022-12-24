
const nelx = 30
const nely = 10
const nelz = 2

var filename = "data/top3d_"+nelx+ "x" +nely+"x" +nelz+".mat"

var MatFileContents
readMatFile(filename)
function readMatFile(filename){
    fetch(filename)
    .then(response=>{
        response.arrayBuffer()
        .then(bin=>{
            try {
                json = mat5.read(bin);

                MatFileContents = json.data;
                onMatFileLoad()
            } catch (e) {
                console.log(e);
            }
        })
    })
}

var resultLoaded = false;
var  onMatFileLoad = function(){
    console.log(MatFileContents)

    resultLoaded = true;

}




