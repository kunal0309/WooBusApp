$(document).ready(function () {
    GetUserDetails();
});

function GetUserDetails() {

    var token = sessionStorage.getItem("access_token");

    var headers = {};
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    $.ajax({
        type: 'GET',
        url: _apiBaseUrl + '/api/v1/users/protected/info',
        contentType: 'application/json',
        dataType: "json",
        headers: headers,
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

    var token = sessionstorage.getitem("access_token");

    var headers = {};
    if (token) {
        headers.authorization = 'bearer ' + token;
    }

    $.ajax({
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
                '<div class="name">' + item.FirstName + ' ' + item.LastName + '</div>' +
                '<span class="user-name">@' + item.UserName + '</span></td>' +
                '<td><a href="#"><img src="images/edit-profile-icon.png"></a></td></tr>' +
                '</table></div><div style="clear:both;"></div>'
                );
    });
}