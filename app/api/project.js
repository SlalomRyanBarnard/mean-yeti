var Project = require('../models/project');
var crud    = require('./crud');

module.exports = function(app) {

    /**
     * GET
     */
    app.get('/api/projects', function(req, res) {

        crud.findAll(Project, req, res);
    });

    /**
     * GET BY ID
     */
    app.get('/api/projects/:project_id', function(req, res) {

        crud.findOne(Project, req.params.project_id, req, res);
    });

    /**
     * POST
     */
    app.post('/api/projects', function(req, res) {

       crud.create(Project, req, res);
    });

    /**
     * PUT
     */
    app.put('/api/projects/:project_id', function (req, res) {

        crud.update(Project, req.params.project_id, req, res);
    });

    /**
     * DELETE
     */
    app.delete('/api/projects/:project_id', function(req, res) {

        crud.delete(Project, req.params.project_id, req, res);
    });
};