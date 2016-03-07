

var App = function() {

	this.dom = {};

	this.init();

};


App.prototype.init = function() {

	console.log('init App');

	this.dom.context = document.getElementById("webgl-canvas");

	this.world = new World(this.dom.context);

};




var app = new App();


