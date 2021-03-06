var Task = require('../models/task');
var crud = require('./crud');

module.exports = function(app) {

    /**
     * GET
     */
    app.get('/api/tasks', function(req, res) {

        crud.findAll(Task, req, res);
    });

    /**
     *
     */
    app.get('/api/tasks/project/:project_id', function(req, res) {

        Task.find({ 'project': req.params.project_id }, function(err, tasks) {

            if (err) {
                res.send(err);
            }
            res.json(tasks);
        });
    });

    /**
     * GET BY ID
     */
    app.get('/api/tasks/:task_id', function(req, res) {

        crud.findOne(Task, req.params.task_id, req, res);
    });

    /**
     * POST
     */
    app.post('/api/tasks', function(req, res) {

        crud.create(Task, req, res);
    });

    /**
     * PUT
     */
    app.put('/api/tasks/:task_id', function (req, res) {

        crud.update(Task, req.params.task_id, req, res);
    });

    /**
     * DELETE
     */
    app.delete('/api/tasks/:task_id', function(req, res) {

        crud.delete(Task, req.params.task_id, req, res);
    });
};