$(document).ready(function () {
    GetUserDetails();
});

function GetUserDetails() {
    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        type: 'GET',
        url: _apiBaseUrl + '/users/protected/info',
        contentType: 'application/json',
        dataType: "json",      
        success: dataParserGetUser,
        error: ServiceError
    });

    function dataParserGetUser(data) {
        populateUserDetail(data)
    }
}

function populateUserDetail(item) {
    if (item != null && item != undefined && item != "") {
        $(".fa-phone").html(item.phonenumber);
        //$(".fa-envelope-o").html(item.email);
        //$(".fa-user").html(item.name);
    }
}

$(".journey").click(function () {
    GetJourneyDetails();
});

function GetJourneyDetails() {

    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        type: 'GET',
        url: _apiBaseUrl + '/api/v1/users/protected/state',
        contentType: 'application/json',
        dataType: "json",
        headers: headers,
        success: dataParserGetUserJourney,
        error: ServiceError
    });

    function dataParserGetUserJourney(data) {
        populateUserJourneyDetail(data)
    }
}

function populateUserJourneyDetail(data) {

    $.each(data, function (i, item) {
        $(".journey-info").html('');
        $(".journey-info").append('' +
                '<div>' +
                '<table width="100%" border="0"><tr><td>' +
                '<div class="name">' + item.phonenumber + '</div>' +
                '</td></tr>' +
                '</table></div><div style="clear:both;"></div>'
                );
    });
}