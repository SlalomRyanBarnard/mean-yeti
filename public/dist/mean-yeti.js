(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('admin.controller', ['$scope', AdminController]);

    function AdminController($scope) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.project = {
            name: '',
            startDate: '',
            endDate: '',
            tasks: [],
            tags: [],
            team: '',
            deliverables: [],
            systems: []
        };

        // Sets up a namespace to put functions
        $scope.func = {};
        var func = $scope.func;


        // Start
        activate();

        function activate() { }
    }
}(angular));
;angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', function($scope, $http, Todos) {
		$scope.formData = {};

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				$scope.todos = data;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.todos = data; // assign our new list of todos
				});
		};
	});;angular.module('mean-yeti').factory('Api', ['$http', ApiService]);

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

};angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	});