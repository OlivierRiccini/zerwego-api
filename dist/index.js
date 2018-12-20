"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const debug = require("debug");
const mongoose_config_1 = require("./setup/mongoose-config");
const express_config_1 = require("./setup/express-config");
debug('ts-express:server');
const port = normalizePort(process.env.PORT || 3000);
express_config_1.default.set('port', port);
const server = http.createServer(express_config_1.default);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
mongoose_config_1.default.connect();
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
    console.log(`Listening on ${bind}`);
}
//# sourceMappingURL=index.js.map