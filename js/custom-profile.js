$(document).ready(function () {
    CheckLogin();
    GetUserDetails();
});

function GetUserDetails() {   
   
    $.ajax({
        type: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        
        url: _apiBaseUrl + '/users/protected/info',
        dataType: "json",
        success: dataParserGetUserProfile,
        error: ServiceError
    });
}

function dataParserGetUserProfile(data) {
    if (data != null && data != undefined && data != "") {

        if (data.phonenumber > 0) {
            $("#journey").hide();
            $("#profile-info").show();
            $("#profile-info").html('');
            $("#profile-info").append('<li><i class="fa fa-phone" id="phoneNumber"></i>&nbsp;' + data.phonenumber + '</li>');
        }
    }
}

$("#editProfile").click(function () {
    window.location.href = "editProfile.html";
});

$("#profile").click(function () {
    GetUserDetails();
});

$("#journeyDetails").click(function () {
    GetJourneyDetails();
});

function GetJourneyDetails() {

    var searchJourneyData = {

    };

    $.ajax({
        type: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/users/protected/info',
        data: searchJourneyData,
        dataType: "json",
        success: dataParserUserJourney,
        error: ServiceError
    });
}

// Need to implement user journey method currently using same user info method 
function dataParserUserJourney(data) {
    if (data != null && data != undefined && data != "") {

        if (data.phonenumber > 0) {
            $("#profile-info").hide();
            $("#journey").show();
            $("#journey").removeClass("fade");
            $("#journey-info").html('');
            $("#journey-info").append('<li><i class="fa fa-phone"></i>&nbsp;' + data.phonenumber + '</li>');
        }
    }
}
// End //