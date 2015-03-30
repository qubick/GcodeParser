var fs 				= require('fs')
	,validator 		= require('validator')
	,path				= require('path')

var inFile		 	= "../data/tian-0329-top.gcode" 
var outFile		 	= "../output/output-part1.csv"
//var inFile = "../data//new1.gcode"
//var outFile = "new1.csv"
var cDist 			= 1 //const: regular distance for interpolation btw two position
var first			= 0

function dist(x1,y1,x2,y2) {

	return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2))
}

function parser(fname, cDist) {

	var lineCnt = 0
		,parseCnt = 0

	fs.readFile(fname, function(err, data){
		if (err) 
			throw err
		else {
			var line = data.toString().split('\n')
			
			while(1){  //get first line
			
				var firstLine = line[lineCnt++]
				var token = firstLine.split(' ')
				
				//if(token.length >= 4){
					if(token[1].toString().match(/X/)){
						var prevX = parseFloat(token[1].slice(1,token[1].length))//take 'X'
							,prevY = parseFloat(token[2].slice(1,token[2].length))//take 'Y' 
						break
					}
				//}
			}
			
			newLine = prevX + ',' + prevY + '\n'
			fs.appendFile(outFile, newLine, function(err){
				if(err) console.log(err)
			})

			for(var i=lineCnt; i<line.length; i++){
				token = line[i].split(' ')
				if(token.length >= 4 && token[0] === 'G1'){
					if(token[3].toString().match(/E/)){ //has X,Y + E or F
					
						var nextX = parseFloat(token[1].slice(1,token[1].length))
							,nextY = parseFloat(token[2].slice(1,token[2].length))

						var eDist = dist(prevX, prevY, nextX, nextY)
							,theta = Math.atan(Math.abs(nextY-prevY)/Math.abs(nextX-prevX))
						
						do {
						console.log("eDist: ", eDist, cDist)	
							if(prevX < nextX)
								prevX = prevX + cDist * Math.cos(theta)
							else if (prevX > nextX)
								prevX = prevX - cDist * Math.cos(theta)

							if(prevY < nextY)
								prevY = prevY + cDist * Math.sin(theta)
							else if(prevY > nextY)
								prevY = prevY - cDist * Math.sin(theta)

							eDist -= cDist;

							//if(eDist < 2)
							//	newLine = prevX + ',' + prevY + ', checked \n'
							
							newLine = prevX + ',' + prevY + '\n'
							fs.appendFile(outFile, newLine, function(err){
								if(err) console.log(err)
							})

						} while(eDist > cDist)


						/*
						if(eDist < cDist){
							prevX = nextX //this should be new pts that makes dist 1
							prevY = nextY
							
							newLine = prevX + ',' + prevY + '\n'
							fs.appendFile(outFile, newLine, function(err){
								if(err) console.log(err)
							})
						}
						*/
						
					} else {
						if(token[3].toString().match(/F7800/)){ //jump w/o interpolation
							prevX = parseFloat(token[1].slice(1,token[1].length))
							prevY = parseFloat(token[2].slice(1,token[2].length))
						}
						
						if(++parseCnt === 4) //each part has 3 layers of wall printing
							outFile = "../output/output-part2.csv"
						
						i++ //if not valid X,Y move commnad, just skip that line
					}
				}else{ //if not G1 command
					i++//	console.log(token)
				}
			}
		}
	})
} //end of main

parser(inFile, 1)
