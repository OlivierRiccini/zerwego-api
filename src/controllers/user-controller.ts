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

  @Post('/signUp')
  async signUp(@Body() user: IUser, @Res() response: any) {
    const userResponse: IUserResponse = await this.userService.signUp(user);
    const token = userResponse.token;
    response.header('x-auth', token);
    debug('POST /user/signUp => ' + JSON.stringify(userResponse.propToSend));
    return userResponse.propToSend;
  }

  @Get('/me')
  @UseBefore(Authenticate)
  async getUser() {
    debug('Meeeeeeee');
    return 'WAOUuuuuuu';
  }

  @Post('/signIn')
  async signIn(@Body() credentials: IUserCredentials, @Res() response: any) {
    const userResponse: IUserResponse = await this.userService.signIn(credentials);
    const token = userResponse.token;
    response.header('x-auth', token);
    debug('POST /user/signIn => ' + JSON.stringify(userResponse.propToSend));
    return userResponse.propToSend;
  }

  @Delete('/signOut')
  async signOut(@Req() request: any) {
    debug('POST /user/signOut => User signing out...');
    const token: string = request.headers['x-auth'];
    await this.userService.signOut(token);
    debug('POST /user/signOut => User disconected');
    return 'Disconnected!';
  }

 
}