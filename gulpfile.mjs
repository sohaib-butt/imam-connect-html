import browsersync from "browser-sync";
import cached from "gulp-cached";
import CleanCSS from "clean-css";
import cssnano from "gulp-cssnano";
import { deleteSync } from "del";
import fileinclude from "gulp-file-include";
import gulp from "gulp";
import gulpif from "gulp-if";
import npmdist from "gulp-npm-dist";
import replace from "gulp-replace";
import uglify from "gulp-uglify";
import useref from "gulp-useref-plus";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";

const browsersyncInstance = browsersync.create();

const paths = {
  base: {
    base: {
      dir: "./",
    },
    node: {
      dir: "./node_modules",
    },
    packageLock: {
      files: "./package-lock.json",
    },
  },
  dist: {
    base: {
      dir: "./dist",
      files: "./dist/**/*",
    },
    libs: {
      dir: "./dist/assets/libs",
    },
    css: {
      dir: "./dist/assets/css",
    },
    js: {
      dir: "./dist/assets/js",
      files: "./dist/assets/js/pages",
    },
  },
  src: {
    base: {
      dir: "./src",
      files: "./src/**/*",
    },
    css: {
      dir: "./src/assets/css",
      files: "./src/assets/css/**/*.css",
    },
    html: {
      dir: "./src",
      files: "./src/**/*.html",
    },
    img: {
      dir: "./src/assets/images",
      files: "./src/assets/images/**/*",
    },
    js: {
      dir: "./src/assets/js",
      pages: "./src/assets/js/pages",
      files: "./src/assets/js/pages/*.js",
      main: "./src/assets/js/*.js",
    },
    partials: {
      dir: "./src/partials",
      files: "./src/partials/**/*",
    },
  },
};

gulp.task("browsersync", function (callback) {
  browsersyncInstance.init({
    server: {
      baseDir: [paths.dist.base.dir, paths.src.base.dir, paths.base.base.dir],
    },
  });
  callback();
});

gulp.task("browsersyncReload", function (callback) {
  browsersyncInstance.reload();
  callback();
});

gulp.task("watch", function () {
  gulp.watch(paths.src.css.files, gulp.series("css", "browsersyncReload"));
  gulp.watch(paths.src.js.dir, gulp.series("js", "browsersyncReload"));
  gulp.watch(
    [paths.src.html.files, paths.src.partials.files],
    gulp.series("fileinclude", "browsersyncReload")
  );
});

gulp.task("js", function () {
  return (
    gulp
      .src(paths.src.js.main)
      // .pipe(uglify())
      .pipe(gulp.dest(paths.dist.js.dir))
  );
});

const cssOptions = {
  compatibility: "*", // (default) - Internet Explorer 10+ compatibility mode
  inline: ["all"], // enables all inlining, same as ['local', 'remote']
  level: 2, // Optimization levels. The level option can be either 0, 1 (default), or 2, e.g.
};

gulp.task("css", function () {
  return gulp
    .src(paths.src.css.files)
    .pipe(sourcemaps.init())
    // .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.dist.css.dir))
    .on("data", function (file) {
      const buferFile = new CleanCSS(cssOptions).minify(file.contents);
      file.contents = Buffer.from(buferFile.styles);
    })
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(paths.dist.css.dir));
});

gulp.task("fileinclude", function () {
  return gulp
    .src([
      paths.src.html.files,
      "!" + paths.dist.base.files,
      "!" + paths.src.partials.files,
    ])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(cached())
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task("clean:packageLock", function (callback) {
  deleteSync(paths.base.packageLock.files); // Use deleteSync
  callback();
});

gulp.task("clean:dist", function (callback) {
  deleteSync(paths.dist.base.dir); // Use deleteSync
  callback();
});

gulp.task("copy:all", function () {
  return gulp
    .src([
      paths.src.base.files,
      "!" + paths.src.partials.dir,
      "!" + paths.src.partials.files,
      "!" + paths.src.css.dir,
      "!" + paths.src.css.files,
      "!" + paths.src.js.dir,
      "!" + paths.src.js.files,
      "!" + paths.src.js.main,
      "!" + paths.src.html.files,
    ])
    .pipe(gulp.dest(paths.dist.base.dir));
});

// gulp.task("copy:libs", function () {
//   const libs = npmdist();
//   console.log("libs======>>>", libs); // Log the output of npmdist()
//   return gulp
//     .src(libs, { base: paths.base.node.dir })
//     .pipe(
//       rename(function (path) {
//         path.dirname = path.dirname.replace(/\/dist/, "").replace(/\\dist/, "");
//       })
//     )
//     .pipe(gulp.dest(paths.dist.libs.dir));
// });

gulp.task("html", function () {
  return gulp
    .src([
      paths.src.html.files,
      "!" + paths.dist.base.files,
      "!" + paths.src.partials.files,
    ])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1assets/libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1assets/libs'))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif("*.js", uglify()))
    .pipe(gulpif("*.css", cssnano({ svgo: false })))
    .pipe(gulp.dest(paths.dist.base.dir));
});

// Default (Production) Task
gulp.task(
  "default",
  gulp.series(
    gulp.parallel(
      "clean:packageLock",
      "clean:dist",
      "copy:all",
      // "copy:libs",
      "fileinclude",
      "css",
      "js",
      "html"
    ),
    gulp.parallel("browsersync", "watch")
  )
);

// Build (Development) Task
gulp.task(
  "build",
  gulp.series(
    "clean:packageLock",
    "clean:dist",
    "copy:all",
    // "copy:libs",
    "fileinclude",
    "css",
    "js",
    "html"
  )
);
