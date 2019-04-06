// import { ExpressMiddlewareInterface } from "routing-controllers";
// import { Service } from "typedi";
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

// @Service()
// export class AuthFacebook implements ExpressMiddlewareInterface {
    
//     constructor() {} 

//     use(request: any, response: any, next: (err?: any) => Promise<any>) {
//         new FacebookStrategy({
//             clientID: '2290018351254667',
//             clientSecret: 'a2fde04b194e78d424a75ad0422ffce2'
//         }, async (accessToken, refreshToken, profile, done) => {
//                 console.log('accessToken ' + accessToken);
//                 console.log('refreshToken ' + refreshToken);
//                 console.log('profile ' + profile);
//                 // next();
//                 done(null, profile);
//             // return profile;
//             // response(accessToken);
//             // console.log('cb ' + cb);
//             // In this example, the user's Facebook profile is supplied as the user
//             // record. In a production-quality application, the Facebook profile should
//             // be associated with a user record in the application's database, which
//             // allows for account linking and authentication with other identity
//             // providers.
//         });
//         next();
//     }
// }
// passport.use('facebook', new FacebookStrategy({
//     clientID: '2290018351254667',
//     clientSecret: 'a2fde04b194e78d424a75ad0422ffce2'
// }, async (accessToken, refreshToken, profile, done) => {
//         console.log('accessToken ' + accessToken);
//         console.log('refreshToken ' + refreshToken);
//         console.log('profile ' + profile);
//         // next();
//         done(null, profile);
//     // return profile;
//     // response(accessToken);
//     // console.log('cb ' + cb);
//     // In this example, the user's Facebook profile is supplied as the user
//     // record. In a production-quality application, the Facebook profile should
//     // be associated with a user record in the application's database, which
//     // allows for account linking and authentication with other identity
//     // providers.
// }));
