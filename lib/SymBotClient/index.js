const SymBotAuth = require('../SymBotAuth');
const SymConfigLoader = require('../SymConfigLoader');
const DatafeedEventsService = require('../DatafeedEventsService');
const MessagesClient = require('../MessagesClient');
const Q = require('kew');

var SymBotClient = {};

SymBotClient.PRESENTATIONML_FORMAT = MessagesClient.PRESENTATIONML_FORMAT;
SymBotClient.MESSAGEML_FORMAT = MessagesClient.MESSAGEML_FORMAT;

SymBotClient.sessionToken = {};

SymBotClient.initBot = (path_to_config_file) => {
  var defer = Q.defer();

  SymConfigLoader.loadFromFile(path_to_config_file).then( SymConfig => {
    SymBotAuth.authenticate( SymConfig ).then( (symAuth) => {
      defer.resolve( { 'config': SymConfig, 'sessionAuthToken': symAuth.sessionAuthToken, 'kmAuthToken': symAuth.kmAuthToken } );
    })
  }).fail( (err) => {
    defer.reject( err );
  });

  return defer.promise;
}

SymBotClient.initBotWithSymConfig = (SymConfig) => {
  var defer = Q.defer();
  SymBotAuth.authenticate( SymConfig ).then( (symAuth) => {
    SymConfigLoader.SymConfig = SymConfig;
    defer.resolve( { 'config': SymConfig, 'sessionAuthToken': symAuth.sessionAuthToken, 'kmAuthToken': symAuth.kmAuthToken } );
  }).fail( (err) => {
    defer.reject( err );
  });
  return defer.promise;
}

SymBotClient.getDatafeedEventsService = (subscriberCallback) => {
  DatafeedEventsService.initService(subscriberCallback);
}

SymBotClient.stopDatafeedEventsService = () => {
  DatafeedEventsService.stopService();
}

SymBotClient.sendMessage = ( conversationId, message, data, format ) => {
  var defer = Q.defer();

  MessagesClient.sendMessage( conversationId, message, data, format ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.forwardMessage = ( conversationId, message, data ) => {
  var defer = Q.defer();

  MessagesClient.forwardMessage( conversationId, message, data ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.setDebugMode = (mode) => {
  SymBotAuth.debug = mode;
  if (SymBotAuth.debug) {
    console.log('[DEBUG] Debug mode turned on');
  } else {
    console.log('[DEBUG] Debug mode turned off');
  }
};

module.exports = SymBotClient;
