function Start() {
		
	// CAMERA SETTINGS
	camera1.position.z = 70;
	camera1.position.y = 70;
	camera1.position.x = 0;
	camera1.startDist = camera1.position.length();
	
	camera2.position.z = 40;
	camera2.position.y = 10;
	camera2.position.x = -10;
	camera2.lookAt(0,0,22);
	camera2.startDist = camera2.position.length();
	
	camera3.position.z = -10;
	camera3.position.y = 20;
	camera3.position.x = 10;
	camera3.lookAt(0,0,-5);
	camera3.startDist = camera3.position.length();
	
	camera4.position.y = 0;
	camera4.position.x = 20;
	
	camera4.position.z = -50;
	camera4.position.y = -10;
	camera4.position.x = 20;
	//camera4.up = new THREE.Vector3(0,0,-1);
	camera4.lookAt(0,0,-25);
	camera4.startDist = camera4.position.length();

	
	//camera2.rotation.y = -90*Math.PI/180;

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'relative';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	// CAMERA CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', Render );
	controls.enableZoom = false;
	
	//controls2 = new THREE.OrbitControls( camera2, renderer2.domElement );
	//controls2.addEventListener( 'change', Render );
	//controls2.enableZoom = false;
	
	window.addEventListener( 'resize', OnResize, false );
	
	OnResize();

}

function FirstUpdate() {

	stats.update();
	controls.update();
	//controls2.update();

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
	//controls2.update();
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
		camera1.aspect = ( canvas.width / canvas.height );
		camera1.updateProjectionMatrix();
		camera2.aspect = ( canvas.width / canvas.height );
		camera2.updateProjectionMatrix();
		camera3.aspect = ( canvas.width / canvas.height );
		camera3.updateProjectionMatrix();
		camera4.aspect = ( canvas.width / canvas.height );
		camera4.updateProjectionMatrix();
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