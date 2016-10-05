angular.module('mean-yeti', [ 'ngSanitize' ])
    .config(['$compileProvider', function ($compileProvider) {
        // disable debug info
        $compileProvider.debugInfoEnabled(false);
    }]);;(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('admin.controller', ['$scope', 'Api', AdminController]);

    function AdminController($scope, api) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.showing = '';
        vm.isNewItem = false;

        vm.editingProject = false;
        vm.editingProjectInfo = undefined;
        vm.editingTask = false;
        vm.editingTaskInfo = undefined;

        // Sets up a namespace to put functions
        $scope.func = {
            selectDataType: selectDataType,
            refreshData: refreshData,

            editProject: editProject,
            deleteProject: deleteProject,
            createProject: createProject,
            updateProject: updateProject,

            editTask: editTask,
            deleteTask: deleteTask,
            createTask: createTask,
            updateTask: updateTask,
        };
        var func = $scope.func;

        // Start
        activate();

        function activate() {
            func.refreshData();
        }

        function refreshData() {
            api.getAll('projects').then(function(result) {
                vm.projects = result.data;
                api.getAll('tasks').then(function(result) {
                    vm.tasks = result.data;
                });
            });
        }

        function selectDataType(dataType) {
            func.refreshData();

            vm.showing = dataType;
        }

        function createProject() {
            api.create(api.endpoint.project, vm.editingProjectInfo).then(function() {
                vm.editingProject = false;
                func.selectDataType('projects');
            });
        };
        function updateProject() {
            api.update(api.endpoint.project, vm.editingProjectInfo._id, vm.editingProjectInfo).then(function() {
                vm.editingProject = false;
                func.selectDataType('projects');
            });
        }
        function editProject(project) {
            vm.editingProject = true;
            vm.editingProjectInfo = angular.copy(project);

            if(vm.editingProjectInfo === undefined) {
                vm.isNewItem = true;
                vm.editingProjectInfo = {
                    name: '',
                    startDate: new Date(),
                    endDate: new Date(),
                    tasks: [],
                    tags: [],
                    team: '',
                    deliverables: [],
                    systems: []
                };
            } else {
                vm.editingProjectInfo.startDate = new Date(project.startDate);
                vm.editingProjectInfo.endDate = new Date(project.endDate);
                vm.isNewItem = false;
            }
        }
        function deleteProject(id) {
            api.remove('projects', id).then(function() {
                func.selectDataType('projects');
            });
        }


        function createTask() {
            api.create(api.endpoint.task, vm.editingTaskInfo).then(function() {
                vm.editingTask = false;
                func.selectDataType('tasks');
            });
        };
        function updateTask() {
            api.update(api.endpoint.task, vm.editingTaskInfo._id, vm.editingTaskInfo).then(function() {
                vm.editingTask = false;
                func.selectDataType('tasks');
            });
        }
        function editTask(task) {
            vm.editingTask = true;
            vm.editingTaskInfo = angular.copy(task);

            if(vm.editingTaskInfo === undefined) {
                vm.isNewItem = true;
                vm.editingProjectInfo = {
                    name: '',
                    isComplete: false,
                    project: '',
                    hourEstimate: 0,
                    hoursBurned: 0,
                    startDate: new Date(),
                    endDate: new Date()
                };
            } else {
                vm.editingTaskInfo.startDate = new Date(task.startDate);
                vm.editingTaskInfo.endDate = new Date(task.endDate);
                vm.isNewItem = false;
            }
        }
        function deleteTask(id) {
            api.remove('tasks', id).then(function() {
                func.selectDataType('tasks');
            });
        }
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