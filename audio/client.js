var baseClient = require('../base/client');


// Debugging stuff
go = function() {
  startRecord(rec);
}

stop = function() {
  console.log('len: ', rec.length);
  console.log('buffers: ', rec.buffers.length)
  return stopRecord(rec);
}

play = function() {
  var audioBuffer = mkBuffer(rec);

  var source = rec.context.createBufferSource();

  source.buffer = audioBuffer;
  source.connect(rec.context.destination);
  source.start();
}
//////////////////

// reset buffers, enable recording flag
var startRecord = function(rec) {
  rec.buffers = [];
  rec.length = 0;
  rec.recording = true;
}

// merge buffers, disable recording flags, return merged buffer
var stopRecord = function(rec) {
  console.log(rec);
  rec.recording = false;

  var output = new Float32Array(rec.length);
  var offset = 0;
  for (var i = 0; i < rec.buffers.length; i++) {
    output.set(rec.buffers[i], offset);
    offset += rec.buffers[i].length;
  }
  rec.output = output;
  return output;
}

var mkBuffer = function(rec) {
  var context = rec.context;
  var arrayBuffer = context.createBuffer(1, rec.length, context.sampleRate);
  var channel = arrayBuffer.getChannelData(0);
  channel.set(rec.output, 0);

  return arrayBuffer;
}

var mkRecorder = function() {
  return {
    recording: false
  }
}
var recorder = mkRecorder();
rec = recorder;

var recorderProcess = function(e) {
  if (!recorder.recording) return;

  console.log('proc');

  var b = e.inputBuffer.getChannelData(0);
  recorder.buffers.push(b);
  recorder.length += b.length;
}

var initStream = function(context) {
  return function(stream) {
    console.log('stream: ', stream);
    var microphone = context.createMediaStreamSource(stream);

    microphone.connect(recorder.node);
    //microphone.connect(context.destination);

    recorder.node.connect(context.destination);
  }
}

var init = function() {

  baseClient(2222);

  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
    window.AudioContext = window.AudioContext ||
                          window.webkitAudioContext;

    var context = new AudioContext();
    recorder.context = context;
    var bufferLen = 1024;
    var numChannels = 1;

    recorder.node = context.createScriptProcessor(
      bufferLen, numChannels, numChannels);

    recorder.node.onaudioprocess = recorderProcess;

    navigator.getUserMedia({audio: true}, initStream(context),
      function(error){
        console.log('error: ', error)
    });

  } else {
     console.log("getUserMedia not supported?");
  }
}
function onButton

module.exports = init;
