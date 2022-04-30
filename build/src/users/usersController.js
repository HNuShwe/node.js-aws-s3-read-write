"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
// src/users/usersController.ts
const tsoa_1 = require("tsoa");
const usersService_1 = require("./usersService");
require('../config/requiredModel');
const AWSS3 = require('../config/s3upload');
let UsersController = class UsersController extends tsoa_1.Controller {
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            usersService_1.UsersService.getallusers((err, result) => {
                if (err) {
                    return { status: "500", message: "Error", data: err };
                }
                return {
                    status: "200",
                    message: "All roles.",
                    data: result
                };
            });
        });
    }
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            usersService_1.UsersService.createuser(requestBody, (err, result) => {
                if (err) {
                    return { status: "500", message: "Error", data: err };
                }
                return {
                    status: "200",
                    message: "All roles.",
                    data: result
                };
            });
        });
    }
    SaveProfileImage(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const ResponseData = yield this.SavingProfileImageForUser(reqBody);
            return ResponseData;
        });
    }
    GetProfileImage(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const ResponseData = yield this.getImage(reqBody.userid);
            return ResponseData;
        });
    }
    SavingProfileImageForUser(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            let imagefilename = '';
            let type = reqBody.mainimage.split(';')[0].split('/')[1];
            if (type !== "jpeg" || type !== "png" || type !== "jpg") {
                type = "png";
            }
            imagefilename = moment().format('YYYYMMDDHHmmss') + '.' + type;
            const uploadBody = {
                image: reqBody.mainimage,
                foldername: "userprofile",
                filename: imagefilename,
            };
            // console.log("before upload to s3")
            const ResponseData = yield this.UploadToS3(uploadBody);
            if (ResponseData.status === "200") {
                const afterupload = ResponseData.data;
                // console.log(afterupload);
                const saveBody = {
                    userid: reqBody.userid,
                    image: imagefilename
                };
                const AfterUpdate = yield this.UpdateUserInDB(saveBody);
                return AfterUpdate;
            }
            else {
                return ResponseData;
            }
        });
    }
    getImage(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                usersService_1.UsersService.selectuser(userid, (error1, resp1) => {
                    if (error1) {
                        resolve({ status: "500", message: error1, data: null });
                    }
                    else {
                        AWSS3.getImage({
                            filename: resp1.image,
                            foldername: "userprofile"
                        }, (error, resp) => {
                            if (error) {
                                resolve({ status: "500", message: error, data: null });
                            }
                            else {
                                resolve({ status: "200", message: "Success", data: resp });
                            }
                        });
                    }
                });
            });
        });
    }
    UploadToS3(uploadBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                AWSS3.uploadImage(uploadBody, (error, resp) => {
                    if (error) {
                        console.log(error);
                        resolve({ status: "500", message: error, data: null });
                    }
                    else {
                        resolve({ status: "200", message: "Success", data: resp });
                    }
                });
            });
        });
    }
    UpdateUserInDB(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                usersService_1.UsersService.updateUser(data, (err, result) => {
                    if (err) {
                        resolve({ status: "500", message: "Error", data: err });
                    }
                    else {
                        resolve({ status: "200", message: "Admin updated", data: result });
                    }
                });
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)()
], UsersController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created") // Custom success response
    ,
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "createUser", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Saved"),
    (0, tsoa_1.Post)('saveimage'),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "SaveProfileImage", null);
__decorate([
    (0, tsoa_1.Post)('getimage'),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "GetProfileImage", null);
UsersController = __decorate([
    (0, tsoa_1.Route)("users")
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=usersController.js.map