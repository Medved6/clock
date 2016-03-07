

var World = function(context) {


	this.instance = {};
	this.instance.context = context;

	this.initScene();

}


World.prototype.initScene = function() {

	//REFERENCE
	var that = this;

	this.instance = new WebglEnv('webgl-canvas').get();
	this.instance.camera.position.set(0,0,40);

	//Launch methods
	this.initStats();
	this.render();
	this.loadMesh = new LoadMeshes(this.setNumbers.bind(this));

	window.onresize = this.resize.bind(this);
}



World.prototype.resize = function() {
	
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  // Update canvas
  can_width  = WIDTH * window.devicePixelRatio;
  can_height = HEIGHT * window.devicePixelRatio;

  // Update camera
  this.instance.camera.aspect = WIDTH / HEIGHT;
  this.instance.camera.updateProjectionMatrix();

  // Update render
  this.instance.renderer.setSize( can_width, can_height );


}


World.prototype.setNumbers = function(meshes,maxValue) {

	//REFERENCE
	var that = this;


	//CREATE SECOND TIMER
	this.second_unit = new Number(meshes,maxValue,that.instance, {x:24,y:0,z:0});
	this.second_decade = new Number(meshes,maxValue,that.instance, {x:16,y:0,z:0});

	//CREATE MINUTE TIMER
	this.minute_unit = new Number(meshes,maxValue,that.instance, {x:4,y:0,z:0});
	this.minute_decade = new Number(meshes,maxValue,that.instance, {x:-4,y:0,z:0});

	//CREATE HOUR TIMER
	this.hour_unit = new Number(meshes,maxValue,that.instance, {x:-16,y:0,z:0});
	this.hour_decade = new Number(meshes,maxValue,that.instance, {x:-24,y:0,z:0});

	
	this.numberController();
}



World.prototype.numberController = function() {

	//REFERENCE
	var that = this;

	var second = new Date().getSeconds();	
	var minute = new Date().getMinutes();
	var hour   = new Date().getHours();

	var initTime = {
		second_unit   : null,
		second_decade : null,
		minute_unit   : null,
		minute_decade : null,
		hour_unit     : null,
		hour_decade   : null
	}

	this.setInterval = window.setInterval(function() {

		var newTime = {
			second_unit : new Date().getSeconds()%10,
			second_decade: Math.floor((new Date().getSeconds())/10),
			minute_unit: new Date().getMinutes()%10,
			minute_decade: Math.floor((new Date().getMinutes())/10),
			hour_unit: new Date().getHours()%10,
			hour_decade: Math.floor((new Date().getHours())/10)
		}

		//INIT SECOND
		that.second_unit.ReadyToMorph(newTime.second_unit);

		if(newTime.second_decade !== initTime.second_decade){
			that.second_decade.ReadyToMorph(newTime.second_decade);
			initTime.second_decade = newTime.second_decade;
		}
		
		
		//INIT MINUTE
		if(newTime.minute_unit !== initTime.minute_unit){
			that.minute_unit.ReadyToMorph(newTime.minute_unit);
			initTime.minute_unit = newTime.minute_unit;
		}

		if(newTime.minute_decade !== initTime.minute_decade){
			that.minute_decade.ReadyToMorph(newTime.minute_decade);
			initTime.minute_decade = newTime.minute_decade;
		}
		
		//INIT HOUR
		if(newTime.hour_unit !== initTime.hour_unit){
			that.hour_unit.ReadyToMorph(newTime.hour_unit);
			initTime.hour_unit = newTime.hour_unit;
		}

		if(newTime.hour_decade !== initTime.hour_decade){
			that.hour_decade.ReadyToMorph(newTime.hour_decade);
			initTime.hour_decade = newTime.hour_decade;
		}


	},1000)
	

}


World.prototype.initStats = function() {

	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.top = '0px';
	this.instance.context.appendChild( this.stats.domElement );

}


World.prototype.render = function() {

	requestAnimationFrame(this.render.bind(this));
	this.instance.renderer.render(this.instance.scene, this.instance.camera);

	this.stats.update();

}





