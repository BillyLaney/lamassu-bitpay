/*
* THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
* WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
* OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
* INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
* STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
* IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

var https = require('https');
var parseJsonResponse = require('parse-json-response');
var _ = require('lodash');

var BitpayTicker = function(config) {
  this.host = config.host || 'bitpay.com';
  this.port = config.port || 443;
  this.rejectUnauthorized = typeof config.rejectUnauthorized === 'boolean'
    ? config.rejectUnauthorized
    : true;
  this.config = config;
};

BitpayTicker.factory = function factory(config) {
  return new BitpayTicker(config);
};

BitpayTicker.prototype.ticker = function ticker(currency, cb) {
  if (typeof currency === 'function' && !cb) {
    cb = currency;
    currency = 'USD';
  }
  
  https.get({
    host: this.host,
    port: this.port,
    rejectUnauthorized: this.rejectUnauthorized,
    path: '/api/rates'
  }, parseJsonResponse(function(err, body, res) {
    if (err) {
      return callback(err);
    }

    var rec = _.findWhere(body, {code: currency});

    if (!rec) {
      cb(new Error('Currency not listed: ' + currency));
      return;
    }
    cb(null, rec.rate);
  }));
};

module.exports = BitpayTicker;
