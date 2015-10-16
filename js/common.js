// declare site public variable here
var adminEmail = 'rashmi.srivastava@vibetechindia.com';
var _webSiteName = "WooBus";
var _apiBaseUrl = "http://dev.cachefi.com/api/v1/";
var _clickedMenu = "";
var _isConfirm = false;
var _apiBaseUrl = "";
var _userDetails = [];
var _currPageName = "";
var _platform = "";

var savedSearchCollectionItem = [];
var keyword = [];
var suburbID;
var name = "";
var _minMenuHeight = "";

var _isApp = "";
var _windowHeight = $(window).height();

document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function () {
        
    // check if the app open or mobile browser
    _isApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

    // get clicked Menu item
    _clickedMenu = getProcessedParamVal(sessionStorage.getItem("clickedMenu"));

    // get menu bar min height
    _minMenuHeight = window.innerHeight - 200;

    // check current Login
    if (getProcessedParamVal(sessionStorage.getItem("user_details")) != "") {
        _userDetails = JSON.parse(sessionStorage.getItem('user_details'));
        $(".btnLogin").html("Logout");
    }
    else if (getProcessedParamVal(localStorage.getItem("username")) != "" && getProcessedParamVal(localStorage.getItem("password")) != "") { // check the local storage now
        // if local storage available, then do Auto Login
        AutoLoginUser();
    }

    // menu height min set
    $(".menuMinHeight").css("min-height", _minMenuHeight);

    /* set current and prev page  url */
    var currLoc = window.location.href;
    _currPageName = currLoc.substring(currLoc.lastIndexOf("/") + 1, currLoc.length);
    _currPageName = _currPageName.toLowerCase();

    //alert(_currPageName);
});

// device ready
function onDeviceReady() {
    _platform = device.platform;
}

// common click events
$('#default-back').click(function (e) {
    e.preventDefault();
    window.history.back(-1);
});

// common click events end

window.DeleteUserSession = function () {
    _userDetails = [];
    sessionStorage.setItem('user_details', "");
    localStorage.setItem("username", "");
    localStorage.setItem("password", "");
    sessionStorage.setItem('access_token', "");
    sessionStorage.setItem('token_type', "");
    sessionStorage.setItem('expires_in', "");
}

window.AutoLoginUser = function () {
    var username = localStorage.getItem("username");
    var password = localStorage.getItem("password");

    var loginData = {
        grant_type: 'password',
        username: username,
        password: password
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
            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('token_type', data.token_type);
            sessionStorage.setItem('expires_in', data.expires_in);

            //  now get the user details after authorization
            GetUser();
        }
    }

    function TokeError(xhr) {
        var errorMsg = JSON.parse(xhr.responseText);
    }
}


window.ServiceError = function (xhr) {
    if (xhr.responseText) {
        var err = xhr.responseText;

        if (err)
            error(err);
        else
            error({ Message: "Unknown server error." })
    }
    return;
}

window.error = function (errMsg) {
    customAlert("Error: " + errMsg);
}

window.getProcessedParamVal = function (passVal) {
    if (passVal == null || passVal == "null" || passVal == "" || passVal == undefined)
        return "";
    else {
        passVal = $.trim(passVal);
        return passVal;
    }
}

window.customAlert = function (msg) {
    try {
        navigator.notification.alert(
                msg, // message
                notificationCallback, // callback
                _webSiteName, // title
                'Ok'     // buttonName
                );
    }
    catch (e) {
        alert(msg);
    }
}

Number.prototype.formatMoney = function (decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
}

window.ConvertDate = function (input) {
    if (input == null || input == "" || input == undefined)
        return "";
    else {
        var chunks = input.split('/');
        var formattedDate = [chunks[1], chunks[0], chunks[2]].join("/");
        return formattedDate;
    }
}

/* Validate the Email  */
window.isValidEmailAddress = function (input) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if (pattern.test(input) == false) {
        return false;
    }
    return true;
}






