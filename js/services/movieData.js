/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("movieDataService", ["$http", "$q", "$window", movieDataService]);

	function movieDataService(http, defer, win) {

		var service;
		var doc = win.document;

		// lazy initialize callback
		if (!win.MovieData) {
			win.MovieData = {
				_callbacks: {}, // callback map
				_dataCache:{}, // 已加载的数据
				removeCallback: function (callbackId) {
					this._callbacks[callbackId] = null;
					delete this._callbacks[callbackId];
				},
				addCallback: function (callbackId, callback) {
					this._callbacks[callbackId] = callback;
				},
				set: function (key, value) {
					this._dataCache[key] = value; // 存储数据
					var callback;
					for (var callbackId in this._callbacks) {
						if (this._callbacks.hasOwnProperty(callbackId)) {
							callback = this._callbacks[callbackId];
							if (callback) {
								callback(); // 通知有新数据来到
							}
						}
					}
				},
				getData: function (key) {
					return this._dataCache[key];
				}
			};
		}

		// 创建jsonp请求
		function writeScriptTag(url, deferred) {
			var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
			var script = doc.createElement("script");
			script.async = " async";
			script.charset = "utf-8";
			script.src = url;
			script.onload = script.onreadystatechange = function () {
				script.onload = script.onreadystatechange = null;
				if (head && head.parentNode) {
					head.removeChild(script);
				}
				script = null;
			};
			script.onerror = function () {deferred.reject();};
			head.insertBefore(script,head.firstChild);
		}

		service = {
			hotCityList: [
				{"id":10, "name":"北京"},
				{"id":82, "name":"上海"},
				{"id":210, "name":"广州"},
				{"id":221, "name":"深圳"},
				{"id":267, "name":"成都"},
				{"id":83, "name":"南京"},
				{"id":96, "name":"杭州"},
				{"id":179, "name":"武汉"}
			],
			getTheaterListByCityId: function (cityId) {
				var d=defer.defer();
				var expectedKey="cinemas_city_" + cityId;
				var data = win.MovieData.getData(expectedKey);
				var callbackId=Math.random().toString(16).slice(2); // random callback id
				if (data) { // 有缓存
					d.resolve(data);
				} else { // 无缓存
					win.MovieData.addCallback(callbackId,function () {
						var data = win.MovieData.getData(expectedKey);
						if (data) {
							d.resolve(data);
							win.MovieData.removeCallback(callbackId);
						}
					});
					writeScriptTag("http://imgcache.qq.com/piao/data/app/movie/v3/cinemas/cities/{{cityId}}/cinemas_city_{{cityId}}.json".replace(/{{cityId}}/g, cityId), d);
				}
				return d.promise;
			}
		};

		return service;
	}
})();
