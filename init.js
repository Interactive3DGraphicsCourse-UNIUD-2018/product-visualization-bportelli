var scene, renderer, camera, stats, controls;
var camera1, camera2, camera3, camera4, controls2;
var canvas, container;
var bodyParts = new Array();
var accentParts = new Array();
var ballpoint = new Array();
var point = new Array();
var pen;
var done = false;
var generic_vs, generic_fs;
var loaded_shaders = false;

function Init() {
	
container = document.getElementById("main_div");
canvas = document.getElementById("product_canvas");
canvas2 = document.getElementById("point_canvas");


scene = new THREE.Scene();
camera1 = new THREE.PerspectiveCamera( 30, canvas.width / canvas.height, 0.1, 1000 );
renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});

// RENDERER
renderer.setSize(canvas.width, canvas.height );
renderer.setClearColor( 0xf0f0f0 );
renderer.setPixelRatio( canvas.devicePixelRatio );
//document.body.appendChild( renderer.domElement );

camera2 = new THREE.PerspectiveCamera( 30, canvas.width / canvas.height, 0.1, 1000 );
camera3 = new THREE.PerspectiveCamera( 30, canvas.width / canvas.height, 0.1, 1000 );
camera4 = new THREE.PerspectiveCamera( 30, canvas.width / canvas.height, 0.1, 1000 );


camera = camera1;

/*****************************************************************************
 *  loads shaders from external files, sets loades_shader to true once done
 */
ShaderLoader("generic.vert", "generic.frag",
	function (vertex, fragment){
		generic_vs = vertex;
		generic_fs = fragment;
		loaded_shaders = true;
	}
);


/******************************************
 *  loads cubemap for environment mapping
 */
var cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath( 'textures/' );
var textureCube;

textureCube = cubeTextureLoader.load(['musee/cube-map_right.jpg', 'musee/cube-map_left.jpg', 'musee/cube-map_top.jpg', 'musee/cube-map_bottom.jpg', 'musee/cube-map_front.jpg', 'musee/cube-map_back.jpg']);
//textureCube = cubeTextureLoader.load(['env_map_sides/posx.bmp', 'env_map_sides/negx.bmp', 'env_map_sides/posy.bmp', 'env_map_sides/negy.bmp', 'env_map_sides/posz.bmp', 'env_map_sides/negz.bmp']);

//scene.background = textureCube;
textureCube.minFilter = THREE.LinearMipMapLinearFilter;


/*********************
 *  light parameters
 */
var lightParams1 = { red: 1.0, green: 1.0, blue: 1.0,    intensity: 0.5,    pos: [0, 40, 0] };
var lightParams2 = { red: .2, green: .2, blue: .2,    intensity: 0.4,    pos: [20, -30, 0] };
var lightParams3 = { red: .2, green: .2, blue: .2,    intensity: 0.4,    pos: [-20, -30, 0] };
var lightParams4 = { red: 0.0, green: 0.0, blue: 1.0,    intensity: 0.0,    pos: [20, 0, -40] };
var ambientLightParams = { red: 0.1, green: 0.05, blue: 0.05, intensity: 0.1, }

if (lightParams1.intensity > 0) {
	var lightMesh1 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
	lightMesh1.position.set( lightParams1.pos[0], lightParams1.pos[1], lightParams1.pos[2] );
	//scene.add(lightMesh1);
	var lightPos1 = new THREE.Vector3(lightMesh1.position.x, lightMesh1.position.y, lightMesh1.position.z);
} else { var lightPos1 = new THREE.Vector3(0,0,0); }
if (lightParams2.intensity > 0) {
	var lightMesh2 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
	lightMesh2.position.set( lightParams2.pos[0], lightParams2.pos[1], lightParams2.pos[2] );
	//scene.add(lightMesh2);
	var lightPos2 = new THREE.Vector3(lightMesh2.position.x, lightMesh2.position.y, lightMesh2.position.z);
} else { var lightPos2 = new THREE.Vector3(0,0,0); }
if (lightParams3.intensity > 0) {
	var lightMesh3 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
	lightMesh3.position.set( lightParams3.pos[0], lightParams3.pos[1], lightParams3.pos[2] );
	//scene.add(lightMesh3);
	var lightPos3 = new THREE.Vector3(lightMesh3.position.x, lightMesh3.position.y, lightMesh3.position.z);
} else { var lightPos3 = new THREE.Vector3(0,0,0); }
if (lightParams4.intensity > 0) {
	var lightMesh4 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
	lightMesh4.position.set( lightParams4.pos[0], lightParams4.pos[1], lightParams4.pos[2] );
	scene.add(lightMesh4);
	var lightPos4 = new THREE.Vector3(lightMesh4.position.x, lightMesh4.position.y, lightMesh4.position.z);
} else { var lightPos4 = new THREE.Vector3(0,0,0); }


