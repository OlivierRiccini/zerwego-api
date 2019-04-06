"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
let AuthSocialService = class AuthSocialService {
    constructor() { }
    facebookLogin() {
        passport.use('facebookAuth', new FacebookStrategy({
            clientID: '2290018351254667',
            clientSecret: 'a2fde04b194e78d424a75ad0422ffce2'
        }, function (accessToken, refreshToken, profile, cb) {
            console.log('accessToken ' + accessToken);
            console.log('refreshToken ' + refreshToken);
            console.log('profile ' + profile);
            // console.log('cb ' + cb);
            // In this example, the user's Facebook profile is supplied as the user
            // record. In a production-quality application, the Facebook profile should
            // be associated with a user record in the application's database, which
            // allows for account linking and authentication with other identity
            // providers.
            return cb(null, profile);
        }));
    }
};
AuthSocialService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AuthSocialService);
exports.AuthSocialService = AuthSocialService;
//# sourceMappingURL=auth-social.service.js.map