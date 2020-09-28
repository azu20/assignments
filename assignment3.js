const fs = require('fs');
////////////////////////////////////////////////////////////////////////////
// Start of Part 1 of Assignment
////////////////////////////////////////////////////////////////////////////

///to consolodate all 3 assignments, googled node.js command line arguments, found: process.argv = property is an inbuilt application programming interface of the process module which is used to get the arguments passed to the node. js process when run in the command line.

//run the following argument when user has entered on command line: length is not equal to 3, or third position of the array, does not -D, then console log the following message and die - return 0 . if true then carry on. , argv - array with all the arguments typed in by user. 
if (process.argv.length === 3 && process.argv[2].startsWith("-D=")) {
    //why3? [node assinment3 -D="user input"]
    //take the third element and split on the = sign - give me back an array and then give me the second element of that new array
    const directory = process.argv[2].split("=")[1];

    if (fs.existsSync(directory)) {
        const all_files = fs.readdirSync(directory);
        const txt_files = all_files.filter((fileName) => fileName.endsWith(".txt"));
        // console.log(all_files);
        // console.log(txt_files);

        /// for each txt file, read the file, and pass it through each function. 
        txt_files.forEach((file) => {
            console.log(`${directory}\\${file}`);
            //   read the file
            const lines = readFile(`${directory}\\${file}`);
            //  pass it to process 1
            const valid_lines = process1(lines);
            // pass it to process 2
            const data = process2(valid_lines);
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


/// <summary> Read file, separate each account entry by line. </summary>
/// <param name="fileName"> The name of the file </param>
/// <returns> An array of account entries within that file. </returns>

function readFile(fileName) {
    return fs.readFileSync(fileName).toString().split("\r\n");
}

////////////////////////////////////////////////////////////////////////////
// Start of Part 2 of Assignment
////////////////////////////////////////////////////////////////////////////
/// <summary> 
/// Reads each account entry and validates it using the specified parameters. It puts the validated account entries into an array, 
/// and prints the invalid account entries on the console. 
/// </summary>
/// <param name="linesArray"> An array that contains all the data that was returned from the function above in lines 38-40.</param>
/// <returns> An array of valid account entries. </returns>
function process1(linesArray) {
    let valid_accounts = [];

    linesArray.forEach((line) => {

        if (line.length !== 0) {
            //console.log(`>>>>${line}<<<`);
            /// creating checks, if each line meets the following requirements, then console log it as a MATCH
            if (line.endsWith("ENDREC") && line.startsWith("REC") && line.includes("ACCOUNT")) {
                // console.log("MATCH: put this in a new file", line);
                valid_accounts.push(line);
            } else {
                /// if it doesn't meet the requirements then (using else argument) print it to the console.
                console.log(line);
            }
        }
    });

    return valid_accounts;
}

////////////////////////////////////////////////////////////////////////////
// Start of Part3 of Assignment
////////////////////////////////////////////////////////////////////////////
/// <summary> 
/// Using the valid accounts, two objects are created, the first oject will hold a summary of every account number 
/// with the total dollar amount. The other object will hold all of the valid account entries.  
/// </summary>
/// <param name="valid_accounts"> An array of valid account entries.</param>
/// <returns> An object containing two values </returns>
function process2(valid_accounts) {

    let statement = {};
    let statement_whole_record = {};

    valid_accounts.forEach((validLine) => {

        if (!validLine.includes(" ")) {
            console.log("error with this record. It has no spaces", validLine);
        } else {
            /// <remarks>
            /// split record when there is a space, and then split it again when there is a space. 
            /// </remarks>
            const record_array = validLine.split(" ")[0].split("-");
            const account_number = record_array[2];
            const money_amount = parseFloat(record_array[4]);

            if (statement[account_number]) {
                const old_value = statement[account_number];
                const new_value = old_value + money_amount;
                statement[account_number] = new_value;

                const existing_entires = statement_whole_record[account_number];
                existing_entires.push(validLine);
                statement_whole_record[account_number] = existing_entires;
            } else {
                /// <remarks>
                /// if the account# is not found within the statement create a new entry
                /// </remarks>
                statement[account_number] = money_amount;
                statement_whole_record[account_number] = [validLine];
            }
        }
    });

    const data = { summarized_values: statement, all_records: statement_whole_record };
    return data;
}

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

    let array_for_output2 = [];
    const sorted_keys = Object.keys(data.summarized_values).sort();
    sorted_keys.forEach((accountNumber) => {
        array_for_output2.push(`${accountNumber}\t${data.summarized_values[accountNumber]}`);
    });

    fs.writeFileSync(`${fileName}-3-summary.txt`, array_for_output2.join("\r\n"));

    let array_for_output3 = [];
    const whole_record_sorted_keys = Object.keys(data.all_records).sort();
    whole_record_sorted_keys.forEach((accountNumber) => {

        const lines_array = data.all_records[accountNumber];
        lines_array.forEach((line) => {
            array_for_output3.push(line);
        });
    });

    fs.writeFileSync(`${fileName}-3-all-accounts.txt`, array_for_output3.join("\r\n"));

}