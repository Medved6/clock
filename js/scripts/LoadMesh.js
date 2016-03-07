


var LoadMeshes = function(callback) {



	this.callback = callback;

	this.init();

}


LoadMeshes.prototype.init = function() {


	//REFERENCE
	var that = this;


	this.count  = 0;
	this.meshes = [];
	this.max_vertices = 0;
	this.loader = new THREE.JSONLoader();

	this.loadAll(this.count);

}


LoadMeshes.prototype.loadAll = function() {

	//REFERENCE
	var that = this;


	// LOADER
	this.loader.load('assets/models/number_'+this.count+'.json', function(geometry){

		if(that.max_vertices < geometry.vertices.length){
			that.max_vertices = geometry.vertices.length;
		}

		that.meshes.push(geometry.vertices);
		that.count ++;

		if(that.count < 10){
			that.loadAll();
		} else {
			that.callback.call(this,that.meshes,that.max_vertices);
		}
	});
}
