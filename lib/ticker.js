'use strict';

var jsonquest = require('jsonquest');
var async = require('async');

var BitpayTicker = function(config) {
  this.config = config;
};

BitpayTicker.factory = function factory(config) {
  return new BitpayTicker(config);
};

function fetchTicker(currency, cb) {
  jsonquest({
    host: 'bitpay.com',
    path: '/api/rates/' + currency,
    method: 'GET',
    protocol: 'https'
  }, function (err, response, result) {
    if (err) return cb(err);
    var rate = null;
    try {
      rate = result.rate;
    } catch (ex) {
      return cb(new Error('Could not parse BitPay ticker response.'));
    }
    cb(null, {currency: currency, rate: rate});
  });
}

BitpayTicker.prototype.ticker = function ticker(currencies, cb) {  
  async.map(currencies, fetchTicker, function (err, results) {
    if (err) return cb(err);
    var formattedResult = {};
    results.forEach(function (result) {
      formattedResult[result.currency] = result;
    });
    return cb(null, formattedResult);
  });
};

module.exports = BitpayTicker;
