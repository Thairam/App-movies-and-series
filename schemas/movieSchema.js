const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');

const movieSchema =
    mongoose.Schema({
        title: {
            type: String,
            unique: true,
            required: 'Título não informado',
            trim: true
        },
        genre: {
            type: Array,
            required: 'Gênero não informado',
            trim: true
        },
        note: {
            type: String,
            trim: true
        },
        imageUrl: {
            type: String,
            trim: true
        },
        score: {
            type: Number,
            min: 0,
            max: 10,
            required: 'Pontuação não informada'
        }
    }, { versionKey: false })

movieSchema.plugin(beautifyUnique)

module.exports = mongoose.model('Movie', movieSchema)