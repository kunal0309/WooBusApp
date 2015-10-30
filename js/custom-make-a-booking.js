var searchfrom = "", searchto = "", searchdate = "", isTwelveRow, centreSeat = "", oldseatvalue = "", oldSelectSeat = "";
var seatNumbers = [];
var seatNumbersArray = new Array;

$("#btnSearch").click(function () {
    if (ValidateForm("txtFrom", "from") && ValidateForm("txtTo", "to") && ValidateForm("txtDate", "date")) {
        $(this).html("please wait...");
        BusSearching();
    }
});


$(document).ready(function () {
    //toggle visibility of journey data based whether customer is in a bus or not
    //getState();
    //setInterval(getState,20000);
    $("#txtFrom").autocomplete({
        source: function (req, res) {
            $.ajax({
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
                url: _apiBaseUrl + '/protected/autocomplete?q=' + req.term,
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
        select: function (event, ui) {
            console.log(ui);
        },

        html: true, // optional (jquery.ui.autocomplete.html.js required)

        // optional (if other layers overlap autocomplete list)
        open: function (event, ui) {
            $(".ui-autocomplete").css("z-index", 1000);
        }
    });

    $("#txtTo").autocomplete({
        source: function (req, res) {
            $.ajax({
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
                url: _apiBaseUrl + '/protected/autocomplete?q=' + req.term,
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
        select: function (event, ui) {
            console.log(ui);
        },
        html: false, // optional (jquery.ui.autocomplete.html.js required)

        // optional (if other layers overlap autocomplete list)
        open: function (event, ui) {
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

function BusSearching() {
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
        url: _apiBaseUrl + '/buses?start=' + searchData.searchfrom + '&end=' + searchData.searchto + '&date=' + searchData.searchdate,
        data: searchData,
        dataType: "json",
        success: dataParserSearchingDetails,
        error: ServiceError
    });

    function dataParserSearchingDetails(data) {
        if (data != null || data != undefined) {
            $.each(data, function (i, item) {
                $("#from").html(item.route.start);
                $("#to").html(item.route.end);
                $("#distance").html(item.route.distance + " Kms");
                var time_taken = moment.duration(item.route.time_taken, 'milliseconds');
                $("#time").html(time_taken);
                $("#price").html("From Rs. " + item.route.fare);

                ScheduledStops(item.route.boarding_points, item.route.scheduled_stops, item._id);

                SeatDetails(item.total_seats, item.seats);
            });

            $("#travelPage").show();
        }
    }
}

function ScheduledStops(boardPoints, stopPoints, busId) {

    $("#myTabs").html("");
    $("#routedetails").html("");

    sessionStorage.setItem('busid', busId);

    $.each(boardPoints, function (i, itemBoard) {

        $("#myTabs").append('<li><a href="javascript:void(0);"><i class="fa fa-map-marker position_show" data-toggle="tooltip" data-placement="top" title="' + itemBoard.point + '"></i></a></li>');

    });

    $.each(stopPoints, function (i, itemStop) {

        $("#myTabs").append('<li><a data-toggle="modal" data-target="#popupmodel" href="#"><i class="fa fa fa-cutlery position_show" data-toggle="tooltip" data-placement="top" title="' + itemStop.name + '"></i></a></li>');

        $("#modelHeading").html(itemStop.name);
        $("#routedetails").append('' + '<div id="map-canvas" class=""></div>' +
                   '<table class="table table-striped"><tbody><tr><td>Location</td><td>' +
                    itemStop.location + '</td></tr><tr><td>Loo Available</td><td>' + SetItem(itemStop.is_loo) + '</td></tr><tr><td>Food Available</td><td>' +
                    SetItem(itemStop.is_food) + '</td></tr><tr><td>Restaurant Available</td><td>' + itemStop.restaurants_available + '</td></tr>'
                    + '</tbody></table>'
                   );
    });

    initialize();

    google.maps.event.addDomListener(window, 'load', initialize);

    google.maps.event.addDomListener(window, "resize", resizingMap());

    $(".strip ul").append('<li><i class="fa fa-long-arrow-down"></i><i class="fa fa-long-arrow-up"></i></li>');
    $('[data-toggle="tooltip"]').tooltip();
}

function SetItem(isCheckItem) {

    var isCheckValue = "";

    if (isCheckItem) {
        isCheckValue += 'Yes';
    }
    else {
        isCheckValue += 'No';
    }

    return isCheckValue;
}

function SeatDetails(totalSeats, seats) {

    $("#seatselection").html("");

    isTwelveRow = false;
    oldseatvalue = false;

    centreSeat = parseInt(totalSeats / 2) + 1;

    var liElem = "";
    var liCenterElem = "";
    var sub_ul = "";

    $.each(seats, function (i, itemSeat) {

        liElem += '<li ' + AlreadySeatBookedClass(itemSeat.seat_no, itemSeat.is_booked) + '><a href="javascript:void(0)" id="seat_' + itemSeat.seat_no + '" class="selectseat-link"></a></li>';

        if ((i + 1) > 1 && isTwelveRow == true) {

            if (centreSeat == i + 1) {

                liCenterElem += '<li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li><li><a href="#"></a></li>' + liElem;

                sub_ul = $('<ul/>').addClass('seataligncenter').append(liCenterElem);
                $("#seatselection").append(sub_ul);
                oldseatvalue = true;
                liCenterElem = "";
                liElem = "";
            }
        }

        if (oldseatvalue) {
            if ((i + 1) > 1 && ((i + 1) % 12) == 1) {

                isTwelveRow = true;
                sub_ul = $('<ul/>').addClass('seatalign').append(liElem);
                $("#seatselection").append(sub_ul);
                liElem = "";
            }
        }
        else {
            if ((i + 1) > 1 && ((i + 1) % 12) == 0) {

                isTwelveRow = true;
                sub_ul = $('<ul/>').addClass('seatalign').append(liElem);
                $("#seatselection").append(sub_ul);
                liElem = "";
            }
        }
    });
}

function AlreadySeatBookedClass(seatNumber, isSeatBooked) {
    var seatBooked = "";

    if (isSeatBooked) {
        $("#" + seatNumber + "").addClass("booked");
        seatBooked = "class='booked'";
    }

    return seatBooked;
}

function getState() {
    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/users/protected/state',
        success: function (data) {
            if (data.in_bus) {
                $(location).attr('href', 'myjourney.html');
            } else {
                $("#travelPage").hide();
            }
        },
        error: ServiceError
    });
}

function getRouteData() {
    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/route/currentRoute',
        success: function (data) {
            if (data.in_bus) {
                $("#travelPage").show();
            } else {
                $("#travelPage").hide();
            }
        },
        error: ServiceError
    });
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

$("#btnBookBus").click(function () {

    if ($("li").hasClass("active")) {

        var sessionBusId = sessionStorage.getItem('busid');
        var sessionSeatNumber = sessionStorage.getItem('seatnumber');

        if (sessionBusId != null && sessionBusId != undefined && sessionBusId != "" && sessionSeatNumber != null && sessionSeatNumber != undefined && sessionSeatNumber != "") {

            seatNumbersArray = sessionSeatNumber.toString().split(',');

            if (seatNumbersArray.length > 0) {
                for (var i = 0; i < seatNumbersArray.length; i++) {
                    seatNumbers[i] = seatNumbersArray[i];
                }
            }

            BusBookingDetails(sessionBusId, seatNumbers);
        }
    }
    else {
        alert("Please select seat");
    }
});

function BusBookingDetails(busID, seatNumbers) {

    var bookingBusData = {
        bus_id: busID,
        seat_no: seatNumbers
    };

    //alert(bookingBusData.seat_no);

    $.ajax({
        method: 'POST',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/protected/book',
        data: bookingBusData,
        dataType: "json",
        success: dataParserBookingDetails,
        error: ServiceError
    });

    function dataParserBookingDetails(data) {
        alert(JSON.stringify(data));
        if (data != null || data != undefined) {
            alert("Your bus booking details saved successfully !");
            //window.location.href = "MyJourney.html";
        }
    }
}

$(document).on('click', '.selectseat-link', function () {

    $("#selectedSeat").html("");

    var seatNumber = this.id;

    if ($("#" + seatNumber + "").parent().hasClass("active") == true) {
        $("#" + seatNumber + "").parent().removeClass("active");

        seatNumber = seatNumber.replace('seat_', '');
        oldSelectSeat = RemoveSelectedSeat(oldSelectSeat, seatNumber);
    }
    else {
        $("#" + seatNumber + "").parent().addClass("active");

        seatNumber = seatNumber.replace('seat_', '');
        oldSelectSeat = AddSelectedSeat(oldSelectSeat, seatNumber);
    }

    sessionStorage.setItem('seatnumber', oldSelectSeat);

    $("#selectedSeat").html(oldSelectSeat);
});

function AddSelectedSeat(oldStr, newStr) {

    if (oldStr != undefined && oldStr != "") {
        oldStr = oldStr + "," + newStr + ",";
    }
    else {
        oldStr = newStr + ",";
    }
    return oldStr.replace(/,\s*$/, "");
}

function RemoveSelectedSeat(oldStr, newStr) {

    if (oldStr != undefined && oldStr != "") {
        if (oldStr.indexOf(newStr) !== -1) {

            var splitStr = oldStr.split(',');

            if (oldStr.indexOf((',' + newStr)) !== -1) {
                oldStr = oldStr.replace((',' + newStr), "");
            }
            if (splitStr.length == 1) {
                oldStr = oldStr.replace(newStr, "");
            }
            else {
                oldStr = oldStr.replace((newStr + ','), "");
            }
        }
    }

    return oldStr.replace(/,\s*$/, "");
}


var map;
var myCenter;
var marker;


function initialize() {
    myCenter = new google.maps.LatLng(51.219987, 4.396237),

     marker = new google.maps.Marker({
         position: myCenter
     });

    var mapProp = {
        center: myCenter,
        zoom: 14,
        draggable: false,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);
    marker.setMap(map);

    google.maps.event.addListener(marker, 'click', function () {

        infowindow.setContent(contentString);
        infowindow.open(map, marker);

    });
};


$('#popupmodel').on('show.bs.modal', function () {
    //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
    resizeMap();
})

function resizeMap() {
    if (typeof map == "undefined") return;
    setTimeout(function () { resizingMap(); }, 400);
}

function resizingMap() {
    if (typeof map == "undefined") return;
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);

}