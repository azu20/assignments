//use FileSync method to read through a file, 
const fs = require('fs');
//find txt fie, put it in a string, inside that big string split each line using /n 
const linesArray = fs.readFileSync('Assignment1-Input-File.txt').toString().split("\r\n");

// grab array that contains the large string, loop through the array once for each array element. 
//this method takes a function 'line'

let output_file = [];

linesArray.forEach((line) => {

    if (line.length !== 0) {
        //console.log(`>>>>${line}<<<`);
        //creating checks, if each line meets the following requirements, then console log it as a MATCH
        if (line.endsWith("ENDREC") && line.startsWith("REC") && line.includes("ACCOUNT")) {
           // console.log("MATCH: put this in a new file", line);
            output_file.push(line);
            // if it doesn't meet the requirements then (using else argument) console log it as a no match.
        } else {
            console.log( line);
        }
    }
});

//write the file out

fs.writeFileSync("output-assignment-1.txt",output_file.join("\r\n"));