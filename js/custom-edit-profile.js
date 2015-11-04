var email = "", password = "", phonenumber = ""

$(document).ready(function () {
    CheckLogin();
    GetUserProfileDetails();
    $("#editProfile").show();    
});

function GetUserProfileDetails() {

    var userData = {
    };

    $.ajax({
        type: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/users/protected/info',
        data: userData,
        dataType: "json",
        success: dataParserGetUserProfile,
        error: ServiceError
    });

    function dataParserGetUserProfile(data) {      
        if (data != null && data != undefined && data != "") {

            if (data.phonenumber > 0) {
                $("#phoneNumber").html(data.phonenumber);
                $("#txtPhoneNumber").val(data.phonenumber);                
            }
        }
    }
}

$("#btnUpdate").click(function () {    
    if (ValidateForm("txtPhoneNumber", "phone number") && minLength("txtPhoneNumber", 3, "Please enter valid phone number") && IsNumber("txtPhoneNumber", 13, "Please enter valid phone number")) {
        $(this).html("please wait...");
        UpdateUserDetails();
    }
});

function UpdateUserDetails() {

    var userData = {
        phonenumber : $("#txtPhoneNumber").val().trim() 
    };

    $.ajax({
        type: 'POST',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/users/protected/updateUserProfile',
        data: userData,
        dataType: "json",
        success: dataParserUpdateUserProfile,
        error: ServiceError
    });   
}

function dataParserUpdateUserProfile(data) {
    
    if (data != null && data != undefined && data != "") {
        $("#editProfile").hide();
        $("#resultMessage").show();
        $("#resultMessage").removeClass("hidden");
    }
    else {       
        customAlert("There is some error in updating profile");
    }
}