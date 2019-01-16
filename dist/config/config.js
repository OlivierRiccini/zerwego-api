var config = require('./config.json');
var env = process.env.NODE_ENV || 'development';
if (env === 'development' || env === 'test') {
    console.log('Config');
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
//# sourceMappingURL=config.js.map