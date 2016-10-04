$(function () {

    var radarDataChart1 = {
        labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
        datasets: [
            {
                label: "",
                backgroundColor: "rgba(26,179,128,0.2)",
                borderColor: "rgba(23,152,126,1)",
                data: [20, 60, 90, 10]
            },
        ]
    };

    var radarDataChart2 = {
        labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
        datasets: [
            {
                label: "",
                backgroundColor: "rgba(26,179,128,0.2)",
                borderColor: "rgba(23,152,126,1)",
                data: [40, 10, 30, 10]
            },
        ]
    };

    var radarDataChart3 = {
        labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
        datasets: [
            {
                label: "",
                backgroundColor: "rgba(26,179,128,0.2)",
                borderColor: "rgba(23,152,126,1)",
                data: [60, 60, 10, 20]
            },
        ]
    };

    var radarDataChart4 = {
        labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
        datasets: [
            {
                label: "",
                backgroundColor: "rgba(26,179,128,0.2)",
                borderColor: "rgba(23,152,126,1)",
                data: [100, 90, 95, 0]
            },
        ]
    };



    var radarOptions = {
        responsive: true,
        legend: { display: false }
    };

    var ctx1 = document.getElementById("project1StatusChart").getContext("2d");
    new Chart(ctx1, {type: 'radar', data: radarDataChart1, options:radarOptions});

    var ctx2 = document.getElementById("project2StatusChart").getContext("2d");
    new Chart(ctx2, {type: 'radar', data: radarDataChart2, options:radarOptions});

    var ctx3 = document.getElementById("project3StatusChart").getContext("2d");
    new Chart(ctx3, {type: 'radar', data: radarDataChart3, options:radarOptions});

    var ctx4 = document.getElementById("project4StatusChart").getContext("2d");
    new Chart(ctx4, {type: 'radar', data: radarDataChart4, options:radarOptions});


    google.charts.load('current', {'packages':['gantt']});
    google.charts.setOnLoadCallback(drawChart);

    function daysToMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    }

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      data.addRows([
        ['Research', 'Find sources',
         new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
        ['Write', 'Write paper',
         null, new Date(2015, 0, 9), daysToMilliseconds(3), 25, 'Research,Outline'],
        ['Cite', 'Create bibliography',
         null, new Date(2015, 0, 7), daysToMilliseconds(1), 20, 'Research'],
        ['Complete', 'Hand in paper',
         null, new Date(2015, 0, 10), daysToMilliseconds(1), 0, 'Cite,Write'],
        ['Outline', 'Outline paper',
         null, new Date(2015, 0, 6), daysToMilliseconds(1), 100, 'Research']
      ]);

      var options = {
        height: 275
      };

      var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

      chart.draw(data, options);
    }


});