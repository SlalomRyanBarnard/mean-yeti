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

        vm.systems = ['BI','BB.com','TBB', 'Kibo', 'ByDesign' ,'SOA', 'OAG', 'LifeRay', 'Analytics'];
        vm.priorities = ['Low','Medium','High'];

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
            toggleSelectionOfTaskForResource: toggleSelectionOfTaskForResource,

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
                    description: '',
                    startDate: new Date(),
                    endDate: new Date(),
                    externalTasks: [],
                    tags: [],
                    team: '',
                    deliverables: '',
                    systems: [],
                    priority: 'Medium',
                    deliveryLoad: '',
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
                    note: '',
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
        function toggleSelectionOfTaskForResource(id) {
            var idx = vm.editingResourceInfo.tasks.indexOf(id);

            // is currently selected
            if (idx > -1) {
                vm.editingResourceInfo.tasks.splice(idx, 1);
            }

            // is newly selected
            else {
                vm.editingResourceInfo.tasks.push(id);
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
;(function(angular) {


    angular.module('mean-yeti').controller('index.controller', ['$scope', 'Api', '$timeout', IndexController]);

    function IndexController($scope, api, $timeout) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.projects = [];
        vm.tasks = [];
        vm.teams = [];
        vm.resources = [];
        vm.users = [];

        vm.apiCalls = 0;

        vm.notifications = [];

        vm.currentUser = undefined;
        vm.selectedProject = undefined;

        // Sets up a namespace to put functions
        $scope.func = {
            refreshData: refreshData,
            showSwitchUser: showSwitchUser,
            selectProject: selectProject,
            removeProjectFavorite: removeProjectFavorite,
            makeProjectFavorite: makeProjectFavorite,
            inPast: inPast,

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

                    vm.tasks = vm.tasks.sort(function(a,b){
                        return new Date(b.endDate) - new Date(a.endDate);
                    });


                    api.getAll('teams').then(function(result) {
                        vm.teams = result.data;
                        api.getAll('resources').then(function(result) {
                            vm.resources = result.data;
                            api.getAll('users').then(function(result) {
                                vm.users = result.data;

                                vm.projects.forEach(function(project) {
                                    vm.apiCalls++;
                                    api.getProjectDetails(project._id).then(function(result) {
                                       project.details = result.data;
                                        vm.apiCalls--;
                                    });
                                });


                                if(vm.currentUser === undefined) {
                                    vm.currentUser = vm.users[0];

                                    // Wait for a digest cycle before populating.
                                    $timeout(analyzeData, 1000);
                                }
                            });
                        });
                    });
                });
            });
        }

        function analyzeData() {
            if(vm.apiCalls > 0) {
                console.log('not done getting data...try again in a moment.');
                $timeout(analyzeData, 300);
                return;
            }

            generateNotifications();
            drawGanttChart();
            drawWatchedProjectsCharts();
        }

        function showSwitchUser(user) {
            vm.currentUser = user;
            drawWatchedProjectsCharts();
        }

        function selectProject(project) {
            vm.selectedProject = project;
            vm.selectedProject.startDate = new Date(vm.selectedProject.startDate);
            vm.selectedProject.endDate = new Date(vm.selectedProject.endDate);

            $timeout(function() {
                drawActivityChart(project);
                $('html, body').animate({
                    scrollTop: $("#projectDetails").offset().top
                }, 500);
            }, 10);
        }

        function makeProjectFavorite(id) {
            vm.currentUser.projects.push(id);
            api.update(api.endpoint.user, vm.currentUser._id, vm.currentUser).then(function(result) {
                api.getAll('resources').then(function(result1) {
                    vm.resources = result1.data;
                    vm.currentUser = result.data;

                    // Wait for a digest cycle before populating.
                    $timeout(function() {
                        drawGanttChart();
                        drawWatchedProjectsCharts();
                    }, 100);
                });
            });
        }

        function removeProjectFavorite(id) {
            var idx = vm.currentUser.projects.indexOf(id);
            vm.currentUser.projects.splice(idx, 1);
            api.update(api.endpoint.user, vm.currentUser._id, vm.currentUser).then(function(result) {
                api.getAll('resources').then(function(result1) {
                    vm.resources = result1.data;
                    vm.currentUser = result.data;

                    // Wait for a digest cycle before populating.
                    $timeout(function() {
                        drawGanttChart();
                        drawWatchedProjectsCharts();
                    }, 100);
                });
            });
        }

        function inPast(checkDate){
            var now = new Date();
            return checkDate < now ? true : false;
        }

        function drawGanttChart() {

            var ganttRows = [];

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Task ID');
            data.addColumn('string', 'Task Name');
            data.addColumn('string', 'Resource');
            data.addColumn('date', 'Start Date');
            data.addColumn('date', 'End Date');
            data.addColumn('number', 'Duration');
            data.addColumn('number', 'Percent Complete');
            data.addColumn('string', 'Dependencies');

            var sortedProjects = vm.projects.sort(function(a,b){
                return new Date(b.startDate) - new Date(a.startDate);
            });

            sortedProjects.forEach(function(project) {

                // TODO: Get this value from the backend
                var percentComplete = project.details.percentComplete;

                var teamName = '(none)';
                vm.teams.forEach(function(team) {
                   if(team._id === project.team) {
                       teamName = team.name;
                   }
                });

                if(ganttRows.length < 10) {
                    ganttRows.push([
                        project._id, project.name, teamName, new Date(project.startDate), new Date(project.endDate), null, percentComplete, null
                    ]);
                }
            });
            data.addRows(ganttRows);

            var options = {
                height: 350,
                gantt: {
                    trackHeight: 30
                }
            };

            var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

            chart.draw(data, options);
        }

        function drawWatchedProjectsCharts() {

            vm.projects.forEach(function(project) {
                var radarDataChart = {
                    labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
                    datasets: [
                        {
                            label: "",
                            backgroundColor: "rgba(26,179,128,0.2)",
                            borderColor: "rgba(23,152,126,1)",
                            data: [project.details.dependencies, project.details.timeline, project.details.tasks, project.details.complexity]
                           // data: [20, 60, 90, 10]
                        },
                    ]
                };
                var radarOptions = {
                    responsive: true,
                    legend: { display: false }
                };

                var ctx1 = document.getElementById("statusChart" + project._id).getContext("2d");
                new Chart(ctx1, {type: 'radar', data: radarDataChart, options:radarOptions});
            });
        }
        function drawActivityChart(project) {
            var radarDataChart1 = {
                labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
                datasets: [
                    {
                        label: "",
                        backgroundColor: "rgba(26,179,128,0.2)",
                        borderColor: "rgba(23,152,126,1)",
                        data: [project.details.dependencies, project.details.timeline, project.details.tasks, project.details.complexity]
                    },
                ]
            };

            var radarOptions = {
                responsive: true,
                legend: { display: false }
            };

            var ctx1b = document.getElementById("ActivityChartProjectDetails").getContext("2d");
            new Chart(ctx1b, {type: 'radar', data: radarDataChart1, options:radarOptions});
        }

        function generateNotifications() {

            var notificationLevelGood = 4;
            var notificationLevelError = 3;
            var notificationLevelWarning = 2;
            var notificationLevelInfo = 1;

            // Find projects that are almost complete.
            vm.projects.forEach(function(project) {

                var hoursToEnd = (new Date(project.endDate) - new Date()) / (1000 * 60 * 60);
                if(hoursToEnd >= 0 && hoursToEnd < (24*4)) {
                    vm.notifications.push({
                        level: notificationLevelGood,
                        text: 'Project ' + project.name + ' will end in ' + Math.round(hoursToEnd) + ' hours.'});
                }
            })

            // Find projects that are overdue.
            vm.projects.forEach(function (project) {
                if((new Date(project.endDate) - new Date()) < 0) {
                    if(project.details.percentComplete < 100) {
                        vm.notifications.push({
                            level: notificationLevelError,
                            text: 'Project ' + project.name + ' is past due.'});
                    }
                }
            });

            // Find projects with overdue tasks.
            vm.projects.forEach(function (project) {
                var projectOverdueTasks = 0;
                vm.tasks.forEach(function(task) {
                    if(task.project !== project._id) return;

                    if((new Date(task.endDate) - new Date()) < 0) {
                        projectOverdueTasks++;
                    }
                })
                if(projectOverdueTasks > 0) {
                    vm.notifications.push({
                        level: notificationLevelWarning,
                        text: 'Project ' + project.name + ' has ' + projectOverdueTasks + ' task' + (projectOverdueTasks > 1 ? 's' : '')  + ' that ' + (projectOverdueTasks > 1 ? 'are' : 'is')  + ' past due.'});
                }
            });

            // Find resources who are double-booked.
            vm.resources.forEach(function(resource) {

                // Get their team
                var teamName = '';
                vm.teams.forEach(function(team) {
                    if(team.resources.indexOf(resource._id) !== -1) {
                        teamName = team.name;
                    }
                });

                var overbooked = false;

                vm.tasks.forEach(function(task) {
                    if(resource.tasks.indexOf(task._id) === -1) return;
                    if(task.isComplete === true) return;

                    var checkDate1 = new Date(task.startDate);
                    var checkDate2 = new Date(task.endDate);

                    // Check it...
                    vm.tasks.forEach(function(checkTask) {
                        if(resource.tasks.indexOf(checkTask._id) === -1) return;
                        if(checkTask.isComplete === true) return;
                        if(checkTask._id === task._id) return;

                        if(checkDate1 > new Date(checkTask.startDate) && checkDate1 < new Date(checkTask.endDate)) {
                            overbooked = true;
                        }
                        if(checkDate2 > new Date(checkTask.startDate) && checkDate2 < new Date(checkTask.endDate)) {
                            overbooked = true;
                        }
                    });
                });

                if(overbooked === true) {
                    vm.notifications.push({level: notificationLevelInfo, text: teamName + ' resource ' + resource.name + ' is over capacity.'});
                }
            });

            vm.notifications = vm.notifications.slice(0, 10);
        }

        function numHoursBetween(d1, d2) {
            var diff = d1.getTime() - d2.getTime();
            return diff / (1000 * 60 * 60);
        };
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
	});;angular.module('mean-yeti').filter('findFavorites', function() {
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
;angular.module('mean-yeti').filter('findTeamMembers', function() {
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
;angular.module('mean-yeti').filter('firstWord', function() {
    return function(str) {

        if(str === undefined) {
            return '';
        }

        return str.split(' ')[0];
    };
});
;angular.module('mean-yeti').filter('getExternalTasks', function() {
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
;angular.module('mean-yeti').filter('worksOnTask', function() {
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
;angular.module('mean-yeti').factory('Api', ['$http', ApiService]);

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