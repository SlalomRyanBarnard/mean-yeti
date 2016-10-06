angular.module('mean-yeti').filter('worksOnTask', function() {
    return function(resources, taskId) {

        if(resources === undefined) {
            return [];
        }

        if(taskId === undefined) {
            return [];
        }

        console.log(taskId);
        return resources.filter(function(resource) {
console.log(resource);
            if(resource.tasks === undefined) return false;

            if(resource.tasks.indexOf(taskId) === -1) {
                return false;
            }
            return true;
        });
    };
});