/********************************************************************
 *  part of the uniforms shared among materials (lights and envMap)
 */
var uniforms_shared = {
	pointLightPositions: {
		type: "v3[]",
		value: new Array(lightPos1, lightPos2, lightPos3, lightPos4)
	},
	clights: {
		type: "v3[]",
		value: new Array(
			new THREE.Vector3(
				lightParams1.red * lightParams1.intensity,
				lightParams1.green * lightParams1.intensity,
				lightParams1.blue * lightParams1.intensity),
			new THREE.Vector3(
				lightParams2.red * lightParams2.intensity,
				lightParams2.green * lightParams2.intensity,
				lightParams2.blue * lightParams2.intensity),
			new THREE.Vector3(
				lightParams3.red * lightParams3.intensity,
				lightParams3.green * lightParams3.intensity,
				lightParams3.blue * lightParams3.intensity),
			new THREE.Vector3(
				lightParams4.red * lightParams4.intensity,
				lightParams4.green * lightParams4.intensity,
				lightParams4.blue * lightParams4.intensity)
		)
	},
	ambientLight: {
		type: "v3",
		value: new THREE.Vector3(
			ambientLightParams.red * ambientLightParams.intensity,
			ambientLightParams.green * ambientLightParams.intensity,
			ambientLightParams.blue * ambientLightParams.intensity)
	},
	envMap:	{ type: "t", value: textureCube}
}


/****************************************************
 *  material-specific uniforms (textures and color)
 */

uniforms_plastic = {
	metalnessMap:	{ type: "t", value: loadTexture("textures/materials/plastic_met.jpg") },
	diffuseMap:		{ type: "t", value: loadTexture("textures/materials/Plastic04_col.jpg") },
	roughnessMap:	{ type: "t", value: loadTexture("textures/materials/Plastic04_rgh.jpg") },
	normalMap:		{ type: "t", value: loadTexture("textures/materials/Plastic04_nrm.jpg") },
	aoMap:			{ type: "t", value: loadTexture("textures/materials/Plastic04_disp.jpg") },
	normalScale:	{ type: "v2", value: new THREE.Vector2(0.5, 0.5) },
	textureRepeat:	{ type: "v2", value: new THREE.Vector2(4.0, 4.0) }
};

uniforms_wood = {
	metalnessMap:	{ type: "t", value: loadTexture("textures/materials/plastic_met.jpg") },
	diffuseMap:		{ type: "t", value: loadTexture("textures/materials/Wood08_col.jpg") },
	roughnessMap:	{ type: "t", value: loadTexture("textures/materials/Wood08_rgh.jpg") },
	normalMap:		{ type: "t", value: loadTexture("textures/materials/Wood08_nrm.jpg") },
	aoMap:			{ type: "t", value: loadTexture("textures/materials/Wood08_disp.jpg") },
	normalScale:	{ type: "v2", value: new THREE.Vector2(1.0, 1.0) },
	textureRepeat:	{ type: "v2", value: new THREE.Vector2(2.0, 2.0) }
};

