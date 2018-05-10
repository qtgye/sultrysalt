const fs = require('fs-extra');
const gulp = require('gulp');
const sass = require('gulp-sass');
const through = require('through2');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');


function compileStyle() {
	return new Promise((resolve, reject) => {
		gulp.src('./src/style/style.scss')
			.pipe(plumber())
			.pipe(sass())
			.pipe(through.obj(function (file) {
				resolve(file.contents.toString());
			}));
	});
}

function compileScript() {
	return fs.readFileSync('./src/script.js').toString();
}

function compileHTMLBody() {
	let html = fs.readFileSync('./src/body.html').toString();
	// Replace SVGs
	return html.replace(/{{svg[-]([a-zA-Z0-9]+)}}/gi, (match, p1) => fs.readFileSync(`./assets/${p1}.svg`).toString());
}


gulp.task('default', async () => {

	Promise.all([compileStyle(), compileScript(), compileHTMLBody()])
	.then(([style, script, body]) => {
		let template = fs.readFileSync('./src/template').toString();

		template = template
		.replace(/\{\{style\}\}/g, style)
		.replace(/\{\{script\}\}/g, script)
		.replace(/\{\{body\}\}/g, body);

		fs.outputFileSync('./dist/index.html', template);

		if ( browserSync.initialized ) {
			browserSync.reload();
		}
	});

});

gulp.task('watch', ['default'], () => {

	browserSync.init({
		server: {
			baseDir: './dist'
		}
	}, () => {
		browserSync.initialized = true;
	});

	gulp.watch(['./src/*', './src/**/*'], ['default']);

});