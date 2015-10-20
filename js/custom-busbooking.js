var searchfrom = "", searchto = "", searchdate = "";

$("#btnBooking").click(function () {
    if (ValidateForm("txtFrom", "from") && ValidateForm("txtTo", "to") && ValidateForm("txtDate", "date")) {
        $(this).html("please wait...");        
        BusBooking();
    }
});


$(document).ready(function () {
    //toggle visibility of journey data based whether customer is in a bus or not
    //getState();
    //setInterval(getState,20000);
    $("#txtFrom").autocomplete({
        source:function(req,res){
            $.ajax({
                method: 'GET',
                headers:{
                    Authorization:localStorage.token
                },
                url: _apiBaseUrl + '/protected/autocomplete?q='+req.term,
                //success: function (data) {
                //    console.log(data);
                //    res(data);
                //},
                //error: ServiceError

                success: function (data) {
                    var availableTags = new Array();

                    $.each(data, function (i, item) {                       
                        availableTags.push($.parseJSON('{"label": "' + item + '" }'));
                    });

                    res(availableTags);
                },
                error: ServiceError

            });
        },
        minLength: 3,
        select: function(event, ui) {
            console.log(ui);
        },

        html: true, // optional (jquery.ui.autocomplete.html.js required)

        // optional (if other layers overlap autocomplete list)
        open: function(event, ui) {
            $(".ui-autocomplete").css("z-index", 1000);
        }
    });

    $("#txtTo").autocomplete({
        source:function(req,res){
            $.ajax({
                method: 'GET',
                headers:{
                    Authorization:localStorage.token
                },
                url: _apiBaseUrl + '/protected/autocomplete?q='+req.term,
                success: function (data) {
                    var availableTags = new Array();

                    $.each(data, function (i, item) {
                        availableTags.push($.parseJSON('{"label": "' + item + '" }'));
                    });

                    res(availableTags);
                },
                error: ServiceError
            });
        },
        minLength: 3,
        select: function(event, ui) {
            console.log(ui);
        },
        html: false, // optional (jquery.ui.autocomplete.html.js required)

        // optional (if other layers overlap autocomplete list)
        open: function(event, ui) {
            $(".ui-autocomplete").css("z-index", 1000);
        }
    });

    $("#txtDate").datepicker();

    //$("[id*=txtFrom]").keyup(function (e) {
    //    getCityArray(this);

    //    var code = e.keyCode || e.which;
    //    if (code == 13) {
    //        e.preventDefault();          
    //        return false;
    //    }
    //});
});

function BusBooking() {
    var searchData = {
        searchfrom: $("#txtFrom").val().trim(),
        searchto: $("#txtTo").val().trim(),
        searchdate: $("#txtDate").val().trim()
    };

    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/protected/buses?start=' + searchfrom + '&end=' + searchto + '&date=' + searchdate,
        data: searchData,
        dataType: "json",
        success: dataParserBooking,
        error: bookingError
    });

    function dataParserBooking(data) {

        if (data != null || data != undefined) {      
            $(".search-from").html(searchData.searchfrom);
            $(".search-to").html(searchData.searchto);
            $("#travelPage").show();
            //window.location.href("myjourney.html");
        }
    }

    function bookingError(xhr) {
        var errorMsg = JSON.parse(xhr.responseText);

        //if (errorMsg.error_description == "This is not a valid user") {
        //    $(".btn-submit").html("Login");
        //    $("#result-password").val("")
        //    $("#reqPassword").removeClass("hidden");
        //    $("#reqPassword").html(loginFailMsg);
        //}
    }
}
 
function getCityArray(cityObject) {
    var keyword = $(cityObject).val();
    if (keyword.length >= autoCompleteMin) {
        var availableTags = new Array();
        keyword = extractLast(keyword);
        availableTags = GetCity(keyword, cityObject);
    }
}

function getState(){
    $.ajax({
        method: 'GET',
        headers:{
            Authorization:localStorage.token
        },
        url: _apiBaseUrl + '/users/protected/state',
        success: function (data) {
            if(data.in_bus){
                $(location).attr('href','myjourney.html');
            }else{
                $("#travelPage").hide();
            }
        },
        error: ServiceError
    });
}

function getRouteData(){
    $.ajax({
        method: 'GET',
        headers:{
            Authorization:localStorage.token
        },
        url: _apiBaseUrl + '/route/currentRoute',
        success: function (data) {
            if(data.in_bus){
                $("#travelPage").show();
            }else{
                $("#travelPage").hide();
            }
        },
        error: ServiceError
    });
}

function GetCity(keyword, cityObject) {
    
    $(cityObject).catcomplete({
        delay: 800,
        minLength: 1,
        source: function (request, response) {           
            $.ajax({
                type:"GET",
                url:  _apiBaseUrl + '/api/v1/protected/autocomplete?q='+citykeyword,
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    var availableTags = new Array();

                    // suburb list
                    $.each(data, function (i, item) {
                        alert(item);
                        //if (getProcessedParamVal(item.Postcode) == "" && item.SuburbName != "" && item.SuburbName != null && item.SuburbName != undefined) {
                        //    availableTags.push($.parseJSON('{"label": "' + item.SuburbName + ' (' + item.ListingCount + ')", "value": "' + item.SuburbName + '#suburb", "id": ' + item.SuburbId + ', "category":"Suburb"}'));

                        //}
                    });

                    response(availableTags);
                },
                error: function () { }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            
            //if (ui.item.value.indexOf("#suburb") > 0) {
            //    ui.item.value = ui.item.value.substr(0, ui.item.value.indexOf("#suburb"));
            //}
            
            //var terms = split(this.value);
            //// remove the current input
            //terms.pop();
            //// add the selected item
            //terms.push(ui.item.value);
            //// add placeholder to get the comma-and-space at the end
            //terms.push("");
            //this.value = terms.join("; ");

            //hideKeyboard();
            //return false;
        }
    });

    $(subObject).bind("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
            event.preventDefault();
        }
    })
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

