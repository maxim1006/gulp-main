"use strict";

const gulp     = require("gulp"),
      path     = require("path"),
      svgmin   = require("gulp-svgmin"),
      rename   = require("gulp-rename"),
      inject   = require("gulp-inject"),
      svgstore = require("gulp-svgstore");


gulp.task("svg", () => {
    let svgs = gulp
        .src("./src/assets/themes/base/images/icons/*.svg")
        .pipe(svgmin(function (file) {
            let prefix = path.basename(file.relative, path.extname(file.relative));

            return {
                plugins: [
                    {
                        removeTitle: true
                    },
                    {
                        removeAttrs: {
                            attrs: "(fill|stroke)"
                        }
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix + "-",
                            minify: true
                        }
                    }
                ]
            }
        }))
        .pipe(rename({prefix: "icon-"}))
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src("./src/index.html")
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(gulp.dest("src"));
});



/*HELPERS*/
process.on("uncaughtException", (err) => {
    console.error(err.message, err.stack, err.errors);
    process.exit(255);
})
;

gulp.on("err", (gulpErr) => {
    if(gulpErr.err) {
        console.error("Gulp error details", [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors].filter(Boolean));
        process.exit(255);
    }
});




////////// Temp solution ///////////

// TODO - Disable all info / logs for HMR until the log level issue will be fixed - https://github.com/webpack/webpack/issues/4115
// const fs = require('fs');
// const browser = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
// const styles = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/styles.js';

// const replaceInFile = (filePath, searchRegex, replaceString) => {
//     const fs = require('fs');
//     filePath = path.resolve(filePath);
//
//     fs.readFile(filePath, 'utf8', function (err,data) {
//         if (err) {
//             return console.log(err);
//         }
//
//         const result = data.replace(searchRegex, replaceString);
//
//         fs.writeFile(filePath, result, 'utf8', function (err) {
//             if (err) {
//                 return console.log(err);
//             }
//         });
//     });
// };
//
// // Why do we add `;\n{}`? Some part of the code has if conditions without {} around their content.
// // So we'll just comment out the console.log line we'll get an error. This way we're adding a line that doesn't do anything.
// const emptyStatement = '//$1;\n{}';
// const consoleRegex = /(console\.(info|log).+\);)/g;
// replaceInFile("node_modules/webpack/hot/dev-server.js", consoleRegex, emptyStatement);
// replaceInFile("node_modules/webpack/hot/log-apply-result.js", consoleRegex, emptyStatement);

////////// End of temp solution ///////////


///Users/max/projects/ux-ng2/node_modules/webpack/hot/log.js - вот тут отключаю логи hmr
