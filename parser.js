var fs 		= require('fs');
var vic		= require('victor');
//var lineReader	= require('line-by-line');


var filename = "tian-layer5.gcode" //get gcode file name
var data

function dist(x1,y1,x2,y2) {

	return sqrt((x2-x1)^2 + (y2-y1)^2)
}

function parser(fname, res) {

/* line by line synchronous event handler
	lr = new lineReader(fname);

	lr.on('error', function (err){
		console.log("error to open file");
	});

	lr.on('line', function(line){
		while (line)
			console.log(line);
	})
*/

	fs.readFile(fname, function(err, data){
		if (err) 
			throw err;
		else {
		
			var gcode = data.toString();	
			var line = gcode.split('\n') //get one line by line
			//console.log(line); //line == array of all lines
			
			//line.forEach(function(entry){ //not for each -> loop
			//var tok = entry.split(' '); //take one line
			while(EOL){
				tok = line[cnt];
				if(tok[0].toString() === 'G1'){
					var prevX = tok[1];
					var prevY = tok[2];
					if(prevX[0] == 'X' && prevY[0] == 'Y'){
						prevX = prevX.replace('X', '');
						prevX = prevY.replace('Y', '');
						//new newPos = new Victor(x.replace('X', ''), y.replace('Y', '');
					}	
				}
				tok = line[cnt+1]; //next line
				if(tok[0].toString() === 'G1'){
					var nextX = tok[1];
					var nextY = tok[2];
					if(nextX[0] == 'X' && nextY[0] == 'Y'){
						nextX = nextX.replace('X', '');
						nextX = nextY.replace('Y', '');
					}
		}
			
	var entDist = dist(prevX, prevY, nextX, nextY);
	//var entDist = prePos.distance(interPos); //victor

	//find midpoint until distance will be greater than .5
		interX = (prevX + nextX)/2;
		interY = (prevY + nextY)/2;
		
		while (dist(interX, interY, x, y) > .5){
			nextX = interX;
			nextY = interY;

			interX = (prevX + x)/2;
			interY = (prevY + y)/2;
		}
	}



	var newLine = interX + '\t' + interY + '\n';
						//write file
						fs.appendFile("xy.txt", newLine, function(err){
							if(err) console.log(err);
						})	
					}
				} else {
					console.log("not G1 command");
				}
			})
		}
	})
}

parser(filename, data);
