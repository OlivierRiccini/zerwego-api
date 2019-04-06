import { Service } from "typedi";
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

@Service()
export class AuthSocialService {

    constructor() {}

    facebookLogin() {
        passport.use('facebookAuth', new FacebookStrategy({
            clientID: '2290018351254667',
            clientSecret: 'a2fde04b194e78d424a75ad0422ffce2'
        },
        function(accessToken, refreshToken, profile, cb) {
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
}