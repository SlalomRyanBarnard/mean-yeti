var Resource = require('../models/resource');
var crud     = require('./crud');

module.exports = function(app) {

    /**
     * GET
     */
    app.get('/api/resources', function(req, res) {

       crud.findAll(Resource, req, res);
    });

    /**
     * GET BY ID
     */
    app.get('/api/resources/:resource_id', function(req, res) {

       crud.findOne(Resource, req.params.resource_id, req, res);
    });

    /**
     * POST
     */
    app.post('/api/resources', function(req, res) {

        crud.create(Resource, req, res);
    });

    /**
     * PUT
     */
    app.put('/api/resources/:resource_id', function (req, res) {

        crud.update(Resource, req.params.resource_id, req, res);
    });

    /**
     * DELETE
     */
    app.delete('/api/resources/:resource_id', function(req, res) {

        crud.delete(Resource, req.params.resource_id, req, res);
    });
};