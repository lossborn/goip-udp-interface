'use strict';

exports.randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}