uniforms_fabric = {
	metalnessMap:	{ type: "t", value: loadTexture("textures/materials/plastic_met.jpg") },
	diffuseMap:		{ type: "t", value: loadTexture("textures/materials/Fabric04_col.jpg") },
	roughnessMap:	{ type: "t", value: loadTexture("textures/materials/Fabric04_rgh.jpg") },
	normalMap:		{ type: "t", value: loadTexture("textures/materials/Fabric04_nrm.jpg") },
	aoMap:			{ type: "t", value: loadTexture("textures/materials/Fabric04_disp.jpg") },
	normalScale:	{ type: "v2", value: new THREE.Vector2(1.0, 1.0) },
	textureRepeat:	{ type: "v2", value: new THREE.Vector2(3.0, 3.0) }
};

uniforms_metal = {
	metalnessMap:	{ type: "t", value: loadTexture("textures/materials/Metal_met.jpg") },
	diffuseMap:		{ type: "t", value: loadTexture("textures/materials/Plastic04_col.jpg") },
	roughnessMap:	{ type: "t", value: loadTexture("textures/materials/Plastic04_rgh.jpg") },
	normalMap:		{ type: "t", value: loadTexture("textures/materials/Plastic04_nrm.jpg") },
	aoMap:			{ type: "t", value: loadTexture("textures/materials/Plastic04_disp.jpg") },
	normalScale:	{ type: "v2", value: new THREE.Vector2(1., 1.) },
	textureRepeat:	{ type: "v2", value: new THREE.Vector2(3.0, 3.0) }
};

uniforms_smoothMetal = {
	metalnessMap:	{ type: "t", value: loadTexture("textures/materials/Metal_met.jpg") },
	diffuseMap:		{ type: "t", value: loadTexture("textures/materials/Metal_col.jpg") },
	roughnessMap:	{ type: "t", value: loadTexture("textures/materials/Metal_rgh.jpg") },
	normalMap:		{ type: "t", value: loadTexture("textures/materials/Metal_nrm.jpg") },
	aoMap:			{ type: "t", value: loadTexture("textures/materials/Metal_disp.jpg") },
	normalScale:	{ type: "v2", value: new THREE.Vector2(1.0, 1.0) },
	textureRepeat:	{ type: "v2", value: new THREE.Vector2(6.0, 6.0) }
};

/********************
 *  object uniforms
 */

bodyParts_uniforms = {
	surfCdiff: { type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) }
}
accentParts_uniforms = {
	surfCdiff: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) }
}
ballpoint_uniforms = {
	surfCdiff: { type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) }
}
point_uniforms = {
	surfCdiff: { type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) }
}
Object.assign(bodyParts_uniforms, uniforms_shared);
Object.assign(bodyParts_uniforms, uniforms_plastic);

Object.assign(accentParts_uniforms, uniforms_shared);
Object.assign(accentParts_uniforms, uniforms_smoothMetal);

Object.assign(ballpoint_uniforms, uniforms_shared);
Object.assign(ballpoint_uniforms, uniforms_smoothMetal);

materialExtensions = {
	derivatives: true, // set to use derivatives
	shaderTextureLOD: true // set to use shader texture LOD
};


/**********************************
 *  load model from external file
 */

var loader = new THREE.OBJLoader();
loader.load( "boligrafo_ballpoint.obj", function ( object ) {
	pen = object;
	
	object.scale.x = .5;
	object.scale.y = .5;
	object.scale.z = .5;
	
	object.position.z = -30;
	
	object.rotation.y = 90*Math.PI/180;
	object.rotation.z = 0*Math.PI/180;
	object.rotation.x = 0*Math.PI/180;
	
	console.log("Object loaded");
	
	object.traverse(
		function (child){
			if (child instanceof THREE.Mesh) {
				if (child.name === "body") bodyParts.push(child);
				if (child.name === "clip") accentParts.push(child);
				if (child.name === "ballpoint") ballpoint.push(child);
				if (child.name === "tip boligrafo:metalico") point.push(child);
				if (child.name === "boligrafo:metalico point") accentParts.push(child);
			}
		}
	);
	done = true;
});

Start();
FirstUpdate();

}