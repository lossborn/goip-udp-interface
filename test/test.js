const { SocketSms, SocketUssd } = require('../index');
const { ServerFactory } = require('../index');

const server = ServerFactory.make(44444);
const address = '10.99.99.3';
const port = '10992';
const login = 'admin';
const passwd0 = 'z8??-(.№ga8+kkm7';
const passwd1 = 'wCpOa3XTmALd';
const passwd2 = '1234';

// All messages
server.onAll((message) => {
    console.log(message);
});

// Goip not supported message
server.onNotSupported((message) => {
    console.log(message);
});

// Keep Alive packets with gateway (line) information
server.onRequest((message) => {
    console.log(message);
});

// Incoming SMS
server.onReceive((message) => {
    console.log(message);
});

// SMS delivery report
server.onDeliver((message) => {
    console.log(message);
});

// End telephone call
server.onHangup((message) => {
    console.log(message);
});

// Start a phone call
server.onRecord((message) => {
    console.log(message);
});

// Change of gate (line) status
server.onState((message) => {
    console.log(message);
});

// Socket server error message
server.onServerError((message) => {
    console.log(message);
});

server.run();
/* const sms = new SocketSms(
    '192.168.0.11', // Goip address
    9991, // Goip port
    'goip_password' // Goip password
);

sms.sendOne('999999999', 'test sms message').then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
}); */

const ussd = new SocketUssd(
    address, // Goip address
    port, // Goip port
    passwd2 // Goip password
);
console.log(ussd)

ussd.sendOne('*124#').then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});