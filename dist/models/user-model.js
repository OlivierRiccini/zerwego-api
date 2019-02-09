"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
const validator_1 = require("validator");
// const data = {
//     id: 10
// };
// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);
delete mongoose.connection.models['User'];
;
class UserDAO extends dao_1.DAOImpl {
    constructor() {
        const UserSchema = new mongoose.Schema({
            id: String,
            name: String,
            email: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                validate: {
                    validator: validator_1.default.isEmail,
                    message: '{VALUE} is not a valid email'
                }
            },
            password: {
                type: String,
                require: true,
                minlength: 6
            },
            tokens: [{
                    access: {
                        type: String,
                        required: true
                    },
                    token: {
                        type: String,
                        required: true
                    }
                }]
        });
        // UserSchema.methods.generateAuthToken = function () {
        //     const user = this;
        //     const access = 'auth';
        //     const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
        //     user.tokens.concat([{access, token}]);
        //     user.save().then(() => {
        //         return token;
        //     });
        // }
        // UserSchema.pre('save', function (next) {
        //     const user = this;
        //     if (user.isModified('password')) {
        //         bcrypt.genSalt(10, (err, salt) => {
        //                 bcrypt.hash(user.password, salt, (err, hash) => {
        //                     console.log('hash => ' + hash);
        //                 })
        //             });
        //     } else {    
        //         next();
        //     }
        // });
        super('User', UserSchema);
    }
}
exports.UserDAO = UserDAO;
//# sourceMappingURL=user-model.js.map