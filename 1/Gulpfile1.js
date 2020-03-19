"use strict";

const config = require('./gulp/config');

const fs = require('fs');
const gulp = require('gulp');
const zip = require('gulp-zip');
const file = require('gulp-file');
const clean = require('gulp-clean');
const localizationProcessor = require("./scripts/localizationProcessor");

gulp.task('cleanDist', function() {
    return gulp.src('dist', {read: false, allowEmpty: true}).pipe(clean());
});

gulp.task('copyLocalization', function() {
    return gulp.src(config.copyLocalization.src)
        .pipe(gulp.dest(config.copyLocalization.dest));
});

//Prepare
gulp.task('prepareFragments', async function() {
    const fragmentsList = Array.from(require('./fragments/fragments_list.json'));
    const descriptorTemplate = require('./descriptor.template.json');
    for (let fragment of fragmentsList) {
        const dirName = 'dist/mui/' + fragment.fragmentName;
        const fragmentDescriptor = JSON.stringify({...descriptorTemplate, ...fragment}, null, 2);
        // create descriptor
        await new Promise(resolve =>
            file('descriptor.json', fragmentDescriptor,  {src: true})
                .pipe(gulp.dest(dirName))
                .on('end', resolve)
        );
        // copy css
        // await new Promise(resolve =>
        //     gulp.src(config.prepareSrc.css)
        //         .pipe(gulp.dest(dirName + '/css'))
        //         .on('end', resolve)
        // );
        // copy js
        await new Promise(resolve =>
            gulp.src(config.prepareSrc.js)
                .pipe(gulp.dest(dirName + '/js'))
                .on('end', resolve)
        );
    }
});

//Prepare plugins
gulp.task('preparePlugins', async function () {
    const pluginsList = require('./fragments/plugins_list.json');
    const descriptorTemplate = require('./descriptor.template.json');
    const muiDir = "./dist/mui/";

    if (!fs.existsSync(muiDir)) {
        fs.mkdirSync(muiDir);
    }

    pluginsList.forEach(async plugin => {
        const dirName = muiDir + plugin.fragmentName;

        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }

        const jsFilePath = `dist/${plugin.fragmentName}.js`;

        await new Promise(resolve =>
            gulp.src(jsFilePath)
                .pipe(gulp.dest(dirName + "/js"))
                .on('end', resolve)
        );

        const pluginDescriptor = JSON.stringify({...descriptorTemplate, ...plugin}, null, 2);

        fs.writeFileSync(dirName + "/descriptor.json", pluginDescriptor);
    });
});

//Zip
gulp.task('zipFragments', function () {
    return gulp.src('./dist/mui/**')
        .pipe(zip('configuration.zip'))
        .pipe(gulp.dest("./dist"));
});

gulp.task('removeDistMui', function() {
    return gulp.src('dist/mui', {read: false}).pipe(clean());
});

gulp.task('fragmentsProd', gulp.series(
    'copyLocalization',
    'prepareFragments',
));

gulp.task("convert-localization-json-to-xliff", () => {
    return new Promise((resolve, reject) => {
        localizationProcessor.convertJsonLocalizationToXlf();
        resolve();
    });
});
