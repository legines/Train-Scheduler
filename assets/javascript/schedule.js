$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDubMuCTCmq1iCjqFUU0F0RfsWhc5mINKc",
    authDomain: "trainscheduler-07.firebaseapp.com",
    databaseURL: "https://trainscheduler-07.firebaseio.com",
    projectId: "trainscheduler-07",
    storageBucket: "",
    messagingSenderId: "554879403431"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Add train function
  $("#addTrain").on("click", function (event) {
    event.preventDefault();

    // Input text saved in variables
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    // Pushes train data onto Firebase
    database.ref().push({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency
    });
  });


  // Firebase watcher + initial loader
  database.ref().on("child_added", function (childSnapshot) {

    var newTrainName = childSnapshot.val().trainName;
    var newDestination = childSnapshot.val().destination;
    var newtrainTime = childSnapshot.val().trainTime;
    var newFrequency = childSnapshot.val().frequency;

    // First Train time captures and converted
    var startTime = moment(newtrainTime, "hh:mm").subtract(1, "years");

    // Current Time calculator
    var currentTime = moment();

    // Difference between the times
    var timeDiff = moment().diff(moment(startTime), "minutes");

    // Remainder used for Minutes Away
    var timeRemainder = timeDiff % newFrequency;

    // Minutes away calc
    var minutesAway = newFrequency - timeRemainder;

    // Next trian arrival calc
    var nextTrain = moment().add(minutesAway, "minutes");
    var nextArrival = moment(nextTrain).format("HH:mm");

    // Adds new trains and their info to page
    $("#schedule").append(
      ' <tr><td>' + newTrainName +
      ' </td><td>' + newDestination +
      ' </td><td>' + newFrequency +
      ' </td><td>' + nextArrival +
      ' </td><td>' + minutesAway + ' </td></tr>');

    // Clear all input
    $("#trainName, #destination, #trainTime, #frequency").val("");
    return false;
  },
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); 

