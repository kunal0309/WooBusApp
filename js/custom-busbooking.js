var cityname="", autoCompleteMin = 0;

$("#btnBooking").click(function () {
    if (ValidateForm("txtFrom", "from") && ValidateForm("txtTo", "to") && ValidateForm("txtDate", "date")) {
        $(this).html("please wait...");        
        BusBooking();
    }
});

$(document).ready(function () {
    $("[id*=txtFrom]").keyup(function (e) {
        getCityArray(this);

        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();          
            return false;
        }
    });
});

function getCityArray(cityObject) {
    var keyword = $(cityObject).val();
    if (keyword.length >= autoCompleteMin) {
        var availableTags = new Array();
        keyword = extractLast(keyword);
        availableTags = GetCity(keyword, cityObject);
    }
}

function GetCity(keyword, cityObject) {
    
    $(cityObject).catcomplete({
        delay: 800,
        minLength: 1,
        source: function (request, response) {           
            $.ajax({
                url:  _apiBaseUrl + '/api/v1/protected/autocomplete?q=',
                data: JSON.stringify(citykeyword),
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

