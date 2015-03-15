var encode = function(entry) {
  var header = entry.header;
  var dataBuffer = entry.buffer;
  var headerString = JSON.stringify(entry);

  var headerLength = Buffer.byteLength(headerString);
  var dataLength = dataBuffer.length;

  var buffer = new Buffer(4 + headerLength + dataLength);

  buffer.writeUInt32LE(headerLength, 0);
  buffer.write(headerString, 4);
  dataBuffer.copy(buffer, 4 + headerLength);

  return buffer;
}

var decode = function(buffer) {
  var headerLength = buffer.readUInt32LE(0);
  var headerString = buffer.toString(undefined, 4, 4 + headerLength);
  var header = JSON.parse(headerString);

  var dataLength = buffer.length - 4 - headerLength;
  var dataBuffer = new Buffer(dataLength);
  buffer.copy(dataBuffer, 0, 4 + headerLength);

  return {header: header, buffer: dataBuffer};
}

var decodeAudio = function(buffer) {
  var arr = new Float32Array(buffer.length / 4);
  for (var i = 0; i * 4 < buffer.length; i++) {
    arr[i] = buffer.readFloatLE(i*4);
  }
  return arr;
}


module.exports = {
  encode: encode,
  decode: decode,
  decodeAudio: decodeAudio,
}
