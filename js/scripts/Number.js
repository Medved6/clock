
var Number = function(geometries,maxValue,world,position) {


	this.allGeo = geometries;
	this.MAX_VERTICES = maxValue;
	this.scene = world.scene;
	this.renderer = world.renderer;
	this.camera  = world.camera;

	this.object = {};
	this.object.animation = {};

	this.mouse = new THREE.Vector2(-100,100);

	this.object.position = position;

	this.tmp = null;

	this.init();
};





Number.prototype.init = function() {

	var that = this;

	this.object.animation           = {};
  this.object.animation.start     = 0;
  this.object.animation.duration  = 900;
  this.object.animation.progress  = 0;
  this.object.animation.running   = false;
  this.object.animation.previous  = null;
  this.object.animation.target    = null;
  this.object.animation.base      = null;

  this.object.animation.state1    = true;
  this.object.animation.state2    = false;

  this.startTime = + new Date();

  var sphere = new THREE.SphereGeometry( 1, 24, 24);

	var initSysteme = new ParticleSysteme(this.MAX_VERTICES,sphere);
	this.particleSysteme = initSysteme.create();

	this.scene.add(this.particleSysteme);

	this.particleSysteme.position.set(this.object.position.x,this.object.position.y,this.object.position.z);

	this.object.animation.base = this.particleSysteme.geometry.attributes;
	this.object.animation.previous = sphere.vertices;
	
	this.tick();

}


Number.prototype.ReadyToMorph = function(target) {

	this.target = target;
		
		if(this.object.animation.state1) {

			var sphere = new THREE.CylinderGeometry( 3, 3, 5,24,24, false);

			for(var i = 0; i < sphere.vertices.length; i++) {

				var pas = Math.random() + 0.6;

				sphere.vertices[i].multiplyScalar(pas);
				sphere.vertices[i].multiplyScalar(pas);
				sphere.vertices[i].multiplyScalar(pas);

			}
						
			this.object.animation.ease = "cubicInOut";
			this.object.animation.duration = 200;
			this.object.animation.target = sphere.vertices;

			this.object.animation.start = + new Date();
			this.object.animation.progress = 0;
			this.object.animation.running = true;

			this.object.animation.state1 = false;
			this.object.animation.state2 = true;

		} else if(this.object.animation.state2) {


			this.object.animation.ease = "elasticOut";
			this.object.animation.duration = 600;
			this.object.animation.target = this.allGeo[this.target];

			this.object.animation.start = + new Date();
			this.object.animation.progress = 0;
			this.object.animation.running = true;


			this.object.animation.state2 = false;
			this.object.animation.state1 = true;
		}

		this.tmp = target;

}



Number.prototype.morph = function() {


	for(var i = 0; i < this.MAX_VERTICES * 3; i = i+3) {

		var base        = this.object.animation.base.position.array;
		var previous    = this.object.animation.previous;
		var destination = this.object.animation.target;
		var progress    = this.object.animation.progress;
		var duration    = this.object.animation.duration

		destination = destination[i / 3 % destination.length];
		previous    = previous[i / 3 % previous.length];

		base[i] = Easie[this.object.animation.ease]( 
			progress, 
			previous.x, 
			destination.x - previous.x, 
			duration
		);
		base[i + 1] = Easie[this.object.animation.ease]( 
			progress, 
			previous.y, 
			destination.y - previous.y, 
			duration
		);
		base[i + 2] = Easie[this.object.animation.ease]( 
			progress, 
			previous.z, 
			destination.z - previous.z, 
			duration
		);
		
	}

	this.object.animation.base.position.needsUpdate = true;


}


Number.prototype.tick = function() {
	
	requestAnimationFrame(this.tick.bind(this));


	var time = Date.now() * 0.00005;

	//var h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	//this.particleSysteme.material.color.setHSL( h, 0.5, 0.5 );

	this.particleSysteme.material.uniforms.time.value = + new Date() - this.startTime;

	if(this.object.animation.running) {

		this.object.animation.progress = new Date() - this.object.animation.start;
		this.morph();

		if(this.object.animation.progress >= this.object.animation.duration)
		{
			this.object.animation.previous = this.object.animation.target;
			this.object.animation.running  = false;
			this.morph();
			if(this.object.animation.state2) {
				this.ReadyToMorph(this.target);
			}
		}
	}
}