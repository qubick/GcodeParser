var fs 				= require('fs'),
	 validator 		= require('validator')
//var vic			= require('victor');
//var lineReader	= require('line-by-line');


var inFile		 	= "data/tian-layer5.gcode" 
var outFile		 	= "output.csv"
var rDist 			= 1 //const: regular distance for interpolation btw two position
var first			= 0

function dist(x1,y1,x2,y2) {

	return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2))
}

function parser(fname) {
	fs.readFile(fname, function(err, data){
		if (err) 
			throw err
		else {
			var line = data.toString().split('\n')	
			
			//line.forEach(function(entry){ //not for each -> loop
			//var tok = entry.split(' '); //take one line
			while(1){
				var tok = line[first].split(' ') //get first line
				if(tok[0] == 'G1'){
					var prevX = tok[1]
					var prevY = tok[2]
					if(prevX[0] == 'X' && prevY[0] == 'Y'){
						prevX = parseFloat(prevX.replace('X', ''))
						prevY = parseFloat(prevY.replace('Y', ''))
					} 
				}
				if (validator.isFloat(prevX) && validator.isFloat(prevY)) 
					break //got first pos then break while
				else
					first++
			}
			
			
			for(var i=1; i<line.length; i++){				
				tok = line[i].split(' ') //next line
				
				if(tok[0].toString() === 'G1'){
					var nextX = tok[1]
					var nextY = tok[2]
					if(nextX[0] == 'X' && nextY[0] == 'Y'){
						nextX = parseFloat(nextX.replace('X', ''))
						nextY = parseFloat(nextY.replace('Y', ''))

						console.log(prevX, prevY);
						// interpolate with constant distance
						var eDist = dist(prevX, prevY, nextX, nextY)
						//	console.log(eDist);
						var theta = Math.atan(Math.abs(nextY-prevY)/Math.abs(nextX-prevX))

						while (eDist > rDist){
							if(prevX < nextX)
								prevX = prevX + rDist * Math.cos(theta)
							else if(prevX > nextX)
								prevX = prevX - rDist * Math.cos(theta)

							if(prevY < nextY)
								prevY = prevY + rDist * Math.sin(theta)
							else if(prevY > nextY)
								prevY = prevY - rDist * Math.sin(theta)

							//console.log('X: ', prevX, 'Y: ', prevY);

							//eDist -= rDist;
							eDist = dist(prevX, prevY, nextX, nextY)

							newLine = prevX + ',' + prevY + '\n'
							fs.appendFile(outFile, newLine, function(err){
								if(err) console.log(err)
							})
						}
						if(eDist < rDist){
							prevX = nextX; prevY = nextY
							
							newLine = prevX + ',' + prevY + '\n'
							fs.appendFile(outFile, newLine, function(err){
								if(err) console.log(err)
							})
						}	
					} else {
						i++
						//console.log("reached here");
					}
				} //end of if	
			} //end of for loop	
		}
	}) //end of fs.read()
} //end of main

parser(inFile)