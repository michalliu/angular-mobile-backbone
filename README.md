angular-mobile-bootstrap
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

##How to use
1. clone the project and `npm install`
2. run `grunt gethtml` to generate index.html from `tpl` folder
3. run `grunt serve` to open a development webserve on port 9001
4. open `http://localhost:9001/index.html#/index`
