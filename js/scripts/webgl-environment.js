

var WebglEnv = function(context) {


	//VARIABLES
	this.instance = {};
	this.options = {};

	//GET CONTEXT TO INJECT WEBGL VIEW
	this.instance.context = context;
	
	//LAUCH INIT
	this.init();

}





WebglEnv.prototype.init = function() {

	//REFERENCE
	var that = this;

	this.initScene();	
}




//INIT WEBGL SCENE
WebglEnv.prototype.initScene = function() {

	//Create new Scene
	this.instance.scene = new THREE.Scene();
	
	//Launch Camera Init
	this.initCamera();

}


//INIT WEBGL CAMERA
WebglEnv.prototype.initCamera = function() {

	//Camera Options
	this.options.camera = {
		fov: 75,
		aspect: window.innerWidth/window.innerHeight,
		near: 0.1,
		far: 1000
	}

	//Create Camera
	this.instance.camera = new THREE.PerspectiveCamera(
		this.options.camera.fov,
		this.options.camera.aspect,
		this.options.camera.near,
		this.options.camera.far
	);
	
	//Launch renderer init
	this.initRenderer();

}

WebglEnv.prototype.initRenderer = function() {

	//Renderer Options
	this.options.renderer = {
		alpha: true,
		antialiasing: true
	}

	//Create Renderer
	this.instance.renderer = new THREE.WebGLRenderer(this.options.renderer);

	//Set renderer size
	this.instance.renderer.setSize(window.innerWidth,window.innerHeight);


	//Laungh Container init
	this.initContainer();
}



WebglEnv.prototype.initContainer = function() {

	this.instance.context = document.getElementById(this.instance.context);

	this.instance.context.appendChild(this.instance.renderer.domElement);

}



//Return all the environment
WebglEnv.prototype.get = function() {

	return this.instance;

}
