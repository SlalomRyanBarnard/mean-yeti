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
    
    var ctx1b = document.getElementById("project1ActivityChart").getContext("2d");
    new Chart(ctx1b, {type: 'radar', data: radarDataChart1, options:radarOptions});

    var ctx2 = document.getElementById("project2StatusChart").getContext("2d");
    new Chart(ctx2, {type: 'radar', data: radarDataChart2, options:radarOptions});

    var ctx3 = document.getElementById("project3StatusChart").getContext("2d");
    new Chart(ctx3, {type: 'radar', data: radarDataChart3, options:radarOptions});

    var ctx4 = document.getElementById("project4StatusChart").getContext("2d");
    new Chart(ctx4, {type: 'radar', data: radarDataChart4, options:radarOptions});


    google.charts.load('current', {'packages':['gantt']});
    //google.charts.setOnLoadCallback(drawChart);

    function daysToMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    }

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      data.addRows([
        ['BODReg2', 'BOD Reg 2', 'Yeti',
         new Date(2015, 8, 01), new Date(2015, 10, 30), null, 100, null],
        ['Project2', 'TBB User API', 'Tsunami',
         new Date(2015, 5, 21), new Date(2015, 8, 20), null, 100, null],
        ['Project3', 'Project 3', 'Mystery Machine',
         new Date(2015, 8, 21), new Date(2015, 11, 20), null, 100, null],
        ['Project4', 'Project 4', 'Devo',
         new Date(2015, 11, 21), new Date(2016, 2, 21), null, 100, null],
        ['Project5', 'Project 5', 'Finance',
         new Date(2016, 2, 22), new Date(2016, 5, 20), null, 50, null],
        ['Project6', 'Project 6', 'Finance',
         new Date(2016, 5, 21), new Date(2016, 8, 20), null, 0, null],
        ['Project7', 'Project 7', 'BI',
         new Date(2016, 8, 21), new Date(2016, 11, 20), null, 0, null],
        ['Project8', 'Project 8', 'BI',
         new Date(2016, 11, 21), new Date(2016, 2, 21), null, 0, null],
        ['Project9', 'Project 9', 'Analytics',
         new Date(2015, 8, 4), new Date(2016, 1, 1), null, 100, null]
      ]);

      var options = {
        height: 350,
        gantt: {
          trackHeight: 30
        }
      };

      var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

      chart.draw(data, options);
    }


});