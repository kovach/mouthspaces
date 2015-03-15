var _ = require('underscore')
var startServer = require('../base/server');
var encode = require('../audio/encode').encode;

// GLOBAL SERVER STATE
var counter = 0;
var entryLog = [];

var freshMessageId = function () {
  return counter++;
}

var handleMessage = function(server, myid) {
  // {array: blob}
  return function(bmsg) {

    // add metadata
    // fresh blob id, connection, timestamp
    var header = {};
    header.timestamp = new Date().getTime();
    header.clientId  = myid;
    header.msgId = freshMessageId();

    var entry = {header: header, buffer: bmsg.buffer};
    // encode binary
    var buffer = encode(entry);

    var outputMessage = {tag: 'binary', buffer: buffer};
    console.log('entry: ', entry);
    entryLog.push(entry);

    // distribute to clients
    _.each(server.connections, function (io, id) {
      if (id !== myid) {
        console.log('forwarding to: ', id);
        io.output.handle(outputMessage);
      }
    });
  }
}


var initServer = function (){

  var server = startServer(2222);
  server.add({
    // {output, input, id}
    'connection': function(msg) {

      msg.input.add({
        binary: handleMessage(server, msg.id)
      });

      msg.output.handle({tag: 'id', id: msg.id});
    },
  });
}

initServer();
