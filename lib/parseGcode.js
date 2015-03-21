var fs 				= require('fs')
	,validator 		= require('validator')
	,path				= require('path')

var inFile		 	= "../data/tian-layer5.gcode" 
var outFile		 	= "out.csv"
//var inFile = "../data//new1.gcode"
//var outFile = "new1.csv"
var rDist 			= 1 //const: regular distance for interpolation btw two position
var first			= 0

function dist(x1,y1,x2,y2) {

	return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2))
}

function parser(fname) {

	var firstCnt = 0;

	fs.readFile(fname, function(err, data){
		if (err) 
			throw err
		else {
			while(1){  //get first line
			
				var line = data.toString().split('\n')
					,firstLine = line[firstCnt++]
					,token = firstLine.split(' ')
				
				if(token.length >= 4){
					if(token[3].toString().match(/E/)){ //has X,Y + E or F
						var prevX = parseFloat(token[1].slice(1,token[1].length))
						,prevY = parseFloat(token[2].slice(1,token[2].length))
						break
					}
				}
			}

			console.log(prevX, prevY)

			for(var i=1; i<line.length; i++){
				token = line[i].split(' ')
				
				if(token.length === 4){
					if(token[3].toString().match(/E/)){ //has X,Y + E or F
						var nextX = parseFloat(token[1].slice(1,token[1].length))
						var nextY = parseFloat(token[2].slice(1,token[2].length))
						console.log(nextX, nextY)
/*						
						newLine = prevX + ',' + prevY + '\n'
						fs.appendFile(outFile, newLine, function(err){
							if(err) console.log(err)
						})
*/

						//parse next line
					}
				}else{
					//	console.log(token)
				}
			}
		}
	})
} //end of main

parser(inFile)
