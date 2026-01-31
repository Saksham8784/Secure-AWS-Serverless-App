var API_ENDPOINT = "https://0cd6l809mi.execute-api.us-east-1.amazonaws.com/prod";

// POST
document.getElementById("savestudent").onclick = function () {
    var inputData = {
        "studentID": $('#studentid').val(),
        "name": $('#name').val(),
        "class": $('#class').val(),
        "age": $('#age').val()
    };

    $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data: JSON.stringify(inputData),
        contentType: 'application/json; charset=utf-8',
        success: function () {
            document.getElementById("studentSaved").innerHTML = "Student Data Saved!";
        },
        error: function () {
            alert("Error saving student data.");
        }
    });
};

// GET
document.getElementById("getstudents").onclick = function () {
    $.ajax({
        url: API_ENDPOINT,
        type: 'GET',
        success: function (response) {

            console.log("RAW RESPONSE:", response);

            var students = response.body ? JSON.parse(response.body) : response;

            $('#studentTable tr').slice(1).remove();

            $.each(students, function (i, data) {
                $("#studentTable").append(
                    "<tr>" +
                    "<td>" + data.studentID + "</td>" +
                    "<td>" + data.name + "</td>" +
                    "<td>" + data.class + "</td>" +
                    "<td>" + data.age + "</td>" +
                    "</tr>"
                );
            });
        },
        error: function () {
            alert("Error retrieving student data.");
        }
    });
};
