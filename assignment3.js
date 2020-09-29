const fs = require('fs');
////////////////////////////////////////////////////////////////////////////
// Start of Assignment 
////////////////////////////////////////////////////////////////////////////
if (process.argv.length === 3 && process.argv[2].startsWith("-D=")) {
    //run the following argument when user has entered on command line: length is not equal to 3, and third position of the array, does not have -D=, then console log the following message and kill program - return 0 . if true then carry on. 
    //why3? [node assignment3 -D="user input"]

    const directory = process.argv[2].split("=")[1];
    //take the third element and split on the = sign - give me back an array and then give me the second element of that new array

    if (fs.existsSync(directory)) {
        //if directory exists, then it reads directory and returns an array with all file names
        //if it doesn't it goes into the else argument on lines 35-38, console logs an error message, and exits program. 

        const all_files = fs.readdirSync(directory);
        // example all_files: ['.git', 'Assignment1-Input-File.txt','assignment1.js' ]

        const txt_files = all_files.filter((fileName) => fileName.endsWith(".txt"));
        // example txt_files: ['Assignment1-Input-File.txt', 'Assignment2-Input-File.txt']

        txt_files.forEach((file) => {
            ///for each txt file, read the file, and pass it through each function. 
      
            const lines = readFile(`${directory}\\${file}`);
            //   read the file, enter the directory in case its not the current directory. 

            const valid_lines = process1(lines);
            // pass it to process 1

            const data = process2(valid_lines);
            // pass it to process 2
            writeFile("output", data);
        });

    } else {
        console.log(`The path you entered is invalid: ${directory}`)
        return 0;
    }

} else {
    console.log("You must run with -D=DIRECTORY_NAME option");
    return 0;
}

////////////////////////////////////////////////////////////////////////////
// Start of Part 1 of Assignment
////////////////////////////////////////////////////////////////////////////

/// <summary> Read file, separate each account entry by line. </summary>
/// <param name="fileName"> The name of the file </param>
/// <returns> An array of account entries within that file. </returns>

function readFile(fileName) {
    return fs.readFileSync(fileName).toString().split("\r\n");
}

/// <summary> 
/// Reads each account entry and validates it using the specified parameters. It puts the validated account entries into an array, 
/// and prints the invalid account entries on the console. 
/// </summary>
/// <param name="linesArray"> An array that contains all the data that was returned from the function above in lines 38-40.</param>
/// <returns> An array of valid account entries. </returns>
function process1(linesArray) {

    let valid_accounts = [];
    ///***create an empty array named valid_accounts */

    linesArray.forEach((line) => {
        //****loop through the linesArray and for each line, it will go throughthe following checks: 

        if (line.length !== 0) {
            ///***if each line is not equal to 0 then process the following funciton. There is no else which means if it is empty then nothing happense, as there is no code to tell it otherwise */

            if (line.endsWith("ENDREC") && line.startsWith("REC") && line.includes("ACCOUNT")) {
                /// each line that is greater than 0, has to then pass the following checks: must end with ENDREC and start with REC and include ACCOUNT

                valid_accounts.push(line);
                //***if it passes the above checks, then push that line into the array valid_accounts */

            } else {
              
                console.log(line);
                  ///if it doesn't meet the requirements then (using else argument) as per the assignment print it to the console.
            }
        } 
    });

    return valid_accounts;
    ///****once it goes through the process1 funciton, we will return the updated valid_accounts array*/
}

//**********************End of part 1******************/

////////////////////////////////////////////////////////////////////////////
// Start of Part2 of Assignment
////////////////////////////////////////////////////////////////////////////
/// <summary> 
/// Using the valid accounts, two objects are created, the first oject will hold a summary of every account number 
/// with the total dollar amount. The other object will hold all of the valid account entries.  
/// </summary>
/// <param name="valid_accounts"> An array of valid account entries.</param>
/// <returns> An object containing two values </returns>

