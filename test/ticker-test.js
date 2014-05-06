'use strict';

var test = require('tap').test;
var Ticker = require('../lib/ticker').factory();

test('Read ticker', function(t){
  Ticker.ticker(['USD', 'EUR', 'ILS'], function(err, results) {
    t.plan(4 * 3 + 1);
    t.equal(err, null, 'There should be no error');
    results.forEach(function (result) {
      t.notEqual(result, null, 'There should be a result');
      t.equal(result.error, undefined, 'The result should contain no error');
      t.notEqual(result.rate, undefined, 'A rate should have been returned');
      t.ok(parseFloat(result.rate, 10), 'The rate should be a float');
    })
    t.end();      
  });
});
