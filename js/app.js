/*globals angular*/
(function appInit() { "use strict";

	var entry="/index";

	angular.module("app",["ngRoute",
		"ngAnimate", // comment it to disable animation
		"ngTouch",
		"appControllers",
		"appTemplateCache",
		"appProviders",
		"appFilters",
		"appDirectives"
		]).

	// Config
	config(["$routeProvider", function ($route) {

		var resolve={
			delay: ["$q","$timeout",function ($q, $timeout){
				var d=$q.defer();
				// we must leave 50ms dealy between 2 $digest cycle, 
				// otherwise the animation look very weird on mobile
				$timeout(d.resolve, 50, false);
				return d.promise;
			}]
		};

		// Routing configuration
		$route.
		when('/index',{
			templateUrl: "views/index.html",
			controller:"IndexControl",
			resolve:resolve
		}).
		when("/index/module/a",{
			templateUrl: "views/a.html",
			controller:"AControl",
			resolve:resolve
		}).
		when("/index/module/b",{
			templateUrl: "views/b.html",
			controller:"BControl",
			resolve:resolve
		}).
		when("/index/module/b/:id",{
			templateUrl: "views/b_id.html",
			controller:"BIdControl",
			resolve:resolve
		}).
		otherwise({
			redirectTo:entry
		});
	}]).
	// we must inject page here, let page initlized firstly,let page handle the route parameters
	run(["$rootScope","page",function ($rootScope,page){
		/*jshint unused:false*/
		var routeCount=0; // routing count

		// determine animation direction
		$rootScope.$on('$routeChangeStart', function(angularEvent, next) {
			var isDownwards = true;
			var newLocation;
			if (next && next.$$route) {
				newLocation = next.$$route.originalPath;
				if (oldLocation !== newLocation && oldLocation && oldLocation.indexOf(newLocation) !== -1) {
					isDownwards = false;
				}
			}
			oldLocation = newLocation;
			if (routeCount++ < 1){ // no animation on first time render
				//$rootScope.pageAnimationClass="slideLeft";
				return;
			}
			$rootScope.pageAnimationClass = isDownwards ? 'slideLeft' : 'slideRight';
		});

	}]);

	var oldLocation='';

	// define modules
	angular.module("appControllers", []); // controllers to control views
	angular.module("appProviders", []);   // providers,services etc
	angular.module("appFilters", []);     // filters
	angular.module("appDirectives", []);  // directives

}());
