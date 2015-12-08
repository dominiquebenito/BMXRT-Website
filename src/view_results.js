
/* Author: Dominique Benito
 * Date: November 05, 2015
 * Note: Graphs that Display Results
 */

var APPLICATION_ID = "hSwI4WHttYwUvux9ArkLXrWg3owoH5GXWLBJlCIy";
var SECRET_KEY = "mHmGDEW42xYFcCoZld9X9EZOVR4VH91JbkQonkTl";

Parse.initialize(APPLICATION_ID, SECRET_KEY);

// Load the Visualization API and the chart packages.
google.load('visualization', '1', {'packages':["corechart"]});

var maxResults = 5;

var username = sessionStorage.getItem('user');
google.setOnLoadCallback(loadGraphs);

function loadGraphs() {
  var completionAll = [];
  var reactionAll = [];
  var bpmAll = [];
  var heartRateAll = [];
  var completionBest = [];
  var reactionBest = [];
  var bpmBest = [];
  var heartRateBest = [];
  var completionRecent = [];
  var reactionRecent = [];
  var bpmRecent = []; 
  var heartRateRecent = [];

  var newUser = 0;
  var currentUser = Parse.Object.extend(username);
  var query = new Parse.Query(currentUser);
  query.greaterThan("completionTime", 0);

  query.find().then(
    function(results) {
      if (results.length == 0)
        newUser = -1;
    }
  ).then(
      function(results) {
        var query = new Parse.Query(currentUser);
        query.greaterThan("completionTime", newUser);
        query.descending("createdAt");
        query.find().then(
          function(results) {
            completionAll.push(['Date', 'Run']);
            reactionAll.push(['Date', 'Run']);
            bpmAll.push(['Date', 'Run']);
            heartRateAll.push(['Date']);

            for (var i = 0; i < 1000; i++)
              heartRateAll.push([i*50]); 

            completionRecent.push(['Date', 'Run']);
            reactionRecent.push(['Date', 'Run']);
            bpmRecent.push(['Date', 'Run']);

            for (var i = 0; i < results.length; i++) { 
              if (i == maxResults)
                break;
              
              completionAll.push([results[i].get("createdAt").toString(), results[i].get("completionTime")]);
              reactionAll.push([results[i].get("createdAt").toString(), results[i].get("reactionTime")]);
              bpmAll.push([results[i].get("createdAt").toString(), results[i].get("bpm")]);

              heartRateAll[0].push("Run " + (i + 1));
              for (var j = 0; j < 1000; j++)
                if (j < results[i].get("heartRate").length) 
                  heartRateAll[j+1].push(results[i].get("heartRate")[j]);
                else
                  heartRateAll[j+1].push(null);

              if (i == 0) {
                completionRecent.push([results[i].get("createdAt").toString(), results[i].get("completionTime")]);
                reactionRecent.push([results[i].get("createdAt").toString(), results[i].get("reactionTime")]);
                bpmRecent.push([results[i].get("createdAt").toString(), results[i].get("bpm")]);

                heartRateRecent.push(['Time', 'Pulse']);
                for (var j = 0; j < results[i].get("heartRate").length; j++)
                    if (j == 1000)
                      break;
                    else
                      heartRateRecent.push([j*10, results[i].get("heartRate")[j]]);
              }
            }
          }
        ).then(
          function() {
            drawGraphs("completion_all", "heart_all", "bpm_all", "reaction_all", completionAll, reactionAll, bpmAll, heartRateAll);
            drawGraphs("completion_recent", "heart_recent", "bpm_recent", "reaction_recent", completionRecent, reactionRecent, bpmRecent, heartRateRecent);
          }
        ).then(
          function() {
            var query = new Parse.Query(currentUser);
            query.greaterThan("completionTime", newUser);
            query.ascending("completionTime");
            query.first().then(
              function(results) {
                completionBest.push(['Date', 'Run']);
                completionBest.push([results.get("createdAt").toString(), results.get("completionTime")]);
              }
            ).then(
              function() {
                var query = new Parse.Query(currentUser);
                query.greaterThan("reactionTime", newUser);
                query.ascending("reactionTime");
                query.first().then(
                  function(results) {
                    reactionBest.push(['Date', 'Run']);
                    reactionBest.push([results.get("createdAt").toString(), results.get("reactionTime")]);
                  }
                ).then(
                  function() {
                    var query = new Parse.Query(currentUser);
                    query.greaterThan("bpm", newUser);
                    query.ascending("bpm");
                    query.first().then(
                      function(results) {
                        bpmBest.push(['Date', 'Run']);
                        bpmBest.push([results.get("createdAt").toString(), results.get("bpm")]);

                        heartRateBest.push(['Time', 'Pulse']);
                        for (var i = 0; i < results.get("heartRate").length; i++)
                          heartRateBest.push([i*50, results.get("heartRate")[i]]);
                      }
                    ).then(
                      function() {
                        drawGraphs("completion_best", "heart_best", "bpm_best", "reaction_best", completionBest, reactionBest, bpmBest, heartRateBest);
                      }
                    )
                  }
                )
              } 
            )
          }
        )
      }
    );
}

// Draws the graphs
function drawGraphs(comp, hr, bpm, reaction, completionData, reactionData, bpmData, heartRateData) {
  // Create the data table for completion time.
  var compTime = google.visualization.arrayToDataTable(completionData);
  var viewct = new google.visualization.DataView(compTime);
  var ctOption = {width:1000, height: 500, bars: 'vertical', legend: { position: "none" }};
  var compTimeChart = new google.visualization.BarChart(document.getElementById(comp));
  compTimeChart.draw(viewct, ctOption);    


  // Create the data table for heart rate.
  var heartRate = google.visualization.arrayToDataTable(heartRateData);
  var hrOption = {width:1000, height: 500, curveType: 'function', legend: { position: 'bottom' }}
  var heartRateChart = new google.visualization.LineChart(document.getElementById(hr));
  heartRateChart.draw(heartRate, hrOption);


  // Create the data table for bpm time.
  var bpmGraph = google.visualization.arrayToDataTable(bpmData);
  var viewbpm = new google.visualization.DataView(bpmGraph);
  var bpmOption = {width:1000, height: 500, bars: 'vertical', legend: { position: "none" }};
  var bpmChart = new google.visualization.BarChart(document.getElementById(bpm));
  bpmChart.draw(viewbpm, bpmOption);


  // Create the data table for reaction time.
  var reactTime = google.visualization.arrayToDataTable(reactionData);
  var viewrt = new google.visualization.DataView(reactTime);
  var rtOption = {width:1000, height: 500, bars: 'vertical', legend: { position: "none" }};
  var reactTimeChart = new google.visualization.BarChart(document.getElementById(reaction));
  reactTimeChart.draw(viewrt, rtOption);
}

function logout() {
  var currentUser = Parse.User.current();
  if (currentUser) {
      Parse.User.logOut();
      location.href ="index.html"
  }
  else {
    console.log("no current user logged in");
  } 
}

function saveThresholds() 
{
  var Thresholds = Parse.Object.extend("thresholds");
  var usersThresholds = new Thresholds();

  usersThresholds.set("username", username);
  usersThresholds.set("completionTime", parseFloat(document.getElementById("ctt").value) );
  usersThresholds.set("reactionTime", parseFloat(document.getElementById("ctt").value) );
  usersThresholds.set("bpm", parseInt(document.getElementById("ctt").value) );

  usersThresholds.save(null, {
    success: function(gameScore) {
      alert('Thresholds saved!');
    },
    error: function(gameScore, error) {
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}