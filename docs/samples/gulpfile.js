'use strict';

var path = require('path'),
    gulp = require('gulp'),
    webpack = require('webpack-config-stream');

var src = './src',
    dest = './dist',
    webpackConfig = {
        debug: true,
        devtool: '#source-map',
        watchDelay: 200
    },
    webpackOptions = {
        useMemoryFs: true,
        progress: true
    },
    CONFIG_FILENAME = webpack.Config.FILENAME;

gulp.task('webpack', [], function() {
    return gulp.src(path.join(src, '**', CONFIG_FILENAME), { base: path.resolve(src) })
        .pipe(webpack.init(webpackOptions))
        .pipe(webpack.props(webpackConfig))
        .pipe(webpack.run())
        .pipe(webpack.format({
            version: false,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
    gulp.watch(path.join(src, '**/*.*')).on('change', function(event) {
        if (event.type === 'changed') {
            gulp.src(event.path, { base: path.resolve(src) })
                .pipe(webpack.closest(CONFIG_FILENAME))
                .pipe(webpack.init(webpackOptions))
                .pipe(webpack.props(webpackConfig))
                .pipe(webpack.watch(function(err, stats) {
                    gulp.src(this.path, { base: this.base })
                        .pipe(webpack.proxy(err, stats))
                        .pipe(webpack.format({
                            verbose: true,
                            version: false
                        }))
                        .pipe(gulp.dest(dest));
                }));
        }
    });
});
