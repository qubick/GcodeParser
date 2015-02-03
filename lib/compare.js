var fs 				= require('fs'),
	 validator 		= require('validator')
//var vic			= require('victor');
//var lineReader	= require('line-by-line');


var inFile1		 	= "data/cube-in10.gcode"
var inFile2			= "data/cube-in05.gcode"
var outFile		 	= "output.csv"
var index			= 0


function compare(fname1, fname2) {
	var line1;
	var line2;

	fs.readFile(fname1, function(err, data){
		if (err) 
			throw err
		else{ 
			line1 = data.toString().split('\n')
			//console.log(line1)
		
			fs.readFile(fname2, function(err, data){
				if (err)
					throw err
				else{
					line2 = data.toString().split('\n')
			//		console.log(line2)
			
					line1.forEach(function(entry){
						var tok = line2[index++]
						if(entry === tok)
							console.log(entry);
					})
				} //end else in readFile(file2)
			}) //end of readFile(file2)
		} //end else in readFile(file1)
	}) //end of readFile(file1)
}
//end of main

compare(inFile1, inFile2)
