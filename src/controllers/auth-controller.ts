const debug = require('debug')('http');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
import {JsonController, Body, Post, Res, Delete, Param, UseBefore} from "routing-controllers";
import { IUser, IUserCredentials, IForgotPassword } from "../models/user-model";
import { Service, Inject } from "typedi";
import { AuthService } from "../services/auth-service";
import { AuthSocialService } from "../services/auth-social.service";
// import { AuthFacebook } from "../middlewares/auth-facebook-middleware";

@JsonController('/auth')
@Service()
export class AuthController {
  @Inject() private authService: AuthService;
  @Inject() private authSocialService: AuthSocialService;
  
  constructor() { }

  @Post('/register')
  async registerUser(@Body() user: IUser, @Res() response: any) {
    const token = await this.authService.register(user);
    const headers = { 'Authorization': token, 'Access-Control-Expose-Headers': '*' };
    response.header(headers);
    debug('POST /user/register => Successfully registered!');
    return 'Successfully registered!';
  }

  @Post('/login')
  async login(@Body() credentials: IUserCredentials, @Res() response: any) {
    let token: string;
    if (credentials.type === 'facebook') {
      token = await this.authService.handleFacebookLogin(credentials);
    } else {
      token = await this.authService.login(credentials);
    }
    const headers = { 'Authorization': token, 'Access-Control-Expose-Headers': '*' };
    response.header(headers);
    debug('POST /user/login => Successfully logged in!');
    return 'Successfully logged in!';
  }
  
  @Delete('/logout/:token')
  async logout(@Param('token') token: string) {
    await this.authService.logout(token);
    debug('POST /user/out => Successfully logged out!');
    return 'Successfully logged out!';
  }

  @Post('/forgot-password')
  async forgotPassord(@Body() contact: IForgotPassword) {
    await this.authService.forgotPassword(contact);
    return 'New Password created!'
  }
 
}
