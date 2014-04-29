This is the documentation for angularjs,angular-animate,angular-route,angular-touch used in this project.

We use [angularjs](https://angularjs.org/) from [my fork](https://github.com/michalliu/angular.js), I didn't change it a lot. 

The bigest change is the jsonp callback name. The original angular uses `angular.callbacks[id]` as jsonp callback function name. However, some server refuses to use `.` in the jsonp callback function name. So, I changes it to `angular_callbacks_id` [commit](https://github.com/michalliu/angular.js/commit/fb6037b58e3e0063364ecd15aaaa7951e01e31cc).

The second change is the deferred object. I added an alias `always` for `finally` of promise object [commit](https://github.com/michalliu/angular.js/commit/f00644f50383c8b50d69ea647180f010d6423152). `finally` is a reserved word in javascript, we should avoid to use it.

The other changes is not related to angularjs itself, but to the building script. If you tried to build angularjs from the repository, you will find it's very slow at beginning, because it will get previous version numbers from the internet!! If your connection is not very good, it will make the building process very painful, I just disables this behaviour see [this commit](https://github.com/michalliu/angular.js/commit/1a3a934c62499442c3f4d93ad982e3e9154d66ec). I aslo fixed a bug about angular doc generation task under windows. [commit](https://github.com/michalliu/angular.js/commit/3de5be3bebf3b1cb2f857897c4853f543a725db3).

angular-animate,angular-animate,angular-route,angular-touch is untouched.
