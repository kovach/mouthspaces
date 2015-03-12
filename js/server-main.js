var _ = require('underscore')
var startServer = require('../base/server');

var server = startServer(2222);
server.add({
  // {output, input, id}
  'connection': function(msg) {
    msg.input.add({
      binary: function(bmsg) {
        console.log('array: ', bmsg.array);
        _.each(server.connections, function (io, id) {
          if (id !== msg.id) {
            console.log('forwarding to: ', id, bmsg);
            io.output.handle(bmsg);
          }
        });
      }
    });

    msg.output.handle({tag: 'id', id: msg.id});
  },
});
