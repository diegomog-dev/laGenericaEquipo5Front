const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    usuario: {type: String, required: true},
    password: {type: String, required: true},
    date: { type: Date, default: Date.now}
});

const dbUserLaGenerica = mongoose.connection.useDb('dbUserLaGenerica');

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}

UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

const UserInfo = dbUserLaGenerica.model('User', UserSchema)

module.exports = UserInfo;