var scene;
var lightParameters1 = { red: 1.0, green: 1.0, blue: 1.0, intensity: 0.2, }
var lightParameters2 = { red: 1.0, green: 1.0, blue: 1.0, intensity: 0.0, }
var lightParameters3 = { red: 0.0, green: 1.0, blue: 0.0, intensity: 0.0, }
var lightParameters4 = { red: 0.0, green: 0.0, blue: 1.0, intensity: 0.0, }
var lightParameters = new Array(
	new THREE.Vector3(
		lightParameters1.red * lightParameters1.intensity,
		lightParameters1.green * lightParameters1.intensity,
		lightParameters1.blue * lightParameters1.intensity),
	new THREE.Vector3(
		lightParameters2.red * lightParameters2.intensity,
		lightParameters2.green * lightParameters2.intensity,
		lightParameters2.blue * lightParameters2.intensity),
	new THREE.Vector3(
		lightParameters3.red * lightParameters3.intensity,
		lightParameters3.green * lightParameters3.intensity,
		lightParameters3.blue * lightParameters3.intensity),
	new THREE.Vector3(
		lightParameters4.red * lightParameters4.intensity,
		lightParameters4.green * lightParameters4.intensity,
		lightParameters4.blue * lightParameters4.intensity),);
var lightMesh1 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
lightMesh1.position.set( 0,40,0 );
scene.add(lightMesh1);
var lightMesh2 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xff0000, wireframe:true}));
lightMesh2.position.set( 0,40,-30 );
scene.add(lightMesh2);
var lightMesh3 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
lightMesh3.position.set( -20,40,0 );
//scene.add(lightMesh3);
var lightMesh4 = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ({color: 0xff0000, wireframe:true}));
lightMesh4.position.set( 20,0,-40 );
//scene.add(lightMesh4);
var lightPosition1 = new THREE.Vector3(lightMesh1.position.x, lightMesh1.position.y, lightMesh1.position.z);
var lightPosition2 = new THREE.Vector3(lightMesh2.position.x, lightMesh2.position.y, lightMesh2.position.z);
var lightPosition3 = new THREE.Vector3(lightMesh3.position.x, lightMesh3.position.y, lightMesh3.position.z);
var lightPosition4 = new THREE.Vector3(lightMesh4.position.x, lightMesh4.position.y, lightMesh4.position.z);
var lightPositions = new Array(lightPosition1, lightPosition2, lightPosition3, lightPosition4);
var ambientLightParameters = { red: 0.2, green: 0.2, blue: 0.2, intensity: 0.0, }

// textures
var accentParts_textureParameters = {
	material: "materials/Metal02",
	metallic: true,
	normalScale: 1.0,
	repeatS: 2.0,
	repeatT: 2.0,
}
var accentParts_normalScale = new THREE.Vector2(accentParts_textureParameters.normalScale, accentParts_textureParameters.normalScale);
var accentParts_textureRepeat = new THREE.Vector2(accentParts_textureParameters.repeatS, accentParts_textureParameters.repeatT);
var accentParts_diffuseMap = loadTexture( "textures/" + accentParts_textureParameters.material + "_col.jpg" );
if (accentParts_textureParameters.metallic) {
	var accentParts_metalnessMap = loadTexture( "textures/" + accentParts_textureParameters.material + "_met.jpg" );
} else {
	var accentParts_metalnessMap = loadTexture( "textures/materials/met.jpg" );
}			
var accentParts_roughnessMap = loadTexture( "textures/" + accentParts_textureParameters.material + "_rgh.jpg" );
var accentParts_normalMap = loadTexture( "textures/" + accentParts_textureParameters.material + "_nrm.jpg" );
var accentParts_aoMap = loadTexture( "textures/" + accentParts_textureParameters.material + "_disp.jpg" );
accentParts_aoMap = loadTexture( "textures/materials/ao.jpg");


var accentParts_cdiff = new THREE.Vector3(1.0, 1.0, 1.0);

var bodyParts_textureParameters = {
	//material: "materials/Wood05",
	//material: "materials/Fabric04",
	material: "materials/Plastic04",
	metallic : false,
	normalScale: 1.0,
	repeatS: 2.0,
	repeatT: 2.0,
}
var bodyParts_normalScale = new THREE.Vector2(bodyParts_textureParameters.normalScale, bodyParts_textureParameters.normalScale);
var bodyParts_textureRepeat = new THREE.Vector2(bodyParts_textureParameters.repeatS, bodyParts_textureParameters.repeatT);
var bodyParts_diffuseMap = loadTexture( "textures/" + bodyParts_textureParameters.material + "_col.jpg" );
if (bodyParts_textureParameters.metallic) {
	var bodyParts_metalnessMap = loadTexture( "textures/" + bodyParts_textureParameters.material + "_met.jpg" );
} else {
	var bodyParts_metalnessMap = loadTexture( "textures/materials/met.jpg" );
}
var bodyParts_roughnessMap = loadTexture( "textures/" + bodyParts_textureParameters.material + "_rgh.jpg" );
var bodyParts_normalMap = loadTexture( "textures/" + bodyParts_textureParameters.material + "_nrm.jpg" );
var bodyParts_aoMap = loadTexture( "textures/" + bodyParts_textureParameters.material + "_disp.jpg" );
//bodyParts_aoMap = loadTexture( "textures/materials/ao.jpg");

var bodyParts_cdiff = new THREE.Vector3(1.0, 0.0, 0.0);