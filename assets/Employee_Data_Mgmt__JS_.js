$(document).ready(function() {

  // Initialize Firebase

  var config = {
	// Update Me
  };

  firebase.initializeApp(config);

  // Create a variable to reference the database

  var database = firebase.database();


  var name = "";
  var role = "";
  var startDate = "";
  var monthlyRate = "";

  var employeeList = [];

  $("#newEmployeeForm").on('submit', function(event) {
    event.preventDefault();
    // Grabbed values from text boxes
    name = $("#nameInput").val().trim();
    role = $("#roleInput").val().trim();
    startDate = moment($("#startDateInput").val().trim()).format();
    monthlyRate = $("#monthlyRateInput").val().trim();

    if (startDate === "Invalid date") {
      alert("Invalid date! Please try again.");
    } else {
        database.ref().push({
        name: name,
        role: role,
        startDate: startDate,
        monthlyRate: monthlyRate,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      // Grabbed values from text boxes
      $("#nameInput").val("");
      $("#roleInput").val("");
      $("#startDateInput").val("");
      $("#monthlyRateInput").val("");

      name = "";
      role = "";
      startDate = "";
      monthlyRate = "";
    }

  });

  database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    if (employeeList.length > 0) {
      console.log("New employee added: " + snapshot.val());
    };

  }, function(err) {
    console.log(err);
  });


  database.ref().once('value', function(snapshot) {
    employeeData = snapshot.val();
    $.each(employeeData, function( index,value) {
      employeeList.push(employeeData[index]);
      var employee = employeeData[index];
      var monthsWorked = moment().diff(moment(employee.startDate), 'months');
      var totalBilled = monthsWorked * employee.monthlyRate;
      var newRow = $(
        "<tr><td>" + 
        employee.name + 
        "</td><td>" +
        employee.role +
        "</td><td>" +
        employee.startDate +
        "</td><td>" +
        monthsWorked +
        "</td><td>" +
        employee.monthlyRate +
        "</td><td>" +
        totalBilled +
        "</td></tr>");
      $("#employeeTbl").append(newRow);
    });
  }, function(err) {
    console.log(err);
  });

});
