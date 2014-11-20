/*globals module,require*/
module.exports = function(grunt){
	var tempfolder="./temp/";
	var releasefolder="./release/";
	var jadedata=function(){
		var config = require("./tpl/config.json");
		config.maxage="31104000";
		config.lastupdate=new Date();
		config.cssversion="v1";
		config.jslibversion="v1";
		config.jspageversion="v1";
		config.jsheadversion="v1";
		return config;
	};
	grunt.initConfig({
		// convert AngularJs html templates to cached JavaScript
		html2js: {
			main: {
				options: {
					base: "",
					module: 'appViewCache'
				},
				src: [ 'views/**/*.html' ],
				dest: 'js/services/appViewCache.js'
			}
		},
		// concat js and css files to temp folder
		concat:{
			js:{
				options:{
					separator: ';\n'
				},
				files:{
					"temp/js/lib.js" : ["lib/zepto/zepto.js",
										"lib/zepto/zepto-fx.js",
										"lib/ionic/js/ionic.js",
										"lib/angular/angular.js",
										"lib/ionic/js/angular/angular-animate.js",
										"lib/ionic/js/angular/angular-sanitize.js",
										"lib/ionic/js/angular-ui/angular-ui-router.js",
										"lib/ionic/js/ionic-angular.js",
										"js/lib/*.js"],
					"temp/js/page.js": [
										"js/app.js",
										"js/app.routes.js",
										"js/services/*.js",
										"js/filters/*.js",
										"js/directives/*.js",
										"js/controllers/**/*.js"]
				}
			},
			css:{
				options:{
					separator: '\n'
				},
				files:{
					"temp/all.css":["lib/ionic/css/ionic.css","css/*.css"]
				}
			}
		},
		// uglify js files put to release folder
		uglify:{
			release:{
				files:[{
					src:[tempfolder+"js/lib.js"],
					dest:releasefolder+"js/lib.js"
				},{
					src:[tempfolder+"js/page.js"],
					dest:releasefolder+"js/page.js"
				}]
			}
		},
		// uglify css files put to release folder
		cssmin:{
			minify: {
				src:tempfolder+"all.css",
				dest:releasefolder+"css/all.css"
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
		jade: {
			debug: {
				options:{
					data: jadedata,
					pretty:true
				},
				files:[{
					src: ["tpl/index_dev.jade"],
					dest: "index.html"
				}]
			},
			release: {
				options:{
					data: jadedata,
					pretty:false // default is false
				},
				files:[{
					src: ["tpl/index.jade"],
					dest: releasefolder + "index.html"
				}]
			}
		},
		clean: {
			temp: ["temp"]
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
		},
		htmlmin:{
			dist:{
				options:{
					removeComments: false,
					collapseWhitespace: true
				},
				files:{
					"./release/index.html": "./release/index.html"
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	//grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('release_css',['concat:css','cssmin']);
	grunt.registerTask('release_js',['html2js','concat:js','uglify']);
	grunt.registerTask('release_jscss',['html2js','concat','uglify','cssmin']);
	grunt.registerTask('release_html',['jade:release','htmlmin']);
	grunt.registerTask('release',['release_jscss','release_html']);
	grunt.registerTask('debug',['jade:debug']);
	grunt.registerTask('default',['release','clean:temp']);
	grunt.registerTask('serve',['connect']);
};
