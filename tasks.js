import gulp from 'gulp';
import file from 'gulp-file';
import React from 'react';

import Site from './src/components/Site';

gulp.task('renderSite', function renderSite() {
  let rendered = React.renderToString(<Site />);

  return file('site.html', rendered, {src: true})
    .pipe(gulp.dest('dist'));
});
