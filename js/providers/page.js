/*global angular*/
(function pageProviderInit(){ "use strict";
	var appCache;
	angular.module("appProviders").

	factory("page",["$rootScope",
		"$location",
		"$http",
		"$q",
		"$cacheFactory",
		"$window",function($rootScope,
			$location,
			$http,
			$q,
			$cacheFactory,
			$win){

		if (!appCache){
			appCache=$cacheFactory("appCache");
		}

		var params=angular.copy($location.search());

		// remove ugly initial params
		angular.forEach(params, function (val,key) {
			$location.search(key,null);
		});

		var page={
			params: params,
			constant:{
				timezoneOffset: new Date().getTimezoneOffset() * 60 * 1000
			},
			utility:{
				timeFormat: function timeFormat(timeStamp){
					var timeStr = new Date(timeStamp*1000),
						year = timeStr.getFullYear(),
						month = 1 + timeStr.getMonth(),
						date = timeStr.getDate(),
						hour = timeStr.getHours(),
						minute = timeStr.getMinutes();
					return year + '年' + month + '月' + date +'日  '+ hour +':'+ minute;
				}
			},
			navigate: function navigate(path){
				$location.path(path);
			},
			back: function(){
				$win.history.back();
			},
			dialog:{
				alert: function(message, ok){
					if($win.alert){
						$win.alert(message);
						if(ok){ok();}
					} else{
						// 自定义alert控件
					}
				},
				progress: function(/*title, dispose*/){
				},
				confirm: function(title, message, ok, cancel){
					if($win.confirm){
						if($win.confirm(message)){
							if(ok){ok();}
						} else{
							if(cancel){cancel();}
						}
					} else{
					}
				}
			}	};
		return page;
	}]);
}());
