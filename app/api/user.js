var User = require('../models/user');
var crud = require('./crud');

module.exports = function(app) {

    /**
     * GET
     */
    app.get('/api/users', function(req, res) {

        crud.findAll(User, req, res);
    });

    /**
     * GET BY ID
     */
    app.get('/api/users/:user_id', function(req, res) {

        crud.findOne(User, req.params.user_id, req, res);
    });

    /**
     * POST
     */
    app.post('/api/users', function(req, res) {

        crud.create(User, req, res);
    });

    /**
     * PUT
     */
    app.put('/api/users/:user_id', function (req, res) {

        crud.update(User, req.params.user_id, req, res);
    });

    /**
     * DELETE
     */
    app.delete('/api/users/:user_id', function(req, res) {

        crud.delete(User, req.params.user_id, req, res);
    });
};