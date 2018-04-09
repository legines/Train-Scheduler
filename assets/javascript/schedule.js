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

    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency
    });
  });


  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function (childSnapshot) {

    var newTrainName = childSnapshot.val().trainName;
    var newDestination = childSnapshot.val().destination;
    var newtrainTime = childSnapshot.val().trainTime;
    var newFrequency = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(newtrainTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % newFrequency;

    // Minute(s) Until Train
    var tMinutesTillTrain = newFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $("#all-display").append(
      ' <tr><td>' + newTrainName +
      ' </td><td>' + newDestination +
      ' </td><td>' + newFrequency +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear input fields
    $("#trainName, #destination, #trainTime, #frequency").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); 

