angular-mobile-backbone
========================

Everything you need to develop an angular application on mobile(iOS and Android)

This a bootstrapping app using angularjs designed for mobile devices(android and ios). You can create your awesome angular appbase on it. we will keep improving it.

It contains:
* classic angular application structure
* grunt tasks to optimization the project into production
* routing and animation support for mobile
* url parameters handling

It doesn't contains:
* beautiful UI interface (you need to design your own)

libs used:
* angularjs
* angular-animate
* angular-route
* angular-touch
* zepto (recommend)

How to use
==========

####development
1. clone the project and `npm install`
2. run `grunt html` to generate `index.html` from `tpl` folder  
Be carefull, You should **NOT** edit index.html directly. It's generated from `/tpl/development/index.html`, your local change will lost when you run `grunt` command.
3. run `grunt serve` to open a development webserve on port 9001
4. open `http://localhost:9001/index.html#/index`

####production
Open another command window run `grunt`.A folder `/release/` will be created. html,css,js files are merged and minified.
Files in this folder is ought to be published.  
You can open `http://localhost:9001/release/index.html#/index` to check if it works correctly.

Development Tips
================

####Folder structure
1. `/css`              contains your css files, a default `page.css` is provided to support animation
2. `/js/libs/`         contains javascript libraries
3. `/js/controllers/`  contains angular controllers
4. `/js/providers/`    contains directives,filters,default page provider,dynamic generated template provider
5. `/js/app.js`        the angular app config
6. `/tpl/`             contains html template to generate an index.html for development and an index.html for production
7. `/views/`           thus views associates with controllers

####Url params
If you need to get some variable from outside, you can use `http://localhost:9001/index.html#/index?x=1&y=2`. x and y will be stored in `page.params`. You can inject `page` to your controller to access the variable.

####Routing
We use routing url to decide the animation direction. For example, if we navigate from `/index` to `/index/module/a`. The animation is slide from left to right. however, if we navigate from `/index/module/a` to `/index`. The animation is slide from right to left. When you design your app routing, you should aslo follow the rule.
