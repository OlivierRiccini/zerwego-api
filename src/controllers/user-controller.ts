const debug = require('debug')('http');
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, Header, HeaderParam, ResponseClassTransformOptions, UseBefore} from "routing-controllers";
import { IUser, IUserCredentials } from "../models/user-model";
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

  @Post('/register')
  async registerUser(@Body() user: IUser, @Res() response: any) {
    const userResponse: IUserResponse = await this.userService.register(user);
    const token = userResponse.token;
    const headers = { 'x-auth': token, 'Access-Control-Expose-Headers': 'x-auth'};
    response.header(headers);
    debug('POST /user/register => ' + JSON.stringify(userResponse.propToSend));
    return userResponse.propToSend;
  }

  @Post('/login')
  async login(@Body() credentials: IUserCredentials, @Res() response: any) {
    const userResponse: IUserResponse = await this.userService.login(credentials);
    const token = userResponse.token;
    const headers = { 'x-auth': token, 'Access-Control-Expose-Headers': 'x-auth'};
    response.header(headers);
    debug('POST /user/login => ' + JSON.stringify(userResponse.propToSend));
    return userResponse.propToSend;
  }

  @Delete('/logout')
  async logout(@Req() request: any) {
    debug('DELETE /user/logout => User signing out...');
    const token: string = request.headers['x-auth'];
    await this.userService.logout(token);
    debug('POST /user/logout => User disconected');
    return 'Disconnected!';
  }

 
}