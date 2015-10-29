$(document).ready(function () {
    JourneyDetails();
});

function JourneyDetails() {
    var journeyData = {
        journeyBusId: "56043a5c361ffe41bd662044" //$("#txtFrom").val().trim()
    };    

    $.ajax({
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/protected/bus/' + journeyData.journeyBusId,
        data: journeyData,
        dataType: "json",
        success: dataParserJourneyDetails,
        error: ServiceError
    });

    function dataParserJourneyDetails(data) {
        if (data != null || data != undefined) {
            $.each(data, function (i, item) {
                $(".search-from").html(item.route.start);
                $(".search-to").html(item.route.end);
                $(".distance_km").html(item.route.distance);
                $(".distance_hr").html(item.route.time_taken);
                //$(".price").html("From Rs. " + item.route.fare);

                scheduledstops(item.route.boarding_points, item.route.scheduled_stops);
            });
        }
    }
}

function scheduledstops(boardPoints, stopPoints) {

    $("#myTabs").html("");
    $(".modal-body").html("");

    $.each(boardPoints, function (i, itemBoard) {
        $("#myTabs").append('<li><a href="javascript:void(0);"><i class="fa fa-map-marker position_show" data-toggle="tooltip" data-placement="top" title="' + itemBoard.point + '"></i></a></li>');
      });

    $.each(stopPoints, function (i, itemStop) {
        $("#myTabs").append('<li><a data-toggle="modal" data-target="#popupmodel" href="#"><i class="fa fa fa-cutlery position_show" data-toggle="tooltip" data-placement="top" title="' + itemStop.name + '"></i></a></li>');

        $(".modelHeading").html(itemStop.name);
        $(".modal-body").append('' + '<img src="images/map.jpg">' +
                   '<table class="table table-striped"><tbody><tr><td>Location</td><td>' +
                    itemStop.location + '</td></tr><tr><td>Loo Available</td><td>' + GetItem(itemStop.is_loo) + '</td></tr><tr><td>Food Available</td><td>' +
                    GetItem(itemStop.is_food) + '</td></tr><tr><td>Restaurant Available</td><td>' + itemStop.restaurants_available + '</td></tr>'
                    + '</tbody></table>'
                   );

    });

    $(".strip ul").append('<li><i class="fa fa-long-arrow-down"></i><i class="fa fa-long-arrow-up"></i></li>');
    $('[data-toggle="tooltip"]').tooltip();
}

$("#btnStop").click(function () {
    window.location.href = "MyJourney.html";
});