const User = require('../schemas/userSchema')

module.exports = app => {

    const save = (req, res) => {
        const newUser = new User({ ...req.body })
        newUser.save()
            .then(userSaved => res.status(201).send(organizeFields(userSaved)))
            .catch(err => res.status(400).send(mongoDBErrorListener(err)))
    }

    const update = (req, res) => {
        const user = {
            _id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin
        }

        User.updateOne({ _id: req.params.id }, user, { runValidators: true })
            .then(_ => res.status(204).send({}))
            .catch(err => res.status(400).send(mongoDBErrorListener(err)))
    }

    const get = (req, res) => {
        const limit = parseInt(req.query.limit) || 5
        const page = parseInt(req.query.page) || 0

        User.find()
            .limit(limit)
            .skip((page <= 0 ? 0 : page - 1) * limit)
            .then(users => {
                const newUsers = users.map(user => organizeFields(user))
                res.status(200).json(newUsers)
            })
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {
        User.findOne({ _id: req.params.id })
            .then(user => res.status(200).json(user ? organizeFields(user) : next()))
            .catch(_ => res.status(404).send('Usuário não encontrado'))
    }

    function mongoDBErrorListener(err) {
        const msg = err.message
        const errors = []
        if (msg.includes('name')) errors.push(err.errors.name.properties.message)
        if (msg.includes('email')) errors.push(err.errors.email.properties.message)
        if (msg.includes('password')) errors.push(err.errors.password.properties.message)
        if (msg === 'Validation failed') errors.push('Email já cadastrado')

        return errors
    }

    function organizeFields(user) {
        const obj = {
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            admin: user.admin
        }

        return obj
    }

    return { save, update, get, getById }
}