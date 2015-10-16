var email = "", password = "", phonenumber = "";
var loginFailMsg = "Invalid username or password - please try again.";
var savedSearchArr = new Array();

// click events
$("#btnLogin").click(function () {
    if (ValidateForm("txtPhoneNumber", "phone number") && minLength("txtPhoneNumber", 3, "Please enter valid phone number") && IsNumber("txtPhoneNumber", 13, "Please enter valid phone number") && ValidateForm("txtEmail", "email") && isValidEmailAddress("txtEmail") && ValidateForm("txtPassword", "password")) {
        $(this).html("please wait...");
        GetToken();
    }
});

$("#btnRegister").click(function () {
    if (ValidateForm("txtUserName", "user name") && maxLength("txtUserName", 12, "Please enter maximum 12 characters") && ValidateForm("txtEmail", "email") && isValidEmailAddress("txtEmail") && ValidateForm("txtPassword", "password") && ValidateForm("txtConfirmPassword", "confirm password") && ValidatePassword("txtPassword", "txtConfirmPassword") && ValidateForm("txtPhoneNumber", "phone number") && minLength("txtPhoneNumber", 3, "Please enter valid phone number") && IsNumber("txtPhoneNumber", 13, "Please enter valid phone number")) {
        $(this).html("please wait...");
        RegisterUser();
    }    
});

function RegisterUser() {
    var userData = {       
        email: $("#txtEmail").val().trim(),        
        password: $("#txtPassword").val().trim(),
        name: $("#txtUserName").val().trim(),
        is_operator: true,
        is_admin: false,
        phonenumber: $("#txtPhoneNumber").val().trim()
    };

    //var userData = {
    //    name: "test",
    //    phonenumber: "4564645",
    //    password: "123456",
    //    is_operator: true,
    //    is_admin: false
    //};
        
    $.ajax({
        type: 'POST',
        url: 'http://dev.cachefi.com/api/v1/users/create',
        data: JSON.stringify(userData),
        contentType: 'application/x-www-form-urlencoded',             
        success: dataParserReg,
        error: ServiceError
    });

    function dataParserReg(data) {
        alert(data);
        if (data != null && data != undefined && data.message.indexOf("Email already registered") > -1) {
            alert("rh");
            $(this).html("Register");
            customAlert(data.message);
            window.location.reload();
        }
        else {
            alert("Error");
            //$("#regModule").hide();
            //$(".result-msg").removeClass("hidden");
        }
    }
}

// get the token after authorization
function GetToken() {
    var loginData = {
        email: email,
        password: password,
        phonenumber: phonenumber
    };

    $.ajax({
        type: 'POST',
        url: _apiBaseUrl + '/token',
        data: loginData,
        contentType: 'application/x-www-form-urlencoded',
        dataType: "json",
        success: dataParserToken,
        error: TokeError
    });

    function dataParserToken(data) {
        if (data != null || data != undefined) {
            //store username and password on local storage.

            sessionStorage.setItem("email", email);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("phonenumber", phonenumber);
            
            localStorage.setItem("email", "");
            localStorage.setItem("password", "");
            localStorage.setItem("phonenumber", "");

            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('token_type', data.token_type);
            sessionStorage.setItem('expires_in', data.expires_in);

            //  now get the user details after authorization
            GetUser();
        }
    }

    function TokeError(xhr) {
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
        sessionStorage.setItem('user_details', newData1);
        var newData = JSON.parse(sessionStorage.getItem('user_details'));
        //alert(newData.registrationPending);

        //if (sessionStorage["savedSearch"] != null && sessionStorage["savedSearch"] != "" && sessionStorage["savedSearch"] != undefined) {
        //    SavedPropertySearch();
        //} else {
        //    window.location.href = "myaccount-landing.html";
        //}
        //if (newData.registrationPending) {
        //    if (sessionStorage["savedSearch"] != null && sessionStorage["savedSearch"] != "") {
        //        SavedPropertySearch();
        //    } else {
        //        window.location.href = "myaccount-landing.html";
        //    }
        //}
        //else {
        //    $("#error").addClass("error");
        //    $("#error").removeClass("hidden");
        //    $("#error").html("You have not activated your account yet.To activate your account follow the link you received via email when you registered.If you have not seen the email, please check your Spam or Junk folder.");
        //    $(".btn-submit").html("Login");
        //}
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

//Be sure the user entered a numeric value

function IsNumber(ctrlName, size, strAlert) {
    var strFieldValue = $("#" + ctrlName + "").val();
    if (strFieldValue.trim() == "")
        return true;
    for (var i = 0; i < size; i++) {

        if (strFieldValue.charAt(i) != "") {

            if (strFieldValue.charAt(i) < "0" || strFieldValue.charAt(i) > "9") {

                if (strAlert != "")
                    alert(strAlert)
                $("#" + ctrlName + "").focus();
                return false;
            }
        }
    }

    return true;
}

//Be sure the user entered a numeric value

window.minLength = function (ctrlName, size, strAlert) {
    var strFieldValue = $("#" + ctrlName + "").val();
    if (strFieldValue.trim() == "")
        return true;
    var strFieldLength = strFieldValue.length;

    if (strFieldLength < size) {
        if (strAlert != "")
            alert(strAlert)
        $("#" + ctrlName + "").focus();
        return false;
    }
    return true;
}


window.maxLength = function (ctrlName, size, strAlert) {
    var strFieldValue = $("#" + ctrlName + "").val();
    if (strFieldValue.trim() == "")
        return true;
    var strFieldLength = strFieldValue.length;

    if (strFieldLength > size) {
        if (strAlert != "")
            alert(strAlert)
        $("#" + ctrlName + "").focus();
        return false;
    }
    return true;
}

/* Form Validation  */
function ValidateForm(ctrlName, defaultVal) {
    var inputVal = $("#" + ctrlName + "").val();
    inputVal = inputVal.trim();
    if (inputVal == "" || $("#" + ctrlName + "").val() == defaultVal) {
        alert("Please enter " + defaultVal + "");
        $("#" + ctrlName + "").focus();
        return false;
    }
    return true;
}

/* Password Match Validation  */
function ValidatePassword(ctrlPassword, ctrlConfirmPassword) {
    if ($("#" + ctrlPassword + "").val() != $("#" + ctrlConfirmPassword + "").val()) {
        alert("Password not matched!");
        $("#" + ctrlConfirmPassword + "").focus();
        return false;
    }
    return true;
}

function validateAlpha(ctrlName) {
    var regex = new RegExp("^[a-zA-Z\s]+$");
    var str = $("#" + ctrlName + "").val();
    if (regex.test(str)) {
        return true;
    }
    else {
        alert('Please enter alphabates only');
        $("#" + ctrlName + "").focus();
        return false;
    }
}

