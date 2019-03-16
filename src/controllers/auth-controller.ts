const debug = require('debug')('http');
import {JsonController, Body, Post, Res, Delete, Param} from "routing-controllers";
import { IUser, IUserCredentials } from "../models/user-model";
import { Service } from "typedi";
import { UserDAO } from '../models/user-model';
import { AuthService } from "../services/auth-service";
import { SecureService } from "../services/secure-service";
import { SecureDAO } from "../models/secure-model";

@JsonController('/auth')
@Service()
export class AuthController {

  constructor(private authService: AuthService, private secureDAO: SecureDAO) {  
      this.authService = new AuthService(new SecureService(new SecureDAO()), new UserDAO());
    }

  @Post('/register')
  async registerUser(@Body() user: IUser, @Res() response: any) {
    const token = await this.authService.register(user);
    const headers = { 'Authorization': token, 'Access-Control-Allow-Headers': 'Authorization'};
    response.header(headers);
    // response.header({'Refresh_token': tokens.refreshToken, 'Access-Control-Allow-Headers': 'Refresh_token'});
    debug('POST /user/register => ' + token);
    return 'Successfully registered!';
  }

  @Post('/login')
  async login(@Body() credentials: IUserCredentials, @Res() response: any) {
    const token = await this.authService.login(credentials);
    const headers = { 'Authorization': token, 'Access-Control-Expose-Headers': '*'};
    response.header(headers);
    // response.header({'Refresh_token': tokens.refreshToken});
    debug('POST /user/login => ' + token);
    return 'Successfully logged in!';
  }

  @Delete('/logout/:token')
  async logout(@Param('token') token: string) {
    await this.authService.logout(token);
    debug('POST /user/login => ' + token);
    return 'Successfully logged in!';
  }
 
}