/*
 * node-appcache-generator
 * https://github.com/arcturus/node-appcache-generator
 *
 * Copyright (c) 2013 Francisco Jordano
 * Licensed under the MPL 2.0 license.
 */

'use strict';

var AppCacheGenerator = function(sources, network, fallback, NL) {
  this.sources = sources || [];
  this.network = network || [];
  this.fallback = fallback || [];
  this.NL = NL || '\n';
};

AppCacheGenerator.prototype.generate = function() {
  // Use contactenation since seems that is faster
  // than array join.
  var content = 'CACHE MANIFEST' + this.NL;

  // Version by date
  content += '# version ' + new Date() + this.NL;

  var self = this;

  // Cache section
  content += 'CACHE:' + this.NL;
  this.sources.forEach(function(source) {
    content += source + self.NL;
  });

  // Network section
  content += 'NETWORK:' + this.NL;
  this.network.forEach(function(nt) {
    content += nt + self.NL;
  });

  // Fallback section
  content += 'FALLBACK:' + this.NL;
  this.fallback.forEach(function(fb) {
    content += fb + self.NL;
  });

  return content;
};

AppCacheGenerator.prototype.generateFromDir = function(dirName, cb) {
  if (!dirName || !cb) {
    throw new Error('Invalid parameters');
  }

  var readdir = require('recursive-readdir');
  var self = this;
  readdir(dirName, function onReadDir(err, files) {
    if (err) {
      cb(err);
      return;
    }

    self.sources = [];
    files.forEach(function onFile(file) {
      self.sources.push(file.substr(dirName.length + 1));
    });
    cb(null, self.generate());
  });
};

var AppCacheValidator = function() {

};

AppCacheValidator.prototype.validate = function(manifest) {
  if (manifest) {
    console.log('ok');
  }
};

exports.Generator = AppCacheGenerator;
exports.Validator = AppCacheValidator;
