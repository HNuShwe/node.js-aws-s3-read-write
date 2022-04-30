"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AWS = require('aws-sdk');
const moment = require('moment');
const multer = require("multer");
const multerS3 = require("multer-s3");
AWS.config.update({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETKEY,
    region: process.env.AWSREGION
});
const BucketMainRoot = "test/";
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const uploadpromotion = multer({
    storage: multerS3({
        s3,
        bucket: 'sinphyutawpromotions',
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
// call S3 to create the bucket
const CreateBucket = () => __awaiter(void 0, void 0, void 0, function* () {
    s3.createBucket({
        Bucket: BucketMainRoot + 'profile'
    }, (err, data) => {
        if (err) {
            console.log("Error", err);
            return 400;
        }
        else {
            console.log("Success", data.Location);
            return 200;
        }
    });
});
const createFile = (params) => __awaiter(void 0, void 0, void 0, function* () {
    // convert body(file contents) to a string so we can append
    const bucketconfig = {
        Bucket: BucketMainRoot + params.Bucket,
        Key: params.Key
    };
    // NOTE this call is now nested in the s3.getObject call so it doesn't happen until the response comes back
    s3.putObject(bucketconfig, (err, data) => {
        console.log('put here');
        if (err) {
            console.log("Error", err);
            return 400;
        }
        else {
            console.log("Success", data);
            return 200;
        }
    });
});
const headObject = (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
    s3.headObject(params, (err, metadata) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            if (err.code === 'NotFound') {
                // create
                const bucketcreatefirst = yield createFile(params);
                console.log(bucketcreatefirst);
                if (bucketcreatefirst === 200) {
                    callback(null, "success");
                }
                else {
                    const message = "Error creating object " + params.Key + " from bucket " + params.Bucket + ".";
                    callback(message);
                }
            }
            else {
                const message = "Error getting head object " + params.Key + " from bucket " + params.Bucket +
                    ". Make sure they exist and your bucket is in the same region as this function.";
                callback(message);
            }
        }
        else {
            callback(null, "success");
        }
    }));
});
const getObject = (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = "Error getting object " + params.Key + " from bucket " + params.Bucket +
                ". Make sure they exist and your bucket is in the same region as this function.";
            console.log(message);
            callback(message);
        }
        else {
            console.log('CONTENT TYPE getObject:', data.ContentType);
            callback(null, data);
        }
    });
});
const putObject = (params, context, getObjectRep, callback) => __awaiter(void 0, void 0, void 0, function* () {
    // convert body(file contents) to a string so we can append
    let body = getObjectRep.Body.toString('utf-8');
    // append data
    console.log(context);
    body += "level: " + context.level + " text: " + context.text
        + " ip: " + context.ip + " localip: " + context.localip + " time: " + context.time + '\n';
    console.log(body);
    const bucketconfig = {
        Bucket: BucketMainRoot + params.Bucket,
        Key: params.Key,
        Body: body
    };
    // NOTE this call is now nested in the s3.getObject call so it doesn't happen until the response comes back
    s3.putObject(bucketconfig, (err, data) => {
        console.log('put here');
        if (err) {
            console.log(err);
            const message = "Error getting object " + bucketconfig.Key + " from bucket " + bucketconfig.Bucket +
                ". Make sure they exist and your bucket is in the same region as this function.";
            console.log(message);
            callback(message);
        }
        else {
            console.log('CONTENT TYPE putObject:', data.ContentType);
            callback(data.ContentType);
        }
    });
});
module.exports = {
    WriteLog: (context, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const params = {
            Bucket: BucketMainRoot + "/logs",
            Key: moment().startOf('isoweek').format('YYYYMMDD') + '.log'
        };
        headObject(params, (headerror, headresp) => {
            if (headerror) {
                callback(headerror);
            }
            else {
                getObject(params, (geterror, getresp) => {
                    if (geterror) {
                        callback(geterror);
                    }
                    else {
                        putObject(params, context, getresp, (puterror, putresp) => {
                            if (puterror) {
                                callback(puterror);
                            }
                            else {
                                callback(null, putresp);
                            }
                        });
                    }
                });
            }
        });
    }),
    uploadImage: (context, callback) => __awaiter(void 0, void 0, void 0, function* () {
        let type = context.image.split(';')[0].split('/')[1];
        let fileextentsion = context.image.split(';')[0].split(':')[1];
        if (type !== "jpeg" || type !== "png" || type !== "jpg") {
            type = "png";
            fileextentsion = "image/png";
        }
        const imageBuffer = Buffer.from(context.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        // console.log(imageBuffer)
        const bucketconfig = {
            Bucket: BucketMainRoot + context.foldername,
            Key: context.filename,
            Body: imageBuffer,
            ContentEncoding: 'base64',
            ContentType: fileextentsion
        };
        console.log(bucketconfig);
        // Set/update the Agent's profile picture in s3 bucket
        s3.putObject(bucketconfig, (errfromput, object) => {
            if (errfromput) {
                console.log(errfromput);
                callback(errfromput);
            }
            else {
                // Profile picture was set/updated successfully
                console.log('successfully uploaded the image!');
                callback(null, object);
            }
        });
    }),
    getImage: (context, callback) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(context)
        const bucketconfig = {
            Bucket: BucketMainRoot + context.foldername,
            Key: context.filename
        };
        s3.getObject(bucketconfig, (err, data) => {
            if (err) {
                console.log(err);
                console.log('Error downloading data: ', data);
                callback(err);
            }
            else {
                console.log('successfully download the image!');
                // console.log(data)
                const encodedstring = data.Body.toString('base64');
                callback(null, encodedstring);
            }
        });
    }),
    DeleteObjectFromS3: (context, callback) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(context)
        const bucketconfig = {
            Bucket: BucketMainRoot + context.foldername,
            Key: context.filename
        };
        s3.deleteObject(bucketconfig, (err, data) => {
            if (err) {
                console.log(err);
                console.log('Error deleting data: ', data);
                callback(err);
            }
            else {
                console.log('successfully delete the file!');
                // console.log(data)
                const encodedstring = data.Body.toString('base64');
                callback(null, encodedstring);
            }
        });
    }),
    getImageWithURL: (context, callback) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(context)
        const signedUrlExpireSeconds = 60 * 30;
        const bucketconfig = {
            Bucket: BucketMainRoot + context.foldername,
            Key: context.filename
        };
        const url = s3.getSignedUrl('getObject', {
            Bucket: BucketMainRoot + context.foldername,
            Key: context.filename,
            Expires: signedUrlExpireSeconds
        });
        callback(null, url);
    }),
    uploadusingmulter: (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const singleUpload = uploadpromotion.single("image");
        singleUpload(data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            else {
                console.log(data);
                callback(null, result);
            }
        });
    })
};
//# sourceMappingURL=s3upload.js.map