const p = require('./package.json');

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const runSequence = require('run-sequence');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

const dir = {
    modules: './node_modules/',
    assets: './src/assets/**/*',
    src: './src/main/**/*{ts,tsx}',
    target: './target/**/*'
};

tsPipeline.registerBuildGulpTasks(
    gulp,
    {
        entryPoints: {
            'app': __dirname + '/src/main/web/Main.tsx'
        },
        outputDir: __dirname + '/target',
        tsLintFile: ts
    }
);

gulp.task('clean', function () {
    return del(['target']);
});

gulp.task('assets', function () {
    return gulp.src(dir.assets)
        .pipe(gulp.dest('target/'));
});

gulp.task('build',  function (callback) {
    runSequence('tsPipeline:build:dev', callback);
});

gulp.task('watch', function () {
    gulp.watch([dir.src, dir.assets], ['build', 'assets']);
});

gulp.task('default', function (callback) {
    runSequence('clean',
        'build',
        'assets',
        callback);
});