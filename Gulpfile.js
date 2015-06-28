'use strict';

var gulp     = require( 'gulp' ),
    connect = require( 'gulp-connect' ),
    stylus      = require( 'gulp-stylus' ),
    nib = require( 'nib' ),
    jshint      = require( 'gulp-jshint' ),
    stylish     = require( 'jshint-stylish' ),
    historyApiFallback = require( 'connect-history-api-fallback' ),
    inject       = require( 'gulp-inject' ),
    wiredep  = require( 'wiredep' ).stream;

// Development web server
gulp.task('server', function(){
    connect.server( {
        root: './app',
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true,
        middleware: function( connect, opt ) {
            return[ historyApiFallback ];
        }
    });
});

// Search errors on JS code and to show in screen
gulp.task('jshint', function() {
    return gulp.src ( './app/scripts/**/*.js' )
    .pipe( jshint ('.jshintrc' ) )
    .pipe( jshint.reporter ( 'jshint-stylish' ) )
    .pipe( jshint.reporter ( 'fail' ) );
});

// Preprocess Stylus files to CSS and reload the changes
gulp.task( 'css', function() {
    gulp.src( './app/stylesheets/main.styl' )
    .pipe(stylus( { use: nib() } ))
    .pipe( gulp.dest( './app/stylesheets' ) )
    .pipe( connect.reload() );
});

// Reload the browser on HTML changes
gulp.task( 'html', function() {
    gulp.src( './app/**/*.html' )
    .pipe( connect.reload() );
});

// Watch code changes and to run related tasks
gulp.task( 'watch', function() {
    gulp.watch( [ './app/**/*.html' ], [ 'html' ] );
    gulp.watch( [ './app/stylesheets/**/*.styl' ], [ 'css', 'inject' ] );
    gulp.watch( [ './app/scripts/**/*.js', './Gulpfile.js' ], [ 'jshint', 'inject' ] );
    gulp.watch( [ './bower.json' ], [ 'wiredep' ] );
});

// Inject into HTML the path of JS scripts and CSS files
gulp.task('inject', function() {
        var sources = gulp.src( [ './app/scripts/**/*.js' , './app/stylesheets/**/*.css' ] );
        return gulp.src( 'index.html', { cwd: './app' } )
        .pipe( inject( sources, {
            read: false,
            ignorePath: '/app'
    }))
    .pipe( gulp.dest( './app' ) );
});

// Inject the path of Bower dependencies into HTML
gulp.task( 'wiredep', function() {
    gulp.src( './app/index.html' )
    .pipe( wiredep( {
        directory: './app/lib'
    }))
    .pipe( gulp.dest( './app' ) );
});

gulp.task( 'default', [ 'server', 'inject', 'wiredep', 'watch' ] );
