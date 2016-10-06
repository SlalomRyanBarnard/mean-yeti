angular.module('mean-yeti').filter('getExternalTasks', function() {
    return function(resources, taskId) {

        if(resources === undefined) {
            return [];
        }

        if(taskId === undefined) {
            return [];
        }

        return resources.filter(function(resource) {

            if(resource.tasks === undefined) return false;

            if(resource.tasks.indexOf(taskId) === -1) {
                return false;
            }
            return true;
        });
    };
});
