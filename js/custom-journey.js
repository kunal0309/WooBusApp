$(document).ready(function () {
    console.log("running");
    //getRouteDetails();
    setInterval(function () {
        //getRouteDetails();
    }, 30000);
});

function getRouteDetails() {
    var token = sessionStorage.getItem("access_token");
    var headers = {};
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    $.ajax({
        type: 'GET',
        url: _apiBaseUrl + '/route/currentRoute',
        dataType: "json",
        headers: headers,
        success: dataParserRoute,
        error: ServiceError
    });

    function dataParserRoute(data) {
        var journeyData= JSON.stringify(data);
        var data=JSON.parse(journeyData);
        console.log(data.start);
        $("#from").html(data.start);
        $("#to").html(data.end);
        $("#distance").html(data.distance+" Kms");
        var time_taken = moment.duration(data.time_taken, 'milliseconds').asHours;
        $("#time").html(time_taken);
        console.log(journeyData);
        sessionStorage.setItem('journey', journeyData);
        //window.location.href = "profile.html";
    }
}

$("#btnStop").click(function () {
    
});

$("#btnAccessories").click(function () {

});
