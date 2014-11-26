/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("queryStringService", [
			queryString]);

	function queryString() {
		var service;

		service = {
			decode: function (str, opt_sep, opt_decode) {
				var decode = opt_decode || decodeURIComponent,
				sep = opt_sep || '&',
				parts = str.split(sep),
				params = {},
				pair;
				for (var i = 0,l = parts.length; i<l; i++) {
					pair = parts[i].split('=',2);
					if (pair && pair[0]) {
						params[decode(pair[0])] = decode(pair[1]);
					}
				}
				return params;
			}
		};
		return service;
	}
})();
