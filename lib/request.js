'use strict';
module.exports = class Request {

    constructor(buffer, address, port) {
        this._buffer = buffer;
        this._address = address;
        this._port = port;
        this._attributes = this._parse(buffer);
    }

    all() {
        return this._attributes;
    }

    buffer() {
        return this._buffer;
    }

    port() {
        return this._port;
    }

    address() {
        return this._address;
    }

    has(key) {
        return this._attributes.hasOwnProperty(key);
    }

    get(key) {
        return this.has(key) ? this._attributes[key] : null;
    }

    _parse(buffer) {
        let attributes = {}
        let arr = buffer.split(';')

        while (arr.length > 0) {
            let item = arr.shift()
            let parts = item.split(':')
            let key = parts.shift()
            let val = parts.join(':')

            if (key.toLowerCase() == 'msg') {
                arr.unshift(val)
                attributes.msg = arr.join(';') // join the rest back
                break
            }
            else if (key.length > 0) {
                attributes[key.toLowerCase()] = val.toLowerCase()
            }
        }
        return attributes
    }
}