function process2(valid_accounts) {

    let statement = {};
   // create an object to tally by account number and sum totals 

    let statement_whole_record = {};
    //second object needed to be able to collect all values for each key, sort it and print it as requested in the assignment.

    valid_accounts.forEach((validLine) => {

        if (!validLine.includes(" ")) {
            console.log("error with this record. It has no spaces", validLine);
        } else {
            /// <remarks>
            /// split record when there is a space, and then split it again when there is a space. 
            /// </remarks>

            // example validLine: RECORD-ACCOUNT_NUMBER-0009-AMOUNT-90.00 This is just some text -ENDREC
            const record_array = validLine.split(" ")[0].split("-");
            // split it - example: [ 'RECORD', 'ACCOUNT_NUMBER', '0009', 'AMOUNT', '90.00' ] etc

            const account_number = record_array[2];
            // example: 0009

            const money_amount = parseFloat(record_array[4]);
            // example: 90

            //if the account # is found twice in the document, then 
            if (statement[account_number]) {
                //the initial value for the first instance of that account # will be put under the object old value

                const old_value = statement[account_number];
                //and the repeating instances will then be put into the new object new_value this object will sum the old value with the new instance dollar value. 

                const new_value = old_value + money_amount;
                //we will insert in the statement under the matching account # the new total value.

                statement[account_number] = new_value;

                const existing_entires = statement_whole_record[account_number];
                //create new object, that will have the statement whole record or entire line under matching account number.  

                existing_entires.push(validLine);
                //push the valid line or entry into existing entries. 

                statement_whole_record[account_number] = existing_entires;
                //the object statement whole record, we will feed it an account number will have all the existing entries matching that account number 

            } else {
                /// <remarks>
                /// if the account# is not found within the statement create a new entry or in this case new objects below, and then continue running each line thorugh the loop - start it all over. if the account number account up twice then it will run the function abouve instead of creating a new entry.    
                /// </remarks>
                statement[account_number] = money_amount;
                statement_whole_record[account_number] = [validLine];
            }
        }
    });

    const data = { summarized_values: statement, all_records: statement_whole_record };
     //create data object, we will call the key summarized values and the value will be statement object and the second key we will call it all-records and the value will be the statement-whole-record object.  

    return data;
    ///****once it goes through the process2 function, we will return the updated valid_accounts array*/
}
/////*********End of Part 2 ***************************************/

////////////////////////////////////////////////////////////////////////////
// Start of Part3 of Assignment
////////////////////////////////////////////////////////////////////////////

/// <summary> 
///  Write two output files, one contains the summarized totals per account. 
///  The other contains all the valid records sorted in ascending order 
/// </summary>
/// <param name="fileName">The file name prefix.</param>
/// <param name="data">
///  An object containing two values. 
///  The first is and object with the summarized total by account. 
///  The other is an object with an array of all lines for an account</param>

function writeFile(fileName, data) {
    ///run the write file funciton, it takes two parameters, filename and data. 

    let array_for_output2 = [];
    ///create empty array called array for output2
   
    const sorted_keys = Object.keys(data.summarized_values).sort();
    //create another array that will hold the sumarized values or account numbers, and they will be sorted.  
    //sorted keys ['0001', '0002','0003', '0005']  etc. 

    sorted_keys.forEach((accountNumber) => {
        //for each sorted key feed it an account number 

        array_for_output2.push(`${accountNumber}\t${data.summarized_values[accountNumber]}`);
        //if the account number matches the account number on the summarized value push the account # and the total dollar amount or the running tally into array for output 2. 
        //ex: array_for_output2 ['0001\t40.09999999', '0002\t80.001', '0003\t90.002','0005\t150'] etc
    });
    
    fs.writeFileSync(`${fileName}-3-summary.txt`, array_for_output2.join("\r\n"));
    //write file, name it the file name from line or output from line 39 and complete it with rest of string, and it will have the sorted account numbers with the running total for each account numberand it will be joined at every "enter or /r/n"

    let array_for_output3 = [];
    //create empty array output 3 

    const whole_record_sorted_keys = Object.keys(data.all_records).sort();
    //create whole record sorted keys array, this will have all records from the data object and they will be sorted by keys (account #)

    whole_record_sorted_keys.forEach((accountNumber) => {
        //for each record, feed it an account number. 

        const lines_array = data.all_records[accountNumber];
        //create an array that will hold entire line matching  the account number. 

        lines_array.forEach((line) => {
        //grab each lines_array and push it into the array for out 2. 

            array_for_output3.push(line);
        //ex: array_for_output3 ['REC-ACCOUNT-0001-AMOUNT-10.00 This is just some text -ENDREC', 'REC-ACCOUNT-0001-AMOUNT-10.00 This is just some text -ENDREC'] etc
        });
    });

    fs.writeFileSync(`${fileName}-3-all-accounts.txt`, array_for_output3.join("\r\n"));
    //write file, name it the file name from line or output from line 39 and complete it with rest of string, and it will have the complete valid entries sorted by account number. joined at every "enter or /r/n"

}