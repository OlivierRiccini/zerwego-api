// import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "@tsed/common";
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const compress = require('compression');
// const methodOverride = require('method-override');
// const rootDir = __dirname;
// @ServerSettings({
//     rootDir,
//     mount: {
//     '/rest': `${rootDir}/controllers/*.js`
//     },
//     mongoose: {
//     url: "mongodb://127.0.0.1:27017/zerwego-api",
//         connectionOptions: {
//         }
//     },
//     acceptMimes: ["application/json"]
// })
// export class Server extends ServerLoader {
//   /**
//    * This method let you configure the express middleware required by your application to works.
//    * @returns {Server}
//    */
//   public $onMountingMiddlewares(): void|Promise<any> {
//       this
//         .use(GlobalAcceptMimesMiddleware)
//         .use(cookieParser())
//         .use(compress({}))
//         .use(methodOverride())
//         .use(bodyParser.json())
//         .use(bodyParser.urlencoded({
//           extended: true
//         }));
//       return null;
//   }
//   public $onReady(){
//       console.log('Server started...');
//   }
//   public $onServerInitError(err){
//       console.error(err);
//   }
// }
// new Server().start();
//# sourceMappingURL=server.js.map