"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = require("./setup/express-config");
const port = process.env.PORT || 3000;
express_config_1.default.listen(port, function () {
    console.log('Express server listening on port ' + port);
});
//# sourceMappingURL=index.js.map