const debug = require('debug')('http');
import {JsonController, Body, Post, Res, HeaderParam} from "routing-controllers";
import { IUser, IUserCredentials, IForgotPassword } from "../models/user-model";
import { Service, Inject } from "typedi";
import { AuthService } from "../services/auth-service";

@JsonController('/auth')
@Service()
export class AuthController {
  @Inject() private authService: AuthService;
  
  constructor() { }

  @Post('/register')
  async registerUser(@Body() user: IUser) {
    const tokens = await this.authService.register(user);
    debug('POST /user/register => Successfully registered!');
    return {
      jwt: tokens.accessToken,
      'refresh-token': tokens.refreshToken
    };
  }

  @Post('/login')
  async login(@Body() credentials: IUserCredentials) {
    let tokens: any;
    if (credentials.type === 'facebook') {
      tokens = await this.authService.handleFacebookLogin(credentials);
    } else {
      tokens = await this.authService.login(credentials);
    }
    debug('POST /user/login => Successfully logged in!');
    return {
      jwt: tokens.accessToken,
      'refresh-token': tokens.refreshToken
    };
  }

  @Post('/refresh')
  async refresh(@HeaderParam('refresh-token') refreshToken: string, @Body() user: IUser) {
    const newTokens: any = await this.authService.refreshTokens(refreshToken, user.id);
    debug('POST /user/refresh => New Tokens successfully created!');
    return {
      jwt: newTokens.accessToken,
      'refresh-token': newTokens.refreshToken
    };
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
