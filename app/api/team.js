var Team = require('../models/team');
var crud = require('./crud');

module.exports = function(app) {

    /**
     * GET
     */
    app.get('/api/teams', function(req, res) {

        crud.findAll(Team, req, res);
    });

    /**
     * GET BY ID
     */
    app.get('/api/teams/:team_id', function(req, res) {

        crud.findOne(Team, req.params.team_id, req, res);
    });

    /**
     * POST
     */
    app.post('/api/teams', function(req, res) {

        crud.create(Team, req, res);
    });

    /**
     * PUT
     */
    app.put('/api/teams/:team_id', function (req, res) {

        crud.update(Team, req.params.team_id, req, res);
    });

    /**
     * DELETE
     */
    app.delete('/api/teams/:team_id', function(req, res) {

        crud.delete(Team, req.params.team_id, req, res);
    });
};