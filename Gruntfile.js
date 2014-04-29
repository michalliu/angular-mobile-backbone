module.exports = function(grunt){
	var libversion="v1";
	var pageversion="v3";
	var cssversion="v1";
	var tplfolder="./tpl";
	var tempfolder="./temp";
	var releasefolder="./release";
	grunt.initConfig({
		// convert AngularJs html templates to cached JavaScript
		html2js: {
			main: {
				options: {
					base: "",
					module: 'appTemplateCache'
				},
				src: [ 'views/**/*.html' ],
				dest: 'js/providers/views.js'
			}
		},
		// concat js and css files to temp folder
		concat:{
			options:{
				separator: ';\n'
			},
			lib:{
				src:["js/lib/zepto.js","js/lib/iscroll.js","js/lib/angular.js","js/lib/angular-*.js"],
				dest: tempfolder+"/js/lib.js"
			},
			page:{
				src:["js/app.js","js/providers/*.js","js/controllers/**/*.js"],
				dest: tempfolder+"/js/page.js"
			},
			css:{
				src:["css/angular-mobile-bootstrap.css","css/*.css"],
				dest: tempfolder+"/all.css"
			}
		},
		// uglify js files put to release folder
		uglify:{
			release:{
				files:[{
					src:[tempfolder+"/js/lib.js"],
					dest:releasefolder+"/js/lib.js"
				},{
					src:[tempfolder+"/js/page.js"],
					dest:releasefolder+"/js/page.js"
				}]
			}
		},
		// uglify css files put to release folder
		cssmin:{
			minify: {
				src:tempfolder+"/all.css",
				dest:releasefolder+"/css/all.css"
			}
		},
		// generate html files
		includereplace:{
			options:{
				globals: {
					"libversion": libversion,
					"pageversion": pageversion,
					"cssversion": cssversion
				},
				processIncludeContents:true
			},
			html_dev:{
				src: tplfolder+'/develop/index.html',
				dest: 'index.html'
			},
			html_release:{
				src: tplfolder+'/release/index.html',
				dest: releasefolder+'/index.html'
			}
		},
		htmlmin:{
			dist:{
				options:{
					removeComments: true,
					collapseWhitespace: true
				},
				files:{
					"./release/index.html": "./release/index.html"
				}
			}
		},
		connect:{
			server: {
				options: {
					port: 9001,
					keepalive:true
				}
			}
		},
		// unused
		compress:{
			main:{
				options: {
					archive: "html.zip",
					mode:"zip"
				},
				files:[
					{expand:true, src: ["index.html","views/**/*.html"],dest:"/"}
				]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-include-replace');
	//grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('html',['includereplace']);
	grunt.registerTask('release_css',['concat:css','cssmin']);
	grunt.registerTask('release_js',['html2js','concat:lib','concat:page','uglify']);
	grunt.registerTask('release_jscss',['html2js','concat','uglify','cssmin']);
	grunt.registerTask('release_html',['html','htmlmin']);
	grunt.registerTask('release',['release_jscss','release_html']);
	grunt.registerTask('default',['release']);
	grunt.registerTask('serve',['connect']);
};
