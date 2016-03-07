


var ParticleSysteme = function(MAX,meshes) {


	this.MAX_VERTICES = MAX;
	this.particle = {};
	this.particle.options = {};

	this.meshes = meshes;

	this.init();


} 


ParticleSysteme.prototype.init = function() {


	this.options =
  {
    preview_size : 120,
    texture_size : 20,
    disk_scale   : 0.8,
    disk_color   : '#ffcc28',
    glow_scale   : 0.6,
    glow_color   : '#ff0077'
  };

  this.canvas      = document.createElement( 'canvas' );
  this.context     = this.canvas.getContext( '2d' );

  this.canvas.width            = this.options.preview_size;
  this.canvas.height           = this.options.preview_size;

	this.min_canvas  = document.createElement( 'canvas' );
  this.min_context = this.min_canvas.getContext( '2d' );


  var center = Math.round(this.options.preview_size) * 0.5;

  // Preview
  this.context.clearRect( 0, 0, this.options.preview_size, this.options.preview_size );
  this.context.fillStyle   = this.options.disk_color;
  this.context.shadowColor = this.options.glow_color;
  this.context.shadowBlur  = Math.round( this.options.preview_size * this.options.glow_scale );
  this.context.beginPath();
  this.context.arc( center, center, this.options.preview_size * this.options.disk_scale * 0.5, 0, Math.PI * 2 );
  this.context.fill();



  this.min_canvas.width            = this.options.texture_size;
  this.min_canvas.height           = this.options.texture_size;
  this.min_canvas.style.top        = '46px';
  this.min_canvas.style.left       = this.options.preview_size + 'px';
  this.min_canvas.style.background = '#222';


  this.texture = new THREE.Texture( this.min_canvas );

  this.min_context.clearRect( 0, 0, this.options.texture_size, this.options.texture_size );
  this.min_context.drawImage( this.canvas, 0, 0, this.min_canvas.width, this.min_canvas.height );

  this.texture.minFilter = THREE.LinearFilter;

  this.texture.needsUpdate = true;


  var maximum = 255;
  var minimum = 100;
  var range = maximum - minimum;
  var red = Math.floor(Math.random()*range)+minimum;
  var green = Math.floor(Math.random()*range)+minimum;
  var blue = Math.floor(Math.random()*range)+minimum;
  var redToHex = red.toString(16);
  var greenToHex = green.toString(16);
  var blueToHex = blue.toString(16);


	this.uniforms = {
		time : {
			type : "f",
			value : 0
		},
		texture : {
			type : "t",
			value: this.texture
		},
		color : {
			type : "c",
			value : new THREE.Color( '#'+redToHex + ""+ greenToHex +""+ blueToHex)
		}
	};

	this.geometry = new THREE.BufferGeometry();

	this.positions = new Float32Array(this.MAX_VERTICES * 3);
	this.colors    = new Float32Array(this.MAX_VERTICES * 3);
	this.sizes     = new Float32Array(this.MAX_VERTICES);
	this.moves     = new Float32Array(this.MAX_VERTICES);


	this.mat_shader = new THREE.ShaderMaterial({
		uniforms : this.uniforms,
		vertexShader: document.getElementById('vertex-shader').textContent,
		fragmentShader: document.getElementById('fragment-shader').textContent,
		transparent: true,
		blending: THREE.AdditiveBlending,
    depthTest      : false,
    depthWrite     : false
	});

	this.geo_particle = new THREE.Geometry();


}


ParticleSysteme.prototype.create = function() {


	var vertex;
	var color = new THREE.Color();
	var destination = this.meshes.vertices;

	for(var i = 0, l = this.MAX_VERTICES; i < l; i++) {

		vertex = destination[i % destination.length];
		vertex.toArray( this.positions, i * 3 );

		color.setHSL( 0.1 + 0.1 * ( i / l ), 1.0, 0.7 )
		color.toArray( this.colors, i * 3 );

		this.sizes[i] = Math.random() * 10 + 2;
		this.moves[i] = Math.random() ;

	}

	this.geometry.addAttribute('position', new THREE.BufferAttribute( this.positions, 3 ))
	this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
	this.geometry.addAttribute('move', new THREE.BufferAttribute(this.moves, 1));
	this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));

	this.particle.systeme = new THREE.Points( this.geometry, this.mat_shader); 

	return this.particle.systeme;

}