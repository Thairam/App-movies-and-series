const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');

const userSchema =
    mongoose.Schema({
        name:
        {
            type: String,
            required: 'Nome não informado',
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: 'Email não informado',
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: 'Senha não informada'
        },
        admin: {
            type: Boolean,
            default: false
        }
    }, { versionKey: false })

userSchema.plugin(beautifyUnique)

module.exports = mongoose.model('User', userSchema)