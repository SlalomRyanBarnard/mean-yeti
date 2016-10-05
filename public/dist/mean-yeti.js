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
        vm.editingTeam = false;
        vm.editingTeamInfo = undefined;
        vm.editingResource = false;
        vm.editingResourceInfo = undefined;
        vm.editingUser = false;
        vm.editingUserInfo = undefined;
        vm.projects = [];
        vm.tasks = [];
        vm.teams = [];
        vm.resources = [];
        vm.users = [];

        vm.systems = ['BI','.com','TBB'];

        // Sets up a namespace to put functions
        $scope.func = {
            selectDataType: selectDataType,
            refreshData: refreshData,
            clearEditing: clearEditing,

            editProject: editProject,
            deleteProject: deleteProject,
            createProject: createProject,
            updateProject: updateProject,
            toggleSelectionOfSystemForProject: toggleSelectionOfSystemForProject,
            toggleSelectionOfExternalTaskForProject: toggleSelectionOfExternalTaskForProject,

            editTask: editTask,
            deleteTask: deleteTask,
            createTask: createTask,
            updateTask: updateTask,

            editTeam: editTeam,
            deleteTeam: deleteTeam,
            createTeam: createTeam,
            updateTeam: updateTeam,

            editResource: editResource,
            deleteResource: deleteResource,
            createResource: createResource,
            updateResource: updateResource,
            updateTeamAfterModifyingResource: updateTeamAfterModifyingResource,
            toggleSelectionOfTeamForResource: toggleSelectionOfTeamForResource,

            editUser: editUser,
            deleteUser: deleteUser,
            createUser: createUser,
            updateUser: updateUser,
            toggleSelectionOfProjectForUser: toggleSelectionOfProjectForUser,
        };
        var func = $scope.func;

        // Start
        activate();

        function activate() {
            func.refreshData();
        }

        function clearEditing() {
            vm.editingProject = false;
            vm.editingProjectInfo = undefined;
            vm.editingTask = false;
            vm.editingTaskInfo = undefined;
            vm.editingTeam = false;
            vm.editingTeamInfo = undefined;
            vm.editingResource = false;
            vm.editingResourceInfo = undefined;
            vm.editingUser = false;
            vm.editingUserInfo = undefined;
        }

        function refreshData() {
            clearEditing();

            api.getAll('projects').then(function(result) {
                vm.projects = result.data;
                api.getAll('tasks').then(function(result) {
                    vm.tasks = result.data;
                    api.getAll('teams').then(function(result) {
                        vm.teams = result.data;
                        api.getAll('resources').then(function(result) {
                            vm.resources = result.data;
                            api.getAll('users').then(function(result) {
                                vm.users = result.data;
                            });
                        });
                    });
                });
            });
        }

        function selectDataType(dataType) {
            func.refreshData();

            vm.showing = dataType;
        }


        function createProject() {
            vm.editingProjectInfo.deliverables = vm.editingProjectInfo.deliverables.split(',');
            vm.editingProjectInfo.tags = vm.editingProjectInfo.tags.split(',');
            api.create(api.endpoint.project, vm.editingProjectInfo).then(function() {
                vm.editingProject = false;
                func.selectDataType('projects');
            });
        }
        function updateProject() {
            console.log(vm.editingProjectInfo);
            vm.editingProjectInfo.deliverables = vm.editingProjectInfo.deliverables.split(',');
            vm.editingProjectInfo.tags = vm.editingProjectInfo.tags.split(',');
            api.update(api.endpoint.project, vm.editingProjectInfo._id, vm.editingProjectInfo).then(function() {
                vm.editingProject = false;
                func.selectDataType('projects');
            });
        }
        function editProject(project) {
            vm.editingProject = true;
            vm.editingProjectInfo = angular.copy(project);
            console.log(vm.editingProjectInfo);

            if(vm.editingProjectInfo === undefined) {
                vm.isNewItem = true;
                vm.editingProjectInfo = {
                    name: '',
                    startDate: new Date(),
                    endDate: new Date(),
                    externalTasks: [],
                    tags: [],
                    team: '',
                    deliverables: '',
                    systems: []
                };
            } else {
                if(vm.editingProjectInfo.externalTasks === undefined) {
                    vm.editingProjectInfo.externalTasks = [];
                }
                vm.editingProjectInfo.deliverables = vm.editingProjectInfo.deliverables.join(', ');
                vm.editingProjectInfo.tags = vm.editingProjectInfo.tags.join(', ');
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
        function toggleSelectionOfSystemForProject(id) {
            var idx = vm.editingProjectInfo.systems.indexOf(id);

            // is currently selected
            if (idx > -1) {
                vm.editingProjectInfo.systems.splice(idx, 1);
            }

            // is newly selected
            else {
                vm.editingProjectInfo.systems.push(id);
            }
        }
        function toggleSelectionOfExternalTaskForProject(id) {
            var idx = vm.editingProjectInfo.externalTasks.indexOf(id);

            // is currently selected
            if (idx > -1) {
                vm.editingProjectInfo.externalTasks.splice(idx, 1);
            }

            // is newly selected
            else {
                vm.editingProjectInfo.externalTasks.push(id);
            }
        }


        function createTask() {
            api.create(api.endpoint.task, vm.editingTaskInfo).then(function() {
                vm.editingTask = false;
                func.selectDataType('tasks');
            });
        }
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
                vm.editingTaskInfo = {
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


        function createTeam() {
            api.create(api.endpoint.team, vm.editingTeamInfo).then(function() {
                vm.editingTeam = false;
                func.selectDataType('teams');
            });
        }
        function updateTeam() {
            api.update(api.endpoint.team, vm.editingTeamInfo._id, vm.editingTeamInfo).then(function() {
                vm.editingTeam = false;
                func.selectDataType('teams');
            });
        }
        function editTeam(team) {
            vm.editingTeam = true;
            vm.editingTeamInfo = angular.copy(team);

            if(vm.editingTeamInfo === undefined) {
                vm.isNewItem = true;
                vm.editingTeamInfo = {
                    name: '',
                    resources: []
                };
            } else {
                vm.isNewItem = false;
            }
        }
        function deleteTeam(id) {
            api.remove('teams', id).then(function() {
                func.selectDataType('teams');
            });
        }


        function createResource() {
            vm.editingResourceInfo.skills = vm.editingResourceInfo.skills.split(',');

            api.create(api.endpoint.resource, vm.editingResourceInfo).then(function(result) {

                console.log(result.data);
                updateTeamAfterModifyingResource(result.data);

                vm.editingResource = false;
                func.selectDataType('resources');
            });
        }
        function updateResource() {
            vm.editingResourceInfo.skills = vm.editingResourceInfo.skills.split(',');

            updateTeamAfterModifyingResource(vm.editingResourceInfo);

            api.update(api.endpoint.resource, vm.editingResourceInfo._id, vm.editingResourceInfo).then(function() {
                vm.editingResource = false;
                func.selectDataType('resources');
            });
        }
        function editResource(resource) {

            vm.editingResource = true;
            vm.editingResourceInfo = angular.copy(resource);
            vm.selectedTeamsForResource = [];

            if(vm.editingResourceInfo === undefined) {
                vm.isNewItem = true;
                vm.editingResourceInfo = {
                    name: '',
                    role: '',
                    tasks: [],
                    skills: ''
                };
            } else {
                vm.editingResourceInfo.skills = vm.editingResourceInfo.skills.join(', ');
                vm.teams.forEach(function(entry) {
                    if(entry.resources.includes(resource._id)) {
                        vm.selectedTeamsForResource.push(entry._id);
                    }
                });
                vm.isNewItem = false;
            }
        }
        function deleteResource(id) {
            api.remove('resources', id).then(function() {
                func.selectDataType('resources');
            });
        }
        function updateTeamAfterModifyingResource(resource) {

            vm.teams.forEach(function(entry) {

                var index = entry.resources.indexOf(resource._id);

                if(vm.selectedTeamsForResource.includes(entry._id)) {
                    // resource requesting to be in it
                    if(index !== -1) {
                        // Found! Do nothing.
                    } else {
                        entry.resources.push(resource._id);
                        api.update(api.endpoint.team, entry._id, entry);
                    }
                } else {
                    // resource doesn't want to be in it
                    if(index !== -1) {
                        entry.resources.splice(index, 1);
                        api.update(api.endpoint.team, entry._id, entry);
                    } else {
                        // Not found! Do nothing.
                    }
                }
            });
        }
        function toggleSelectionOfTeamForResource(id) {
            var idx = vm.selectedTeamsForResource.indexOf(id);

            // is currently selected
            if (idx > -1) {
                vm.selectedTeamsForResource.splice(idx, 1);
            }

            // is newly selected
            else {
                vm.selectedTeamsForResource.push(id);
            }
        }


        function createUser() {
            api.create(api.endpoint.user, vm.editingUserInfo).then(function() {
                vm.editingUser = false;
                func.selectDataType('users');
            });
        }
        function updateUser() {
            api.update(api.endpoint.user, vm.editingUserInfo._id, vm.editingUserInfo).then(function() {
                vm.editingUser = false;
                func.selectDataType('users');
            });
        }
        function editUser(user) {
            vm.editingUser = true;
            vm.editingUserInfo = angular.copy(user);

            if(vm.editingUserInfo === undefined) {
                vm.isNewItem = true;
                vm.editingUserInfo = {
                    name: '',
                    pictureUrl: '',
                    projects: []
                };
            } else {
                vm.isNewItem = false;
            }
        }
        function deleteUser(id) {
            api.remove('users', id).then(function() {
                func.selectDataType('users');
            });
        }
        function toggleSelectionOfProjectForUser(id) {
            var idx = vm.editingUserInfo.projects.indexOf(id);

            // is currently selected
            if (idx > -1) {
                vm.editingUserInfo.projects.splice(idx, 1);
            }

            // is newly selected
            else {
                vm.editingUserInfo.projects.push(id);
            }
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