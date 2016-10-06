angular.module('mean-yeti').filter('getExternalTasks', function() {
    return function(tasks, project) {

        if(tasks === undefined) {
            return [];
        }

        if(project === undefined) {
            return [];
        }

        return tasks.filter(function(task) {

            if(project.externalTasks.indexOf(task._id) === -1) {
                return false;
            }
            return true;
        });
    };
});
