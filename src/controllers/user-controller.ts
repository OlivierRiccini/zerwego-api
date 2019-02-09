const debug = require('debug')('http');
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, Header, HeaderParam, ResponseClassTransformOptions, UseBefore} from "routing-controllers";
import { IUser } from "../models/user-model";
import { Service } from "typedi";
import { UserDAO } from '../models/user-model';
import { UserService, IUserResponse } from "../services/user-Service";
import { Authenticate } from "../middlewares/auth-middleware";

@JsonController('/users')
@Service()
export class UserController {

  constructor(private userService: UserService) {    
      this.userService = new UserService(new UserDAO());
    }

  @Post()
  async createUser(@Body() user: IUser, @Res() response: any) {
    const userResponse: IUserResponse = await this.userService.createUser(user);
    const token = userResponse.token;
    response.header('x-auth', token);
    debug('POST /user => ' + JSON.stringify(userResponse.propToSend));
    return userResponse.propToSend;
  }

  @Get('/me')
  @UseBefore(Authenticate)
  async getUser() {
    return 'WAOUuuuuuu';
  }



 
}