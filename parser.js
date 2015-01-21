var fs 				= require('fs');
//var vic			= require('victor');
//var lineReader	= require('line-by-line');


var filename = "tian-layer5.gcode" 
var cnt = 0;
var rDist = .5; //suppose regular distance is .5

var data;
var prevX;
var prevY;

function dist(x1,y1,x2,y2) {

	return Math.sqrt((x2-x1)^2 + (y2-y1)^2)
}

function posX(x1,y1,x2,y2,a,b){

	return (y1*(b^2+x2^2+y2^2) - y2*(a^2-x1^2-y1^2))/2*(x2*y1-x1*y2)
}

function posY(x1,y1,x2,y2,a,b){

	return (x2*(x1^2-y1^2-a^2) - x1*(x2^2-y2^2+b^2))/2*(y1*x2-y2*x1)
}

function parser(fname, res) {
	fs.readFile(fname, function(err, data){
		if (err) 
			throw err;
		else {
			var line = data.toString().split('\n');	
			//console.log(gcode); //line == array of all lines
			
			//line.forEach(function(entry){ //not for each -> loop
			//var tok = entry.split(' '); //take one line
			var tok = line[cnt++].split(' ');
//console.log(line[cnt]);
			if(tok[0] === 'G1'){
				prevX = tok[1];
				prevY = tok[2];
				
				if(prevX[0] == 'X' && prevY[0] == 'Y'){
					prevX = prevX.replace('X', '');
					prevY = prevY.replace('Y', '');
					//write to file	
				} 
			} //get first line
//console.log(line.length);
			for(var i=1; i<line.length; i++){				
				tok = line[i].split(' '); //next line
				
				if(tok[0].toString() === 'G1'){
					var nextX = tok[1];
					var nextY = tok[2];
					if(nextX[0] == 'X' && nextY[0] == 'Y'){
						nextX = nextX.replace('X', '');
						nextY = nextY.replace('Y', '');
					
//***** 1st: interpolate with constant distance
						var eDist = dist(prevX, prevY, nextX, nextY);
						while (eDist > .5){
							var interX = posX(prevX, prevY, nextX, nextY, rDist, eDist)
							var interY = posY(prevX, prevY, nextX, nextY, rDist, eDist)

							prevX = interX;
							prevY = interY;
			
							eDist = dist(prevX, prevY, nextX, nextY);
						}
					} else {
						i++
						console.log("reached here");
					}
				}
//****** 2nd: interpolate with mid porints 

			var newLine = interX + '\t' + interY + '\n';
				//write file
				fs.appendFile("xy.txt", newLine, function(err){
					if(err) console.log(err);
				})	
			} //end of for loop	
		} //end of else
	}); //end of fs.read()
}

parser(filename, data);
