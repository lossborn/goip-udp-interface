module.exports = {
    'ServerFactory': require('./lib/server-factory'),
    'HttpSms': require('./lib/modules/http-sms'),
    'SocketSms': require('./lib/modules/socket-sms'),
    'SocketUssd': require('./lib/modules/socket-ussd'),
    'MessageDispatcher': require('./lib/message-dispatcher'),
    'MessageFactory': require('./lib/message-factory'),
}