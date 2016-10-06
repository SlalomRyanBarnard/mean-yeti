angular.module('mean-yeti').filter('getExternalTasks', function() {
    return function(tasks, project) {

        console.log('aa');
        console.log(tasks);
        console.log(project);
        console.log('bb');
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
            console.log('found task');
            return true;
        });
    };
});
