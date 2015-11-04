$(document).ready(function () {
    CheckLogin(); 
    EntertainmentDetails();
    GetAllVideo();
});

function GetAllAudio() {
    $.ajax({
        type: 'GET',
        headers: {
            Authorization: localStorage.token
        },
        url: _apiBaseUrl + '/buses?start=' + searchData.searchfrom + '&end=' + searchData.searchto + '&date=' + searchData.searchdate,
        data: searchData,
        dataType: "json",
        success: dataParserBookingDetails,
        error: ServiceError
    });

    function dataParserBookingDetails(data) {
        if (data != null || data != undefined && data != "") {
            $.each(data, function (i, item) {

            });
        }
    }
}

function GetAllVideo() {
    $("#dvMovieList").html("");
   
    var selectMovie = '<div class="item active">' +
         '<div class="row-fluid"><div class="col-xs-3">' +
         '<a data-toggle="modal" data-target="#popupplayvideo" href="#" class="select-thumbnail-link thumbnail" id="thumbvideo_' + 1 + '">' +
         '<img src="images/m1.jpg" alt="Image" style="max-width: 100%;" /></a></div>' + '<div class="col-xs-3">' +
         '<a data-toggle="modal" data-target="#popupplayvideo" href="#" class="select-thumbnail-link thumbnail" id="thumbvideo_' + 2 + '">' +
         '<img src="images/m2.jpg" alt="Image" style="max-width: 100%;" /></a></div>' +
         '<div class="col-xs-3"><a data-toggle="modal" data-target="#popupplayvideo" href="#" class="select-thumbnail-link thumbnail" id="thumbvideo_' + 3 + '">' +
         '<img src="images/m3.jpg" alt="Image" style="max-width: 100%;" /></a></div>' +
         '<div class="col-xs-3">' +
         '<a data-toggle="modal" data-target="#popupplayvideo" href="#" class="select-thumbnail-link thumbnail" id="thumbvideo_' + 4 + '">' +
         '<img src="images/m4.jpg" alt="Image" style="max-width: 100%;" /></a></div></div></div>' +
         '<div class="item"><div class="row-fluid"><div class="col-xs-3">' +
         '<a data-toggle="modal" data-target="#popupplayvideo" href="#x" class="select-thumbnail-link thumbnail" id="thumbvideo_' + 5 + '">' +
         '<img src="images/m1.jpg" alt="Image" style="max-width: 100%;" /></a></div>' +
         '<div class="col-xs-3"><a data-toggle="modal" data-target="#popupplayvideo" href="#" class="select-thumbnail-link thumbnail" id="thumbvideo_' + 6 + '">' +
         '<img src="images/m2.jpg" alt="Image" style="max-width: 100%;" /></a></div></div></div>';

    $("#dvMovieList").append(selectMovie);
}

$(document).on('click', '.select-thumbnail-link', function () {
    aud.pause();
    var videoid = this.id;
    videoid = videoid.replace('thumbvideo_', '');
    PlayVideo(videoid);
});

function PlayVideo(videoId) {

    var videoFile = 'http://html5videoformatconverter.com/data/images/happyfit2.mp4';  // videoId;

    $("#dvVideo video").attr({
        "src": videoFile,
        "autoplay": false,
        "height": "200px"
    })
}

function EntertainmentDetails() {
   
    $.ajax({
        type: 'GET',
        url: _apiBaseUrl + '/box/media?bus_identifier=1',       
        dataType: "json",
        success: dataParserEntertainmentDetails,
        error: ServiceError
    });

    function dataParserEntertainmentDetails(data) {
        if (data != null || data != undefined && data != "") {
            $.each(data, function (i, item) {
                
            });
        }
    }
}

/**
* END
 */

/**
 * Created by Indresh Singh for music player on 27/10/15.
 */

var playlist = [
    {
        url: "http://www.scottandrew.com/mp3/demos/holding_back_demo_011504.mp3",
        title: "Holding Back"
    },
    {
        url: "http://www.scottandrew.com/mp3/wb/where_ive_been/Scott_Andrew_and_the_Walkingbirds-Gravel_Road_Requiem.mp3",
        title: "Gravel Road Requiem"
    },
    {
        url: "http://www.scottandrew.com/mp3/syfy/01%20-%20Scott%20Andrew%20-%20More%20Good%20Days.mp3",
        title: "More Good Days"
    },
    {
        url: "http://www.scottandrew.com/mp3/syfy/01%20-%20Scott%20Andrew%20-%20More%20Good%20Days.mp3",
        title: "More Good Days"
    },
    {
        url: "http://www.scottandrew.com/mp3/syfy/01%20-%20Scott%20Andrew%20-%20More%20Good%20Days.mp3",
        title: "More Good Days"
    }
];

//Scott Andrew’s HTML5 audio player
var aud = $('#jukebox .aud').get(0);
var vid = $("#dvVideo video").get(0);
aud.pos = -1;

$('#jukebox .play').bind('click', function (evt) {
    evt.preventDefault();
    if (aud.pos < 0) {
        $('#jukebox .next').trigger('click');
    } else {
        aud.play();
    }
});

$(".target").click(function (evt) {
    vid.pause();
    evt.preventDefault();
    if (aud.pos == playlist.length) aud.pos = 0;
    aud.pos = $(this).data("tab-id");
    aud.setAttribute('src', playlist[aud.pos].url);
    $('#jukebox .info').html(playlist[aud.pos].title);
    aud.load();
    aud.play();
});

$('#jukebox .pause').bind('click', function (evt) {
    evt.preventDefault();
    aud.pause();
});

$('#jukebox .next').bind('click', function (evt) {
    evt.preventDefault();
    aud.pause();
    aud.pos++;
    if (aud.pos == playlist.length) aud.pos = 0;
    aud.setAttribute('src', playlist[aud.pos].url);
    $('#jukebox .info').html(playlist[aud.pos].title);
    aud.load();
});

$('#jukebox .prev').bind('click', function (evt) {
    evt.preventDefault();
    aud.pause();
    aud.pos--;
    if (aud.pos < 0) aud.pos = playlist.length - 1;
    aud.setAttribute('src', playlist[aud.pos].url);
    $('#jukebox .info').html(playlist[aud.pos].title);
    aud.load();
});

// JQuery doesn't seem to like binding to these HTML 5
// media events, but addEventListener does just fine

aud.addEventListener('progress', function (evt) {
    var width = parseInt($('#jukebox').css('width'));
    var percentLoaded = Math.round(evt.loaded / evt.total * 100);
    var barWidth = Math.ceil(percentLoaded * (width / 100));
    $('#jukebox .load-progress').css('width', barWidth);

});

aud.addEventListener('timeupdate', function (evt) {
    var width = parseInt($('#jukebox').css('width'));
    var percentPlayed = Math.round(aud.currentTime / aud.duration * 100);
    var barWidth = Math.ceil(percentPlayed * (width / 100));
    $('#jukebox .play-progress').css('width', barWidth);
});

aud.addEventListener('canplay', function (evt) {
    $('#jukebox .play').trigger('click');
});

aud.addEventListener('ended', function (evt) {
    $('#jukebox .next').trigger('click');
});


$('#jukebox .info').html(playlist[0].title);


/**
* END
 */