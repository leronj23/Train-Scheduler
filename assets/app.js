// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAMOqiL1peh6xlGurf3KH7yklAVP4tS1n8",
    authDomain: "train-scheduler-69c92.firebaseapp.com",
    databaseURL: "https://train-scheduler-69c92.firebaseio.com",
    projectId: "train-scheduler-69c92",
    storageBucket: "train-scheduler-69c92.appspot.com",
    messagingSenderId: "308647141372"
};
firebase.initializeApp(config);

// Set Firebase Database
var database = firebase.database();

//  Modal
$('#pupupModal').on('show.bs.modal', function (event) {

    //  Modal Title
    $(this).find('.modal-title').text('New Train Schedule')
})

$('#pupupModal').on('hidden.bs.modal', function (e) {
    $(this)
        .find("input")
        .val('')
        .end();

        $("#error").html("");
})

// Add Schedule Button
$('#addScheduleBtn').on('click', function () {

    // Grabs user input
    let trainName = $("#train-name-input").val().trim();
    let dest = $("#destination-input").val().trim();
    let firstTrainTime = $("#first-train-time-input").val().trim();
    let frequency = $("#frequency-input").val().trim();

    // Check if any fields are blank
    let array = [trainName, dest, firstTrainTime, frequency];
    function isFormFilledOut(currentValue) {
        return currentValue !== '';
    }
    if (array.every(isFormFilledOut)) {

        // Creates local "temporary" object for holding employee data
        let newTrainSchedule = {
            trainName: trainName,
            destination: dest,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        };

        // Uploads train data to the database
        database.ref().push(newTrainSchedule);

        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
    }
    else {

        $("#error").html("All fields are required!");
    }
});


// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var dest = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log("firstTimeConverted", firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainConverted = moment(nextTrain).format("hh:mma");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(dest),
        $("<td>").text(frequency),
        $("<td>").text(nextTrainConverted),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});