const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const PROFILE_IMAGE_FOLDER_URL = '/profileImage';

module.exports.getProfileImage = (id, callback) => {
    fs.readdir('./' + PROFILE_IMAGE_FOLDER_URL + '/' + id, (err, files) => {
        if (err) {
            callback(`${process.env.SERVER_URL + PROFILE_IMAGE_FOLDER_URL}/noProfileImage.jpg`)
        } else {
            if (files[files.length - 1]) {
                callback(process.env.SERVER_URL + PROFILE_IMAGE_FOLDER_URL + '/' + id + '/' + files[files.length - 1])
            } else {
                callback(`${process.env.SERVER_URL + PROFILE_IMAGE_FOLDER_URL}/noProfileImage.jpg`)

            }
        }
    })
}


module.exports.getImageInfo = (accountID, imageName, callback) => {

    fs.readdir('./' + PROFILE_IMAGE_FOLDER_URL + '/' + accountID, (err, files) => {
        if (err) {
            callback(true)
        } else {
            const index = files.indexOf(imageName)
            if (index !== -1) {
                const uri = process.env.SERVER_URL + PROFILE_IMAGE_FOLDER_URL + '/' + accountID + '/';
                callback(false, {
                    previousImageUri: files[index - 1] ? uri + files[index - 1] : null,
                    previousIndex: index - 1,
                    currentImageUri: uri + files[index],
                    currentIndex: index,
                    nextImageUri: files[index + 1] ? uri + files[index + 1] : null,
                    nextIndex: index + 1,
                    lengthImagesList: files.length
                })

            } else {
                callback(true)

            }

        }
    })
}
module.exports.getImageList = (accountID, pointer, size, callback) => {
    if (accountID) {
        const uri = process.env.SERVER_URL + PROFILE_IMAGE_FOLDER_URL + '/' + accountID + '/';
        fs.readdir('./' + PROFILE_IMAGE_FOLDER_URL + '/' + accountID, (err, files) => {
            if (err) {
                callback(true)
            } else {
                if (pointer == 'false') {
                    callback(false, {
                        list: [],
                        id: accountID,
                        pointer: false
                    })
                }
                else if (pointer === null || pointer === 'null' || pointer === undefined) {

                    const list = files.splice(-size, size).reverse()


                    callback(false, {
                        list: list.map(item => uri + item),
                        id: accountID,
                        pointer: list[list.length - 1] === files[0] ? false : list.length
                    })
                } else if (pointer != 'null' || pointer != 'false') {

                    const list = files.slice().splice(-parseInt(pointer) - parseInt(size), size).reverse();
                    callback(false, {
                        list: list.map(item => uri + item),
                        id: accountID,
                        pointer: list[list.length - 1] === files[0] ? false : parseInt(pointer) + list.length
                    })
                }

            }
        })
    } else {
        callback(true)
    }

}

module.exports.makeDirctionFolder = (id, type, callback) => {
    var dir = path.join(path.resolve(), 'uploads', id.toString(), type)
    mkdirp(dir, function (err) {
        if (err) console.error(err)
        else
            callback(dir)
    });
}


