// src/users/usersController.ts
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
  import { User } from "./user";
  import { UsersService, UserCreationParams } from "./usersService";
  export type MainResponse = Pick<User, "email" | "name" | "phoneNumbers">;
  require('../config/requiredModel');
  const AWSS3 = require('../config/s3upload');
  
  @Route("users")
  export class UsersController extends Controller {
    @Get()
    public async getUser(){
      UsersService.getallusers((err:any, result:any) => {
        if (err) {
            return {status:"500",message:"Error", data: err};
        }
        return {
          status: "200",
          message: "All roles.",
          data: result
        };
      });
    }
  
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams
    ){
      UsersService.createuser(requestBody,(err:any, result:any) => {
        if (err) {
            return {status:"500",message:"Error", data: err};
        }
        return {
          status: "200",
          message: "All roles.",
          data: result
        };
      });
    }

    
    @SuccessResponse("201", "Saved")
    @Post('saveimage')
    public async SaveProfileImage(
        @Body() reqBody: {
            mainimage: any,
            userid: number
        }
    ){
        const ResponseData = await this.SavingProfileImageForUser(reqBody);
        return ResponseData;
    }

    @Post('getimage')
    public async GetProfileImage(
      @Body() reqBody: {
        userid: number
      }
    ){
        const ResponseData = await this.getImage(reqBody.userid);
        return ResponseData;
    }

    public async SavingProfileImageForUser(reqBody:{userid:number,mainimage:any}){
      let imagefilename = '';
      let type = reqBody.mainimage.split(';')[0].split('/')[1];
      if(type !== "jpeg" || type !== "png" || type !== "jpg"){
          type = "png";
      }
      imagefilename = moment().format('YYYYMMDDHHmmss') + '.' + type ;
      const uploadBody = {
          image: reqBody.mainimage,
          foldername : "userprofile",
          filename  : imagefilename,
      }
      // console.log("before upload to s3")
      const ResponseData = await this.UploadToS3(uploadBody);
      if((ResponseData as MainResponseModel).status === "200"){
          const afterupload = (ResponseData as MainResponseModel).data;
          // console.log(afterupload);
          const saveBody = {
              userid:reqBody.userid,
              image:imagefilename
          }
          const AfterUpdate = await this.UpdateUserInDB(saveBody);
          return AfterUpdate;
      }else{
          return ResponseData;
      }
  }
  public async getImage(userid:number){
    return new Promise(resolve => {
      UsersService.selectuser(userid,(error1:any,resp1:any)=>{
        if (error1) {
          resolve({status: "500",message: error1,data:null});
        }else{
            AWSS3.getImage({
              filename: resp1.image,
              foldername: "userprofile"
            },(error:any,resp:any)=>{
                if (error) {
                    resolve({status: "500",message: error,data:null});
                }else{
                    resolve({status: "200",message:"Success", data: resp});
                }
            });
        }
      });
    });  
  }
  public async UploadToS3(uploadBody:{
    image: any,
    foldername : String,
    filename  : String
  }){
    return new Promise(resolve => {
        AWSS3.uploadImage(uploadBody,(error:any,resp:any)=>{
            if (error) {
                console.log(error)
                resolve({status: "500",message: error,data:null});
            }else{
                resolve({status: "200",message:"Success", data: resp});
            }
        });
    });
  }
  public async UpdateUserInDB(data:any) {
    return new Promise(resolve => {
        UsersService.updateUser(data, (err: any, result: any) => {
                if (err) {
                    resolve({status:"500",message:"Error", data: err});
                }else{
                    resolve({status: "200", message: "Admin updated", data:result});
                }
            }
        );
    });
  }
}