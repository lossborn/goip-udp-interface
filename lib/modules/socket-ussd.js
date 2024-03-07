const dgram = require('dgram');
const { randomInt } = require('../util');

module.exports = class SocketUssd {
    //test timeout and make resend after 10 sec
    constructor(address, port, password, timeout = 50000) {

        this._requestStatus = {
            error: 0,
            success: 2,
        };

        this._address = address;
        this._port = port;
        this._id = null;
        this._password = password;
        this._socket = dgram.createSocket('udp4');
        this._pendingRequest = null;
        this._expectedResponse = null;
        this._timeoutHandler = null;
        this._timeout = timeout;

        this._socket.on('message', (msg) => {
            let utf8msg = msg.toString('utf-8');

            if (utf8msg && this._checkResponse(utf8msg, 'ERROR', this._id)) {

                this._socket.emit('expected-' + this._expectedResponse, {
                    'status': this._requestStatus.error,
                    'error': new Error(this._pendingRequest + ': ' + utf8msg)
                });

                this.close();
            }

            if (utf8msg && this._checkResponse(utf8msg, this._expectedResponse, this._id)) {

                this._socket.emit('expected-' + this._expectedResponse, {
                    'status': this._requestStatus.success,
                    'message': utf8msg
                });
            }
        });
    }

    _isTimeout(reject) {
        this._timeoutHandler = setTimeout(() => {
            reject(new Error('Timeout in ' + this._pendingRequest))
            this.close()
        }, this._timeout)
    }
    //maybe problems
    _checkResponse(msg, expected, id) {
        return msg.substr(0, (1 + expected.length + id.toString().length)) === expected + ' ' + id.toString();
    }

    async send(ussd_command, id) {

        this._id = id || randomInt(10000, 99999);

        const resp = await this._sendUssdRequest(ussd_command, this._id);

        const prepare = resp.trim().split(' ');

        return {
            'sendid': prepare[1], // ussd session identifier
            'answer': prepare.splice(2).join(' '), // ussd response
            'raw': resp.trim()
        };
    }

    async sendOne(ussd_command, id) {
        const send = await this.send(ussd_command, id);
        this.close();
        return send;
    }

    close() {
        this._socket.close();
    }

    _sendRequest(command_string, expected, request) {
        this._expectedResponse = expected;
        this._pendingRequest = request;

        return new Promise((resolve, reject) => {
            const ussd_message = command_string /* + '\n' */;
            this._socket.once('expected-' + expected, (res) => {
                clearTimeout(this._timeoutHandler);
                if (res.status === this._requestStatus.error) {
                    reject(res.error);
                } else {
                    resolve(res.message)
                }
            });
            this._socket.send(ussd_message, 0, ussd_message.length, this._port, this._address);
            this._isTimeout(reject);
        });
    }

    _sendUssdRequest(ussd_command, id) {
        const command_string = 'USSD ' + id + ' ' + this._password + ' ' + ussd_command;
        return this._sendRequest(command_string, 'USSD', 'sendUssdRequest');
    }

}