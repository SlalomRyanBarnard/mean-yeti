angular.module('mean-yeti').factory('Api', ['$http', ApiService]);

function ApiService($http) {

    // Constants
    var apiPrefix = '/api/';
    var endpoint = {
        project: 'projects',
        resource: 'resources',
        task: 'tasks',
        team: 'teams',
        user: 'users'
    };

    // Service Definition
    var service = {
        getAll: getAll,
        getOne: getOne,
        create: create,
        remove: remove,
        update: update,
        getProjectDetails: getProjectDetails,
        endpoint: endpoint
    };

    return service;


    /**
     *
     * @param endpoint
     */
    function getAll (endpoint) {
        return $http({
            method: 'GET',
            url: apiPrefix + endpoint,
            cache: false
        });
    };

    function getProjectDetails(projectId) {
        return $http({
            method: 'GET',
            url: apiPrefix + 'projects/' + projectId + '/details',
            cache: false
        });
    };

    /**
     *
     * @param endpoint
     * @param id
     */
    function getOne (endpoint, id) {
        return $http({
            method: 'GET',
            url: apiPrefix + endpoint + '/' + id,
            cache: false
        });
    };

    /**
     *
     * @param endpoint
     * @param body
     */
    function create (endpoint, body) {
        console.log('CREATING ' + endpoint);
        console.log(body);
        return $http({
            method: 'POST',
            url: apiPrefix + endpoint,
            data: body
        });
    };

    /**
     *
     * @param endpoint
     * @param id
     */
    function remove (endpoint, id) {
        return $http({
            method: 'DELETE',
            url: apiPrefix + endpoint + '/' + id
        });
    };

    /**
     *
     * @param endpoint
     * @param id
     * @param body
     */
    function update (endpoint, id, body) {
        return $http({
            method: 'PUT',
            url: apiPrefix + endpoint + '/' + id,
            data: body
        });
    };

}