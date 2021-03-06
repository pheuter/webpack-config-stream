'use strict';

var expect = require('expect.js'),
    fs = require('vinyl-fs'),
    initStream = require('../lib/initStream'),
    runStream = require('../lib/runStream'),
    failAfterStream = require('../lib/failAfterStream');

describe('failAfterStream', function () {
    it('should throw error when stats have errors or warnings', function(done) {
        var entry = fs.src('test/fixtures/failAfterStream/webpack.config.js'),
            init = initStream({
                useMemoryFs: true,
                progress: false
            }),
            run = runStream(function() {}),
            failAfter = failAfterStream({
                errors: true,
                warnings: true
            });

        failAfter.on('data', function() {
            this.on('error', function(err) {
                expect(err.message).to.contain(failAfterStream.MESSAGE);

                done();
            });
        });

        entry.pipe(init).pipe(run).pipe(failAfter);
    });
});
