precision highp float;
precision highp int;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 uVv;
void main() {
	vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
	vPosition = vPos.xyz;
	vNormal = normalMatrix * normal;
	uVv = uv;
	gl_Position = projectionMatrix * vPos;
}