This package allow to send and receive SMS messages using GSM / VOIP Goip1, Goip4, Goip8, Goip16 gateways from Hybertone / Dbltek company. SMS can be received via the UDP protocol. The SMS can be sent via UDP or HTTP. Additionally, it is possible to receive basic information about the state and status of individual GSM gates (lines).

## Installation

```bash
npm i goip-udp-interface
```

## Server usage instruction

To start receiving messages from Goip gateways you need to create and start a server.

#### Example 1

```javascript
const {ServerFactory, HttpSms, SocketSms} = require('goip-udp-interface');

const server = ServerFactory.make(333);

server.onAll( (message) => {
    console.log(message);
});

server.run();
```

#### Example 2

```javascript
const {ServerFactory, MessageDispatcher, MessageFactory} = require('goip-udp-interface');

const server = ServerFactory.make(333, {
    'address': '0.0.0.0', // server address
    'messageDispatcher': new MessageDispatcher(), // Message Dispatcher implementation
    'messageFactory': new MessageFactory() // Message Factory implementation
});

server.onAll( (message) => {
    console.log(message);
});

server.run();
```

#### Register message listener

```javascript
const {ServerFactory} = require('goip-udp-interface');

const server = ServerFactory.make(333);

// All messages
server.onAll( (message) => {
    console.log(message);
});

// Goip not supported message
server.onNotSupported( (message) => {
    console.log(message);
});

// Keep Alive packets with gateway (line) information
server.onRequest( (message) => {
    console.log(message);
});

// Incoming SMS
server.onReceive( (message) => {
    console.log(message);
});

// SMS delivery report
server.onDeliver( (message) => {
    console.log(message);
});

// End telephone call
server.onHangup( (message) => {
    console.log(message);
});

// Start a phone call
server.onRecord( (message) => {
    console.log(message);
});

// Change of gate (line) status
server.onState( (message) => {
    console.log(message);
});

// Socket server error message
server.onServerError( (message) => {
    console.log(message);
});

server.run();
```

## Sending a message

#### Sending via UDP socket

##### Example 1 - sending one message and close the connection

```javascript
const {SocketSms} = require('goip-udp-interface');

const sms = new SocketSms(
	'192.168.0.11', // Goip address
	9991, // Goip port
	'goip_password' // Goip password
);

sms.sendOne('999999999','test sms message').then( response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```

##### Example 2 - sending many messages

```javascript
const {SocketSms} = require('goip-udp-interface');

const sms = new SocketSms(
	'192.168.0.11', // Goip address
	9991, // Goip port
	'goip_password' // Goip password
);

( async () => {

    try {

        const response1 = await sms.send('999999999','test sms message 1');
        const response2 = await sms.send('999999999','test sms message 2');

        console.log(response1);
        console.log(response2);

    } catch (error) {

        console.log(error);

    }

    sms.close();
})();
```

#### Sending via HTTP

##### Example 1 - sending one message

```javascript
const {HttpSms} = require('goip-udp-interface');

const sms = new HttpSms(
    'http://192.168.0.11', // Goip http address
    1, // Line number
    'login', // Goip login
    'password', // Goip password
    {
		'waitForStatus': false, // Wait and check sending status
		'waitTries': 10, // Number of attempts
		'waitTime': 1000 // Time in  milliseconds
	});

sms.send('999999999', 'test message').then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});
```

##### Example 2 - sending many messages

```javascript
const {HttpSms} = require('goip-udp-interface');

const sms = new HttpSms('http://192.168.0.11',1,'login','password',{
    'waitForStatus': true
});

(async () => {

    try {
        const response1 = await sms.send('999999999','test sms message 1');
        const response2 = await sms.send('999999999','test sms message 2');
        console.log(response1);
        console.log(response2);
    } catch (error) {
        console.log(error);
    }

})();
```

##### Example 3 - checking status by id

```javascript
const {HttpSms} = require('goip-udp-interface');
const sms = new HttpSms(
    'http://192.168.0.11', // Goip http address
    1, // Line number
    'login', // Goip login
    'password', // Goip password
);

( async () => {

    try {
        const response = await sms.send('999999999', 'test message');

        console.log(response);

        setTimeout(async () => {
            const isSend = await sms.isSend( response.id );

            if( isSend ) {
                console.log('sms sent')
            }
        
            if( !isSend ) {
                console.log('sms not sent')
            }

        }, 5000);

    } catch (error) {
        console.log(error);
    }

})();
```
## Sending an ussd message

#### Sending via UDP socket

##### Example - sending one ussd and get response

```javascript
const {SocketUssd} = require('goip-udp-interface');

const ussd = new SocketUssd(
	'192.168.0.11', // Goip address
	9991, // Goip port
	'goip_password' // Goip password
);

ussd.sendOne('*100#').then( response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```