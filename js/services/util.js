/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("utilService", [
			utilService]);

	function utilService() {
		var util;

		util = {
			dateTime: {
				timeFormatString: function (date, ptn, baseTime) {
					try{
						date = date.getTime ? date : (new Date(date));
					}catch(ign){
						return '';
					}
					var me = util.dateTime.timeFormatString;
					if (!me._map) {
						me._map = {	//sds 不要更改
							y: ['getYear', 31104000000],
							Y: ['getFullYear', 31104000000, '\u5E74\u524D'],
							M: ['getMonth', 2592000000, '\u4E2A\u6708\u524D'],
							d: ['getDate', 86400000, '\u5929\u524D'],
							h: ['getHours', 3600000, '\u5C0F\u65F6\u524D'],
							m: ['getMinutes', 60000, '\u5206\u949F\u524D'],
							s: ['getSeconds', 1000, '\u79D2\u524D']
						};
					}
					if (!me._units) {
						me._units=['Y', 'M', 'd', 'h', 'm', 's'];
					}
					if (!me._re) {
						me._re=/\{([_yYMdhms]{1,2})(?:\:([\d\w\s]))?\}/g;
					}
					var map = me._map,
						unt = me._units,
						rel = false,
						t,
						delta,
						v;

					if(!ptn){
						baseTime = baseTime || new Date();

						delta = Math.abs(date - baseTime);
						for(var i = 0, len = unt.length; i < len; ++i){
							t = map[unt[i]];
							if(delta > t[1]){
								return Math.floor(delta / t[1]) + t[2];
							}
						}
						return "刚刚";
					}else{
						return ptn.replace(me._re, function(a, b, c){
								(rel = b.charAt(0) == '_') && (b = b.charAt(1));
								if(!map[b]){
									return a;
								}
								if (!rel) {
									v = date[map[b][0]]();
									b == 'y' && (v %= 100);
									b == 'M' && v++;
									return v < 10 ? fillLength(v, 2, c) : v.toString();
								} else {
									return Math.floor(Math.abs(date - baseTime) / map[b][1]);
								}
							});
					}
				},

				getTimeDesc: function(time) {
					var tmp, td = new Date(), nowt = new Date(), d = 3600 * 24 * 1000, fix8 = 3600 * 8 * 1000,
						_nt = nowt.getTime(), _t = time * 1000;
					var timeFormatString=util.dateTime.timeFormatString;
					var nextyear;
					nowt.setTime(_nt);
					nextyear = new Date(nowt.getFullYear() + 1 + "-01-01T00:00:00Z");
					td.setTime(time * 1000);
					_t = Math.floor(
							((_nt + fix8) / d) - Math.floor((_t + fix8) / d)
							);
					if (_t === 1) {//今天
						tmp = "今天" + timeFormatString(td, " {h}:{m}");
					} else if (td.getTime() < nextyear.getTime()){//年度内
						tmp = timeFormatString(td, "{M: }月{d: }日").replace(/\s/g, "") + timeFormatString(td, " {h}:{m}");
					} else {//年度外
						tmp = timeFormatString(td, "{Y: }年{M: }月{d: }日").replace(/\s/g, "") + timeFormatString(td, " {h}:{m}");
					}
					return tmp;
				},

				getCurrentDate: function () {
					var dt=new Date();
					var dtm=dt.getMonth() + 1;
					if (dtm < 10) dtm = "0" + dtm;
					return dt.getFullYear() + "-" + dtm + "-" + dt.getDate();
				}
			}
		};

		/**
		* 用指定字符补足需要的数字位数
		*
		* @param {string} s 源字符串
		* @param {number} l 长度
		* @param {string} [ss="0"] 指定字符
		* @param {boolean} [isBack=false] 补足的方向: true 后方; false 前方;
		* @returns {string} 返回的结果串
		*/
		function fillLength(source, l, ch, isRight){
			if ((source = String(source)).length < l) {
				var ar = new Array(l - source.length);
				ar[isRight ? 'unshift' : 'push'](source);
				source = ar.join(ch || '0');
			}
			return source;
		}
		return util;
	}
})();
