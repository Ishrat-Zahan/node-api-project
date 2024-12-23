const fs = require('fs');
const path = require('path');


const lib = {};


//base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

//write data to file
lib.create = function (dir, file, data, callback) {
    //open the file for writing
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {

        if (!err && fileDescriptor) {
            //convert data to string
            const stringData = JSON.stringify(data);

            //write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing file');
                        }
                    });

                } else {
                    callback('Error writing')

                }
            });
        } else {
            callback(err);
            return;
        }
    });
}

//read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        callback(err, data);
    })
};

//update existing file
lib.update = (dir, file, data, callback) => {

    //file open for writing

    fs.open(lib.basedir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {

            //convert data to string
            const stringData = JSON.stringify(data);

            //truncate the file
            fs.ftruncate(fileDescriptor, (err) => {

                if (!err) {
                    //write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            })
                        }
                    })

                } else {
                    console.log(err);

                }
            })

        } else {
            console.log(err);
        }
    })
}


//delete existing file
lib.delete=(dir,file,callback) => {
    fs.unlink(lib.basedir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    })
}

module.exports = lib;