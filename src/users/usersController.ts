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
  }