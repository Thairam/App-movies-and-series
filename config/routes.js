module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .get(app.api.user.getById)
        .patch(app.api.user.update)
        .delete(app.api.user.remove)

    app.route('/movies')
        .post(app.api.movie.save)
        .get(app.api.movie.get)

    app.route('/movies/:id')
        .get(app.api.movie.getById)
        .patch(app.api.movie.update)
        .delete(app.api.movie.remove)
}