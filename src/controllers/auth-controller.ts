const debug = require('debug')('http');
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, Header, HeaderParam, ResponseClassTransformOptions, UseBefore} from "routing-controllers";
import { IUser, IUserCredentials } from "../models/user-model";
import { Service } from "typedi";
import { UserDAO } from '../models/user-model';
import { AuthService } from "../services/auth-service";

@JsonController('/users')
@Service()
export class AuthController {

  constructor(private authService: AuthService) {    
      this.authService = new AuthService(new UserDAO());
    }

  @Post('/register')
  async registerUser(@Body() user: IUser, @Res() response: any) {
    const token: string = await this.authService.register(user);
    const headers = { 'Authorization': token, 'Access-Control-Allow-Headers': 'Authorization'};
    response.header(headers);
    debug('POST /user/register => ' + token);
    return 'Successfully registered!';
  }

  @Post('/login')
  async login(@Body() credentials: IUserCredentials, @Res() response: any) {
    const token: string = await this.authService.login(credentials);
    const headers = { 'Authorization': token, 'Access-Control-Expose-Headers': 'Authorization'};
    response.header(headers);
    debug('POST /user/login => ' + token);
    return 'Successfully logged in!';
  }
 
}