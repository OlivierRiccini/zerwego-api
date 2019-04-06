const debug = require('debug')('http');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
import {JsonController, Body, Post, Res, Delete, Param, UseBefore} from "routing-controllers";
import { IUser, IUserCredentials } from "../models/user-model";
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
    console.log(credentials);
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

  @UseBefore(passport.authenticate('facebook', {session: false}))
  @Post('/facebook')
  facebookLogin() {
    // await this.authSocialService.facebookLogin();
    debug('POST /auth/facebook => Successfully facebookLogin!');
    return 'Zeubi trop fort!';
  }

  @Delete('/logout/:token')
  async logout(@Param('token') token: string) {
    await this.authService.logout(token);
    debug('POST /user/out => Successfully logged out!');
    return 'Successfully logged out!';
  }
 
}

passport.use('facebook', new FacebookStrategy({
  clientID: '2290018351254667',
  clientSecret: 'a2fde04b194e78d424a75ad0422ffce2'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken ' + accessToken);
    console.log('refreshToken ' + refreshToken);
    console.log('profile ' + profile);
  } catch (err) {
    console.log('ERROR: ' + err)
    done(err, false, err.message);
  }
      // next();
  // return profile;
  // response(accessToken);
  // console.log('cb ' + cb);
  // In this example, the user's Facebook profile is supplied as the user
  // record. In a production-quality application, the Facebook profile should
  // be associated with a user record in the application's database, which
  // allows for account linking and authentication with other identity
  // providers.
}));