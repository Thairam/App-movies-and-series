const Movie = require('../schemas/movieSchema')

module.exports = app => {

    const save = (req, res) => {
        const newMovie = new Movie({ ...req.body })
        newMovie.save()
            .then(movieSaved => res.status(201).send(organizeFields(movieSaved)))
            .catch(err => res.status(400).send(mongoDBErrorListener(err)))
    }

    const update = (req, res) => {
        const movie = {
            _id: req.params.id,
            title: req.body.title,
            genre: req.body.genre,
            note: req.body.note,
            imageUrl: req.body.imageUrl,
            score: req.body.score
        }

        Movie.updateOne({ _id: req.params.id }, movie, { runValidators: true })
            .then(_ => res.status(204).send({}))
            .catch(err => res.status(400).send(mongoDBErrorListener(err)))
    }

    const getById = (req, res) => {
        Movie.findOne({ _id: req.params.id })
            .then(movie => res.status(200).json(movie ? organizeFields(movie) : next()))
            .catch(_ => res.status(404).send('Filme/Série não encontrado!'))
    }

    const get = (req, res) => {
        Movie.find({ $or: [{ genre: req.query.genre }, { title: req.query.title }] })
            .then(movies => res.status(200).json(movies))
            .catch(_ => res.status(404).send('Filme/Série não encontrado!'))
    }

    const remove = (req, res) => {
        Movie.deleteOne({ _id: req.params.id })
            .then(_ => res.status(204).send({}))
            .catch(err => res.status(500).send(err))
    }

    function mongoDBErrorListener(err) {
        const msg = err.message
        const errors = []

        if (msg.includes('title')) errors.push(err.errors.title.properties.message)
        if (msg.includes('genre')) errors.push(err.errors.genre.properties.message)
        if (msg.includes('score')) {
            if (err.errors.score.properties.value) {
                errors.push('Pontuação inválida!')
            } else {
                errors.push('Pontuação não informada!')
            }
        }
        if (msg === 'Validation failed') errors.push('Título já cadastrado!')

        return errors
    }

    function organizeFields(movie) {
        const obj = {
            id: movie._id,
            title: movie.title,
            genre: movie.genre,
            note: movie.note,
            imageUrl: movie.imageUrl,
            score: movie.score
        }

        return obj
    }

    return { save, update, getById, get, remove }
}