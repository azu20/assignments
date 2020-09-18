//use FileSync method to read through a file, 
const fs = require('fs');
//find txt fie, put it in a string, inside that big string split each line using /n 

////////////////////////////////////////////////////////////////////////////
// Start of Part 1 of Assignment
////////////////////////////////////////////////////////////////////////////
const linesArray = fs.readFileSync('Assignment2-Input-File.txt').toString().split("\r\n");
// grab array that contains the large string, loop through the array once for each array element. 
//this method takes a function 'line'
let array_for_output1 = [];

linesArray.forEach((line) => {

    if (line.length !== 0) {
        //console.log(`>>>>${line}<<<`);
        //creating checks, if each line meets the following requirements, then console log it as a MATCH
        if (line.endsWith("ENDREC") && line.startsWith("REC") && line.includes("ACCOUNT")) {
           // console.log("MATCH: put this in a new file", line);
            array_for_output1.push(line);
            // if it doesn't meet the requirements then (using else argument) console log it as a no match.
        } else {
            console.log( line);
        }
    }
});

//write the file out

fs.writeFileSync("output-1.txt",array_for_output1.join("\r\n"));

////////////////////////////////////////////////////////////////////////////
// Start of Part 2 of Assignment
////////////////////////////////////////////////////////////////////////////
const valid_accounts = fs.readFileSync('output-1.txt').toString().split("\r\n");

let dictionary = {}; 
let dictionary_whole_record = {}; 

valid_accounts.forEach((validLine) => {

   //console.log("\t", validLine); 
    if(!validLine.includes(" ")){
        console.log("error with this record. It has no spaces",validLine);
    }else {
        //split record when there is a space, then get 
        const record_array = validLine.split(" ")[0].split("-");
        const account_number = record_array[2];
        const money_amount = parseFloat(record_array[4]);

        if(dictionary[account_number]){
            const old_value = dictionary[account_number];
            const new_value = old_value + money_amount;
            dictionary[account_number] = new_value;

            const existing_entires =  dictionary_whole_record[account_number];
            existing_entires.push(validLine);
            dictionary_whole_record[account_number] = existing_entires;
        }else{

            //if the account# is not found within the dictionary create a new entry
            dictionary[account_number] = money_amount;
            dictionary_whole_record[account_number] = [validLine];           
        }
    } 
}); 

// console.log("validEntries outside", validEntries);
// let duplicateColors= getDuplicateArrayElements(validAccount);//["blue", "red"]
//console.log("array_for_output1", output_file);


let array_for_output2 = [];

const sorted_keys = Object.keys(dictionary).sort();
sorted_keys.forEach( (accountNumber) => {
    array_for_output2.push(`${accountNumber}\t${dictionary[accountNumber]}`);
});

fs.writeFileSync("output-2-summary.txt",array_for_output2.join("\r\n"));



let array_for_output3 = [];

const whole_record_sorted_keys = Object.keys(dictionary_whole_record).sort();
whole_record_sorted_keys.forEach( (accountNumber) => {
    //   K: V
    //   V = [one, two, three]
    const lines_array = dictionary_whole_record[accountNumber];
    lines_array.forEach( (line) => {
            array_for_output3.push(line);
    });
    
});

fs.writeFileSync("output-2-all-accounts.txt",array_for_output3.join("\r\n"));


