'use strict';

const walk = require('walk');
const fs = require('fs');
const fse = require('fs-extra');
const { exit } = require('process');
var files = [];
var inputArray = [];
var destination;
var correctedPath;
var walker;


//Check for the command line arguments and make sure the SRC and DST folders are available
//Making sure always the last folder is considered as Destination folder
if (process.argv.length == 2) {
    console.log('Source and Destination not provided');
    exit;
}
else if (process.argv.length > 2 && process.argv.length < 4) {
    console.log('Destination folder not provided');
    exit;
}
else {

    //Take the source and destination from CLI. Source shall be in array to facilitate multiple source transfer at once.
    for (let j = 2; j < process.argv.length - 1; j++) {
        inputArray.push(process.argv[j]);
    }
    let tempLen = process.argv.length;
    destination = process.argv[tempLen - 1];


    // Create the desitnation folder if not already exist.
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    //Loop through the every input given reccursively and make file path array
    for (let i = 0; i < inputArray.length; i++) {
        let inputPath = inputArray[i];
        let destinationFolder = destination;

        walker = walk.walk(inputPath, { followLinks: true });
        walker.on('file', function (root, stat, next) {
            files.push(root + '/' + stat.name);
            next();
        });

        //Loop through the filepath array and copy the files. 
        //The filepath is considered as the name for the new file created. 
        walker.on('end', function () {
            files.forEach(fileName => {
                correctedPath = fileName.replace(/\\/g, "/");
                let temp = correctedPath.replace(/\//g, "_");
                let newFileName = temp.replace(":", "");
                let destDir = destinationFolder + '/' + newFileName;

                //This method will copy the files to destination. 
                try {
                    fse.copySync(fileName, destDir);
                } catch (err) {
                    console.error(err);
                }
            });
        });
    }
}


