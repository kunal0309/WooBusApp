﻿var email = "", password = "", phonenumber = "";
var loginFailMsg = "Invalid username or password - please try again.";

// click events
$("#btnLogin").click(function () {
    if (ValidateForm("txtPhoneNumber", "phone number") && minLength("txtPhoneNumber", 3, "Please enter valid phone number") && IsNumber("txtPhoneNumber", 13, "Please enter valid phone number")) {
        $(this).html("please wait...");
        GetToken();
    }
});

$("#btnRegister").click(function () {
    if (ValidateForm("txtPhoneNumber", "phone number") && minLength("txtPhoneNumber", 3, "Please enter valid phone number") && IsNumber("txtPhoneNumber", 13, "Please enter valid phone number")) {
        $(this).html("please wait...");
        RegisterUser();
    }    
});

function RegisterUser() {
    //console.log("registering users");
    var userData = {
        //email: $("#txtEmail").val().trim(),
        //name: $("#txtUserName").val().trim(),
        phonenumber: $("#txtPhoneNumber").val().trim()
    };
           
    $.ajax({
        type: 'POST',
        url: _apiBaseUrl+'/users/create',
        data: userData,
        contentType: 'application/x-www-form-urlencoded',             
        success: dataParserReg,
        error: ServiceError
    });

    function dataParserReg(data) {
        userData.pin = data.pin;
        localStorage.userData=JSON.stringify(userData);
        //$(location).attr('href','confirmForm.html');  
        window.location.href = "confirmForm.html";
    }
}

// get the token after authorization
function GetToken() {   
    var loginData = {       
        phonenumber: $("#txtPhoneNumber").val().trim()
    };

    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/users/protected/info',
        data: loginData,        
        dataType: "json",
        success: dataParserToken,
        error: TokenError
    });

    function dataParserToken(data) {
      
        if (data != null || data != undefined) {
            //store username and password on local storage.            
            window.location.href("home.html");
        }
    }

    function TokenError(xhr) {
        var errorMsg = JSON.parse(xhr.responseText);
      
        //if (errorMsg.error_description == "This is not a valid user") {
        //    $(".btn-submit").html("Login");
        //    $("#result-password").val("")
        //    $("#reqPassword").removeClass("hidden");
        //    $("#reqPassword").html(loginFailMsg);
        //}
    }
}

// get the user information
function GetUser() {
    var token = sessionStorage.getItem("access_token");
    var headers = {};
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    $.ajax({
        type: 'GET',
        url: _apiBaseUrl + '',
        contentType: 'application/json',
        dataType: "json",
        headers: headers,
        success: dataParserUser,
        error: ServiceError
    });

    function dataParserUser(data) {
        var newData1 = JSON.stringify(data);

        alert(newData1);

        sessionStorage.setItem('user_details', newData1);
        var newData = JSON.parse(sessionStorage.getItem('user_details'));        
         window.location.href = "profile.html";       
    }
}

$(document).ready(function () {
    $(".ajaxLoaderContent").hide();

    /* Validate the Email  */
    window.isValidEmailAddress = function (ctrlName) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        if (pattern.test($("#" + ctrlName + "").val()) == false) {
            alert("Please enter a valid email address");
            $("#" + ctrlName + "").focus();
            return false;
        }
        return true;
    }
});

