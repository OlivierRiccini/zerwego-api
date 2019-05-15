const debug = require('debug')('http');
// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook');
import {JsonController, Body, Post, Res, HeaderParam} from "routing-controllers";
import { IUser, IUserCredentials, IForgotPassword } from "../models/user-model";
import { Service, Inject } from "typedi";
import { AuthService } from "../services/auth-service";
// import { AuthSocialService } from "../services/auth-social.service";
// import { AuthFacebook } from "../middlewares/auth-facebook-middleware";

@JsonController('/auth')
@Service()
export class AuthController {
  @Inject() private authService: AuthService;
  // @Inject() private authSocialService: AuthSocialService;
  
  constructor() { }

  @Post('/register')
  async registerUser(@Body() user: IUser, @Res() response: any) {
    const tokens = await this.authService.register(user);
    const headers = {
      jwt: tokens.accessToken,
      'refresh-token': tokens.refreshToken,
      'Access-Control-Expose-Headers': '*'
    };
    response.header(headers);
    debug('POST /user/register => Successfully registered!');
    return 'Successfully registered!';
  }

  @Post('/login')
  async login(@Body() credentials: IUserCredentials, @Res() response: any) {
    let tokens: any;
    if (credentials.type === 'facebook') {
      tokens = await this.authService.handleFacebookLogin(credentials);
    } else {
      tokens = await this.authService.login(credentials);
    }
    const headers = {
      jwt: tokens.accessToken,
      'refresh-token': tokens.refreshToken,
      'Access-Control-Expose-Headers': '*'
    };
    response.header(headers);
    debug('POST /user/login => Successfully logged in!');
    return 'Successfully logged in!';
  }

  @Post('/refresh')
  async refresh(@HeaderParam('refresh-token') refreshToken: string, @Body() user: IUser, @Res() response: any) {
    const newTokens: any = await this.authService.refreshTokens(refreshToken, user.id);
    const headers = {
      jwt: newTokens.accessToken,
      'refresh-token': newTokens.refreshToken,
      'Access-Control-Expose-Headers': '*'
    };
    response.header(headers);
    debug('POST /user/refresh => New Tokens successfully created!');
    return 'New Tokens successfully created!';
  }

  @Post('/logout')
  async logout(@HeaderParam('refreshToken') refreshToken: string) {
    await this.authService.logout(refreshToken);
    debug('POST /user/logout => Successfully logged out!');
    return 'Successfully logged out!';
  }

  @Post('/forgot-password')
  async forgotPassord(@Body() contact: IForgotPassword) {
    await this.authService.forgotPassword(contact);
    return 'New Password created!'
  }
 
}
