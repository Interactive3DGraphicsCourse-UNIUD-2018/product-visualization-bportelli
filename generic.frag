precision highp float;
precision highp int;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 uVv;
uniform vec3 pointLightPositions[4]; // in world space
uniform vec3 clights[4];
uniform vec3 ambientLight;
uniform sampler2D metalnessMap;
uniform sampler2D diffuseMap;
uniform sampler2D roughnessMap;
uniform sampler2D normalMap;
uniform sampler2D aoMap;
uniform vec2 normalScale;
uniform vec2 textureRepeat;
uniform vec3 surfCdiff;
uniform samplerCube envMap;
const float PI = 3.14159;
vec3 cdiff;
vec3 cspec;
float roughness;
vec3 outRadiances[4];

#define saturate(a) clamp( a, 0.0, 1.0 )

float pow2( const in float x ) { return x*x; }

float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
	float maxMIPLevelScalar = float( maxMIPLevel );
	float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
	return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
}

float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}

// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

vec3 BRDF_Specular_GGX_Environment( vec3 normal, vec3 viewDir, const in vec3 cspec, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
	return cspec * AB.x + AB.y;
}

vec3 FSchlick(float lDoth) {
	return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
}

float DGGX(float nDoth, float alpha) {
	float alpha2 = alpha*alpha;
	float d = nDoth*nDoth*(alpha2-1.0)+1.0;
	return (  alpha2 / (PI*d*d));
}

float G1(float dotProduct, float k) {
	return (dotProduct / (dotProduct*(1.0-k) + k) );
}

float GSmith(float nDotv, float nDotl) {
		float k = roughness*roughness;
		return G1(nDotl,k)*G1(nDotv,k);
}

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
	vec3 q0 = dFdx( eye_pos.xyz );
	vec3 q1 = dFdy( eye_pos.xyz );
	vec2 st0 = dFdx( uVv.st );
	vec2 st1 = dFdy( uVv.st );
	vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
	vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
	vec3 N =  surf_norm ;
	vec3 mapN = normalize(texture2D( normalMap, uVv * textureRepeat ).xyz * 2.0 - 1.0);
	mapN.xy = normalScale * mapN.xy;
	mat3 tsn = mat3( S, T, N );
	return normalize( tsn * mapN );
}

void main() {

	vec3 n = perturbNormal2Arb( vPosition, normalize( vNormal ));
	vec3 v = normalize( -vPosition);

	vec3 vReflect = reflect(vPosition,n);
	vec3 r = inverseTransformDirection( vReflect, viewMatrix );

	vec3 metalness = texture2D( metalnessMap, uVv*textureRepeat ).rgb;
	
	vec3 baseColor = texture2D( diffuseMap, uVv*textureRepeat ).rgb;
	baseColor = (baseColor * surfCdiff)*2.;  // to change color
	baseColor = pow( baseColor, vec3(2.2));	 // texture in sRGB, linearize			
	
	// Relation between metalness and (cdiff, cspec)
	// | material  | metalness | cdiff     | cspec     |
	// | metal     | 1         | 0         | baseColor |
	// | dielectic | 0         | baseColor | 0.04      |
	cdiff = (vec3(1.)-metalness) * baseColor;
	cspec = metalness * baseColor + (vec3(1.)-metalness) * 0.04;
	
	roughness = texture2D( roughnessMap, uVv*textureRepeat).r; // no need to linearize roughness map

	float blinnShininessExponent = GGXRoughnessToBlinnExponent(roughness);
	float specularMIPLevel = getSpecularMIPLevel(blinnShininessExponent, 8);
	vec3 envLight = textureCubeLodEXT( envMap, vec3(-r.x, r.yz), specularMIPLevel ).rgb;
	vec3 grayScaleEnvLight = vec3(.3*envLight.r + .59*envLight.g + .11*envLight.b);
	envLight = pow( envLight, vec3(2.2));
	grayScaleEnvLight = pow( grayScaleEnvLight, vec3(2.2));
	
	float blinnShininessExponent2 = GGXRoughnessToBlinnExponent(1.);
	float specularMIPLevel2 = getSpecularMIPLevel(blinnShininessExponent2, 9);
	vec3 envLight2 = textureCubeLodEXT( envMap, vec3(-r.x, r.yz), specularMIPLevel2 ).rgb;
	vec3 grayScaleEnvLight2 = vec3(.3*envLight2.r + .59*envLight2.g + .11*envLight2.b);
	envLight2 = pow( envLight2, vec3(2.2));
	grayScaleEnvLight2 = pow( grayScaleEnvLight2, vec3(2.2));
	
	for (int i=0; i<4; i++) {
		vec4 lPosition = viewMatrix * vec4( pointLightPositions[i], 1.0 );
		vec3 l = normalize(lPosition.xyz - vPosition.xyz);
		vec3 h = normalize( v + l);
		// small quantity to prevent divisions by 0
		float nDotl = max(dot( n, l ),0.000001);
		float lDoth = max(dot( l, h ),0.000001);
		float nDoth = max(dot( n, h ),0.000001);
		float vDoth = max(dot( v, h ),0.000001);
		float nDotv = max(dot( n, v ),0.000001);
		vec3 fresnel = FSchlick(lDoth);
		vec3 BRDF = (vec3(1.0)-fresnel)*cdiff/PI + fresnel*GSmith(nDotv,nDotl)*DGGX(nDoth,roughness*roughness)/
			(4.0*nDotl*nDotv);
		outRadiances[i] = PI* clights[i] * nDotl * BRDF ;
	}
	
	vec3 ambLight = (cdiff*(grayScaleEnvLight2+vec3(0.0))+envLight2*0.04)*texture2D( aoMap, uVv * textureRepeat ).xyz;

	vec3 metallicReflection = envLight*BRDF_Specular_GGX_Environment(n, v, cspec, roughness)*texture2D( aoMap, uVv * textureRepeat ).xyz;
	
	vec3 outRadiance = saturate(outRadiances[0]+outRadiances[1]+outRadiances[2]+outRadiances[3]) +
					(vec3(1.)-metalness)*ambLight +
					metalness*metallicReflection;
	
	// gamma encode the final value
	gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
} 