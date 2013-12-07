'use strict';

var appcache = require('../lib/node-appcache-generator.js');
var proxyquire = require('proxyquire');

exports.appcache = {
  setUp: function(done) {
    this.sources = [
      'index.html',
      'styles/style.css',
      'images/image.png',
      'offline.html'
    ];
    this.network = [
      '*'
    ];
    this.fallback = [
      '/ /offline.html'
    ];
    // setup here
    done();
  },
  empty: function(test) {
    var generator = new appcache.Generator([], [], []);
    var output = generator.generate();
    test.ok(output.length > 0);
    test.ok(output.indexOf('CACHE MANIFEST') !== -1);
    test.ok(output.indexOf('version') !== -1);
    test.ok(output.indexOf('CACHE:') !== -1);
    test.ok(output.indexOf('NETWORK:') !== -1);
    test.ok(output.indexOf('FALLBACK:') !== -1);
    test.done();
  },
  cacheSection: function(test) {
    var generator = new appcache.Generator(this.sources, [], []);
    var output = generator.generate();
    var indexCache = output.indexOf('CACHE:');
    var indexNetwork = output.indexOf('NETWORK:');

    test.ok(indexCache > -1);
    test.ok(indexNetwork > -1);

    this.sources.forEach(function onSources(s) {
      var sourceIndex = output.indexOf(s);
      test.ok(sourceIndex > -1);
      test.ok(sourceIndex > indexCache);
      test.ok(sourceIndex < indexNetwork);
    });
    test.done();
  },
  networkSection: function(test) {
    var generator = new appcache.Generator(this.sources, this.network, []);
    var output = generator.generate();
    var indexNetwork = output.indexOf('NETWORK:');
    var indexFallback = output.indexOf('FALLBACK:');

    test.ok(indexFallback > -1);
    test.ok(indexNetwork > -1);

    this.network.forEach(function onNetwork(n) {
      var networkIndex = output.indexOf(n);
      test.ok(networkIndex > -1);
      test.ok(networkIndex > indexNetwork);
      test.ok(networkIndex < indexFallback);
    });
    test.done();
  },
  fallbackSection: function(test) {
    var generator = new appcache.Generator(this.sources, this.network,
      this.fallback);
    var output = generator.generate();

    var indexFallback = output.indexOf('FALLBACK:');

    test.ok(indexFallback > -1);
    this.fallback.forEach(function onFallback(f) {
      var fallbackIndex = output.indexOf(f);
      test.ok(fallbackIndex > -1);
      test.ok(fallbackIndex > indexFallback);
    });
    test.done();
  },
  version: function(test) {
    var generator = new appcache.Generator(this.sources, this.network,
      this.fallback);
    var output = generator.generate();

    var VERSION = 'version ';

    var indexVersion = output.indexOf(VERSION);
    test.ok(indexVersion > -1);
    var indexNL = output.indexOf(generator.NL, indexVersion);
    test.ok(indexNL > -1);
    var start = indexVersion + VERSION.length;
    var length = indexNL - start;
    test.ok(length > 0);
    var manifestVersion = output.substr(start, length);

    var date = new Date(manifestVersion);
    var now = new Date();

    test.ok(date.year === now.year);
    test.ok(date.month === now.moth);
    test.ok(date.day === date.day);

    // Difference between dates shouldn't be that big
    test.ok((now.getTime() - date.getTime()) < 5 * 1000);
    test.done();
  },
  recursive: function(test) {
    var self = this;
    var dir = './projects/html5/myproject';
    var proxy = proxyquire('../lib/node-appcache-generator.js',
      {
        'recursive-readdir': function(dirName, cb) {
          test.equal(dir, dirName);

          cb(null, self.sources);
        }
      }
    );

    var generator = new proxy.Generator([], [], []);
    generator.generateFromDir(dir, function(err, output) {
      test.ok(output.length > 0);
      test.ok(output.indexOf('CACHE MANIFEST') !== -1);
      test.ok(output.indexOf('version') !== -1);
      test.ok(output.indexOf('CACHE:') !== -1);
      test.ok(output.indexOf('NETWORK:') !== -1);
      test.ok(output.indexOf('FALLBACK:') !== -1);
      test.done();
    });
  }
};
