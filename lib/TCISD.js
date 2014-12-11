
/**
 * 统计上报组件：测速上报 & 返回码上报
 * mangosmwang
*/
(function (){

	if(typeof(window.TCISD) == "undefined"){
		window.TCISD = {};
	}

	//////////// @fileoverview 测速时间点统计器////////////////

	/**
	 * 创建一个时间点统计对象实体
		若是已经创建过相同名称的对象则返回已有对象
	 *
	 * @param {string} [statName = flagArr.join("_")] 时间点统计器的名称
	 * @param {object} [flagArr = [175, 115, 1]] 各个统计参数标识
	 * @param {object} [standardData = null] 时间点统计基准数据
	 {
		 timeStamps:{
			 1: 123, //第一时间点标准时延123ms
			 2: 350  //..二..............350ms
		 }
	 }

	 * @return {object} TCISD.TimeStat instance
	 *
	 *
	 */
	TCISD.createTimeStat = function(statName, flagArr, standardData){
		var _s = TCISD.TimeStat,
			t,
			instance;

		flagArr = flagArr || _s.config.defaultFlagArray; //这里都是内部人用，就不严谨检查了
		t = flagArr.join("_");
		statName = statName || t; //这里都是内部人用，就不严谨检查了

		if(instance = _s._instances[statName]){
			return instance;
		} else {
			return (new _s(statName, t, standardData));
		}
	};

	/**
	 * 给当前时间点统计器打下一个新的时间点记录
		默认增加在序列尾部的位置
	 *
	 * @method
	 * @param {number} [timeStampSeq = instance.timeStamps.length] 时间点的位置
	 * @param {string} [statName = flagArr.join("_")] 时间点统计器的名称
	 * @param {object} [flagArr = [175, 115, 1]] 各个统计参数标识
	 * @param {object} [timeObj = new Date()] 选项
	 * @return {object} TCISD.TimeStat instance
	 *
	 *
	 */
	TCISD.markTime = function(timeStampSeq, statName, flagArr, timeObj){
		var ins = TCISD.createTimeStat(statName, flagArr);
		ins.mark(timeStampSeq, timeObj);

		return ins;
	};

	/**
	 * 时间点统计器类定义
	 *
	 * @class TCISD.TimeStat
	 *
	 *
	 *
	 */
	TCISD.TimeStat = function(statName, flags, standardData){
		var _s = TCISD.TimeStat;
		this.sName = statName;
		this.flagStr = flags;
		this.timeStamps = [null];
		this.zero = _s.config.zero;
		if(standardData){
			this.standard = standardData;
		}
		_s._instances[statName] = this;
		_s._count++;
	};

	/**
	 * 获取一个指定时间点的详细数据，若设置过基准值的话，能得到延迟率指数，可用来参考评价客户端性能
	 *
	 * @method
	 * @param {number} seq 时间点的位置
	 * @return {object} {
							zero: //Date对象表达的改时间点统计器的零时点
							time: //Date对象表达的概时间点统计点的时刻
							duration: //时延（time - zero）
							delayRate: //延迟率：若配置过该时间点的标准延迟，则这里给出延迟率：
									算法：（单位均为ms, 延迟率为负数即标识较快）
										延迟率 = (实际延迟 - 标准延迟) / 标准延迟
						}
	 *
	 *
	 */
	TCISD.TimeStat.prototype.getData = function(seq){
		var r = {}, t, d;
		if(seq && (t = this.timeStamps[seq])){
			d = new Date();
			d.setTime(this.zero.getTime());
			r.zero = d;
			d = new Date();
			d.setTime(t.getTime());
			r.time = d;
			r.duration = t - this.zero;

			if(this.standard && (d = this.standard.timeStamps[seq])){
				r.delayRate = (r.duration - d) / d;
			}
		}else{
			r.timeStamps = TCISD.TimeStat._cloneData(this.timeStamps);
		}

		return r;
	};

	/**
	 * 防止重要数据抛出后被修改
	 *
	 * @private
	 *
	 *
	 */
	TCISD.TimeStat._cloneData = function(obj) {
		if ((typeof obj) == 'object') {
			var res = obj.sort ? [] : {};
			for (var i in obj) {
				res[i] = TCISD.TimeStat._cloneData(obj[i]);
			}
			return res;
		} else if ((typeof obj) == 'function') {
			return Object;
		}
		return obj;
	};


	/**
	 * 给当前时间点统计器打下一个新的时间点记录
		默认增加在序列尾部的位置
	 *
	 * @method
	 * @param {number} [seq = instance.timeStamps.length] 时间点的位置
	 * @param {object} [timeObj = new Date()] 选项
	 * @return {object} TCISD.TimeStat instance
	 *
	 *
	 */
	TCISD.TimeStat.prototype.mark = function(seq, timeObj){
		seq = seq || this.timeStamps.length;
		this.timeStamps[Math.min(Math.abs(seq), 99)] = timeObj || (new Date());
		return this;
	};

	/**
	 * 将另一个时间点统计对象实体合并进来
			例如：A.merge(B); 则将B的时间点序列排在A的时间点序列之前，A的原时间点ID将拍后，位置偏移发生改变，若B有配置过时延对比标准，则标准也将merge到A的标准中，且标准ID维持不变，这里注意一下会发生的对应错误问题

			此功能主要面向Qzone这样的复杂前端场景，iframe中页面对外层时间点统计结果存在“继承”的关系
	 *
	 * @method
	 * @param {object} baseTimeStat TCISD.TimeStat instance
	 * @return {object} TCISD.TimeStat instance
	 *
	 *
	 */
	TCISD.TimeStat.prototype.merge = function(baseTimeStat){
		var x, y;
		if(baseTimeStat && (typeof(baseTimeStat.timeStamps) == "object") && baseTimeStat.timeStamps.length){
			this.timeStamps = baseTimeStat.timeStamps.concat(this.timeStamps.slice(1));
		}else{
			return this;
		}

		if(baseTimeStat.standard && (x = baseTimeStat.standard.timeStamps)){
			if(!this.standard){
				this.standard = {};
			}
			if(!(y = this.standard.timeStamps)){
				y = this.standard.timeStamps = {};
			}
			for(var key in x){
				if(!y[key]){
					y[key] = x[key];
				}
			}
		}

		return this;
	};
	/**
	 * 显式设置一个0时点，作为时延计算的基点（减数）
	 *
	 * @method
	 * @param {object} [od = new Date()] Date instance
	 * @return {object} TCISD.TimeStat instance
	 *
	 *
	 */
	TCISD.TimeStat.prototype.setZero = function(od){
		if(typeof(od) != "object" || typeof(od.getTime) != "function"){
			od = new Date();
		}
		this.zero = od;
		return this;
	};

	/**
	 * 上报一个时间点统计序列
	 *
	 * @method
	 * @param {string} [baseURL = "http://isdspeed.qq.com/cgi-bin/r.cgi"] 上报的CGI接口
	 * @return {object} TCISD.TimeStat instance
	 *
	 *
	 */
	TCISD.TimeStat.prototype.report = function(baseURL){
		var _s = TCISD.TimeStat,
			url = [],
			t, z;

		if((t = this.timeStamps).length < 1){
			return this;
		}

		url.push((baseURL && baseURL.split("?")[0]) || _s.config.webServerInterfaceURL);
		url.push("?");

		z = this.zero;
		for(var i = 1, len = t.length; i < len; ++i){
			if(t[i]){
				url.push(i, "=", t[i].getTime ? (t[i] - z) : t[i], "&");
			}
		}

		t = this.flagStr.split("_");
		for(var i = 0, len = _s.config.maxFlagArrayLength; i < len; ++i){
			if(t[i]){
				url.push("flag", i + 1, "=", t[i], "&");
			}
		}

		if(_s.pluginList && _s.pluginList.length){
			for(var i = 0, len = _s.pluginList.length; i < len; ++i){
				(typeof(_s.pluginList[i]) == 'function') && _s.pluginList[i](url);
			}
		}

		//sds 这个东西不支持这样加，注意我下面的pluginList，这里tcisd是面向BU的统计引擎，不应该直接插入Qzone Only的逻辑
		//url.push("userFlag=",  ((typeof(g_isAlpha_iUin)!="undefined") ? g_isAlpha_iUin : 0), "&");//标识是否alpha
		url.push("sds=", Math.random());
		pingSender(url.join(""));
		return this;
	};

	/**
	 *
	 *
	 * @private
	 *
	 *
	 */
	TCISD.TimeStat._instances = {};

	/**
	 *
	 *
	 * @private
	 *
	 *
	 */
	TCISD.TimeStat._count = 0;

	/**
	 *
	 *
	 * @private
	 *
	 *
	 */
	TCISD.TimeStat.config = {
		webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/r.cgi",
		defaultFlagArray: [
			175,	//Qzone业务ID
			115,	//Qzone个人中心站点ID
			1		//下属页面ID
		],
		maxFlagArrayLength: 6,
		zero: window._s_ || (new Date())
	};




	//////////// @fileoverview 返回码系统发送器////////////////

	/**
	 * 简单get请求发送器Async
	 *
	 * @param {number} [statId = 1] 标识ID,需要IOD itil组分配, 1肯定不对呵呵
	 * @param {number} [resultType = 1] 返回码大类型，1成功，2失败
	 * @param {number} [returnValue = 1] 返回码，1-10为统一定义字段，不允许自定义使用,目前系统定义的字段如下：
	1数据异常
	2权限错误
	3超时（在规定时间内请求未返回视为超时）
	11-99为用户自定义字段
	100以上为保留字段

	 * @param {object} [opts = {
							reportRate: 1, //表示该上报类型的次数（数值为1/采样频率）；
	比如正确的cgi上报率为1/1000
	那么这里的值就为1000
	错误的采样为100/100，那么这个值为1
	后台系统会自动对这个上报记为num次正确或错误。
	这里推荐默认用1，错误和成功采样率一致。

							duration: 1000 //表示本次处理时间 单位ms，可以用此字段记录你某个过程的执行时间，或者绝对时间也可，有效区间是 (0,180000]
						}] 可选参数
	 *
	 */
	TCISD.valueStat = function(statId, resultType, returnValue, opts){
		//还是异步化一下，不要堵别人主流程吧
		setTimeout(function(){
	        // if(opts && opts.ozversion == 4){
		    TCISD.valueStat.sendV8(statId, resultType, returnValue, opts);
	        // }else{
	        //     TCISD.valueStat.send(statId, resultType, returnValue, opts);
	        // }
		}, 0);
	};

	/**
	 * 简单get请求发送器Async【返回码3.0】
	 *
	 * @param {number} [statId = 1] 标识ID,需要IOD itil组分配, 1肯定不对呵呵
	 * @param {number} [resultType = 1] 返回码大类型，1成功，2失败
	 * @param {number} [returnValue = 1] 返回码，1-10为统一定义字段，不允许自定义使用,目前系统定义的字段如下：
	1数据异常
	2权限错误
	3超时（在规定时间内请求未返回视为超时）
	11-99为用户自定义字段
	100以上为保留字段

	 * @param {object} [opts = {
							reportRate: 1, //表示该上报类型的次数（数值为1/采样频率）；
	比如正确的cgi上报率为1/1000
	那么这里的值就为1000
	错误的采样为100/100，那么这个值为1
	后台系统会自动对这个上报记为num次正确或错误。
	这里推荐默认用1，错误和成功采样率一致。

							duration: 1000, //表示本次处理时间 单位ms，可以用此字段记录你某个过程的执行时间，或者绝对时间也可，有效区间是 (0,180000]
							fixReportRateOnly: false //只上报采样率数据到OZ平台，展示时做修正，逻辑本身不做真正意义上的按抽样率上报，而是全报
						}] 可选参数
	 *
	 */
	TCISD.valueStat.send = function(statId, resultType, returnValue, opts){
		var _s = TCISD.valueStat,
			_c = _s.config,
			t = _c.defaultParams,
			p,
			url = [];

		statId = statId || t.statId; //这个有风险啊，拿了默认值报上去可不对哦，下面两行也是
		resultType = resultType || t.resultType;
		returnValue = returnValue || t.returnValue;

		opts = opts || t; //这里都是内部人用，就不严谨检查了

		if(typeof(opts.reportRate) != "number"){
			opts.reportRate = 1;
		}

		opts.reportRate = Math.round(Math.max(opts.reportRate, 1));

		if(!opts.fixReportRateOnly && !TCISD.valueStat.config.reportAll && (opts.reportRate > 1 && (Math.random() * opts.reportRate) > 1)){
			return;
		}

		url.push((opts.reportURL || _c.webServerInterfaceURL), "?");
		url.push(
				"flag1=", statId, "&",
				"flag2=", resultType, "&",
				"flag3=", returnValue, "&",
			//sds 这个东西不支持这样加，注意我下面的pluginList，这里tcisd是面向BU的统计引擎，不应该直接插入Qzone Only的逻辑
			//	"userFlag=", ((typeof(g_isAlpha_iUin)!="undefined") ? g_isAlpha_iUin : 0), "&",//标识是否alpha
				"1=", (TCISD.valueStat.config.reportAll ? 1 : opts.reportRate), "&",
				"2=", opts.duration, "&"
			);
		//自定义字段 helli 只支持整形字段上报哦
		if(typeof opts.extendField != 'undefined'){
			url.push("4=", opts.extendField, "&");
		}

		if(_s.pluginList && _s.pluginList.length){
			for(var i = 0, len = _s.pluginList.length; i < len; ++i){
				(typeof(_s.pluginList[i]) == 'function') && _s.pluginList[i](url);
			}
		}

		url.push("sds=", Math.random());
		pingSender(url.join(""));
	};

	/**
	 * 简单get请求发送器Sync【返回码4.0】
	 *
	 * @param {number} [statId = 1] 标识ID,需要IOD itil组分配, 1肯定不对呵呵
	 * @param {number} [resultType = 1] 返回码大类型，1成功，2失败
	 * @param {number} [returnValue = 1] 返回码，1-10为统一定义字段，不允许自定义使用,目前系统定义的字段如下：
	1数据异常
	2权限错误
	3超时（在规定时间内请求未返回视为超时）
	11-99为用户自定义字段
	100以上为保留字段

	 * @param {object} [opts = {
	                        reportRate: 1, //表示该上报类型的次数（数值为1/采样频率）；
	比如正确的cgi上报率为1/1000
	那么这里的值就为1000
	错误的采样为100/100，那么这个值为1
	后台系统会自动对这个上报记为num次正确或错误。
	这里推荐默认用1，错误和成功采样率一致。

	                        duration: 1000, //表示本次处理时间 单位ms，可以用此字段记录你某个过程的执行时间，或者绝对时间也可，有效区间是 (0,180000]
	                        fixReportRateOnly: false //只上报采样率数据到OZ平台，展示时做修正，逻辑本身不做真正意义上的按抽样率上报，而是全报
	                    }] 可选参数
	 *
	 */
	TCISD.valueStat.sendV8 = function(statId, resultType, returnValue, opts){
	    var _s = TCISD.valueStat,
	        _c = {
	            webServerInterfaceURL: "http://c.isdspeed.qq.com/code.cgi",
	            defaultParams: {
	                statId : 1, //标识ID,需要IOD itil组分配, 1肯定不对呵呵
	                domain : "isdspeed.qq.com",
	                cgi : "%2Fcgi-bin%2Fv.cgi%3Fflag1%3D",
	                resultType: 1,  //成功
	                returnValue: -1000,    //自定义
	                reportRate: 1,  //100%采样
	                duration: 1000,  //自定义时间
	                uin : window.g_iLoginUin    //QQ号
	            },
	            reportAll: false //不抽样，全上报
	        },
	        t = _c.defaultParams,
	        p,
	        url = [];
	    var domain = t.domain,
	        cgi = (t.cgi + (statId || t.statId)),
	        type = resultType || t.resultType,
	        code = parseInt(returnValue);

	    if(typeof(code) != "number" || typeof(returnValue)=="undefined"){
	        code = t.returnValue;
	    }
	    var opts = opts || t; //这里都是内部人用，就不严谨检查了

	    if(typeof(opts.reportRate) != "number"){
	        opts.reportRate = 1;
	    }

	    if(typeof(opts.uin) != "number"){
	        opts.uin = t.uin;   //乱传就上报默认的
	    }

	    opts.reportRate = Math.round(Math.max(opts.reportRate, 1));

	    if(!opts.fixReportRateOnly && !_c.reportAll && (opts.reportRate > 1 && (Math.random() * opts.reportRate) > 1)){
	        return;
	    }
	    var time = opts.duration || t.duration,
	        rate = (_c.reportAll ? 1 : opts.reportRate),
	        uin = opts.uin;
	    url.push(_c.webServerInterfaceURL, "?");
	    url.push(
	            "domain=", domain, "&",
	            "cgi=", cgi, "&",
	            "type=", type, "&",
	            "code=", code, "&",
	            "time=", time, "&",
	            "rate=", rate, "&"
	        );
	    uin && url.push("uin=", uin, "&");
	    url.push("sds=", Math.random());
	    pingSender(url.join(""));
	};


	/**
	 *
	 *
	 * @private
	 *
	 *
	 */
	TCISD.valueStat.config = {
		webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/v.cgi",
		defaultParams: {
			statId: 1, //标识ID,需要IOD itil组分配, 1肯定不对呵呵
			resultType: 1,	//成功
			returnValue: 11,	//自定义
			reportRate: 1,	//100%采样
			duration: 1000	//自定义时间
		},
		reportAll: false //不抽样，全上报
	};


	function pingSender(url,t,opts){
			if(!window.TCISD._imgPool){
				window.TCISD._imgPool={};
			}
			var _s = window.TCISD._imgPool,iid,img;
			if(!url){
				return;
			}
			opts = opts || {};
			if (typeof _s._sndCount === "undefined"){
				_s._sndCount=0;
			}
			_s._sndPool = _s._sndPool || {};
			_s._clearFn = _s._clearFn || function (evt,ref) {
				var _s = window.TCISD._imgPool;
				if(ref){
					_s._sndPool[ref.iid] = ref.onload = ref.onerror = ref.ontimeout = ref._s_ = null;
					delete _s._sndPool[ref.iid];
					_s._sndCount--;
					ref = null;
				}
			};
			iid = "sndImg_" + _s._sndCount++;
			img = _s._sndPool[iid] = new Image();
			img.iid = iid;
			img.onload = img.onerror = img.ontimeout = (function(t){
				return function(evt){
					evt = evt || window.event || {
						type:'timeout'
					};
					void(typeof(opts[evt.type]) == 'function' ? setTimeout(
							(function(et,ti){
								return function(){
									opts[et]({
										'type':et,
										'duration':((new Date()).getTime() - ti)
									});
								};
							})(evt.type,t._s_)
							,0) : 0);
					_s._clearFn(evt,t);
				};
			})(img);

			(typeof(opts.timeout) == 'function') && setTimeout(function(){
				img.ontimeout && img.ontimeout({
					type:'timeout'
				});
			},(typeof(opts.timeoutValue) == 'number' ? Math.max(100,opts.timeoutValue) : 5000));

			void((typeof(t) == 'number') ? setTimeout(function(){
				img._s_ = (new Date()).getTime();
				img.src = url;
			},(t = Math.max(0,t))) : (img.src = url));
		}


})();
