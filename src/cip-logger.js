const requestDebug = require('request-debug');

module.exports = function setupLogging(request, level) {
  if(level === 'all') {
    logEverything(request);
  } else {
    simpleLogWithTiming(request);
  }
}

function logEverything(request) {
  requestDebug(request);
}

function simpleLogWithTiming(request) {
  const requests = {};

  requestDebug(request, function(type, data, r) {
    switch (type) {
      case 'request':
        requests[data.debugId] = {
          uri: data.uri,
          startTime: new Date().getTime()
        };
        break;

      case 'response':
        timeDifference = new Date().getTime() - requests[data.debugId].startTime;

        uri = requests[data.debugId].uri

        console.log(`CIP call - ${uri} - ${timeDifference} ms`);

        // Let's clean up.
        delete requests[data.debugId];
        break;

      default:
        return
    }
  });
}
