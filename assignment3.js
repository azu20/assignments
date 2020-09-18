const fs = require('fs');
//find txt fie, put it in a string, inside that big string split each line using /n 

if (process.argv.length !== 3 || !process.argv[2].startsWith("-D=")) {
    console.log("You must run with -D=DIRECTORY_NAME option");
    return 0;
}

const directory = process.argv[2].split("=")[1];

if (fs.existsSync(directory)) {
    const all_files = fs.readdirSync(directory);
    const txt_files = all_files.filter((fileName) => fileName.endsWith(".txt"));
    // console.log(all_files);
    // console.log(txt_files);

    //for each txt file
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

/// <summary> ........ </summary>
/// <param name="linesArray">....</param>
/// <returns> An array of valid accounts. </returns>

function readFile(fileName) {
    return fs.readFileSync(fileName).toString().split("\r\n");
}

/// <summary> ........ </summary>
/// <param name="linesArray">....</param>
/// <returns> An array of valid accounts. </returns>
function process1(linesArray) {
    let valid_accounts = [];

    linesArray.forEach((line) => {

        if (line.length !== 0) {
            //console.log(`>>>>${line}<<<`);
            //creating checks, if each line meets the following requirements, then console log it as a MATCH
            if (line.endsWith("ENDREC") && line.startsWith("REC") && line.includes("ACCOUNT")) {
                // console.log("MATCH: put this in a new file", line);
                valid_accounts.push(line);
                // if it doesn't meet the requirements then (using else argument) console log it as a no match.
            } else {
                console.log(line);
            }
        }
    });

    return valid_accounts;
}

/// <summary> ........ </summary>
/// <param name="linesArray">....</param>
/// <returns> An array of valid accounts. </returns>
function process2(valid_accounts) {

    let dictionary = {};
    let dictionary_whole_record = {};

    valid_accounts.forEach((validLine) => {

        if (!validLine.includes(" ")) {
            console.log("error with this record. It has no spaces", validLine);
        } else {
            /// <remarks>
            /// split record when there is a space, then get 
            /// </remarks>
            const record_array = validLine.split(" ")[0].split("-");
            const account_number = record_array[2];
            const money_amount = parseFloat(record_array[4]);

            if (dictionary[account_number]) {
                const old_value = dictionary[account_number];
                const new_value = old_value + money_amount;
                dictionary[account_number] = new_value;

                const existing_entires = dictionary_whole_record[account_number];
                existing_entires.push(validLine);
                dictionary_whole_record[account_number] = existing_entires;
            } else {

                //if the account# is not found within the dictionary create a new entry
                dictionary[account_number] = money_amount;
                dictionary_whole_record[account_number] = [validLine];
            }
        }
    });

    const data = { summarized_values: dictionary, all_records: dictionary_whole_record };
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
        //   K: V
        //   V = [one, two, three]
        const lines_array = data.all_records[accountNumber];
        lines_array.forEach((line) => {
            array_for_output3.push(line);
        });
    });

    fs.writeFileSync(`${fileName}-3-all-accounts.txt`, array_for_output3.join("\r\n"));

}