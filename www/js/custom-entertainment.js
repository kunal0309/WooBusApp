/**
 * Created by pariskshitdutt on 17/10/15.
 */
$("#btnPlayMedia").click(function () {
    //PlayMediaPlayer();
    alert("rh");
    captureVideo();
    
});

function PlayMediaPlayer(){
    //http://programmerguru.com/android-tutorial/wp-content/uploads/2013/04/hosannatelugu.mp3
}


// api-capture  Capture Video
function captureVideo() {
    document.getElementById('format-data').innerHTML = "";
    document.getElementById('capture-result').innerHTML = "";
    navigator.device.capture.captureVideo(captureSuccess, captureError, { limit: 1 });
}

function captureSuccess(mediaFiles) {
    alert("rh1");
    var winWidth = $(window).width();
    winWidth = (winWidth * 90) / 100;
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i++) {
        var mediaFile = mediaFiles[i];
        mediaFile.getFormatData(getFormatDataSuccess, getFormatDataError);

        var vid = document.createElement('video');
        vid.id = "theVideo";
        vid.width = winWidth;
        vid.height = "250";
        vid.controls = "controls";
        var source_vid = document.createElement('source');
        source_vid.id = "theSource";
        source_vid.src = mediaFile.fullPath;
        vid.appendChild(source_vid);
        document.getElementById('format-data').innerHTML = '';
        document.getElementById('format-data').appendChild(vid);
        document.getElementById('capture-result').innerHTML = formatBytes(mediaFile.size) + ' ' + mediaFile.type;
    }
}

function getFormatDataSuccess(mediaFileData) {
    //document.getElementById('video_meta_container').innerHTML = mediaFileData.duration + ' seconds, ' + mediaFileData.width + ' x ' + mediaFileData.height;
}

function getFormatDataError(error) {
    alert('A Format Data Error occurred during getFormatData: ' + error.code);
}


var myMedia = null;
var playing = false;

function playAudio() {    
    if (!playing) {
        myMedia.play();
        document.getElementById('play').src = "images/pause.png";
        playing = true;
    } else {
        myMedia.pause();
        document.getElementById('play').src = "images/play.png";
        playing = false;
    }
}
function stopAudio() {
    myMedia.stop();
    playing = false;
    document.getElementById('play').src = "images/play.png";
    document.getElementById('audio_position').innerHTML = "0.000 sec";
}