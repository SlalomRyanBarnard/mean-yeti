var Project = require('../models/project');
var Task = require('../models/task');

var crud    = require('./crud');

function getPercentComplete() {
    return 66;
}

/**
 *
 * @param startDate
 * @param endDate
 * @returns {number}
 */
function getTimeline(project) {

    var today = new Date();
    var startDate = project.startDate;
    var endDate   = project.endDate;

    if (!startDate || !endDate || today < startDate) {
        return 0;
    }

    var totalDays   = Math.round((endDate - startDate) / (1000*60*60*24));
    var daysPassed  = Math.round((today - startDate) / (1000*60*60*24));

    if (totalDays === 0) {
        return 100;
    }

    return (daysPassed / totalDays) * 100;
};

/**
 *
 */
function getDependencies(project) {
    return 50;
};

/**
 *
 * @param project
 */
function getComplexity(project) {

    return ((project.systems.length / 7) + (project.externalTasks.length / 10)) * 50;
};

/**
 *
 * @param tasks
 */
function getTasks(tasks) {
    return 75;
};

module.exports = function(app) {

    /**
     * GET
     */
    app.get('/api/projects', function(req, res) {

        crud.findAll(Project, req, res);
    });

    /**
     * TODO fill details to populate
     */
    app.get('/api/projects/:project_id/details', function (req, res) {

        Project.findOne({ '_id' : req.params.project_id }, function (err, project) {

            if (err) {
                res.send(err);
            }
            Task.find({ 'project' : req.params.project_id}, function (err, tasks) {
                console.log('finding tasks');

                if (err) {
                    res.send(err);
                }
                var quadrants = {
                    complexity: getComplexity(project),
                    tasks: getTasks(),
                    dependencies: getDependencies(),
                    timeline: getTimeline(project),
                    percentComplete: getPercentComplete()
                };

                res.json(quadrants);
            });
        });

    });

    /**
     * TODO fill details to populate
     */
    app.get('/api/projects/details', function (req, res) {

        crud.findWithDetails(Project, '', req, res)
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