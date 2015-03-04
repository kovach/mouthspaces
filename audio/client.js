var baseClient = require('../base/client');


var init = function() {

  baseClient(2222);

  navigator.getUserMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
    window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext;

    var context = new AudioContext();

    navigator.getUserMedia({audio: true}, function(stream) {
      var microphone = context.createMediaStreamSource(stream);

    }, function(error){
         console.log('error: ', error)
    });
  } else {
     console.log("getUserMedia not supported");
  }
}

module.exports = init;
