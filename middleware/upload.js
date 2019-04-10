'use strict'

var multer = require('multer');
var mongoose = require('mongoose');
var path = require('path');

function uploadImage(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    var imageName;

    var uploadStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.resolve(__dirname, '../data/user/avatar/'));
        },
        filename: function (req, file, cb) {
            var fileExtension;
            switch (file.mimetype) {
                case 'image/jpeg':
                    fileExtension = 'jpeg';
                    break;
                case 'image/jpg':
                    fileExtension = 'jpg';
                    break;
                case 'image/png':
                    fileExtension = 'png';
                    break;
                default:
                    return res.status(400).json({
                        message: "Formato de archivo no soportado."
                    })
            }
            imageName = id + Date.now() + '.' + fileExtension;
            cb(null, imageName);
        }
    });

    var upload = multer({
        storage: uploadStorage
    });

    var uploadFile = upload.single('avatar');

    uploadFile(req, res, function (err) {
        req.imageName = imageName;
        req.uploadError = err;
        next();
    })
}

module.exports = {
    uploadImage
}