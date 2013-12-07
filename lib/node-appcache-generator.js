/*
 * node-appcache-generator
 * https://github.com/arcturus/node-appcache-generator
 *
 * Copyright (c) 2013 Francisco Jordano
 * Licensed under the MPL 2.0 license.
 */

'use strict';

var AppCacheGenerator = function(sources, network, fallback) {
  this.sources = sources;
  this.network = network;
  this.fallback = fallback;
};

AppCacheGenerator.prototype.generate = function() {
  // Use contactenation since seems that is faster
  // than array join.
  var NL = '\n';
  var content = 'CACHE MANIFEST' + NL;

  // Version by date
  content += '# version ' + new Date() + NL;

  // Cache section
  content += 'CACHE:' + NL;
  this.sources.forEach(function(source) {
    content += source + NL;
  });

  // Network section
  content += 'NETWORK:' + NL;
  this.network.forEach(function(nt) {
    content += nt + NL;
  });

  // Fallback section
  content += 'FALLBACK:' + NL;
  this.fallback.forEach(function(fb) {
    content += fb + NL;
  });

  return content;
};

var AppCacheValidator = function() {

};

AppCacheValidator.prototype.validate = function(manifest) {
  manifest += '';
};

exports.Generator = AppCacheGenerator;
exports.Validator = AppCacheValidator;
