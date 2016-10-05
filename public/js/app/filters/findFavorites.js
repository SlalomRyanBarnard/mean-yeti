angular.module('mean-yeti').filter('findFavorites', function() {
    return function(projects, favorites) {

        if(favorites === undefined) {
            return [];
        }

        return projects.filter(function(project) {
            if(favorites.indexOf(project._id) !== -1) {
                return true;
            }
            return false;
        });
    };
});
