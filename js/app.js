/* globals angular */
;(function () {
	angular
		.module("app", [
			"ionic",
			"appViewCache",
			"pasvaz.bindonce",
			"pickadate"
			])
		.config(['$httpProvider', function (http) {
			http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			http.defaults.transformRequest.unshift(function (data) {
				if(!data) return "";
				var params = data.params, result=[];
				if (params) {
					for(var key in params) {
						if(params.hasOwnProperty(key)) {
							result.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
						}
					}
					return result.join("&");
				}
				return "";
			});
		}])
		.run(["$ionicPlatform","$ionicLoading","$rootScope", "$window",
			function (ionicPlatform, ionicLoading, rootScope) {
				rootScope.$on('$stateChangeStart', function () {
					ionicLoading.show({
						template: '<i class="icon ion-loading-b"></i>'
					});
				});
				rootScope.$on("$stateChangeSuccess", function () {
					ionicLoading.hide();
				});
		}]).run(["utilService","$window", function (util, win) {
			var profile = util.parseJsonData("profile");
			if (!profile || !profile.sid) {
				win.location.href = "http://ui.ptlogin2.qzone.com/cgi-bin/login?style=9&appid=1000000000&pt_ttype=1&s_url=http%3A%2F%2Fttest.m.qzone.com%2Fwish%2Flogin";
			}
		}]);
})();
