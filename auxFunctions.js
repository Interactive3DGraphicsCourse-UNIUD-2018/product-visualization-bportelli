function Start() {
		
	// CAMERA SETTINGS
	camera.position.z = 70;
	camera.position.y = 70;
	camera.position.x = 0;
	
	

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'relative';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	// CAMERA CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', Render );
	
	window.addEventListener( 'resize', OnResize, false );
	
	OnResize();

}

function FirstUpdate() {

	stats.update();
	controls.update();

	if (done && loaded_shaders) {

		bodyParts_vs = generic_vs;
		bodyParts_fs = generic_fs;
		bodyParts_material = new THREE.ShaderMaterial({ uniforms: bodyParts_uniforms, vertexShader: bodyParts_vs, fragmentShader: bodyParts_fs, extensions: materialExtensions });
		
		accentParts_vs = generic_vs;
		accentParts_fs = generic_fs;
		accentParts_material = new THREE.ShaderMaterial({ uniforms: accentParts_uniforms, vertexShader:accentParts_vs, fragmentShader: accentParts_fs, extensions: materialExtensions });
		
		ballpoint_vs = generic_vs;
		ballpoint_fs = generic_fs;
		ballpoint_material = new THREE.ShaderMaterial({ uniforms: ballpoint_uniforms, vertexShader: ballpoint_vs, fragmentShader: ballpoint_fs, extensions: materialExtensions });
		
		point_vs = generic_vs;
		point_fs = generic_fs;
		point_material = new THREE.ShaderMaterial({ uniforms: point_uniforms, vertexShader: point_vs, fragmentShader: point_fs, extensions: materialExtensions});
		
		bodyParts_material.needsUpdate = true;
		accentParts_material.needsUpdate = true;
		ballpoint_material.needsUpdate = true;

		bodyParts.forEach(function(el){
			el.material = bodyParts_material;
		});
		accentParts.forEach(function(el){
			el.material = accentParts_material;
		});
		ballpoint.forEach(function(el){
			el.material = ballpoint_material;
		});
		point.forEach(function(el){
			el.material = point_material;
		});
		scene.add(pen);
		
		done = false;
		loaded_shaders = false;
		
		requestAnimationFrame(Update);
	
	} else {
		requestAnimationFrame(FirstUpdate);
	}
	//Render();
}

function Update() {
	requestAnimationFrame(Update);
	stats.update();
	controls.update();
	Render();
}

function Render() {
	renderer.render(scene, camera);
}

function OnResize() {
		
	setTimeout(function(){
		var rect = container.getBoundingClientRect();
		canvas.width = Math.min(rect.width, 1200-250)-32;
		canvas.height = (Math.min(rect.width, 1200-250)-32)/3*2;
		renderer.setSize( canvas.width,canvas.height );
		camera.aspect = ( canvas.width / canvas.height );
		camera.updateProjectionMatrix();
	}, 500);
	
}


function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
	var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
	vertex_loader.setResponseType('text');
	vertex_loader.load(vertex_url, function (vertex_text) {
		var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
		fragment_loader.setResponseType('text');
		fragment_loader.load(fragment_url, function (fragment_text) {
			onLoad(vertex_text, fragment_text);
		});
	}, onProgress, onError);
}

function loadTexture(file) {
	var texture = new THREE.TextureLoader().load( file , function ( texture ) {
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set( 0, 0 );
		texture.needsUpdate = true;
		Render();
	} );
	return texture;
}