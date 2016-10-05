angular.module('mean-yeti').filter('findTeamMembers', function() {
    return function(resources, teams, teamId) {

        if(teamId === undefined) {
            return [];
        }

        if(teams === undefined) {
            return [];
        }

        // Find the team
        var team = undefined;
        teams.forEach(function(t) {
            if(t._id === teamId) {
                team = t;
            }
        });

        return resources.filter(function(resource) {

            // Is this resource on that team?
            if(team.resources.indexOf(resource._id) !== -1) {
                return true;
            }
            return false;
        });
    };
});
