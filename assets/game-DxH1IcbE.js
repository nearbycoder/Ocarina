const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SMAAPass-wYK8kwqm.js","./three.core-DasCGBBz.js","./BokehPass--SI-jwZ7.js"])))=>i.map(i=>d[i]);
import{$n as e,At as t,C as n,Cn as r,D as i,Dt as a,E as o,En as s,Et as c,Gn as l,H as u,Hn as d,Ht as f,I as p,Jn as m,Kn as h,L as g,Lt as _,M as v,Mn as y,Mt as b,N as x,Nn as S,O as C,Ot as w,P as T,Pn as E,Pt as D,R as O,S as k,Sr as ee,St as A,T as te,Tn as ne,Tt as j,Un as re,Ut as ie,Vn as M,Vt as N,Wn as ae,Xn as oe,Y as P,Yn as se,Zn as ce,_ as le,_r as ue,a as de,ar as F,b as fe,bn as pe,br as me,bt as I,c as he,ct as ge,d as _e,dr as ve,dt as L,et as ye,f as be,fr as xe,ft as Se,g as Ce,gr as we,gt as Te,h as Ee,hr as R,ht as De,ir as Oe,it as z,j as ke,jn as Ae,jt as je,k as Me,kt as B,lr as Ne,lt as V,m as Pe,mr as H,mt as U,nr as Fe,nt as Ie,o as Le,or as W,p as G,pr as Re,pt as ze,qn as Be,r as Ve,rr as He,rt as Ue,s as We,sr as Ge,tr as Ke,tt as qe,u as Je,ur as Ye,ut as Xe,v as Ze,vr as Qe,vt as $e,w as et,wn as tt,wt as nt,x as rt,xn as it,xr as at,xt as ot,y as st,yn as ct,yr as K,yt as lt,z as ut,zn as dt}from"./three.core-DasCGBBz.js";import{a as ft,i as pt,n as mt,o as ht,r as gt,t as _t}from"./index-QBxDB86n.js";var vt=Object.defineProperty,yt=(e,t)=>{let n={};for(var r in e)vt(n,r,{get:e[r],enumerable:!0});return t||vt(n,Symbol.toStringTag,{value:`Module`}),n};function bt(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function xt(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var q={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},J={common:{diffuse:{value:new G(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new V}},envmap:{envMap:{value:null},envMapRotation:{value:new V},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new V}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new V}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new V},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new V},normalScale:{value:new F(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new V},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new V}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new V}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new V}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new G(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new W},probesMax:{value:new W},probesResolution:{value:new W}},points:{diffuse:{value:new G(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0},uvTransform:{value:new V}},sprite:{diffuse:{value:new G(16777215)},opacity:{value:1},center:{value:new F(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}}},St={basic:{uniforms:K([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.fog]),vertexShader:q.meshbasic_vert,fragmentShader:q.meshbasic_frag},lambert:{uniforms:K([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new G(0)},envMapIntensity:{value:1}}]),vertexShader:q.meshlambert_vert,fragmentShader:q.meshlambert_frag},phong:{uniforms:K([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new G(0)},specular:{value:new G(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:q.meshphong_vert,fragmentShader:q.meshphong_frag},standard:{uniforms:K([J.common,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.roughnessmap,J.metalnessmap,J.fog,J.lights,{emissive:{value:new G(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:q.meshphysical_vert,fragmentShader:q.meshphysical_frag},toon:{uniforms:K([J.common,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.gradientmap,J.fog,J.lights,{emissive:{value:new G(0)}}]),vertexShader:q.meshtoon_vert,fragmentShader:q.meshtoon_frag},matcap:{uniforms:K([J.common,J.bumpmap,J.normalmap,J.displacementmap,J.fog,{matcap:{value:null}}]),vertexShader:q.meshmatcap_vert,fragmentShader:q.meshmatcap_frag},points:{uniforms:K([J.points,J.fog]),vertexShader:q.points_vert,fragmentShader:q.points_frag},dashed:{uniforms:K([J.common,J.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:q.linedashed_vert,fragmentShader:q.linedashed_frag},depth:{uniforms:K([J.common,J.displacementmap]),vertexShader:q.depth_vert,fragmentShader:q.depth_frag},normal:{uniforms:K([J.common,J.bumpmap,J.normalmap,J.displacementmap,{opacity:{value:1}}]),vertexShader:q.meshnormal_vert,fragmentShader:q.meshnormal_frag},sprite:{uniforms:K([J.sprite,J.fog]),vertexShader:q.sprite_vert,fragmentShader:q.sprite_frag},background:{uniforms:{uvTransform:{value:new V},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:q.background_vert,fragmentShader:q.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new V}},vertexShader:q.backgroundCube_vert,fragmentShader:q.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:q.cube_vert,fragmentShader:q.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:q.equirect_vert,fragmentShader:q.equirect_frag},distance:{uniforms:K([J.common,J.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:q.distance_vert,fragmentShader:q.distance_frag},shadow:{uniforms:K([J.lights,J.fog,{color:{value:new G(0)},opacity:{value:1}}]),vertexShader:q.shadow_vert,fragmentShader:q.shadow_frag}};St.physical={uniforms:K([St.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new V},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new V},clearcoatNormalScale:{value:new F(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new V},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new V},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new V},sheen:{value:0},sheenColor:{value:new G(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new V},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new V},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new V},transmissionSamplerSize:{value:new F},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new V},attenuationDistance:{value:0},attenuationColor:{value:new G(0)},specularColor:{value:new G(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new V},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new V},anisotropyVector:{value:new F},anisotropyMap:{value:null},anisotropyMapTransform:{value:new V}}]),vertexShader:q.meshphysical_vert,fragmentShader:q.meshphysical_frag};var Ct={r:0,b:0,g:0},wt=new Xe,Tt=new V;Tt.set(-1,0,0,0,1,0,0,0,1);function Et(e,t,n,r,i,a){let o=new G(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new L(new Le(1,1,1),new E({name:`BackgroundCubeMaterial`,uniforms:xe(St.backgroundCube.uniforms),vertexShader:St.backgroundCube.vertexShader,fragmentShader:St.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(wt.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Tt),l.material.toneMapped=Pe.getTransfer(i.colorSpace)!==y,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new L(new B(2,2),new E({name:`BackgroundMaterial`,uniforms:xe(St.background.uniforms),vertexShader:St.background.vertexShader,fragmentShader:St.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Pe.getTransfer(i.colorSpace)!==y,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ct,ue(e)),n.buffers.color.setClear(Ct.r,Ct.g,Ct.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Dt(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Ot(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function kt(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(at(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&at(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function At(e){let t=this,n=null,r=0,i=!1,a=!1,o=new w,s=new V,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var jt=4,Mt=6,Nt=20,Pt=256,Ft=new c,It=new G,Lt=null,Rt=0,zt=0,Bt=!1,Vt=new W,Ht=new W,Ut=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Vt}=i;Lt=this._renderer.getRenderTarget(),Rt=this._renderer.getActiveCubeFace(),zt=this._renderer.getActiveMipmapLevel(),Bt=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xt(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yt(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Lt,Rt,zt),this._renderer.xr.enabled=Bt,e.scissorTest=!1,Kt(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Lt=this._renderer.getRenderTarget(),Rt=this._renderer.getActiveCubeFace(),zt=this._renderer.getActiveMipmapLevel(),Bt=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ye,minFilter:ye,generateMipmaps:!1,type:g,format:f,colorSpace:Ue,depthBuffer:!1},r=Gt(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gt(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Wt(r)),this._blurMaterial=Jt(r,e,t),this._ggxMaterial=qt(r,e,t)}return r}_compileMaterial(e){let t=new L(new he,e);this._renderer.compile(t,Ft)}_sceneToCubeUV(e,t,n,r,i){let o=new a(90,1,t,n),s=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,d=l.toneMapping;l.getClearColor(It),l.toneMapping=0,l.autoClear=!1,l.state.buffers.depth.getReversed()&&(l.setRenderTarget(r),l.clearDepth(),l.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new L(new Le,new Se({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let f=this._backgroundBox,p=f.material,m=!1,h=e.background;h?h.isColor&&(p.color.copy(h),e.background=null,m=!0):(p.color.copy(It),m=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(o.up.set(0,s[t],0),o.position.set(i.x,i.y,i.z),o.lookAt(i.x+c[t],i.y,i.z)):n===1?(o.up.set(0,0,s[t]),o.position.set(i.x,i.y,i.z),o.lookAt(i.x,i.y+c[t],i.z)):(o.up.set(0,s[t],0),o.position.set(i.x,i.y,i.z),o.lookAt(i.x,i.y,i.z+c[t]));let a=this._cubeSize;Kt(r,n*a,t>2?a:0,a,a),l.setRenderTarget(r),m&&l.render(f,o),l.render(e,o)}l.toneMapping=d,l.autoClear=u,e.background=h}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xt()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yt());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Kt(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Ft)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-jt?n-d+jt:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Kt(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Ft),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Kt(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Ft)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Kt(t,3*l*(r>this._lodMax-jt?r-this._lodMax+jt:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Ft)}};function Wt(e){let t=[],n=[],r=e,i=e-jt+1+Mt;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Ht.set(1,r,n):e===1?Ht.set(-n,1,-r):e===2?Ht.set(-n,r,1):e===3?Ht.set(-1,r,-n):e===4?Ht.set(-n,-1,r):Ht.set(n,r,-1),Ht.toArray(l,(e*6+t)*3)}}let u=new he;u.setAttribute(`position`,new We(c,3)),u.setAttribute(`outputDirection`,new We(l,3)),n.push(new L(u,null)),r>jt&&r--}return{lodMeshes:n,sizeLods:t}}function Gt(e,t,n){let r=new Ye(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Kt(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function qt(e,t,n){return new E({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Pt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Zt(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Jt(e,t,n){return new E({name:`SphericalGaussianBlur`,defines:{SAMPLES:Nt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Zt(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Yt(){return new E({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Zt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Xt(){return new E({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Zt(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Qt=class extends Ye{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ze(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Le(5,5,5),i=new E({name:`CubemapFromEquirect`,uniforms:xe(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new L(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=ye),new Ce(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function $t(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Qt(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ut(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ut(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function en(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ee(`WebGLRenderer: `+e+` extension not supported.`),t}}}function tn(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?se:m)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function nn(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function rn(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function an(e,t,n){let r=new WeakMap,i=new Ge;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new rt(h,p,m,u);g.type=v,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new F(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function on(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var sn={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function cn(e,t,n,r,i,a){let o=new Ye(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,l=null,u=new he;u.setAttribute(`position`,new ke([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new ke([0,2,0,0,2,0],2));let d=new it({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new L(u,d),p=new c(-1,1,1,-1,0,1),m=null,h=null,_=!1,v,y=null,b=[],x=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),l!==null&&l.setSize(e,t);for(let n=0;n<b.length;n++){let r=b[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){b=e,x=b.length>0&&b[0].isRenderPass===!0;let t=o.width,n=o.height;b.length>0&&s===null&&(s=new Ye(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),l=new Ye(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<b.length;e++){let r=b[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(_||e.toneMapping===0&&b.length===0)return!1;if(y=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return x===!1&&e.setRenderTarget(o),v=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return x},this.end=function(e,t){e.toneMapping=v,_=!0;let n=o,r=s;for(let i=0;i<b.length;i++){let a=b[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?l:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},Pe.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=sn[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(y),e.render(f,p),y=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),l!==null&&l.dispose(),u.dispose(),d.dispose()}}var ln=new re,un=new te(1,1),dn=new rt,fn=new fe,pn=new Ze,mn=[],hn=[],gn=new Float32Array(16),_n=new Float32Array(9),vn=new Float32Array(4);function yn(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=mn[i];if(a===void 0&&(a=new Float32Array(i),mn[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function bn(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function xn(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Sn(e,t){let n=hn[t];n===void 0&&(n=new Int32Array(t),hn[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Cn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function wn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bn(n,t))return;e.uniform2fv(this.addr,t),xn(n,t)}}function Tn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(bn(n,t))return;e.uniform3fv(this.addr,t),xn(n,t)}}function En(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bn(n,t))return;e.uniform4fv(this.addr,t),xn(n,t)}}function Dn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),xn(n,t)}else{if(bn(n,r))return;vn.set(r),e.uniformMatrix2fv(this.addr,!1,vn),xn(n,r)}}function On(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),xn(n,t)}else{if(bn(n,r))return;_n.set(r),e.uniformMatrix3fv(this.addr,!1,_n),xn(n,r)}}function kn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),xn(n,t)}else{if(bn(n,r))return;gn.set(r),e.uniformMatrix4fv(this.addr,!1,gn),xn(n,r)}}function An(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function jn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bn(n,t))return;e.uniform2iv(this.addr,t),xn(n,t)}}function Mn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(bn(n,t))return;e.uniform3iv(this.addr,t),xn(n,t)}}function Nn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bn(n,t))return;e.uniform4iv(this.addr,t),xn(n,t)}}function Pn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Fn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bn(n,t))return;e.uniform2uiv(this.addr,t),xn(n,t)}}function In(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(bn(n,t))return;e.uniform3uiv(this.addr,t),xn(n,t)}}function Ln(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bn(n,t))return;e.uniform4uiv(this.addr,t),xn(n,t)}}function Rn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(un.compareFunction=n.isReversedDepthBuffer()?518:515,a=un):a=ln,n.setTexture2D(t||a,i)}function zn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||fn,i)}function Bn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||pn,i)}function Vn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||dn,i)}function Hn(e){switch(e){case 5126:return Cn;case 35664:return wn;case 35665:return Tn;case 35666:return En;case 35674:return Dn;case 35675:return On;case 35676:return kn;case 5124:case 35670:return An;case 35667:case 35671:return jn;case 35668:case 35672:return Mn;case 35669:case 35673:return Nn;case 5125:return Pn;case 36294:return Fn;case 36295:return In;case 36296:return Ln;case 35678:case 36198:case 36298:case 36306:case 35682:return Rn;case 35679:case 36299:case 36307:return zn;case 35680:case 36300:case 36308:case 36293:return Bn;case 36289:case 36303:case 36311:case 36292:return Vn}}function Un(e,t){e.uniform1fv(this.addr,t)}function Wn(e,t){let n=yn(t,this.size,2);e.uniform2fv(this.addr,n)}function Gn(e,t){let n=yn(t,this.size,3);e.uniform3fv(this.addr,n)}function Kn(e,t){let n=yn(t,this.size,4);e.uniform4fv(this.addr,n)}function qn(e,t){let n=yn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Jn(e,t){let n=yn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Yn(e,t){let n=yn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Xn(e,t){e.uniform1iv(this.addr,t)}function Zn(e,t){e.uniform2iv(this.addr,t)}function Qn(e,t){e.uniform3iv(this.addr,t)}function $n(e,t){e.uniform4iv(this.addr,t)}function er(e,t){e.uniform1uiv(this.addr,t)}function tr(e,t){e.uniform2uiv(this.addr,t)}function nr(e,t){e.uniform3uiv(this.addr,t)}function rr(e,t){e.uniform4uiv(this.addr,t)}function ir(e,t,n){let r=this.cache,i=t.length,a=Sn(n,i);bn(r,a)||(e.uniform1iv(this.addr,a),xn(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?un:ln;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ar(e,t,n){let r=this.cache,i=t.length,a=Sn(n,i);bn(r,a)||(e.uniform1iv(this.addr,a),xn(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||fn,a[e])}function or(e,t,n){let r=this.cache,i=t.length,a=Sn(n,i);bn(r,a)||(e.uniform1iv(this.addr,a),xn(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||pn,a[e])}function sr(e,t,n){let r=this.cache,i=t.length,a=Sn(n,i);bn(r,a)||(e.uniform1iv(this.addr,a),xn(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||dn,a[e])}function cr(e){switch(e){case 5126:return Un;case 35664:return Wn;case 35665:return Gn;case 35666:return Kn;case 35674:return qn;case 35675:return Jn;case 35676:return Yn;case 5124:case 35670:return Xn;case 35667:case 35671:return Zn;case 35668:case 35672:return Qn;case 35669:case 35673:return $n;case 5125:return er;case 36294:return tr;case 36295:return nr;case 36296:return rr;case 35678:case 36198:case 36298:case 36306:case 35682:return ir;case 35679:case 36299:case 36307:return ar;case 35680:case 36300:case 36308:case 36293:return or;case 36289:case 36303:case 36311:case 36292:return sr}}var lr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Hn(t.type)}},ur=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cr(t.type)}},dr=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},fr=/(\w+)(\])?(\[|\.)?/g;function pr(e,t){e.seq.push(t),e.map[t.id]=t}function mr(e,t,n){let r=e.name,i=r.length;for(fr.lastIndex=0;;){let a=fr.exec(r),o=fr.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){pr(n,l===void 0?new lr(s,e,t):new ur(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new dr(s),pr(n,e)),n=e}}}var hr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);mr(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function gr(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var _r=37297,vr=0;function yr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var br=new V;function xr(e){Pe._getMatrix(br,Pe.workingColorSpace,e);let t=`mat3( ${br.elements.map(e=>e.toFixed(4))} )`;switch(Pe.getTransfer(e)){case z:return[t,`LinearTransferOETF`];case y:return[t,`sRGBTransferOETF`];default:return at(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Sr(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+yr(e.getShaderSource(t),r)}return i}function Cr(e,t){let n=xr(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var wr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Tr(e,t){let n=wr[t];return n===void 0?(at(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Er=new W;function Dr(){return Pe.getLuminanceCoefficients(Er),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Er.x.toFixed(4)}, ${Er.y.toFixed(4)}, ${Er.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Or(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(jr).join(`
`)}function kr(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Ar(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function jr(e){return e!==``}function Mr(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Pr=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fr(e){return e.replace(Pr,Lr)}var Ir=new Map;function Lr(e,t){let n=q[t];if(n===void 0){let e=Ir.get(t);if(e!==void 0)n=q[e],at(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Fr(n)}var Rr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zr(e){return e.replace(Rr,Br)}function Br(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Vr(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Hr={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Ur(e){return Hr[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Wr={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Gr(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Wr[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Kr={302:`ENVMAP_MODE_REFRACTION`};function qr(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Kr[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Jr={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Yr(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Jr[e.combine]||`ENVMAP_BLENDING_NONE`}function Xr(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Zr(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ur(n),l=Gr(n),u=qr(n),d=Yr(n),f=Xr(n),p=Or(n),m=kr(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(jr).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(jr).join(`
`),_.length>0&&(_+=`
`)):(g=[Vr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(jr).join(`
`),_=[Vr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:q.tonemapping_pars_fragment,n.toneMapping===0?``:Tr(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,q.colorspace_pars_fragment,Cr(`linearToOutputTexel`,n.outputColorSpace),Dr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(jr).join(`
`)),o=Fr(o),o=Mr(o,n),o=Nr(o,n),s=Fr(s),s=Mr(s,n),s=Nr(s,n),o=zr(o),s=zr(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=gr(i,i.VERTEX_SHADER,y),S=gr(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Sr(i,x,`vertex`),n=Sr(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):at(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new hr(i,h),T=Ar(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,_r)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=vr++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Qr=0,$r=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ei(e),t.set(e,n)),n}},ei=class{constructor(e){this.id=Qr++,this.code=e,this.usedTimes=0}};function ti(e){return e===1030||e===37490||e===36285}function ni(e,t,n,r,i,a){let o=new P,s=new $r,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&at(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,ee;if(C){let e=St[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,ee=t.id}let A=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),ne=h.isInstancedMesh===!0,j=h.isBatchedMesh===!0,re=!!i.map,ie=!!i.matcap,M=!!x,N=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,P=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,le=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,F=i.clearcoat>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,I=i.sheen>0,he=i.transmission>0,ge=de&&!!i.anisotropyMap,_e=F&&!!i.clearcoatMap,ve=F&&!!i.clearcoatNormalMap,L=F&&!!i.clearcoatRoughnessMap,ye=me&&!!i.iridescenceMap,be=me&&!!i.iridescenceThicknessMap,xe=I&&!!i.sheenColorMap,Se=I&&!!i.sheenRoughnessMap,Ce=!!i.specularMap,we=!!i.specularColorMap,Te=!!i.specularIntensityMap,Ee=he&&!!i.transmissionMap,R=he&&!!i.thicknessMap,De=!!i.gradientMap,Oe=!!i.alphaMap,z=i.alphaTest>0,ke=!!i.alphaHash,Ae=!!i.extensions,je=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(je=e.toneMapping);let Me={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:ee,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:j,batchingColor:j&&h._colorsTexture!==null,instancing:ne,instancingColor:ne&&h.instanceColor!==null,instancingMorph:ne&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Pe.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:re,matcap:ie,envMap:M,envMapMode:M&&x.mapping,envMapCubeUVHeight:S,aoMap:N,lightMap:ae,bumpMap:oe,normalMap:P,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:P&&i.normalMapType===1,normalMapTangentSpace:P&&i.normalMapType===0,packedNormalMap:P&&i.normalMapType===0&&ti(i.normalMap.format),metalnessMap:le,roughnessMap:ue,anisotropy:de,anisotropyMap:ge,clearcoat:F,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:L,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:ye,iridescenceThicknessMap:be,sheen:I,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:Ce,specularColorMap:we,specularIntensityMap:Te,transmission:he,transmissionMap:Ee,thicknessMap:R,gradientMap:De,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:z,alphaHash:ke,combine:i.combine,mapUv:re&&m(i.map.channel),aoMapUv:N&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:P&&m(i.normalMap.channel),displacementMapUv:se&&m(i.displacementMap.channel),emissiveMapUv:ce&&m(i.emissiveMap.channel),metalnessMapUv:le&&m(i.metalnessMap.channel),roughnessMapUv:ue&&m(i.roughnessMap.channel),anisotropyMapUv:ge&&m(i.anisotropyMap.channel),clearcoatMapUv:_e&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:L&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:be&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&m(i.sheenRoughnessMap.channel),specularMapUv:Ce&&m(i.specularMap.channel),specularColorMapUv:we&&m(i.specularColorMap.channel),specularIntensityMapUv:Te&&m(i.specularIntensityMap.channel),transmissionMapUv:Ee&&m(i.transmissionMap.channel),thicknessMapUv:R&&m(i.thicknessMap.channel),alphaMapUv:Oe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(P||de),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(re||Oe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&P===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:je,decodeVideoTexture:re&&i.map.isVideoTexture===!0&&Pe.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&Pe.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ae&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ae&&i.extensions.multiDraw===!0||j)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Me.vertexUv1s=c.has(1),Me.vertexUv2s=c.has(2),Me.vertexUv3s=c.has(3),c.clear(),Me}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=St[t];n=oe.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Zr(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function ri(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function ii(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function ai(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function oi(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||ii),r.length>1&&r.sort(t||ai),i.length>1&&i.sort(t||ai)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function si(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new oi,e.set(t,[i])):n>=r.length?(i=new oi,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function ci(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new W,color:new G};break;case`SpotLight`:n={position:new W,direction:new W,color:new G,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new W,color:new G,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new W,skyColor:new G,groundColor:new G};break;case`RectAreaLight`:n={color:new G,position:new W,halfWidth:new W,halfHeight:new W}}return e[t.id]=n,n}}}function li(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new F};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new F};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new F,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var ui=0;function di(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function fi(e){let t=new ci,n=li(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new W);let i=new W,a=new Xe,o=new Xe;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(di);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=J.LTC_FLOAT_1,r.rectAreaLTC2=J.LTC_FLOAT_2):(r.rectAreaLTC1=J.LTC_HALF_1,r.rectAreaLTC2=J.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=ui++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function pi(e){let t=new fi(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function mi(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new pi(e),t.set(n,[a])):r>=i.length?(a=new pi(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var hi=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gi=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_i=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],vi=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],yi=new Xe,bi=new W,xi=new W;function Si(e,t,r){let i=new T,a=new F,o=new F,s=new Ge,c=new ze,l=new U,u={},d=r.maxTextureSize,f={0:1,1:0,2:2},p=new E({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new F},radius:{value:4}},vertexShader:hi,fragmentShader:gi}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new he;h.setAttribute(`position`,new We(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new L(h,p),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let b=this.type;this.render=function(t,r,c){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||t.length===0)return;this.type===2&&(at(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let l=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=b!==this.type;m&&r.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let l=0,u=t.length;l<u;l++){let u=t[l],f=u.shadow;if(f===void 0){at(`WebGLShadowMap:`,u,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;a.copy(f.mapSize);let h=f.getFrameExtents();a.multiply(h),o.copy(f.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(o.x=Math.floor(d/h.x),a.x=o.x*h.x,f.mapSize.x=o.x),a.y>d&&(o.y=Math.floor(d/h.y),a.y=o.y*h.y,f.mapSize.y=o.y));let _=e.state.buffers.depth.getReversed();if(f.camera._reversedDepth=_,f.map===null||m===!0){if(f.map!==null&&(f.map.depthTexture!==null&&(f.map.depthTexture.dispose(),f.map.depthTexture=null),f.map.dispose()),this.type===3){if(u.isPointLight){at(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}f.map=new Ye(a.x,a.y,{format:ct,type:g,minFilter:ye,magFilter:ye,generateMipmaps:!1}),f.map.texture.name=u.name+`.shadowMap`,f.map.depthTexture=new te(a.x,a.y,v),f.map.depthTexture.name=u.name+`.shadowMapDepth`,f.map.depthTexture.format=n,f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=I,f.map.depthTexture.magFilter=I}else u.isPointLight?(f.map=new Qt(a.x),f.map.depthTexture=new le(a.x,Ke)):(f.map=new Ye(a.x,a.y),f.map.depthTexture=new te(a.x,a.y,Ke)),f.map.depthTexture.name=u.name+`.shadowMap`,f.map.depthTexture.format=n,this.type===1?(f.map.depthTexture.compareFunction=_?518:515,f.map.depthTexture.minFilter=ye,f.map.depthTexture.magFilter=ye):(f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=I,f.map.depthTexture.magFilter=I);f.camera.updateProjectionMatrix()}f.map.isWebGLCubeRenderTarget!==!0&&(f.map.width!==a.x||f.map.height!==a.y)&&f.map.setSize(a.x,a.y);let y=f.map.isWebGLCubeRenderTarget?6:f.getViewportCount();u.isPointLight!==!0&&f.updateMatrices(u,c);for(let t=0;t<y;t++){let n=f.getCamera(t);if(u.isPointLight){let e=f.camera,n=f.matrix,r=u.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),bi.setFromMatrixPosition(u.matrixWorld),e.position.copy(bi),xi.copy(e.position),xi.add(_i[t]),e.up.copy(vi[t]),e.lookAt(xi),e.updateMatrixWorld(),n.makeTranslation(-bi.x,-bi.y,-bi.z),yi.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),f._frustum.setFromProjectionMatrix(yi,e.coordinateSystem,e.reversedDepth)}if(f.map.isWebGLCubeRenderTarget)e.setRenderTarget(f.map,t),e.clear();else{t===0&&(e.setRenderTarget(f.map),e.clear());let n=f.getViewport(t);s.set(o.x*n.x,o.y*n.y,o.x*n.z,o.y*n.w),p.viewport(s)}i=f.getFrustum(t),C(r,c,n,u,this.type)}f.isPointLightShadow!==!0&&this.type===3&&x(f,c),f.needsUpdate=!1}b=this.type,y.needsUpdate=!1,e.setRenderTarget(l,u,f)};function x(n,r){let i=t.update(_);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null?n.mapPass=new Ye(a.x,a.y,{format:ct,type:g}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,p,_,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,m,_,null)}function S(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,w)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function C(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(i))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=S(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=S(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)C(c[e],r,a,o,s)}function w(e){e.target.removeEventListener(`dispose`,w);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ci(e,t){function n(){let t=!1,n=new Ge,r=null,i=new Ge(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ue(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ne[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ue(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,ee=null,A=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),j=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),j=re>=1);let M=null,N={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),P=new Ge().fromArray(ae),se=new Ge().fromArray(oe);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ue(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),ue(e.CULL_FACE),he(0);function ue(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function F(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let I={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(de(e.BLEND),g=!1);return}if(g===!1&&(ue(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(I[r],I[i],I[o],I[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?de(e.CULL_FACE):ue(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ue(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?de(e.CULL_FACE):(ue(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function L(t){t!==k&&(j&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(ue(e.POLYGON_OFFSET_FILL),(ee!==n||A!==r)&&(ee=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):de(e.POLYGON_OFFSET_FILL)}function be(t){t?ue(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+te-1),M!==t&&(e.activeTexture(t),M=t)}function Se(t,n,r){r===void 0&&(r=M===null?e.TEXTURE0+te-1:M);let i=N[r];i===void 0&&(i={type:void 0,texture:void 0},N[r]=i),(i.type!==t||i.texture!==n)&&(M!==r&&(e.activeTexture(r),M=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Ce(){let t=N[M];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function we(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Te(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ee(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function z(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function ke(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function B(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ne(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function V(t){P.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),P.copy(t))}function Pe(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function H(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function U(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Fe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},M=null,N={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,ee=null,A=null,P.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ue,disable:de,bindFramebuffer:F,drawBuffers:fe,useProgram:pe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:L,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:we,compressedTexImage3D:Te,texImage2D:je,texImage3D:Me,pixelStorei:Ne,getParameter:B,updateUBOMapping:H,uniformBlockBinding:U,texStorage2D:ke,texStorage3D:Ae,texSubImage2D:Ee,texSubImage3D:De,compressedTexSubImage2D:Oe,compressedTexSubImage3D:z,scissor:V,viewport:Pe,reset:Fe}}function wi(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new F,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):H(`canvas`)}function g(e,t,n){let r=1,i=ke(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),at(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&at(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];at(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||at(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?z:Pe.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,at(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function ee(){return O}function te(e){O=e}function ne(){let e=O;return e>=i.maxTextures&&at(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function j(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function re(t,i){let a=r.get(t);if(t.isVideoTexture&&De(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)at(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)at(`WebGLRenderer: Texture marked for update but image is incomplete`);else{de(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){de(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function M(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){de(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function N(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){fe(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ae={[tt]:e.REPEAT,[be]:e.CLAMP_TO_EDGE,[lt]:e.MIRRORED_REPEAT},oe={[I]:e.NEAREST,[A]:e.NEAREST_MIPMAP_NEAREST,[ot]:e.NEAREST_MIPMAP_LINEAR,[ye]:e.LINEAR,[Ie]:e.LINEAR_MIPMAP_NEAREST,[qe]:e.LINEAR_MIPMAP_LINEAR},P={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function se(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&at(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,P[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ce(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=j(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function le(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ue(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=le(n.start,r.width,4),c=le(t.start,r.width,4);n.start<=i+1&&a===c&&le(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function de(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ce(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Pe.getPrimaries(Pe.workingColorSpace),r=o.colorSpace===``?null:Pe.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Oe(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);se(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===et,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ue(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=we(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else at(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?at(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=we(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=ke(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=ke(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function fe(t,o,s){if(o.image.length!==6)return;let c=ce(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Pe.getPrimaries(Pe.workingColorSpace),r=o.colorSpace===``?null:Pe.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Oe(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);se(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?at(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=ke(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function pe(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Ee(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Te(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function me(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ee(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Te(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Te(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);Ee(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Te(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Te(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function he(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),se(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else re(i.depthTexture,0);let u=l.__webglTexture,d=Te(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Ee(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Ee(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ge(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)he(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?he(i.__webglFramebuffer[0],t,0):he(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),me(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),me(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,i){let a=r.get(t);n!==void 0&&pe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ge(t)}function ve(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Ee(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Te(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),me(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),se(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)pe(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else pe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),se(c,a),pe(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),se(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)pe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else pe(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ge(t)}function L(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let xe=[],Se=[];function Ce(t){if(t.samples>0){if(Ee(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(xe.length=0,Se.length=0,xe.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(xe.push(l),Se.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Se)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,xe))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Te(e){return Math.min(i.maxSamples,e.samples)}function Ee(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function De(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Oe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Pe.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&at(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function ke(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=k,this.getTextureUnits=ee,this.setTextureUnits=te,this.setTexture2D=re,this.setTexture2DArray=ie,this.setTexture3D=M,this.setTextureCube=N,this.rebindTextures=_e,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=L,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=Ee,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Ti(e,t){function n(n,r=``){let i,a=Pe.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Ei=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Di=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Oi=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Me(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new E({vertexShader:Ei,fragmentShader:Di,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new L(new B(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ki=class extends C{constructor(t,r){super();let i=this,o=null,s=1,c=null,l=`local-floor`,u=1,d=null,p=null,m=null,h=null,g=null,v=null,y=typeof XRWebGLBinding<`u`,b=new Oi,x={},S=r.getContextAttributes(),C=null,w=null,T=[],E=[],D=new F,O=null,k=null,ee=new a;ee.viewport=new Ge;let A=new a;A.viewport=new Ge;let ne=[ee,A],j=new Ve,re=null,ie=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=T[e];return t===void 0&&(t=new ve,T[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=T[e];return t===void 0&&(t=new ve,T[e]=t),t.getGripSpace()},this.getHand=function(e){let t=T[e];return t===void 0&&(t=new ve,T[e]=t),t.getHandSpace()};function M(e){let t=E.indexOf(e.inputSource);if(t===-1)return;let n=T[t];n!==void 0&&(n.update(e.inputSource,e.frame,d||c),n.dispatchEvent({type:e.type,data:e.inputSource}))}function N(){o.removeEventListener(`select`,M),o.removeEventListener(`selectstart`,M),o.removeEventListener(`selectend`,M),o.removeEventListener(`squeeze`,M),o.removeEventListener(`squeezestart`,M),o.removeEventListener(`squeezeend`,M),o.removeEventListener(`end`,N),o.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<T.length;e++){let t=E[e];t!==null&&(E[e]=null,T[e].disconnect(t))}re=null,ie=null,b.reset();for(let e in x)delete x[e];if(t.setRenderTarget(C),g=null,h=null,m=null,o=null,w=null,pe.stop(),i.isPresenting=!1,t.setPixelRatio(O),t.setSize(D.width,D.height,!1),k!==null){let e=k.camera;e.fov=k.fov,e.zoom=k.zoom,e.updateProjectionMatrix(),k=null}i.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){s=e,i.isPresenting===!0&&at(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){l=e,i.isPresenting===!0&&at(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return d||c},this.setReferenceSpace=function(e){d=e},this.getBaseLayer=function(){return h===null?g:h},this.getBinding=function(){return m===null&&y&&(m=new XRWebGLBinding(o,r)),m},this.getFrame=function(){return v},this.getSession=function(){return o},this.setSession=async function(a){if(o=a,o!==null){if(C=t.getRenderTarget(),o.addEventListener(`select`,M),o.addEventListener(`selectstart`,M),o.addEventListener(`selectend`,M),o.addEventListener(`squeeze`,M),o.addEventListener(`squeezestart`,M),o.addEventListener(`squeezeend`,M),o.addEventListener(`end`,N),o.addEventListener(`inputsourceschange`,ae),S.xrCompatible!==!0&&await r.makeXRCompatible(),O=t.getPixelRatio(),t.getSize(D),y&&`createProjectionLayer`in XRWebGLBinding.prototype){let i=null,a=null,c=null;S.depth&&(c=S.stencil?r.DEPTH24_STENCIL8:r.DEPTH_COMPONENT24,i=S.stencil?et:n,a=S.stencil?e:Ke);let l={colorFormat:r.RGBA8,depthFormat:c,scaleFactor:s};m=this.getBinding(),h=m.createProjectionLayer(l),o.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),w=new Ye(h.textureWidth,h.textureHeight,{format:f,type:ce,depthTexture:new te(h.textureWidth,h.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,i),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let e={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(o,r,e),o.updateRenderState({baseLayer:g}),t.setPixelRatio(1),t.setSize(g.framebufferWidth,g.framebufferHeight,!1),w=new Ye(g.framebufferWidth,g.framebufferHeight,{format:f,type:ce,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(u),d=null,c=await o.requestReferenceSpace(l),pe.setContext(o),pe.start(),i.isPresenting=!0,i.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=E.indexOf(n);r>=0&&(E[r]=null,T[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=E.indexOf(n);if(r===-1){for(let e=0;e<T.length;e++)if(e>=E.length){E.push(n),r=e;break}else if(E[e]===null){E[e]=n,r=e;break}if(r===-1)break}let i=T[r];i&&i.connect(n)}}let oe=new W,P=new W;function se(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(P),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(o===null)return;let t=e.near,n=e.far;b.texture!==null&&(b.depthNear>0&&(t=b.depthNear),b.depthFar>0&&(n=b.depthFar)),j.near=A.near=ee.near=t,j.far=A.far=ee.far=n,(re!==j.near||ie!==j.far)&&(o.updateRenderState({depthNear:j.near,depthFar:j.far}),re=j.near,ie=j.far),j.layers.mask=e.layers.mask|6,ee.layers.mask=j.layers.mask&-5,A.layers.mask=j.layers.mask&-3;let r=e.parent,i=j.cameras;le(j,r);for(let e=0;e<i.length;e++)le(i[e],r);i.length===2?se(j,ee,A):j.projectionMatrix.copy(ee.projectionMatrix),k===null&&e.isPerspectiveCamera&&(k={camera:e,fov:e.fov,zoom:e.zoom}),ue(e,j,r)};function ue(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=_*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(h!==null||g!==null)return u},this.setFoveation=function(e){u=e,h!==null&&(h.fixedFoveation=e),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=e)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(j)},this.getCameraTexture=function(e){return x[e]};let de=null;function fe(e,n){if(p=n.getViewerPose(d||c),v=n,p!==null){let e=p.views;g!==null&&(t.setRenderTargetFramebuffer(w,g.framebuffer),t.setRenderTarget(w));let n=!1;e.length!==j.cameras.length&&(j.cameras.length=0,n=!0);for(let r=0;r<e.length;r++){let i=e[r],o=null;if(g!==null)o=g.getViewport(i);else{let e=m.getViewSubImage(h,i);o=e.viewport,r===0&&(t.setRenderTargetTextures(w,e.colorTexture,e.depthStencilTexture),t.setRenderTarget(w))}let s=ne[r];s===void 0&&(s=new a,s.layers.enable(r),s.viewport=new Ge,ne[r]=s),s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.projectionMatrix.fromArray(i.projectionMatrix),s.projectionMatrixInverse.copy(s.projectionMatrix).invert(),s.viewport.set(o.x,o.y,o.width,o.height),r===0&&(j.matrix.copy(s.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),n===!0&&j.cameras.push(s)}let r=o.enabledFeatures;if(r&&r.includes(`depth-sensing`)&&o.depthUsage==`gpu-optimized`&&y){m=i.getBinding();let t=m.getDepthInformation(e[0]);t&&t.isValid&&t.texture&&b.init(t,o.renderState)}if(r&&r.includes(`camera-access`)&&y){t.state.unbindTexture(),m=i.getBinding();for(let t=0;t<e.length;t++){let n=e[t].camera;if(n){let e=x[n];e||(e=new Me,x[n]=e);let t=m.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<T.length;e++){let t=E[e],r=T[e];t!==null&&r!==void 0&&r.update(t,n,d||c)}de&&de(e,n),n.detectedPlanes&&i.dispatchEvent({type:`planesdetected`,data:n}),v=null}let pe=new bt;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){de=e},this.dispose=function(){}}},Ai=new Xe,ji=new V;ji.set(-1,0,0,0,1,0,0,0,1);function Mi(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ue(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Ai.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(ji),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Ni(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?at(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):at(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Pi=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Fi=null;function Ii(){return Fi===null&&(Fi=new k(Pi,16,16,ct,g),Fi.name=`DFG_LUT`,Fi.minFilter=ye,Fi.magFilter=ye,Fi.wrapS=be,Fi.wrapT=be,Fi.generateMipmaps=!1,Fi.needsUpdate=!0),Fi}var Li=class{constructor(t={}){let{canvas:n=Re(),context:i=null,depth:a=!0,stencil:o=!1,alpha:s=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1,outputBufferType:m=ce}=t;this.isWebGLRenderer=!0;let h;if(i!==null){if(typeof WebGLRenderingContext<`u`&&i instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);h=i.getContextAttributes().alpha}else h=s;let _=m,v=new Set([ie,pe,r]),y=new Set([ce,Ke,Oe,e,Fe,He]),b=new Uint32Array(4),x=new Int32Array(4),S=new W,C=null,w=null,E=[],D=[],O=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let k=this,ee=!1,A=null,te=null,ne=null,j=null;this._outputColorSpace=Ae;let re=0,M=0,N=null,ae=-1,oe=null,P=new Ge,se=new Ge,le=null,ue=new G(0),de=0,F=n.width,fe=n.height,I=1,he=null,ge=null,_e=new Ge(0,0,F,fe),ve=new Ge(0,0,F,fe),L=!1,ye=new T,be=!1,xe=!1,Se=new Xe,Ce=new W,we=new Ge,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ee=!1;function De(){return N===null?I:1}let z=i;function ke(e,t){return n.getContext(e,t)}let je,Me,B,V,H,U,Ie,Le,ze,Be,Ve,Ue,We,Je,Ze,$e,et,tt,nt,rt,it,ot,st;try{let e={alpha:!0,depth:a,stencil:o,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:f};if(`setAttribute`in n&&n.setAttribute(`data-engine`,`three.js r186`),n.addEventListener(`webglcontextlost`,lt,!1),n.addEventListener(`webglcontextrestored`,ut,!1),n.addEventListener(`webglcontextcreationerror`,dt,!1),z===null){let t=`webgl2`;if(z=ke(t,e),z===null)throw ke(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}ct()}catch(e){throw n.removeEventListener(`webglcontextlost`,lt,!1),n.removeEventListener(`webglcontextrestored`,ut,!1),n.removeEventListener(`webglcontextcreationerror`,dt,!1),R(`WebGLRenderer: `+e.message),e}function ct(){je=new en(z),je.init(),it=new Ti(z,je),Me=new kt(z,je,t,it),B=new Ci(z,je),Me.reversedDepthBuffer&&p&&B.buffers.depth.setReversed(!0),te=z.createFramebuffer(),ne=z.createFramebuffer(),j=z.createFramebuffer(),V=new rn(z),H=new ri,U=new wi(z,je,B,H,Me,it,V),Ie=new $t(k),Le=new xt(z),ot=new Dt(z,Le),ze=new tn(z,Le,V,ot),Be=new on(z,ze,Le,ot,V),tt=new an(z,Me,U),Ze=new At(H),Ve=new ni(k,Ie,je,Me,ot,Ze),Ue=new Mi(k,H),We=new si,Je=new mi(je),et=new Et(k,Ie,B,Be,h,l),$e=new Si(k,Be,Me),st=new Ni(z,V,Me,B),nt=new Ot(z,je,V),rt=new nn(z,je,V),V.programs=Ve.programs,k.capabilities=Me,k.extensions=je,k.properties=H,k.renderLists=We,k.shadowMap=$e,k.state=B,k.info=V}_!==1009&&(O=new cn(_,n.width,n.height,c,a,o));let K=new ki(k,z);this.xr=K,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let e=je.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=je.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(e){e!==void 0&&(I=e,this.setSize(F,fe,!1))},this.getSize=function(e){return e.set(F,fe)},this.setSize=function(e,t,r=!0){if(K.isPresenting){at(`WebGLRenderer: Can't change size while VR device is presenting.`);return}F=e,fe=t,n.width=Math.floor(e*I),n.height=Math.floor(t*I),r===!0&&(n.style.width=e+`px`,n.style.height=t+`px`),O!==null&&O.setSize(n.width,n.height),this.setViewport(0,0,e,t)},this.getDrawingBufferSize=function(e){return e.set(F*I,fe*I).floor()},this.setDrawingBufferSize=function(e,t,r){F=e,fe=t,I=r,n.width=Math.floor(e*r),n.height=Math.floor(t*r),this.setViewport(0,0,e,t)},this.setEffects=function(e){if(_===1009){R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){at(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}O.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(P)},this.getViewport=function(e){return e.copy(_e)},this.setViewport=function(e,t,n,r){e.isVector4?_e.set(e.x,e.y,e.z,e.w):_e.set(e,t,n,r),B.viewport(P.copy(_e).multiplyScalar(I).round())},this.getScissor=function(e){return e.copy(ve)},this.setScissor=function(e,t,n,r){e.isVector4?ve.set(e.x,e.y,e.z,e.w):ve.set(e,t,n,r),B.scissor(se.copy(ve).multiplyScalar(I).round())},this.getScissorTest=function(){return L},this.setScissorTest=function(e){B.setScissorTest(L=e)},this.setOpaqueSort=function(e){he=e},this.setTransparentSort=function(e){ge=e},this.getClearColor=function(e){return e.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=v.has(t)}if(e){let e=N.texture.type,t=y.has(e),n=et.getClearColor(),r=et.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(b[0]=i,b[1]=a,b[2]=o,b[3]=r,z.clearBufferuiv(z.COLOR,0,b)):(x[0]=i,x[1]=a,x[2]=o,x[3]=r,z.clearBufferiv(z.COLOR,0,x))}else r|=z.COLOR_BUFFER_BIT}t&&(r|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&z.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),A=e},this.dispose=function(){n.removeEventListener(`webglcontextlost`,lt,!1),n.removeEventListener(`webglcontextrestored`,ut,!1),n.removeEventListener(`webglcontextcreationerror`,dt,!1),et.dispose(),We.dispose(),Je.dispose(),H.dispose(),Ie.dispose(),Be.dispose(),ot.dispose(),st.dispose(),Ve.dispose(),K.dispose(),K.removeEventListener(`sessionstart`,vt),K.removeEventListener(`sessionend`,yt),q.stop()};function lt(e){e.preventDefault(),Qe(`WebGLRenderer: Context Lost.`),ee=!0}function ut(){Qe(`WebGLRenderer: Context Restored.`),ee=!1;let e=V.autoReset,t=$e.enabled,n=$e.autoUpdate,r=$e.needsUpdate,i=$e.type;ct(),V.autoReset=e,$e.enabled=t,$e.autoUpdate=n,$e.needsUpdate=r,$e.type=i}function dt(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ft(e){let t=e.target;t.removeEventListener(`dispose`,ft),pt(t)}function pt(e){mt(e),H.remove(e)}function mt(e){let t=H.get(e).programs;t!==void 0&&(t.forEach(function(e){Ve.releaseProgram(e)}),e.isShaderMaterial&&Ve.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Te);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Ft(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ze.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;ot.setup(i,r,s,n,c);let h,g=nt;if(c!==null&&(h=Le.get(c),g=rt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*De()),g.setMode(z.LINES)):g.setMode(z.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*De()),i.isLineSegments?g.setMode(z.LINES):i.isLineLoop?g.setMode(z.LINE_LOOP):g.setMode(z.LINE_STRIP)}else i.isPoints?g.setMode(z.POINTS):i.isSprite&&g.setMode(z.TRIANGLES);if(i.isBatchedMesh){if(je.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Le.get(c).bytesPerElement:1,o=H.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(z,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ht(e,t,n,r){A!==null&&e.isNodeMaterial&&A.setObject(r,e),be===!0&&Ze.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,jt(e,t,r),e.side=0,e.needsUpdate=!0,jt(e,t,r),e.side=2):jt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),A!==null&&A.renderStart(e,t,n),w=Je.get(n),w.init(t),D.push(w),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(w.pushLight(e),e.castShadow&&w.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(w.pushLight(e),e.castShadow&&w.pushShadow(e))}),w.setupLights(),A!==null&&A.updateLights(w.state.lightsArray),xe=this.localClippingEnabled,be=Ze.init(this.clippingPlanes,xe),be===!0&&Ze.setGlobalState(this.clippingPlanes,t),A!==null&&$e.render(w.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ht(o,n,t,e),r.add(o)}else ht(i,n,t,e),r.add(i)}}),w=D.pop(),A!==null&&A.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=H.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}je.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let gt=null;function _t(e){gt&&gt(e)}function vt(){q.stop()}function yt(){q.start()}let q=new bt;q.setAnimationLoop(_t),typeof self<`u`&&q.setContext(self),this.setAnimationLoop=function(e){gt=e,K.setAnimationLoop(e),e===null?q.stop():q.start()},K.addEventListener(`sessionstart`,vt),K.addEventListener(`sessionend`,yt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ee===!0)return;A!==null&&A.renderStart(e,t);let n=K.enabled===!0&&K.isPresenting===!0,r=O!==null&&(N===null||n)&&O.begin(k,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(K.cameraAutoUpdate===!0&&K.updateCamera(t),t=K.getCamera()),e.isScene===!0&&e.onBeforeRender(k,e,t,N),w=Je.get(e,D.length),w.init(t),w.state.textureUnits=U.getTextureUnits(),D.push(w),Se.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ye.setFromProjectionMatrix(Se,Ne,t.reversedDepth),xe=this.localClippingEnabled,be=Ze.init(this.clippingPlanes,xe),C=We.get(e,E.length),C.init(),E.push(C),K.enabled===!0&&K.isPresenting===!0){let e=k.xr.getDepthSensingMesh();e!==null&&J(e,t,-1/0,k.sortObjects)}J(e,t,0,k.sortObjects),C.finish(),A!==null&&A.updateLights(w.state.lightsArray),k.sortObjects===!0&&C.sort(he,ge),Ee=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Ee&&et.addToRenderList(C,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),be===!0&&Ze.beginShadows();let i=w.state.shadowsArray;if($e.render(i,e,t),be===!0&&Ze.endShadows(),(r&&O.hasRenderPass())===!1){let n=C.opaque,r=C.transmissive;if(w.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Ct(n,r,e,a)}Ee&&et.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];St(C,e,n,n.viewport)}}else r.length>0&&Ct(n,r,e,t),Ee&&et.render(e),St(C,e,t)}N!==null&&M===0&&(U.updateMultisampleRenderTarget(N),U.updateRenderTargetMipmap(N)),r&&O.end(k),e.isScene===!0&&e.onAfterRender(k,e,t),ot.resetDefaultState(),ae=-1,oe=null,D.pop(),D.length>0?(w=D[D.length-1],U.setTextureUnits(w.state.textureUnits),be===!0&&Ze.setGlobalState(k.clippingPlanes,w.state.camera)):w=null,E.pop(),C=E.length>0?E[E.length-1]:null,A!==null&&A.renderEnd()};function J(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)w.pushLightProbeGrid(e);else if(e.isLight)w.pushLight(e),e.castShadow&&w.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ye)){r&&we.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Se);let i=Be.update(e),a=e.material;a.visible&&C.push(e,i,a,n,we.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ye))){let i=Be.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),we.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),we.copy(e.boundingSphere.center)),we.applyMatrix4(e.matrixWorld).applyMatrix4(Se)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&C.push(e,i,c,n,we.z,s,t)}}else a.visible&&C.push(e,i,a,n,we.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)J(i[e],t,n,r)}function St(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;w.setupLightsView(n),be===!0&&Ze.setGlobalState(k.clippingPlanes,n),r&&B.viewport(P.copy(r)),i.length>0&&wt(i,t,n),a.length>0&&wt(a,t,n),o.length>0&&wt(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function Ct(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[r.id]===void 0){let e=je.has(`EXT_color_buffer_half_float`)||je.has(`EXT_color_buffer_float`);w.state.transmissionRenderTarget[r.id]=new Ye(1,1,{generateMipmaps:!0,type:e?g:ce,minFilter:qe,samples:Math.max(4,Me.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Pe.workingColorSpace})}let i=w.state.transmissionRenderTarget[r.id],a=r.viewport||P;i.setSize(a.z*k.transmissionResolutionScale,a.w*k.transmissionResolutionScale);let s=k.getRenderTarget(),c=k.getActiveCubeFace(),l=k.getActiveMipmapLevel();k.setRenderTarget(i),k.getClearColor(ue),de=k.getClearAlpha(),de<1&&k.setClearColor(16777215,.5),k.clear(),Ee&&et.render(n);let u=k.toneMapping;k.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),w.setupLightsView(r),be===!0&&Ze.setGlobalState(k.clippingPlanes,r),wt(e,n,r),U.updateMultisampleRenderTarget(i),U.updateRenderTargetMipmap(i),je.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Tt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(U.updateMultisampleRenderTarget(i),U.updateRenderTargetMipmap(i))}k.setRenderTarget(s,c,l),k.setClearColor(ue,de),d!==void 0&&(r.viewport=d),k.toneMapping=u}function wt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Tt(o,t,n,s,l,c)}}function Tt(e,t,n,r,i,a){A!==null&&i.isNodeMaterial&&A.setObject(e,i),e.onBeforeRender(k,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(k,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,k.renderBufferDirect(n,t,r,i,e,a),i.side=2):k.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(k,t,n,r,i,a)}function jt(e,t,n){t.isScene!==!0&&(t=Te);let r=H.get(e),i=w.state.lights,a=w.state.shadowsArray,o=i.state.version,s=Ve.getParameters(e,i.state,a,t,n,w.state.lightProbeGridArray),c=Ve.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ie.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ft),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Nt(e,s),d}else s.uniforms=Ve.getUniforms(e),A!==null&&e.isNodeMaterial&&A.build(e,n,s),e.onBeforeCompile(s,k),d=Ve.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ze.uniform),Nt(e,s),r.needsLights=Lt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=w.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Mt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=hr.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Nt(e,t){let n=H.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Pt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];S.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(S))return n}return null}function Ft(e,t,n,r,i){t.isScene!==!0&&(t=Te),U.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?k.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Pe.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ie.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=k.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=H.get(r),y=w.state.lights;if(be===!0&&(xe===!0||e!==oe)){let t=e===oe&&r.id===ae;Ze.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ze.numPlanes||v.numIntersection!==Ze.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=w.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=jt(r,t,i),A&&r.isNodeMaterial&&A.onUpdateProgram(r,x,v));let S=!1,C=!1,T=!1,E=x.getUniforms(),D=v.uniforms;if(B.useProgram(x.program)&&(S=!0,C=!0,T=!0),r.id!==ae&&(ae=r.id,C=!0),v.needsLights){let e=Pt(w.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||oe!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(z,`projectionMatrix`,e.projectionMatrix),E.setValue(z,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(z,Ce.setFromMatrixPosition(e.matrixWorld)),Me.logarithmicDepthBuffer&&E.setValue(z,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(z,`isOrthographic`,e.isOrthographicCamera===!0),oe!==e&&(oe=e,C=!0,T=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&E.setValue(z,`sunShadowMap`,y.state.sunShadowMap,U),y.state.directionalShadowMap.length>0&&E.setValue(z,`directionalShadowMap`,y.state.directionalShadowMap,U),y.state.spotShadowMap.length>0&&E.setValue(z,`spotShadowMap`,y.state.spotShadowMap,U),y.state.pointShadowMap.length>0&&E.setValue(z,`pointShadowMap`,y.state.pointShadowMap,U)),i.isSkinnedMesh){E.setOptional(z,i,`bindMatrix`),E.setOptional(z,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(z,`boneTexture`,e.boneTexture,U))}i.isBatchedMesh&&(E.setOptional(z,i,`batchingTexture`),E.setValue(z,`batchingTexture`,i._matricesTexture,U),E.setOptional(z,i,`batchingIdTexture`),E.setValue(z,`batchingIdTexture`,i._indirectTexture,U),E.setOptional(z,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(z,`batchingColorTexture`,i._colorsTexture,U));let O=n.morphAttributes;if((O.position!==void 0||O.normal!==void 0||O.color!==void 0)&&tt.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,E.setValue(z,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=Ii()),C){if(E.setValue(z,`toneMappingExposure`,k.toneMappingExposure),v.needsLights&&It(D,T),a&&r.fog===!0&&Ue.refreshFogUniforms(D,a),Ue.refreshMaterialUniforms(D,r,I,fe,w.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}hr.upload(z,Mt(v),D,U)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(hr.upload(z,Mt(v),D,U),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(z,`center`,i.center),E.setValue(z,`modelViewMatrix`,i.modelViewMatrix),E.setValue(z,`normalMatrix`,i.normalMatrix),E.setValue(z,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];st.update(n,x),st.bind(n,x)}}return x}function It(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Lt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return re},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=H.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),H.get(e.texture).__webglTexture=t,H.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=H.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,re=t,M=n;let r=null,i=!1,a=!1;if(e){let o=H.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(z.FRAMEBUFFER,o.__webglFramebuffer),P.copy(e.viewport),se.copy(e.scissor),le=e.scissorTest,B.viewport(P),B.scissor(se),B.setScissorTest(le),ae=-1;return}if(o.__webglFramebuffer===void 0)U.setupRenderTarget(e);else if(o.__hasExternalTextures)U.rebindTextures(e,H.get(e.texture).__webglTexture,H.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&H.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);U.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=H.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&U.useMultisampledRTT(e)===!1?H.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,P.copy(e.viewport),se.copy(e.scissor),le=e.scissorTest}else P.copy(_e).multiplyScalar(I).floor(),se.copy(ve).multiplyScalar(I).floor(),le=L;if(n!==0&&(r=te),B.bindFramebuffer(z.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(P),B.scissor(se),B.setScissorTest(le),i){let r=H.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=H.get(e.textures[t]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=H.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,t.__webglTexture,n)}ae=-1};function Rt(e){let t=H.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Me.textureFormatReadable(e.format),t.__typeReadable=Me.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=H.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){B.bindFramebuffer(z.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let u=Rt(o);if(u.__formatReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&z.readPixels(t,n,r,i,it.convert(c),it.convert(l),a)}finally{let e=N===null?null:H.get(N).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=H.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(z.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let d=Rt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.bufferData(z.PIXEL_PACK_BUFFER,a.byteLength,z.STREAM_READ),z.readPixels(t,n,r,i,it.convert(l),it.convert(u),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let p=N===null?null:H.get(N).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,p);let m=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await me(z,m,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,a),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(f),z.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;U.setTexture2D(e,0),z.copyTexSubImage2D(z.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=it.convert(t.format),_=it.convert(t.type),v;t.isData3DTexture?(U.setTexture3D(t,0),v=z.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(U.setTexture2DArray(t,0),v=z.TEXTURE_2D_ARRAY):(U.setTexture2D(t,0),v=z.TEXTURE_2D),B.activeTexture(z.TEXTURE0),B.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(z.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(z.UNPACK_ROW_LENGTH),b=B.getParameter(z.UNPACK_IMAGE_HEIGHT),x=B.getParameter(z.UNPACK_SKIP_PIXELS),S=B.getParameter(z.UNPACK_SKIP_ROWS),C=B.getParameter(z.UNPACK_SKIP_IMAGES);B.pixelStorei(z.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(z.UNPACK_SKIP_PIXELS,l),B.pixelStorei(z.UNPACK_SKIP_ROWS,u),B.pixelStorei(z.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=H.get(e),r=H.get(t),h=H.get(n.__renderTarget),g=H.get(r.__renderTarget);B.bindFramebuffer(z.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,H.get(e).__webglTexture,i,d+n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,H.get(t).__webglTexture,a,m+n)),z.blitFramebuffer(l,u,o,s,f,p,o,s,z.DEPTH_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||H.has(e)){let n=H.get(e),r=H.get(t);B.bindFramebuffer(z.READ_FRAMEBUFFER,ne),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,j);for(let e=0;e<c;e++)w?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,n.__webglTexture,i),T?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,r.__webglTexture,a),i===0?T?z.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):z.copyTexSubImage2D(v,a,f,p,l,u,o,s):z.blitFramebuffer(l,u,o,s,f,p,o,s,z.COLOR_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?z.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(z.UNPACK_ROW_LENGTH,y),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(z.UNPACK_SKIP_PIXELS,x),B.pixelStorei(z.UNPACK_SKIP_ROWS,S),B.pixelStorei(z.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&z.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){H.get(e).__webglFramebuffer===void 0&&U.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?U.setTextureCube(e,0):e.isData3DTexture?U.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?U.setTexture2DArray(e,0):U.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){re=0,M=0,N=null,B.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ne}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Pe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Pe._getUnpackColorSpace()}},Ri=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},zi=new c(-1,1,1,-1,0,1),Bi=new class extends he{constructor(){super(),this.setAttribute(`position`,new ke([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new ke([0,2,0,0,2,0],2))}},Vi=class{constructor(e){this._mesh=new L(Bi,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,zi)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Hi=1e-4,Ui=(e,t)=>{let n=t.rotation||0,r=Math.cos(n),i=Math.sin(n);return{x:(e.x-t.x)*r-(e.z-t.z)*i,z:(e.x-t.x)*i+(e.z-t.z)*r}},Wi=(e,t)=>{let n=t.rotation||0,r=Math.cos(n),i=Math.sin(n);return{x:e.x*r+e.z*i,z:-e.x*i+e.z*r}};function Gi(e,t,n){let r=Ui(e,n);if(n.radius!==void 0){let e=Math.hypot(r.x,r.z),i=t+n.radius-e;return i<=0?null:{...Wi(e>Hi?{x:r.x/e,z:r.z/e}:{x:1,z:0},n),depth:i}}let i=n.w/2,a=n.d/2,o=r.x-Math.max(-i,Math.min(i,r.x)),s=r.z-Math.max(-a,Math.min(a,r.z)),c=Math.hypot(o,s);if(c>=t)return null;let l,u;return c>Hi?(l={x:o/c,z:s/c},u=t-c):i-Math.abs(r.x)<a-Math.abs(r.z)?(l={x:r.x>=0?1:-1,z:0},u=t+i-Math.abs(r.x)):(l={x:0,z:r.z>=0?1:-1},u=t+a-Math.abs(r.z)),{...Wi(l,n),depth:u}}function Ki(e,t,n,r){let i=e.x-n.x,a=e.z-n.z,o=t.x*t.x+t.z*t.z;if(o<Hi*Hi)return null;let s=i*t.x+a*t.z,c=s*s-o*(i*i+a*a-r*r);if(c<0)return null;let l=(-s-Math.sqrt(c))/o;if(l<-1e-4||l>1)return null;let u=i+t.x*l,d=a+t.z*l,f=Math.hypot(u,d)||1;return t.x*u+t.z*d>=0?null:{t:Math.max(0,l),x:u/f,z:d/f}}function qi(e,t,n,r){let i=Ui(e,r),a=Ui({x:e.x+t.x,z:e.z+t.z},r),o={x:a.x-i.x,z:a.z-i.z},s=null,c=e=>{e&&(!s||e.t<s.t)&&(s=e)};if(r.radius!==void 0)c(Ki(i,o,{x:0,z:0},n+r.radius));else{let e=r.w/2,t=r.d/2;for(let r of[-1,1]){if(o.x*r<-1e-4){let a=(r*(e+n)-i.x)/o.x;a>=-1e-4&&a<=1&&Math.abs(i.z+o.z*a)<=t&&c({t:Math.max(0,a),x:r,z:0})}if(o.z*r<-1e-4){let a=(r*(t+n)-i.z)/o.z;a>=-1e-4&&a<=1&&Math.abs(i.x+o.x*a)<=e&&c({t:Math.max(0,a),x:0,z:r})}for(let a of[-1,1])c(Ki(i,o,{x:r*e,z:a*t},n))}}if(!s)return null;let l=s;return{t:l.t,...Wi(l,r)}}function Ji(e,t,n,r=0){let i=Ui(e,n),a=Ui(t,n),o=n.radius,s=0,c=1;for(let[l,u,d,f]of[[i.x,a.x-i.x,-(o??n.w/2)-r,(o??n.w/2)+r],[e.y,t.y-e.y,(n.bottom??-10)-r,(n.top??8)+r],[i.z,a.z-i.z,-(o??n.d/2)-r,(o??n.d/2)+r]]){if(Math.abs(u)<Hi){if(l<d||l>f)return null;continue}let e=(d-l)/u,t=(f-l)/u;if(s=Math.max(s,Math.min(e,t)),c=Math.min(c,Math.max(e,t)),s>c)return null}return s}var Yi=class{colliders;active;cells=new Map;dynamic=[];constructor(e,t=()=>!0){this.colliders=e,this.active=t;for(let t of e){let e=Math.abs(Math.cos(t.rotation||0)),n=Math.abs(Math.sin(t.rotation||0)),r=t.radius??(e*t.w+n*t.d)/2,i=t.radius??(n*t.w+e*t.d)/2;for(let e=Math.floor((t.x-r)/12);e<=Math.floor((t.x+r)/12);e++)for(let n=Math.floor((t.z-i)/12);n<=Math.floor((t.z+i)/12);n++){let r=`${e},${n}`;this.cells.has(r)||this.cells.set(r,[]),this.cells.get(r).push(t)}}}query(e,t=e,n=1){let r=new Set(this.dynamic);for(let i=Math.floor((Math.min(e.x,t.x)-n)/12);i<=Math.floor((Math.max(e.x,t.x)+n)/12);i++)for(let a=Math.floor((Math.min(e.z,t.z)-n)/12);a<=Math.floor((Math.max(e.z,t.z)+n)/12);a++)for(let e of this.cells.get(`${i},${a}`)||[])r.add(e);return[...r].filter(this.active)}solid(e,t=e,n=1){return this.query(e,t,n).filter(e=>!e.overhead)}blocked(e,t=.4){return this.solid(e,e,t).some(n=>Gi(e,t,n))}move(e,t,n=.4){let r={...e};for(let e=0;e<8;e++){let e=!1;for(let t of this.solid(r,r,n)){let i=Gi(r,n,t);i&&(r.x+=i.x*(i.depth+Hi),r.z+=i.z*(i.depth+Hi),e=!0)}if(!e)break}let i={...t};for(let e=0;e<5;e++){let e=null;for(let t of this.solid(r,{x:r.x+i.x,z:r.z+i.z},n)){let a=qi(r,i,n,t);a&&(!e||a.t<e.t)&&(e=a)}if(!e){r.x+=i.x,r.z+=i.z;break}r.x+=i.x*e.t+e.x*Hi,r.z+=i.z*e.t+e.z*Hi,i.x*=1-e.t,i.z*=1-e.t;let t=i.x*e.x+i.z*e.z;if(t<0&&(i.x-=e.x*t,i.z-=e.z*t),Math.hypot(i.x,i.z)<Hi)break}return r}cast(e,t,n=0,r){let i=1;for(let a of this.query(e,t,n)){if(a===r)continue;let o=Ji(e,t,a,n);o!==null&&(i=Math.min(i,o))}return i}},Xi=[{duration:.66,start:.18,end:.36,damage:0},{duration:.64,start:.16,end:.35,damage:0},{duration:.82,start:.25,end:.44,damage:1}],Zi={torso:0,lean:0,shoulder:[.1,0,.08],elbow:.2,offhand:.18,wrist:-.55},Qi=[{torso:-.34,lean:-.04,shoulder:[1.05,-.85,.82],elbow:1.72,offhand:.75,wrist:-.85},{torso:.32,lean:-.03,shoulder:[1.1,.95,-.5],elbow:1.3,offhand:.68,wrist:-.75},{torso:-.2,lean:-.08,shoulder:[.55,-.25,.28],elbow:1.75,offhand:.85,wrist:-1.8}],$i=[{torso:.36,lean:.09,shoulder:[1.18,.95,-.55],elbow:.34,offhand:.9,wrist:-1.25},{torso:-.38,lean:.08,shoulder:[.95,-.9,.65],elbow:.3,offhand:.82,wrist:-1.18},{torso:.15,lean:.13,shoulder:[1.48,.1,.06],elbow:.08,offhand:.95,wrist:-1.5}],ea=[{torso:0,lean:.06,shoulder:[1.35,-.05,.06],elbow:.12,offhand:.82,wrist:-1.48},{torso:0,lean:.05,shoulder:[1.28,.05,.08],elbow:.15,offhand:.8,wrist:-1.43},{torso:.05,lean:.1,shoulder:[1.45,0,.02],elbow:.05,offhand:.95,wrist:-1.5}],ta=e=>(e=Math.max(0,Math.min(1,e)),e*e*(3-2*e));function na(e,t,n){n=ta(n);let r=(e,t)=>e+(t-e)*n;return{torso:r(e.torso,t.torso),lean:r(e.lean,t.lean),shoulder:e.shoulder.map((e,n)=>r(e,t.shoulder[n])),elbow:r(e.elbow,t.elbow),offhand:r(e.offhand,t.offhand),wrist:r(e.wrist,t.wrist)}}function ra(e,t){let n=Xi[t];if(e<=0||e>=n.duration)return Zi;if(e<n.start)return na(Zi,Qi[t],e/n.start);if(e<n.end){let r=(e-n.start)/(n.end-n.start);return r<.5?na(Qi[t],ea[t],r*2):na(ea[t],$i[t],(r-.5)*2)}return na($i[t],Zi,(e-n.end)/(n.duration-n.end))}function ia(e,t,n){let r=Xi[n],i=Math.max(e,r.start),a=Math.min(t,r.end);return a>=i&&t>=r.start&&e<=r.end?{start:i,end:a}:null}function aa(e,t,n,r=-.05){let i=Math.hypot(t,n);return i<.001||(-Math.sin(e)*t-Math.cos(e)*n)/i>=r}var oa=(e,t)=>({x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}),sa=(e,t)=>e.x*t.x+e.y*t.y+e.z*t.z,ca=e=>Math.max(0,Math.min(1,e));function la(e,t,n,r){let i=oa(t,e),a=oa(r,n),o=oa(e,n),s=sa(i,i),c=sa(a,a),l=sa(i,a),u=sa(i,o),d=sa(a,o),f=0,p=0;if(s<1e-8&&c<1e-8)return sa(o,o);if(s<1e-8)p=ca(d/c);else if(c<1e-8)f=ca(-u/s);else{let e=s*c-l*l;f=e>1e-8?ca((l*d-u*c)/e):0,p=(l*f+d)/c,p<0?(p=0,f=ca(-u/s)):p>1&&(p=1,f=ca((l-u)/s))}let m=o.x+i.x*f-a.x*p,h=o.y+i.y*f-a.y*p,g=o.z+i.z*f-a.z*p;return m*m+h*h+g*g}var ua={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},da=class extends Ri{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof E?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=oe.clone(e.uniforms),this.material=new E({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Vi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},fa=class extends Ri{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},pa=class extends Ri{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ma=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new F);this._width=n.width,this._height=n.height,t=new Ye(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:g}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new da(ua),this.copyPass.material.blending=0,this.timer=new l}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}fa!==void 0&&(r instanceof fa?n=!0:r instanceof pa&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new F);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},ha=class extends Ri{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new G}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},ga={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new F},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Xe},cameraProjectionMatrixInverse:{value:new Xe},cameraWorldMatrix:{value:new Xe},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new W(-1,-1,-1)},sceneBoxMax:{value:new W(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},_a={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},va={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function ya(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=ba(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new W(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new k(i,t,t);return a.wrapS=tt,a.wrapT=tt,a.needsUpdate=!0,a}function ba(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;){if(i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]!==0){a-=2,i++;continue}r[i*t+a]=e++,a++,i--}return r}var xa={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:Sa(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new F},cameraProjectionMatrixInverse:{value:new Xe},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Sa(e,t,n){let r=Ca(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function Ca(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new W(Math.cos(a),Math.sin(a),o))}return r}var wa=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,ee=v-w+2*d,A=g-1+3*d,te=_-1+3*d,ne=v-1+3*d,j=c&255,re=l&255,ie=u&255,M=this.perm[j+this.perm[re+this.perm[ie]]]%12,N=this.perm[j+y+this.perm[re+b+this.perm[ie+x]]]%12,ae=this.perm[j+S+this.perm[re+C+this.perm[ie+w]]]%12,oe=this.perm[j+1+this.perm[re+1+this.perm[ie+1]]]%12,P=.6-g*g-_*_-v*v;P<0?r=0:(P*=P,r=P*P*this._dot3(this.grad3[M],g,_,v));let se=.6-T*T-E*E-D*D;se<0?i=0:(se*=se,i=se*se*this._dot3(this.grad3[N],T,E,D));let ce=.6-O*O-k*k-ee*ee;ce<0?a=0:(ce*=ce,a=ce*ce*this._dot3(this.grad3[ae],O,k,ee));let le=.6-A*A-te*te-ne*ne;return le<0?o=0:(le*=le,o=le*le*this._dot3(this.grad3[oe],A,te,ne)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,ee=T>E?8:0,A=w>D?4:0,te=T>D?2:0,ne=+(E>D),j=O+k+ee+A+te+ne,re=+(a[j][0]>=3),ie=+(a[j][1]>=3),M=+(a[j][2]>=3),N=+(a[j][3]>=3),ae=+(a[j][0]>=2),oe=+(a[j][1]>=2),P=+(a[j][2]>=2),se=+(a[j][3]>=2),ce=+(a[j][0]>=1),le=+(a[j][1]>=1),ue=+(a[j][2]>=1),de=+(a[j][3]>=1),F=w-re+c,fe=T-ie+c,pe=E-M+c,me=D-N+c,I=w-ae+2*c,he=T-oe+2*c,ge=E-P+2*c,_e=D-se+2*c,ve=w-ce+3*c,L=T-le+3*c,ye=E-ue+3*c,be=D-de+3*c,xe=w-1+4*c,Se=T-1+4*c,Ce=E-1+4*c,we=D-1+4*c,Te=h&255,Ee=g&255,R=_&255,De=v&255,Oe=o[Te+o[Ee+o[R+o[De]]]]%32,z=o[Te+re+o[Ee+ie+o[R+M+o[De+N]]]]%32,ke=o[Te+ae+o[Ee+oe+o[R+P+o[De+se]]]]%32,Ae=o[Te+ce+o[Ee+le+o[R+ue+o[De+de]]]]%32,je=o[Te+1+o[Ee+1+o[R+1+o[De+1]]]]%32,Me=.6-w*w-T*T-E*E-D*D;Me<0?l=0:(Me*=Me,l=Me*Me*this._dot4(i[Oe],w,T,E,D));let B=.6-F*F-fe*fe-pe*pe-me*me;B<0?u=0:(B*=B,u=B*B*this._dot4(i[z],F,fe,pe,me));let Ne=.6-I*I-he*he-ge*ge-_e*_e;Ne<0?d=0:(Ne*=Ne,d=Ne*Ne*this._dot4(i[ke],I,he,ge,_e));let V=.6-ve*ve-L*L-ye*ye-be*be;V<0?f=0:(V*=V,f=V*V*this._dot4(i[Ae],ve,L,ye,be));let Pe=.6-xe*xe-Se*Se-Ce*Ce-we*we;return Pe<0?p=0:(Pe*=Pe,p=Pe*Pe*this._dot4(i[je],xe,Se,Ce,we)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},Ta=class t extends Ri{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=ya(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Ye(this.width,this.height,{type:g,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new E({defines:Object.assign({},ga.defines),uniforms:oe.clone(ga.uniforms),vertexShader:ga.vertexShader,fragmentShader:ga.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Te,this.normalMaterial.blending=0,this.pdMaterial=new E({defines:Object.assign({},xa.defines),uniforms:oe.clone(xa.uniforms),vertexShader:xa.vertexShader,fragmentShader:xa.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new E({defines:Object.assign({},_a.defines),uniforms:oe.clone(_a.uniforms),vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new E({uniforms:oe.clone(ua.uniforms),vertexShader:ua.vertexShader,fragmentShader:ua.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new E({uniforms:oe.clone(va.uniforms),vertexShader:va.vertexShader,fragmentShader:va.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new Vi(null),this._originalClearColor=new G,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,n){t===void 0?(this.depthTexture=new te,this.depthTexture.format=et,this.depthTexture.type=e,this.normalRenderTarget=new Ye(this.width,this.height,{minFilter:I,magFilter:I,type:g,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=t,this.normalTexture=n,this._renderGBuffer=!1);let r=+!!this.normalTexture,i=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=r,this.gtaoMaterial.defines.DEPTH_SWIZZLING=i,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=r,this.pdMaterial.defines.DEPTH_SWIZZLING=i,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Sa(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case t.OUTPUT.Off:break;case t.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case t.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case t.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case t.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:n);break;case t.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case t.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new wa,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new k(r,e,e,f,ce);return i.wrapS=tt,i.wrapT=tt,i.needsUpdate=!0,i}};Ta.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Ea={name:`FXAAShader`,uniforms:{tDiffuse:{value:null},resolution:{value:new F(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},Da={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new G(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Oa=class e extends Ri{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new F(256,256):new F(e.x,e.y),this.clearColor=new G(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Ye(i,a,{type:g,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Ye(i,a,{type:g,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Ye(i,a,{type:g,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Da;this.highPassUniforms=oe.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new E({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new F(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=oe.clone(ua.uniforms),this.blendMaterial=new E({uniforms:this.copyUniforms,vertexShader:ua.vertexShader,fragmentShader:ua.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new G,this._oldClearAlpha=1,this._basic=new Se,this._fsQuad=new Vi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new F(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new E({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new F(.5,.5)},direction:{value:new F(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new E({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Oa.BlurDirectionX=new F(1,0),Oa.BlurDirectionY=new F(0,1);var ka={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Aa=class extends Ri{constructor(){super(),this.isOutputPass=!0,this.uniforms=oe.clone(ka.uniforms),this.material=new it({name:ka.name,uniforms:this.uniforms,vertexShader:ka.vertexShader,fragmentShader:ka.fragmentShader}),this._fsQuad=new Vi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Pe.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ja=class extends Ta{scale=.5;setSize(e,t){super.setSize(Math.max(1,Math.round(e*this.scale)),Math.max(1,Math.round(t*this.scale)))}render(e,t,n,r,i){let a=[];this.scene.traverse(e=>{e.visible&&(e.userData.skipAO||e instanceof M)&&(a.push(e),e.visible=!1)});try{super.render(e,t,n,r,i)}finally{a.forEach(e=>e.visible=!0)}}},Ma={name:`GradeShader`,uniforms:{tDiffuse:{value:null},amount:{value:1},vignette:{value:.2}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform float amount,vignette;varying vec2 vUv;
void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 col=clamp(c.rgb,0.,1.);
float l=dot(col,vec3(.2126,.7152,.0722));
col=mix(col,col*col*(3.-2.*col),.16*amount);
col=mix(vec3(l),col,1.+.07*amount);
col+=amount*(vec3(.016,.009,-.010)*smoothstep(.45,1.,l)+vec3(-.008,.004,.010)*(1.-smoothstep(0.,.42,l)));
vec2 d=(vUv-.5)*2.;
col*=1.-vignette*smoothstep(.7,1.45,length(d));
gl_FragColor=vec4(clamp(col,0.,1.),c.a);}`},Na=class{renderer;scene;camera;composer;contact;bloom;focus;smaa;ultra;grade=new da(Ma);fxaa=new da(Ea);profile;blur=0;width=0;height=0;ratio=0;constructor(e,t,n){this.renderer=e,this.scene=t,this.camera=n,this.composer=new ma(e),this.composer.addPass(new ha(t,n)),this.contact=new ja(t,n),this.contact.updateGtaoMaterial({radius:1.35,thickness:.8,distanceFallOff:1,samples:8}),this.contact.updatePdMaterial({radius:4,samples:8,rings:2}),this.contact.blendIntensity=.72,this.composer.addPass(this.contact),this.bloom=new Oa(new F(256,256),0,.35,1.05);let r=this.bloom.materialHighPassFilter;r.fragmentShader=`uniform sampler2D tDiffuse;uniform float luminosityThreshold;varying vec2 vUv;
void main(){vec4 texel=texture2D(tDiffuse,vUv);float v=luminance(texel.rgb);
gl_FragColor=vec4(min(texel.rgb*(max(v-luminosityThreshold,0.)/max(v,1e-4)),vec3(1.5)),1.);}`,r.needsUpdate=!0,this.composer.addPass(this.bloom),this.composer.addPass(new Aa),this.composer.addPass(this.grade),this.composer.addPass(this.fxaa),e.info.autoReset=!1}loadUltra(){this.ultra??=Promise.all([_t(()=>import(`./SMAAPass-wYK8kwqm.js`),__vite__mapDeps([0,1]),import.meta.url),_t(()=>import(`./BokehPass--SI-jwZ7.js`),__vite__mapDeps([2,1]),import.meta.url)]).then(([{SMAAPass:e},{BokehPass:t}])=>{this.focus=new t(this.scene,this.camera,{focus:20,aperture:0,maxblur:.006}),this.focus.enabled=!1,this.composer.insertPass(this.focus,2),this.smaa=new e,this.composer.addPass(this.smaa),this.profile&&this.configure(this.profile)})}configure(e){this.profile=e,this.contact.scale=e.contactScale,this.contact.updateGtaoMaterial({samples:e.contactSamples}),this.contact.updatePdMaterial({samples:e.contactSamples,radius:e.contactScale<1?4:6}),this.bloom.enabled=e.bloom>0,this.bloom.strength=e.bloom,this.grade.enabled=e.grade,(e.antialias===`smaa`||e.depthOfField)&&this.loadUltra(),this.smaa&&(this.smaa.enabled=e.antialias===`smaa`),this.fxaa.enabled=!this.smaa?.enabled,e.depthOfField||(this.blur=0),this.focus&&(this.focus.enabled=!1),this.width=0}get passes(){return{contact:this.contact.enabled,contactScale:this.contact.scale,bloom:this.bloom.enabled,grade:this.grade.enabled,fxaa:this.fxaa.enabled,smaa:!!this.smaa?.enabled,depthOfField:!!this.focus?.enabled}}render(e,t=0,n=0){if(this.renderer.info.reset(),!e){this.renderer.render(this.scene,this.camera);return}let r=this.renderer.getPixelRatio();(r!==this.ratio||innerWidth!==this.width||innerHeight!==this.height)&&(this.ratio=r,this.width=innerWidth,this.height=innerHeight,this.composer.setPixelRatio(r),this.composer.setSize(this.width,this.height),this.fxaa.uniforms.resolution.value.set(1/(this.width*r),1/(this.height*r)));let i=this.focus&&this.profile?.depthOfField&&t>0?1:0;if(this.blur+=(i-this.blur)*Math.min(1,n*5),i&&this.blur>.99&&(this.blur=1),!i&&this.blur<.01&&(this.blur=0),this.focus&&(this.focus.enabled=this.blur>0),this.focus?.enabled){let e=this.focus.uniforms;t>0&&(e.focus.value=t),e.aperture.value=45e-5*this.blur,e.nearClip.value=this.camera.near,e.farClip.value=this.camera.far}this.composer.render(n)}},Pa=class extends S{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new Le;e.deleteAttribute(`uv`);let n=new $e({side:1}),r=new $e,i=new t(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let a=new L(e,n);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);let o=new u(e,r,6),s=new nt;s.position.set(-10.906,2.009,1.846),s.rotation.set(0,-.195,0),s.scale.set(2.328,7.905,4.651),s.updateMatrix(),o.setMatrixAt(0,s.matrix),s.position.set(-5.607,-.754,-.758),s.rotation.set(0,.994,0),s.scale.set(1.97,1.534,3.955),s.updateMatrix(),o.setMatrixAt(1,s.matrix),s.position.set(6.167,.857,7.803),s.rotation.set(0,.561,0),s.scale.set(3.927,6.285,3.687),s.updateMatrix(),o.setMatrixAt(2,s.matrix),s.position.set(-2.017,.018,6.124),s.rotation.set(0,.333,0),s.scale.set(2.002,4.566,2.064),s.updateMatrix(),o.setMatrixAt(3,s.matrix),s.position.set(2.291,-.756,-2.621),s.rotation.set(0,-.286,0),s.scale.set(1.546,1.552,1.496),s.updateMatrix(),o.setMatrixAt(4,s.matrix),s.position.set(-2.193,-.369,-5.547),s.rotation.set(0,.516,0),s.scale.set(3.875,3.487,2.986),s.updateMatrix(),o.setMatrixAt(5,s.matrix),this.add(o);let c=new L(e,Fa(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new L(e,Fa(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let d=new L(e,Fa(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);let f=new L(e,Fa(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let p=new L(e,Fa(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);let m=new L(e,Fa(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Fa(e){return new De({color:0,emissive:16777215,emissiveIntensity:e})}var Y=(e,t)=>({speaker:e,text:t}),Ia={opening:{chapter:`PROLOGUE · THE LANTERN MORNING`,title:`Before the world grew quiet`,pages:[Y(`ALDER VILLAGE · YOUR ELEVENTH SUMMER`,`Your father always hung the first lantern. This year, his hook beside the door is empty. Tomas left to mend the great bell last autumn. His last letter said he would be home before the apples ripened.`),Y(`MIRA · CALLING FROM THE WELL`,`Alder! You promised you’d help with the lanterns. Rowan says we’re lighting them even if the bell won’t ring. Come on. I saved you the one with the crooked handle.`),Y(`A MORNING THAT STILL BELONGS TO YOU`,`You put your father’s reed flute in your satchel and step outside. Find Mira by the well. Move with {move}; {look} to look around. Walk close and {talk} to talk.`)]},lantern:{chapter:`PROLOGUE · THE LANTERN MORNING`,title:`One small errand`,pages:[Y(`MIRA`,`Don’t laugh. I opened the lantern to feed them and all three lights escaped. One’s by the apple trees, just east of here. Will you get that one? We can find the others later.`),Y(`ALDER`,`If I bring it back, you have to stop saying my dad’s flute sounds like a wet goose.`),Y(`MIRA`,`Make it sound less like a wet goose, then. Go on — the orchard’s just past Soren’s house. Press E near the little golden light.`)]},silence:{chapter:`CHAPTER I · THE NOTE THAT BROKE`,title:`A bell without an echo`,pages:[Y(`MIRA`,`You found it! Here, hold the handle. Tonight we’ll hang it on your father’s hook. He’ll see it from the road.`),Y(`THE BELL SANCTUARY`,`A single note rolls over the roofs. The light in your hands folds into a tiny, frightened spark. No bird answers. Far north, the dark tower gives the same note back.`),Y(`MIRA`,`Alder… your flute. It’s warm. That’s your dad’s tune, isn’t it? Go to Soren. He was with your father the night he left. I’ll stay with the light.`)]},smith:{chapter:`CHAPTER I · THE NOTE THAT BROKE`,title:`Something worth carrying`,pages:[Y(`SOREN`,`I made Tomas a new bell pin before he left. He made me promise to look after you. Neither of us thought it would come to this.`),Y(`SOREN`,`Take this practice blade and the oak shield. {Sword} to strike. {Shield} to block, then answer while a guardian recovers. {Dodge} to roll out of reach. You needn’t win every fight. Coming home counts.`),Y(`SOREN`,`Rowan knows why the bell rang. Ask him properly this time. And don’t let him tell you you’re too young to hear the answer.`)]},commission:{chapter:`CHAPTER I · THE NOTE THAT BROKE`,title:`The keeper’s son`,pages:[Y(`ROWAN`,`I kept your father’s last message from you. I thought waiting would be kinder. I was wrong. He went to stop the king’s stilling bell — a bell that takes tomorrow away, one village at a time.`),Y(`ROWAN`,`Tomas hid three living notes in the old sanctuaries: a seed in Whisperwood, an ember in Cinderpeak, a pearl by Larkwater. Their guardians have gone silent. Your flute can wake what they protected.`),Y(`ALDER`,`Then I’ll find the notes. And I’ll find out what happened to him. You don’t get to decide what I can bear anymore.`),Y(`ROWAN`,`Start with the Rootbound Hollow, west along the pale road. The other two can wait until you’re ready; you may seek them in any order. {Map} opens your map. Your journal will keep what you learn.`)]},root:{chapter:`CHAPTER II · WHAT OUR PARENTS LEAVE`,title:`The tree remembers`,pages:[Y(`A MEMORY HELD IN THE SEED`,`Your father kneels beside a wounded guardian. He sets down his hammer. ‘You were made to shelter things,’ he says. ‘You can remember how.’ Beneath the stone mask, a green shoot opens.`),Y(`TOMAS · AN OLD RECORDING`,`Alder, if you find this: courage isn’t being the only one who can do a thing. It’s asking someone to stand beside you. These notes open the way to Crownfall. Keep them out of the king’s hands.`),Y(`ALDER`,`The seed is warm. For the first time since autumn, you can remember your father’s voice without trying. You write his words down before they fade.`)]},ember:{chapter:`CHAPTER II · WHAT OUR PARENTS LEAVE`,title:`The king had a name`,pages:[Y(`A MEMORY HELD IN THE EMBER`,`The furnace shows a king without his crown, hammering a bell until his hands bleed. Beside him lies a small shoe, still wet with river mud. A name is scratched into its sole: Ilen.`),Y(`THE ROYAL FOUNDER`,`King Oras asked us for one more day with his daughter. We could not return the dead. So he ordered a bell that would never allow another day to end. We built it. That was our shame.`),Y(`ALDER`,`The silence isn’t an army coming to conquer the kingdom. It is one person’s grief, made large enough to swallow everyone else. You close your hand around the ember. It still burns.`)]},tide:{chapter:`CHAPTER II · WHAT OUR PARENTS LEAVE`,title:`The last letter`,pages:[Y(`TOMAS · THE PEARL’S MEMORY`,`I’ve broken the king’s first bell. The floodgate is closing, and someone has to hold the wheel while the coast gets out. I won’t be coming through it.`),Y(`TOMAS`,`I wanted to teach you everything. How to plane a door. How to mend that crooked lantern. I’m sorry about the things we won’t do. None of this is a debt you owe me, Alder. Live a life of your own.`),Y(`ALDER`,`You sit beside the water until your hands stop shaking. There is no rescue waiting at the end of this road. But there are people at home who still need tomorrow. You put the pearl beside the flute.`)]},farewell:{chapter:`CHAPTER III · THE YEARS BETWEEN`,title:`What will you carry?`,choice:!0,pages:[Y(`ROWAN · AT THE BELL`,`The three notes have opened the crossing. Crownfall is seven years ahead of us, sealed inside the king’s stolen time. The bell can take you there. Your body will grow through those years; you will not get to live them.`),Y(`MIRA`,`Seven birthdays? All at once? …Then I’ll be older than you when you get back. Don’t argue. I’ll have actually done them.`),Y(`ALDER`,`I thought I was doing this to bring Dad home. Now I think I’m doing it so nobody else has to wait beside an empty hook.`),Y(`MIRA`,`I’m frightened too. I’ll keep the village going. You keep one thing for me — something the bell can’t take. What do you promise?`)]},crossing:{chapter:`CHAPTER IV · SEVEN WINTERS`,title:`The world did not wait`,pages:[Y(`THE FIRST WINTER`,`Mira hangs your lantern beside the well. Soren sets a second place at supper. Rowan writes your name in the village book and leaves the date of your return blank.`),Y(`THE FOURTH WINTER`,`The north road freezes. Families from the coast sleep in Soren’s workshop. Mira stops waiting by the sanctuary every morning. There is bread to make, and someone has to make it.`),Y(`THE SEVENTH SPRING`,`The bell releases a breath. Your sleeves stop halfway along your arms. In the polished stone, a stranger has your eyes. Below the hill, a lantern is still burning. Go home. Find Mira by the well.`)]},reunion:{chapter:`CHAPTER IV · SEVEN WINTERS`,title:`You’re late`,pages:[Y(`MIRA`,`…Alder? Hold still. Let me look at you. I had a speech ready. Seven years to write it, and all I can think is that your hair’s still a disaster.`),Y(`ALDER`,`For me, we were just at the bell. I’m sorry. I don’t know how to be the person you’ve been waiting for.`),Y(`MIRA`,`Then be the one who’s here. I kept your promise where I could see it. I got angry with you sometimes. I grew up. Both things can be true.`),Y(`MIRA`,`We learned why the king couldn’t finish the silence. Your father scattered its answers: Clarity in Frostveil, Light in the Saffron Wastes, Mercy in Mourning Fen. I marked the old places on your map. This time, you’re carrying our work too.`)]},frost:{chapter:`CHAPTER V · THE THINGS WE KEEP`,title:`A name beneath the frost`,pages:[Y(`THE MONASTERY’S WITNESS`,`Oras struck his own name from every stone. ‘A king cannot grieve,’ he told us. ‘Let there be only the Crown.’ Yet every winter he returned to ask whether we remembered Ilen.`),Y(`ALDER`,`Clarity is not forgetting what hurts. You speak both their names into the cold: Oras. Ilen. The mirror clears. There is a person beneath the Crown, and he can still be reached.`)]},sun:{chapter:`CHAPTER V · THE THINGS WE KEEP`,title:`A sky that keeps moving`,pages:[Y(`THE ASTRONOMER’S RECORD`,`The king commanded us to erase the hour of the flood. But the stars would not lie. Turn back one hour and every life begun after it is unwritten. Every friendship. Every child.`),Y(`ALDER`,`You think of Mira making bread, of strangers sleeping safely in the forge. Bringing back yesterday would take those days from them. The light settles in your palm. You will open tomorrow, not undo it.`)]},moon:{chapter:`CHAPTER V · THE THINGS WE KEEP`,title:`The song Ilen knew`,pages:[Y(`ILEN · A MEMORY IN THE MOONWELL`,`A child sits beside the king at a reed-lined pool. He cannot play the flute, so she shows him: low, middle, high, middle, low. She laughs when he gets it wrong. He tries again.`),Y(`ALDER`,`Your father taught you the same five notes. It was never a spell for stopping time. It was a song people gave their children. You write it in your journal: 1 · 2 · 3 · 2 · 1. At Crownfall, you will give it back.`)]},crownArrival:{chapter:`CHAPTER VI · LET THE MORNING COME`,title:`The man inside the silence`,pages:[Y(`THE KING WITHOUT A NAME`,`I know what you have lost. I could give you the morning before he left. His hand on your shoulder. The door still open. Would you truly throw that away?`),Y(`ALDER`,`I would want it. Every day, I would want it. But my father stayed at that gate so other people could live. I won’t take their lives away to get mine back.`),Y(`THE SILENT CROWN`,`The armor closes around the king. His bell drowns out your words. Open the seals, break the armor’s hold, and carry Ilen’s song to the chamber beyond: low, middle, high, middle, low.`)]},crown:{chapter:`EPILOGUE · AN ORDINARY MORNING`,title:`A place at the table`,pages:[Y(`ORAS`,`The broken armor falls quiet. You play the five notes again. ‘She always laughed at the last one,’ Oras says. This time, he lets the note end. The stilling bell cracks. Outside, the sun moves.`),Y(`ALDER VILLAGE`,`You come home by the long road. Soren pretends he has something in his eye. Rowan closes the village book. Mira gives you a crooked lantern and makes you hang it yourself.`),Y(`MIRA`,`There. Not straight, but it’ll hold. Come inside, Alder. The bread’s getting cold.`)]}};function La(){return{prologue:0,promise:null,reunited:!1,seen:[],pending:null}}function Ra(e,t){e.story.seen.includes(t)||e.story.seen.push(t);let n={opening:1,lantern:2,silence:3,smith:4,commission:5};e.story.prologue=Math.max(e.story.prologue,n[t]||0),t===`commission`&&(e.talked=!0),t===`reunion`&&(e.story.reunited=!0),e.story.pending=null}function za(e){if(e.won)return null;if(e.age===`adult`&&!e.story.reunited)return{title:`You’re late`,detail:`Return to Alder Village. Find Mira beside the well.`};if(e.age!==`child`)return null;let t=[[`The lantern morning`,`Your story begins outside your home.`],[`A familiar face`,`Find Mira by the well · {moveShort} to move, {use} to talk.`],[`One small errand`,e.fireflies.includes(`orchard`)?`Bring the wandering light back to Mira by the well.`:`Find the golden light in the orchard, east of the village. {Use} to catch it.`],[`Someone who knows`,`Speak with Soren at the forge, east of the well.`],[`No more secrets`,`Ask Elder Rowan, beside the well, about your father.`]][e.story.prologue];return t?{title:t[0],detail:t[1]}:null}function Ba(e){return e.age===`child`&&e.story.prologue<5?za(e).detail:e.age===`adult`&&!e.story.reunited?`Go home first. Mira is waiting beside the village well.`:null}var Va={root:{title:`Roots that hum`,by:`A KEEPER’S MARK · THE ROOTBOUND HOLLOW`,text:`A bell no bigger than your thumb is scratched into the stone, the way your father marked every door he ever mended. Beneath it: ‘Third night out. The roots in here hum when it rains. Alder would have climbed every one of them by now. — T.’`},ember:{title:`Soren’s pin`,by:`A KEEPER’S MARK · THE EMBER VAULT`,text:`‘Soren’s new pin holds. The heat in these walls smells like his forge, where Alder used to fall asleep on the bench waiting for me to finish. I would give a great deal for one more of those evenings. — T.’`},tide:{title:`Counting waves`,by:`A KEEPER’S MARK · THE TIDAL ARCHIVE`,text:`‘The tide comes up to the third step and no further. I sat and counted waves for an hour, just to hear something keep its rhythm. Alder plays the flute like this sea: loud, then sudden, then very gentle. — T.’`},frost:{title:`A list instead of a letter`,by:`A KEEPER’S MARK · THE GLASS MONASTERY`,text:`Frost fills an older inscription, but one line is fresh, cut by a steady hand: ‘Too cold for ink, so I carve. I keep meaning to write Alder a proper letter and keep writing lists instead. Mend the lantern handle. Plane the sticking door. Tell him. — T.’`},sun:{title:`One clock, wound`,by:`A KEEPER’S MARK · THE SUNKEN OBSERVATORY`,text:`‘Every clock in this place stopped at a different hour. I wound one, just to watch it go. Whatever comes of this, let the world keep its ordinary mornings: bread, chores, a boy late for supper. — T.’`},moon:{title:`Names over the dead`,by:`A KEEPER’S MARK · THE MOONWELL CRYPT`,text:`‘Every tomb here has a name cut over it. Someone cared enough to remember each one. If I am remembered, let it be as a man who mended doors and burned the porridge, not as the keeper of anything. — T.’`},crown:{title:`Five small dots`,by:`MARKS IN THE PLASTER · THE SILENT CROWN`,text:`No keeper’s bell is carved here. Low on the wall, a child has pressed five dots into the soft plaster, low to high and back again, and beside them drawn a crooked man trying to play a flute. They were never meant for you. You leave them as you found them.`}};function Ha(e){return e.story.seen.filter(e=>Ia[e]).map(t=>({title:Ia[t].title,pages:Ia[t].pages.map((n,r)=>({...n,text:Ua(Ia[t],r,e.story.promise)}))}))}function Ua(e,t,n){return e===Ia.reunion&&t===2?n===`remember`?`You promised to remember us. I wrote down everything you missed. Bad harvests. Good weddings. The day I finally fixed that lantern. You can read it when you’re ready. First, sit with me a moment.`:`You promised you’d come home. I stopped pretending that meant everything would stay the same. I got angry with you sometimes. I grew up. Both things can be true. But there’s still a place for you here.`:e.pages[t].text}function Wa(e){if(e.won)return null;if(e.age===`adult`)return e.story.reunited?null:{x:-5,z:57,name:`Mira`};switch(e.story.prologue){case 1:return{x:-5,z:57,name:`Mira`};case 2:return e.fireflies.includes(`orchard`)?{x:-5,z:57,name:`Mira`}:{x:20,z:66,name:`Orchard light`};case 3:return{x:10,z:54,name:`Soren`};case 4:return{x:3.1,z:49,name:`Rowan`};default:return null}}function Ga(e,t){return e.won?{elder:`For seven years I left a space beside your name. This morning I wrote: came home. I think that is enough for the history books.`,mira:e.story.promise===`remember`?`I meant what I said. The book is yours to read. But tomorrow, we start a page neither of us has seen.`:`You kept your promise. Tomorrow we can argue about whose turn it is to mend the fence. I’ve missed having ordinary things to argue about.`,smith:`Your father never could hang a lantern straight. You’ve inherited his talent. Come by tomorrow. I’ll show you how to fix the bracket.`}[t]:e.age===`adult`?{elder:`Mira kept the village fed. Soren sheltered the coast folk. I kept the records. You missed seven years, Alder. You didn’t miss being loved. Seek the three echoes when you’re ready.`,mira:e.completed.includes(`moon`)?`Low, middle, high, middle, low. You used to play it until everyone begged you to stop. Perhaps that’s why the king should be afraid of you. Come back, Alder.`:`There’s bread here whenever you need it. I’m still finding your wandering lights too. Some things are allowed to take their time.`,smith:`I kept his tools. It seemed wrong to let them rust. When this is over, you can decide what you want to make with them.`}[t]:e.completed.includes(`tide`)?{elder:`I am sorry, Alder. I should have trusted you with what I feared. Your father chose those people at the floodgate. What you do next is your choice, not his command.`,mira:`You don’t have to tell me yet. We can just sit here. I remember the way your dad whistled through his teeth. You were terrible at it. We can remember the good bits too.`,smith:`Tomas held the gate? Of course he did. He always said a thing wasn’t mended until everyone could use it. I wish, just once, he’d been a little less stubborn.`}[t]:e.completed.includes(`ember`)&&t===`elder`?`Oras. I had almost forgotten his name. Losing Ilen broke him; it did not give him the right to break everyone else. Remember that when you meet him.`:e.completed.includes(`root`)&&t===`mira`?`You heard him? His real voice? Tell me exactly what he said. I’ll write it down too. Then there’ll be two of us keeping it safe.`:null}var Ka=[{id:`root`,name:`The Rootbound Hollow`,region:`Whisperwood`,x:-68,z:8,color:`#93c67d`,age:`child`,puzzle:`sequence`,relic:`Seed of Courage`,boss:`The Briar Warden`,hint:`Roots remember the sun: east, center, west. Touch the stones in that order.`,sequence:[2,1,0]},{id:`ember`,name:`The Ember Vault`,region:`Cinderpeak`,x:68,z:-42,color:`#f3a16d`,age:`child`,puzzle:`block`,relic:`Ember of Resolve`,boss:`The Cinder Colossus`,hint:`A stone carries the mountain’s weight. Push it onto the gold seal.`,sequence:[]},{id:`tide`,name:`The Tidal Archive`,region:`Larkwater Coast`,x:77,z:60,color:`#79cdd9`,age:`child`,puzzle:`song`,relic:`Pearl of Memory`,boss:`The Drowned Scribe`,hint:`The tide remembers three notes: low, high, middle. Play the reed flute near the altar.`,sequence:[1,3,2]},{id:`frost`,name:`The Glass Monastery`,region:`Frostveil Heights`,x:-70,z:-67,color:`#b3ddea`,age:`adult`,puzzle:`mirrors`,relic:`Echo of Clarity`,boss:`The Frostbound Sentinel`,hint:`Turn each mirror until all three face the northern star. Their beams must point away from the entrance.`,sequence:[]},{id:`sun`,name:`The Sunken Observatory`,region:`Saffron Wastes`,x:65,z:-105,color:`#e8c179`,age:`adult`,puzzle:`torches`,relic:`Echo of Light`,boss:`The Astral Scarab`,hint:`Leave only the two outer flames burning. Light and shadow must balance.`,sequence:[]},{id:`moon`,name:`The Moonwell Crypt`,region:`Mourning Fen`,x:-83,z:69,color:`#b49acb`,age:`adult`,puzzle:`bells`,relic:`Echo of Mercy`,boss:`The Hollow Cantor`,hint:`The inscription reads: middle, west, east, middle. Let each bell answer in turn.`,sequence:[1,0,2,1]},{id:`crown`,name:`The Silent Crown`,region:`Crownfall`,x:0,z:-119,color:`#efbf7b`,age:`adult`,puzzle:`final`,relic:`The Waking Dawn`,boss:`The King Without a Name`,hint:`Play the song that held the years together: low, middle, high, middle, low.`,sequence:[1,2,3,2,1]}];function qa(e,t){if(!e||typeof e!=`object`)return null;let n=e,r=Ka.find(e=>e.id===n.id);if(!r||no(t,r)||!Array.isArray(n.fallen)||n.fallen.some(e=>!Number.isInteger(e)||e<0||e>15))return null;let i=n.warden===!0,a=i||n.seal===!0;return{id:r.id,puzzle:a||n.puzzle===!0,fallen:[...new Set(n.fallen)].sort((e,t)=>e-t),seal:a,wall:n.wall===!0,warden:i}}var Ja=`bell-of-ages-save-v1`,Ya=[1,2,3];function Xa(e){return e===1?Ja:`${Ja}:${e}`}var Za=`bell-of-ages-last-journey`;function Qa(e){let t=Number(e);return Ya.includes(t)?t:1}function $a(e,t){return t.includes(e)?e:t[0]??null}function eo(e,t){let n=Ya.find(t=>!e.includes(t));return n?{place:n,replaces:!1}:{place:t,replaces:!0}}function to(){return{story:La(),version:1,age:`child`,completed:[],crystals:0,maxHealth:6,health:6,sword:1,talked:!1,fireflies:[],reward:!1,chests:[],visited:[],carvings:[],noticed:[],marker:null,visit:null,position:{x:-10,z:71},elapsed:0,won:!1}}function no(e,t){return e.completed.includes(t.id)?`This sanctuary has already been restored.`:t.age===e.age?Ba(e)||(t.id===`crown`&&![`frost`,`sun`,`moon`].every(t=>e.completed.includes(t))?`The Crown is sealed. Gather the three echoes of the elder age.`:null):t.age===`adult`?`This passage will open in another age.`:`Its echo has already passed.`}function ro(e){return e.age===`child`&&[`root`,`ember`,`tide`].every(t=>e.completed.includes(t))}function io(e,t){let n=Ka.find(e=>e.id===t);return!n||no(e,n)?!1:(e.completed.push(t),e.crystals+=25,e.maxHealth+=1,e.health=e.maxHealth,t===`crown`&&(e.won=!0),!0)}function ao(e){return ro(e)?(e.age=`adult`,e.sword=Math.max(e.sword,2),e.maxHealth+=2,e.health=e.maxHealth,!0):!1}function oo(e){try{if(!e)return null;let t=JSON.parse(e);if(t.version!==1||![`child`,`adult`].includes(t.age))return null;let n=to(),r;if(t.story===void 0)r={...La(),prologue:5,reunited:t.age===`adult`,seen:[`opening`,`commission`,...Array.isArray(t.completed)?t.completed.filter(e=>Object.hasOwn(Ia,e)):[]]};else{let e=t.story;if(!e||!Number.isInteger(e.prologue)||e.prologue<0||e.prologue>5||![null,`home`,`remember`].includes(e.promise)||typeof e.reunited!=`boolean`||!Array.isArray(e.seen)||e.seen.some(e=>typeof e!=`string`||!Object.hasOwn(Ia,e))||e.pending!==null&&(!e.pending||typeof e.pending.id!=`string`||!Object.hasOwn(Ia,e.pending.id)||!Number.isInteger(e.pending.page)||e.pending.page<0||e.pending.page>=Ia[e.pending.id].pages.length))return null;r={prologue:e.prologue,promise:e.promise,reunited:e.reunited,seen:[...new Set(e.seen)],pending:e.pending?{id:e.pending.id,page:e.pending.page}:null}}for(let e of[`completed`,`fireflies`,`chests`])if(!Array.isArray(t[e])||t[e].some(e=>typeof e!=`string`))return null;for(let e of[`crystals`,`maxHealth`,`health`,`sword`,`elapsed`])if(!Number.isFinite(t[e])||t[e]<0)return null;if(!t.position||!Number.isFinite(t.position.x)||!Number.isFinite(t.position.z))return null;let i=e=>(Array.isArray(e)?e:[]).filter(e=>typeof e==`string`&&Ka.some(t=>t.id===e)),a=i(Array.isArray(t.visited)?t.visited:t.completed),o=Math.min(30,Math.max(6,t.maxHealth)),s={...n,...t,story:r,visited:[...new Set(a)],carvings:[...new Set(i(t.carvings))],noticed:[...new Set((Array.isArray(t.noticed)?t.noticed:[...t.chests,...t.fireflies]).filter(e=>Do.some(t=>t.id===e)))],marker:so(t.marker),maxHealth:o,health:Math.min(t.health,o),sword:Math.min(3,Math.max(1,t.sword)),position:{x:Math.max(-140,Math.min(140,t.position.x)),z:Math.max(-140,Math.min(140,t.position.z))},visit:null};return s.visit=qa(t.visit,s),s}catch{return null}}function so(e){if(!e||typeof e!=`object`)return null;let{x:t,z:n}=e;if(typeof t!=`number`||typeof n!=`number`||!Number.isFinite(t)||!Number.isFinite(n))return null;let r=e=>Math.max(-140,Math.min(140,e));return{x:r(t),z:r(n)}}var co=`the-bell-of-ages`;function lo(e,t=new Date){return JSON.stringify({game:co,format:1,exported:t.toISOString(),save:e},null,1)}function uo(e=new Date){return`bell-of-ages-journey-${[e.getFullYear(),e.getMonth()+1,e.getDate()].map(e=>String(e).padStart(2,`0`)).join(`-`)}.json`}function fo(e){let t;try{t=JSON.parse(e)}catch{return{error:`This file isn’t a journey file. Nothing was changed.`}}if(!t||typeof t!=`object`||Array.isArray(t))return{error:`This file isn’t a journey file. Nothing was changed.`};let n=t;if(`game`in n&&n.game!==`the-bell-of-ages`)return{error:`This file belongs to another game. Nothing was changed.`};let r=oo(JSON.stringify(`game`in n?n.save:n));return r?{save:r}:{error:`This journey file is damaged or from a newer version. Nothing was changed.`}}function po(e){return[e.age===`child`?`the first age, childhood`:`the second age, adulthood`,`${e.completed.length} / 7 relics`,`${e.crystals} crystals`,`${e.fireflies.length} / 3 wandering lights`].join(` · `)}function mo(e){let t=Math.floor(e/60);return t<1?`Under a minute played`:t<60?`${t} min played`:`${Math.floor(t/60)} h ${String(t%60).padStart(2,`0`)} min played`}function ho(e,t){return Array.from({length:Math.ceil(t/2)},(t,n)=>e>=n*2+2?`full`:e===n*2+1?`half`:`empty`)}function go(e){return e>0&&e<=2}var _o=e=>`${Math.floor(e/2)||(e%2?``:`0`)}${e%2?`½`:``}`;function vo(e,t){return`Health: ${_o(e)} of ${_o(t)} hearts`}function yo(e){let t=e.visit&&Ka.find(t=>t.id===e.visit.id);return[e.age===`child`?`First age`:`Second age`,`${e.completed.length} / 7 relics`,t?t.name:wo(e.position.x,e.position.z),mo(e.elapsed)].join(` · `)}function bo(e,t){return t?{x:0,z:-17,chamber:`warden`}:e?{x:0,z:8,chamber:`guardians`}:{x:0,z:29,chamber:`puzzle`}}function xo(e,t,n){return[{name:`Alder Village`,x:0,z:57},{name:`the Bell Sanctuary`,x:0,z:13},...Ka.filter(t=>e.visited.includes(t.id)).map(e=>({name:e.name.replace(/^The /,`the `),x:e.x,z:e.z+7}))].reduce((e,r)=>Math.hypot(r.x-t,r.z-n)<Math.hypot(e.x-t,e.z-n)?r:e)}function So(e,t,n){return n===e[t]?t+1:+(n===e[0])}function Co(e){return za(e)||(e.won?{title:`A world awake`,detail:`The bell rings again. Wander the restored kingdom.`}:e.talked?ro(e)?{title:`The years between`,detail:`Bring the three relics to the Bell Sanctuary.`}:e.age===`child`?{title:`Three promises`,detail:`Restore the childhood sanctuaries · ${e.completed.length} / 3`}:[`frost`,`sun`,`moon`].every(t=>e.completed.includes(t))?{title:`The last silence`,detail:`Enter the Silent Crown in the far north.`}:{title:`Echoes of another age`,detail:`Recover the three elder echoes · ${e.completed.filter(e=>[`frost`,`sun`,`moon`].includes(e)).length} / 3`}:{title:`A small beginning`,detail:`Speak with Elder Rowan beside the village well.`})}function wo(e,t){return t<-94&&Math.abs(e)<33?`Crownfall`:e<-40&&t<-35?`Frostveil Heights`:e>35&&t<-78?`Saffron Wastes`:e>38&&t<-15?`Cinderpeak`:e>42&&t>25?`Larkwater Coast`:e<-40&&t>40?`Mourning Fen`:e<-35?`Whisperwood`:Math.hypot(e,t)<22?`Bell Sanctuary`:Math.hypot(e,t-50)<30?`Alder Village`:`The Long Meadow`}var To=[{id:`orchard`,x:20,z:66},{id:`woods`,x:-43,z:22},{id:`shore`,x:55,z:44}],Eo=[{id:`field-0`,x:-30,z:49},{id:`field-1`,x:31,z:13},{id:`field-2`,x:-34,z:-42},{id:`field-3`,x:45,z:-70},{id:`field-4`,x:92,z:31.2},{id:`field-5`,x:-103,z:-23}],Do=[...Eo.map(e=>({...e,kind:`chest`})),...To.map(e=>({...e,kind:`light`}))];function Oo(e,t,n,r=16){return Do.filter(i=>!e.noticed.includes(i.id)&&Math.hypot(i.x-t,i.z-n)<=r).map(e=>e.id)}function ko(e){return Do.filter(t=>e.noticed.includes(t.id)||e.chests.includes(t.id)||e.fireflies.includes(t.id)).map(t=>({kind:t.kind,id:t.id,x:t.x,z:t.z,found:(t.kind===`chest`?e.chests:e.fireflies).includes(t.id)}))}var Ao={village:{x:0,z:49,name:`Alder Village`},bell:{x:0,z:5,name:`Bell Sanctuary`},...Object.fromEntries(Ka.map(e=>[e.id,{x:e.x,z:e.z,name:e.name}]))};function jo(e,t,n){let r=Wa(e);if(r)return r;if(e.won||e.story.prologue<5)return null;if(ro(e))return Ao.bell;let i=null;for(let r of Ka){if(no(e,r))continue;let a={x:r.x,z:r.z,name:r.name};(!i||Ro(a,t,n)<Ro(i,t,n))&&(i=a)}return i}function Mo(e,t,n){let r=e.marker?{...e.marker,name:`Your marker`,marker:!0}:jo(e,t,n),i=r&&Io(t,n,r.x,r.z);return i?{...r,...i}:r}var No=5.8,Po=3.2,Fo=-2.6;function Io(e,t,n,r){let i=Ka.find(e=>Math.hypot(n-e.x,r-e.z)<1);if(!i)return null;let a=Math.abs(e-i.x),o=t-i.z,s=e<i.x?-1:1,c={x:i.x,z:i.z+3},l={x:i.x+s*No,z:i.z+Po},u={x:i.x+s*No,z:i.z+Fo},d=o>1.6?[c]:a>=5.1?[l,c]:o<=-2.1?[u,l,c]:[{x:e,z:i.z+Fo-.6},u,l,c],f=0,p={x:e,z:t};for(let e of d)f+=Math.hypot(e.x-p.x,e.z-p.z),p=e;return{x:d[0].x,z:d[0].z,paces:f}}function Lo(e){let t=Math.round(e);return`${t} ${t===1?`pace`:`paces`}`}var Ro=(e,t,n)=>Math.hypot(e.x-t,e.z-n);function zo(e,t,n,r,i){let a=r-t,o=i-n,s=-a*Math.sin(e)-o*Math.cos(e),c=a*Math.cos(e)-o*Math.sin(e);return Math.atan2(c,s)}function Bo(e,t,n,r){let i=e*n,a=t*n,o=Math.hypot(i,a),s=Math.atan2(i,-a);return o<=r?{x:i,y:a,onRim:!1,angle:s}:{x:i/o*r,y:a/o*r,onRim:!0,angle:s}}function Vo(e,t){return{x:Math.max(-140,Math.min(140,e*2*145-145)),z:Math.max(-140,Math.min(140,t*2*145-145))}}var Ho={root:[`volley`],ember:[`shockwave`],tide:[`charge`],frost:[`volley`,`charge`],sun:[`shockwave`,`volley`],moon:[`charge`,`shockwave`],crown:[`charge`,`shockwave`,`volley`]},Uo={slam:{windup:1.05,min:0,max:3.6,recover:1.4},charge:{windup:1.2,min:4.5,max:13,length:12,halfWidth:1.25,dash:.4,recover:1.5},shockwave:{windup:1.25,min:0,max:7.5,reach:9,band:.75,travel:.8,recover:1.3},volley:{windup:1.15,min:3,max:18,radius:1.45,spread:2.7,recover:1.2}};function Wo(e,t){return(e?2.6:4.2)+t*1.6}function Go(e){return e===`slam`||e===`charge`}function Ko(e,t,n,r){if(n<=0){let n=e.filter(e=>e!==`slam`&&t>=Uo[e].min&&t<=Uo[e].max);if(n.length)return n[Math.min(n.length-1,Math.floor(r*n.length))]}return t<=Uo.slam.max?`slam`:null}function qo(e,t,n,r,i,a){let o=n-e,s=r-t,c=o*o+s*s,l=c===0?0:Math.max(0,Math.min(1,((i-e)*o+(a-t)*s)/c));return Math.hypot(i-(e+o*l),a-(t+s*l))}function Jo(e,t,n,r=Uo.shockwave.band){return e>=t-r&&e<=n+r}function Yo(e,t,n,r,i=Uo.volley.spread){let a=n-e,o=r-t,s=Math.hypot(a,o)||1,c=-o/s*i,l=a/s*i;return[{x:n,z:r},{x:n+c,z:r+l},{x:n-c,z:r-l}]}function Xo(e,t,n,r,i=Uo.charge.length){let a=n-e,o=r-t,s=Math.hypot(a,o)||1;return{x:e+a/s*i,z:t+o/s*i}}var Zo={guardian:{hp:[3,5],speed:2.6,reach:1.9,windup:.8,recover:.85},skirmisher:{hp:[2,3],speed:4.3,reach:3.4,windup:.8,recover:1.1,lunge:3.6,dash:.24,halfWidth:.7},warder:{hp:[2,4],speed:2.3,near:5.5,far:9.5,reach:13,windup:1.1,recover:1.3,radius:1.3,cooldown:2.4}};function Qo(e,t){return Zo[e].hp[+!!t]}function $o(e){return e<Zo.warder.near?-1:+(e>Zo.warder.far)}var es={root:[`guardian`,`guardian`,`guardian`,`skirmisher`],ember:[`guardian`,`skirmisher`,`warder`,`guardian`],tide:[`warder`,`guardian`,`skirmisher`,`warder`],frost:[`skirmisher`,`warder`,`skirmisher`,`guardian`],sun:[`warder`,`skirmisher`,`guardian`,`warder`],moon:[`guardian`,`warder`,`skirmisher`,`skirmisher`],crown:[`skirmisher`,`warder`,`guardian`,`warder`]},ts=[`guardian`,`skirmisher`,`guardian`,`warder`,`guardian`,`skirmisher`,`warder`,`guardian`,`skirmisher`,`guardian`,`warder`,`guardian`];function ns(e){return Math.min(.8,Math.max(0,e)*1.8)}var rs={guardian:1,warden:1.6},is=.45;function as(e,t){let n=Math.max(0,e/t),r=Math.min(1,n/is);return{tilt:-1.35*r*r,sink:Math.min(1,Math.max(0,(n-is)/.55)),landed:n>=is,gone:n>=1}}var X={z:-4,door:2.6,face:17.25,wall:18,inner:18.75,outer:24.75,half:3.25,tablet:24.1,read:23.2,examine:16.5},os=(e,t,n,r,i,a,o=0)=>[{shape:e,x:t,z:n,w:r,d:i,h:a,rotation:o},{shape:e,x:-t,z:n,w:r,d:i,h:a,rotation:-o}],ss={root:{theme:`Root pillars twist up from the floor; the arena is ringed by old stumps.`,hall:[{shape:`root`,x:-11,z:-1,w:1.8,d:1.8,h:7},{shape:`root`,x:11,z:-12,w:2,d:2,h:7},{shape:`root`,x:-11.5,z:-17,w:1.6,d:1.6,h:7},{shape:`root`,x:11,z:1,w:1.5,d:1.5,h:7}],arena:[...os(`root`,10,-29,1.6,1.6,2.2),...os(`root`,12,-38,1.8,1.8,2.6),...os(`root`,10,-47,1.6,1.6,2.2)],decals:[],guardians:[[-7,-5],[7,-7],[-4,-13],[5,-15]],alcove:-1},ember:{theme:`Low basalt walls give cover in the hall; four basalt columns hold up the arena.`,hall:[{shape:`wall`,x:-9.5,z:-3,w:5,d:.9,h:1.4},{shape:`wall`,x:9.5,z:-10,w:5,d:.9,h:1.4},{shape:`wall`,x:-9.5,z:-16,w:5,d:.9,h:1.4}],arena:[...os(`basalt`,9,-30,2.2,2.2,7),...os(`basalt`,9,-46,2.2,2.2,7)],decals:[{shape:`vent`,x:-9,z:-38,r:1.6},{shape:`vent`,x:9,z:-38,r:1.6},{shape:`vent`,x:0,z:-50,r:1.2}],guardians:[[-6,-6],[6,-4],[8,-15],[-3,-12]],alcove:1},tide:{theme:`Fallen archive shelves lie across the hall between tide pools.`,hall:[{shape:`shelf`,x:-10,z:-6,w:6,d:1.2,h:2.2,rotation:.35},{shape:`shelf`,x:10,z:-14,w:6,d:1.2,h:2.2,rotation:-.4}],arena:[...os(`shelf`,11,-33,4.5,1.1,2,.3),...os(`shelf`,10.5,-47,4.5,1.1,2,-.25)],decals:[{shape:`pool`,x:8.5,z:-2,r:2.4},{shape:`pool`,x:-9,z:-17,r:2.2},{shape:`pool`,x:0,z:-40,r:3.2}],guardians:[[-8,-11],[5,-6],[-5,-2],[7,-18]],alcove:1},frost:{theme:`Clusters of glass crystals stand in the hall; ice-glass pillars flank the arena.`,hall:[{shape:`crystal`,x:-9,z:-1,w:2,d:2,h:3},{shape:`crystal`,x:9.5,z:-6,w:2.4,d:2.4,h:3.6},{shape:`crystal`,x:-8.5,z:-12,w:2.2,d:2.2,h:3.2},{shape:`crystal`,x:9,z:-17.5,w:2,d:2,h:3}],arena:[...os(`crystal`,8.5,-29,2.2,2.2,4.5),...os(`crystal`,12,-42,2.6,2.6,5)],decals:[{shape:`inlay`,x:0,z:-40,r:6}],guardians:[[-5,-6],[6,-12],[5,-1],[-6,-17]],alcove:-1},sun:{theme:`Obelisks stand in sundial arcs; the arena is an open dial ringed by gnomons.`,hall:[...os(`obelisk`,8,-3,1.2,1.2,3.4),...os(`obelisk`,11,-10,1.2,1.2,3.8),...os(`obelisk`,8,-17,1.2,1.2,3.4)],arena:[...os(`obelisk`,12,-28,1,1,2.4),...os(`obelisk`,14,-38,1,1,2.8),...os(`obelisk`,12,-48,1,1,2.4)],decals:[{shape:`inlay`,x:0,z:-38,r:9}],guardians:[[0,-9],[-5,-14],[5,-14],[-11,-3]],alcove:1},moon:{theme:`Rows of sarcophagi fill the crypt hall; candle columns light the arena.`,hall:[...os(`tomb`,7.5,-3,1.5,3.2,1.1),...os(`tomb`,11.5,-3,1.5,3.2,1.1),...os(`tomb`,7.5,-12,1.5,3.2,1.1),...os(`tomb`,11.5,-12,1.5,3.2,1.1)],arena:[...os(`column`,9,-28,1.3,1.3,6),...os(`column`,12,-38,1.3,1.3,6),...os(`column`,9,-48,1.3,1.3,6)],decals:[{shape:`pool`,x:0,z:-38,r:2.6}],guardians:[[-9.5,-7.5],[3,-17],[9.5,-7.5],[-4,-1]],alcove:-1},crown:{theme:`A colonnade runs the length of the throne hall and on into the arena.`,hall:[-1,-6,-11,-16].flatMap(e=>os(`column`,7,e,1.3,1.3,7)),arena:[-27,-33,-39,-45,-51].flatMap(e=>os(`column`,9.5,e,1.4,1.4,7)),decals:[{shape:`inlay`,x:0,z:-39,r:5}],guardians:[[-10.5,-8],[10.5,-13],[0,-4],[0,-15]],alcove:-1}},Z={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,Back:8,Start:9,Up:12,Down:13,Left:14,Right:15};function cs(e,t,n=.18,r=.92){let i=Math.hypot(e,t);if(!Number.isFinite(i)||i<=n)return{x:0,y:0};let a=Math.min(1,(i-n)/(r-n));return{x:e/i*a,y:t/i*a}}var ls=[`interact`,`attack`,`shield`,`dodge`,`target`,`flute`,`map`,`journal`],us={interact:Z.A,attack:Z.X,shield:Z.RB,dodge:Z.B,target:Z.LB,flute:Z.Y,map:Z.Back,journal:Z.Up},ds={interact:`Interact`,attack:`Sword`,shield:`Shield`,dodge:`Dodge roll`,target:`Lock on`,flute:`Reed flute`,map:`Kingdom map`,journal:`Journal`},fs=[`auto`,`xbox`,`playstation`,`nintendo`],ps={auto:`Automatic`,xbox:`Xbox`,playstation:`PlayStation`,nintendo:`Nintendo`},ms=[`D-pad up`,`D-pad down`,`D-pad left`,`D-pad right`],hs={xbox:[`A`,`B`,`X`,`Y`,`LB`,`RB`,`LT`,`RT`,`Back`,`Start`,`LS`,`RS`,...ms],playstation:[`✕`,`◯`,`□`,`△`,`L1`,`R1`,`L2`,`R2`,`Create`,`Options`,`L3`,`R3`,...ms],nintendo:[`B`,`A`,`Y`,`X`,`L`,`R`,`ZL`,`ZR`,`−`,`+`,`LS`,`RS`,...ms]};function gs(e){let t=String(e??``);return/054c|playstation|dualshock|dualsense|sony/i.test(t)?`playstation`:/057e|nintendo|pro controller|joy-?con|switch/i.test(t)?`nintendo`:`xbox`}function _s(e,t){return e===`auto`?gs(t):e}function vs(e){return fs.includes(e)?e:`auto`}function ys(e,t=`xbox`){return hs[t][e]??`Button ${e}`}function bs(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0&&e<=15&&e!==Z.Start}function xs(e){if(!e||typeof e!=`object`||Array.isArray(e))return{...us};let t=e,n={...us};for(let e of ls)bs(t[e])&&(n[e]=t[e]);return new Set(Object.values(n)).size===ls.length?n:{...us}}function Ss(e,t,n){if(!bs(n))return null;let r={...e},i=ls.find(r=>r!==t&&e[r]===n)??null;return i&&(r[i]=e[t]),r[t]=n,{pad:r,swapped:i}}function Cs(e){return e.shield===Z.RB&&!ls.some(t=>e[t]===Z.RT)}function ws(e,t,n,r=us){let i=n=>!!t[n]&&!e[n],a=[];if(n===`play`){for(let e of[`interact`,`attack`,`dodge`,`flute`,`target`])i(r[e])&&a.push(e);i(Z.Start)&&a.push(`pause`),i(r.map)&&a.push(`map`),i(r.journal)&&a.push(`journal`),(i(r.shield)||Cs(r)&&i(Z.RT))&&a.push(`shield`)}else n===`flute`?(i(Z.A)&&a.push(`note-1`),i(Z.X)&&a.push(`note-2`),i(Z.Y)&&a.push(`note-3`),(i(Z.B)||i(Z.Start))&&a.push(`close`)):(i(Z.A)&&a.push(`confirm`),i(Z.B)&&a.push(`back`),i(Z.Start)&&a.push(`start`),i(r.map)&&a.push(`map`),i(Z.Up)&&a.push(`focus-prev`),i(Z.Down)&&a.push(`focus-next`),i(Z.Left)&&a.push(`adjust-prev`),i(Z.Right)&&a.push(`adjust-next`));return a}function Ts(e,t=!1){return e===`Tab`?t?`focus-prev`:`focus-next`:e===`ArrowUp`?`focus-prev`:e===`ArrowDown`?`focus-next`:e===`ArrowLeft`?`adjust-prev`:e===`ArrowRight`?`adjust-next`:e===`Enter`||e===`NumpadEnter`||e===`Space`?`confirm`:null}function Es(e,t=us){return!!e[t.shield]||Cs(t)&&!!e[Z.RT]}function Ds(e,t){for(let n=0;n<=15;n++)if(t[n]&&!e[n])return n;return-1}var Os=[`forward`,`back`,`left`,`right`,`interact`,`attack`,`shield`,`dodge`,`target`,`flute`,`journal`,`map`,`checkpoint`],ks={forward:`KeyW`,back:`KeyS`,left:`KeyA`,right:`KeyD`,interact:`KeyE`,attack:`KeyJ`,shield:`ShiftLeft`,dodge:`Space`,target:`KeyQ`,flute:`KeyF`,journal:`Tab`,map:`KeyM`,checkpoint:`KeyR`},As={forward:`Move forward`,back:`Move back`,left:`Move left`,right:`Move right`,interact:`Interact`,attack:`Sword`,shield:`Shield`,dodge:`Dodge roll`,target:`Lock on`,flute:`Reed flute`,journal:`Journal`,map:`Kingdom map`,checkpoint:`Return to checkpoint`},js=new Set([`Escape`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Digit1`,`Digit2`,`Digit3`]);function Ms(e){return e.replace(/^(Shift|Control|Alt|Meta)Right$/,`$1Left`)}function Ns(e){return js.has(Ms(e))}var Ps=e=>typeof e==`string`&&/^[A-Z][A-Za-z0-9]{1,24}$/.test(e)&&!Ns(e)&&Ms(e)===e;function Fs(e){if(!e||typeof e!=`object`||Array.isArray(e))return{...ks};let t=e,n={...ks};for(let e of Os)Ps(t[e])&&(n[e]=t[e]);return new Set(Object.values(n)).size===Os.length?n:{...ks}}function Is(e,t,n){if(n=Ms(n),!Ps(n))return null;let r={...e},i=Os.find(r=>r!==t&&e[r]===n)??null;return i&&(r[i]=e[t]),r[t]=n,{keys:r,swapped:i}}var Ls={Space:`Space`,ShiftLeft:`Shift`,ControlLeft:`Ctrl`,AltLeft:`Alt`,MetaLeft:`Meta`,CapsLock:`Caps Lock`,Backquote:"`",Minus:`-`,Equal:`=`,BracketLeft:`[`,BracketRight:`]`,Backslash:`\\`,Semicolon:`;`,Quote:`'`,Comma:`,`,Period:`.`,Slash:`/`,IntlBackslash:`\\`};function Rs(e,t){let n=t?.get(e);return n?.trim()?n.toUpperCase():/^Key[A-Z]$/.test(e)?e.slice(3):/^Digit\d$/.test(e)?e.slice(5):/^Numpad\d$/.test(e)?`Num ${e.slice(6)}`:Ls[e]??e.replace(/(Left|Right)$/,``)}function zs(e=ks,t){let n={};for(let r of Os)n[r]=Rs(e[r],t);return n}function Bs(e){let t=[e.forward,e.left,e.back,e.right];return t.every(e=>e.length===1)?t.join(``):t.join(` / `)}var Vs=zs();function Hs(e=us,t=`xbox`){let n=e=>ys(e,t),r={confirm:n(Z.A),back:n(Z.B),pause:n(Z.Start),low:n(Z.A),middle:n(Z.X),high:n(Z.Y)};for(let t of ls)r[t]=n(e[t]);return r}var Us=Hs(),Ws={keys:Vs,pad:Us,toggleShield:!1};function Gs({keys:e,pad:t,toggleShield:n}){let r=n?`press`:`hold`;return{move:{keyboard:Bs(e),gamepad:`the left stick`,touch:`the thumbstick`},moveShort:{keyboard:Bs(e),gamepad:`Left stick`,touch:`Thumbstick`},look:{keyboard:`drag the mouse`,gamepad:`use the right stick`,touch:`drag the scene`},talk:{keyboard:`press ${e.interact}`,gamepad:`press ${t.interact}`,touch:`tap Use`},use:{keyboard:e.interact,gamepad:t.interact,touch:`Use`},sword:{keyboard:`press ${e.attack}`,gamepad:`press ${t.attack}`,touch:`tap Sword`},shield:{keyboard:`${r} ${e.shield}`,gamepad:`${r} ${t.shield}`,touch:n?`tap Shield`:`hold Shield`},dodge:{keyboard:`press ${e.dodge}`,gamepad:`press ${t.dodge}`,touch:`tap Dodge`},flute:{keyboard:`press ${e.flute}`,gamepad:`press ${t.flute}`,touch:`tap Flute`},fluteKey:{keyboard:e.flute,gamepad:t.flute,touch:`Flute`},map:{keyboard:e.map,gamepad:t.map,touch:`the Kingdom button`},lock:{keyboard:e.target,gamepad:t.target,touch:`Lock`}}}var Ks=e=>e?`keys`in e||`pad`in e||`toggleShield`in e?{...Ws,...e}:{...Ws,keys:e}:Ws;function qs(e,t,n){let r=Gs(Ks(n));return e.replace(/\{(\w+)\}/g,(e,n)=>{let i=r[n[0].toLowerCase()+n.slice(1)];if(!i)return e;let a=i[t];return n[0]===n[0].toUpperCase()?a[0].toUpperCase()+a.slice(1):a})}function Js(e,t){return Gs(Ks(t)).use[e]}function Ys(e,t=Us){return e===`keyboard`?[`1`,`2`,`3`]:e===`gamepad`?[t.low,t.middle,t.high]:null}var Xs={hurt:{duration:260,strongMagnitude:.9,weakMagnitude:.6},impact:{duration:200,strongMagnitude:.6,weakMagnitude:.3},guard:{duration:120,strongMagnitude:.25,weakMagnitude:.55},strike:{duration:70,strongMagnitude:0,weakMagnitude:.35}};function Zs(e,t,n,r=null){if(!n||t!==`gamepad`)return null;let i=Xs[e];return r&&r.strongMagnitude>i.strongMagnitude?null:i}var Qs=[`auto`,`on`,`off`],$s={auto:`Automatic`,on:`Always`,off:`Never`};function ec(e){return Qs.includes(e)?e:`auto`}function tc(e,t){return e===`on`||e===`auto`&&t!==`keyboard`}var nc=[`low`,`medium`,`high`,`ultra`],rc={low:`Low`,medium:`Medium`,high:`High`,ultra:`Ultra`},ic={low:`For weak graphics: lower resolution, simple shadows, no post-processing, and less distant grass`,medium:`Contact shadows and smoothed edges. Lowers the 3D resolution, never the text, when frames run slow`,high:`Sharper, steady resolution, a soft glow on bright light, and a gentle colour grade`,ultra:`Supersampled resolution, finer and softer shadows, richer light and edges, more grass and sparks, and depth of field in scenes`},ac=`bell-visual-quality`,oc={performance:`low`,adaptive:`medium`,high:`high`};function sc(e,t,n=`medium`){return nc.includes(e)?e:typeof t==`string`&&oc[t]||n}function cc(e,t){return e&&t>0&&t<600?`low`:`medium`}function lc(e){return nc[Math.max(0,nc.indexOf(e)-1)]}var uc=`bell-of-ages-settings-v1`,dc=.25,fc={min:4.5,max:12,normal:7.6,step:.76};function pc(e=!1){return{version:1,master:100,effects:100,ambience:100,music:100,muted:!1,sensitivity:1,invertY:!1,mouseLook:!1,cameraDistance:fc.normal,cameraFollow:`auto`,reducedMotion:e,largeText:!1,threatArrows:!0,toggleShield:!1,vibration:!0,touchLeft:!1,touchSize:0,keys:{...ks},pad:{...us},padStyle:`auto`,fidelity:`medium`}}var mc=(e,t,n)=>Math.min(n,Math.max(t,e)),hc=(e,t)=>Math.round(e/t)*t;function gc(e,t){return typeof e==`number`&&Number.isFinite(e)?mc(hc(e,10),0,100):t}function _c(e,t=1){return typeof e==`number`&&Number.isFinite(e)?mc(hc(e,dc),.5,2):t}function vc(e,t=fc.normal){return typeof e==`number`&&Number.isFinite(e)?mc(Math.round(e*100)/100,fc.min,fc.max):t}var yc=[`Standard`,`Large`,`Largest`];function bc(e,t=0){return typeof e==`number`&&Number.isInteger(e)?mc(e,0,yc.length-1):t}function xc(e,t=!1,n=null,r=`medium`){let i=pc(t),a;try{a=e?JSON.parse(e):{},(!a||typeof a!=`object`||Array.isArray(a))&&(a={})}catch{a={}}let o=e=>typeof a[e]==`boolean`?a[e]:i[e];return{version:1,master:gc(a.master,i.master),effects:gc(a.effects,i.effects),ambience:gc(a.ambience,i.ambience),music:gc(a.music,i.music),muted:o(`muted`),sensitivity:_c(a.sensitivity,i.sensitivity),invertY:o(`invertY`),mouseLook:o(`mouseLook`),cameraDistance:vc(a.cameraDistance,i.cameraDistance),cameraFollow:ec(a.cameraFollow),reducedMotion:o(`reducedMotion`),largeText:o(`largeText`),threatArrows:o(`threatArrows`),toggleShield:o(`toggleShield`),vibration:o(`vibration`),touchLeft:o(`touchLeft`),touchSize:bc(a.touchSize),keys:Fs(a.keys),pad:xs(a.pad),padStyle:vs(a.padStyle),fidelity:sc(a.fidelity,n,r)}}function Sc(e,t){if(e.muted)return 0;let n=t===`effects`?e.effects:t===`ambience`?e.ambience:e.music;return e.master/100*(n/100)}var Cc={value:0},wc={value:new W},Tc={value:58},Ec=`
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise21(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .57*noise21(p)+.28*noise21(p*2.03)+.15*noise21(p*4.09);}
`,Dc,Oc=new Map;function kc(e=`#dfdcca`){if(Oc.has(e))return Oc.get(e);Dc||(Dc=new ae().load(`./textures/ancient-limestone.png`),Dc.wrapS=Dc.wrapT=tt,Dc.colorSpace=Ae,Dc.anisotropy=4);let t=new $e({color:e,roughness:.93});return t.userData.shared=!0,t.onBeforeCompile=e=>{e.uniforms.masonry={value:Dc},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 masonryPosition; varying vec3 masonryNormal;`),e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`#include <project_vertex>
 masonryPosition=(modelMatrix*vec4(transformed,1.)).xyz;
 masonryNormal=normalize(mat3(modelMatrix)*objectNormal);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform sampler2D masonry; varying vec3 masonryPosition; varying vec3 masonryNormal;`),e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`#include <map_fragment>
 vec3 an=abs(masonryNormal);vec2 suv=an.y>.65?masonryPosition.xz:an.x>an.z?masonryPosition.zy:masonryPosition.xy;
 vec3 brick=texture2D(masonry,suv*.18).rgb;
 diffuseColor.rgb*=mix(vec3(.88),brick*1.3,.78);`)},t.customProgramCacheKey=()=>`masonry-v1`,Oc.set(e,t),t}function Ac(e){let t=new $e({map:e,roughness:.96});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 terrainPosition;`),e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`#include <project_vertex>
terrainPosition=(modelMatrix*vec4(transformed,1.)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\nvarying vec3 terrainPosition;${Ec}`),e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`#include <map_fragment>
 float grit=noise21(terrainPosition.xz*8.);
 float mottling=fbm(terrainPosition.xz*1.5);
 diffuseColor.rgb*=.86+.2*mottling+.1*grit;`)},t}function jc(e){let t=e||new ae().load(`./textures/alder-foliage.png`);t.colorSpace=Ae,t.anisotropy=4;let n=new De({color:`#ffffff`,map:t,alphaTest:e?0:.42,side:2});return n.userData.ownedTexture=!e,n.userData.foliage=!0,n.onBeforeCompile=e=>{e.uniforms.natureTime=Cc,e.uniforms.natureEye=wc,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float natureTime; uniform vec3 natureEye; varying float leafHeight;`),e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
 leafHeight=position.y;vec3 root=instanceMatrix[3].xyz;
 transformed.x+=sin(natureTime*1.15+root.x*.21+root.z*.13)*.085*(position.y+1.2);
 transformed.z+=cos(natureTime*.87+root.z*.2)*.05;
transformed*=smoothstep(2.8,5.5,distance(root,natureEye));`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float leafHeight;`),e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
 diffuseColor.rgb*=mix(vec3(.8,.87,.79),vec3(1.18,1.15,.94),smoothstep(-1.,.85,leafHeight));`),e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_begin>`,`#include <normal_fragment_begin>
normal=normalize(mix(normal,mat3(viewMatrix)*vec3(0.,1.,0.),.65));`)},n}function Mc(){let e=new De({color:`#ffffff`,side:2});return e.onBeforeCompile=e=>{e.uniforms.natureTime=Cc,e.uniforms.natureEye=wc,e.uniforms.grassReach=Tc,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float natureTime; uniform vec3 natureEye;uniform float grassReach; varying float grassHeight;`),e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
 vec3 root=instanceMatrix[3].xyz;grassHeight=position.y;
 float fade=1.-smoothstep(grassReach-18.,grassReach,distance(root.xz,natureEye.xz));
 transformed*=fade;
 float gust=sin(natureTime*1.65+root.x*.24+root.z*.14)*.15+sin(natureTime*.8+root.z*.47)*.1;
 transformed.x+=gust*pow(position.y,2.)*fade;transformed.z+=gust*.5*position.y*fade;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float grassHeight;`),e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
 diffuseColor.rgb*=mix(vec3(.74,.84,.66),vec3(1.16,1.18,.82),clamp(grassHeight,0.,1.));`),e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_begin>`,`#include <normal_fragment_begin>
normal=normalize(mat3(viewMatrix)*vec3(0.,1.,0.));`)},e}function Nc(){return new E({transparent:!0,depthWrite:!1,side:2,uniforms:{time:Cc,deep:{value:new G(`#236f7b`)},shallow:{value:new G(`#7dd8c2`)}},vertexShader:`varying vec3 wp;uniform float time;void main(){vec3 p=position;vec4 world=modelMatrix*vec4(p,1.);world.y+=sin(world.x*.45+time)*.025+sin(world.z*.6+time*.8)*.025;wp=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,fragmentShader:`uniform float time;uniform vec3 deep,shallow;varying vec3 wp;${Ec}
 void main(){vec2 p=wp.xz;float a=fbm(p*.19+vec2(time*.022,-time*.017));float lines=sin(p.x*1.7+p.y*.5+sin(p.y*.9-time)*1.2+time*.7);float glimmer=pow(max(0.,lines),22.)*.075;vec3 color=mix(deep,shallow,a)+glimmer;float sparkle=pow(noise21(p*5.+time*.25),22.)*.3;color+=sparkle;gl_FragColor=vec4(color,.89);#include <tonemapping_fragment>
 #include <colorspace_fragment>}`.replace(`;#include`,`;
#include`)})}function Pc(e,t,n,r,i,a,o){let s=new Map;for(let e of n){let t=`${Math.floor(e.x/48)},${Math.floor(e.z/48)}`;s.has(t)||s.set(t,[]),s.get(t).push(e)}let c=o,l=new nt;for(let[n,o]of s){let s=new u(e,t,o.length);s.name=r?`Meadow tufts`:`Woodland canopy`,s.userData.noBatch=!0,s.userData.skipAO=r||t.userData.foliage,o.forEach((e,t)=>{l.position.set(e.x,e.y,e.z),l.rotation.set(0,e.rotation,0),l.scale.set(e.sx,e.sy,e.sz),l.updateMatrix(),s.setMatrixAt(t,l.matrix),s.setColorAt(t,e.color)}),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0),s.computeBoundingSphere(),s.boundingSphere&&(s.boundingSphere.radius+=2),s.castShadow=!r,s.receiveShadow=!0,!r&&t.alphaTest>0&&(s.customDepthMaterial=new ze({depthPacking:N,map:t.map,alphaTest:.42,side:2})),i.add(s);let[d,f]=n.split(`,`).map(Number);a.push({mesh:s,x:d*48+24,z:f*48+24,grass:r,fullCount:o.length,near:c?e:void 0,far:c})}}function Fc(){let e=[],t=[],n=[];for(let r=0;r<3;r++){let i=r*2.399,a=Math.cos(i),o=Math.sin(i),s=.024+r*.004,c=.38+r*.085,l=Math.sin(r*12.3)*.11,u=Math.cos(r*5.3)*.11,d=[[l-a*s,0,u-o*s],[l+a*s,0,u+o*s],[l-a*s*.58+o*.045,c*.58,u-o*s*.58-a*.045],[l+a*s*.58+o*.045,c*.58,u+o*s*.58-a*.045],[l+o*.12,c,u-a*.12]];for(let r of[0,1,2,1,3,2,2,3,4])e.push(...d[r]),t.push(-o*.25,.94,a*.25),n.push(r===4?.5:r%2,d[r][1]/c)}let r=new he;return r.setAttribute(`position`,new ke(e,3)),r.setAttribute(`normal`,new ke(t,3)),r.setAttribute(`uv`,new ke(n,2)),r}function Ic(e,t){let n=Zc(7342),r=[],i=[],a=[],o=[],s=[],c=t.age===`adult`,l=(t,r,o,s=!1)=>{let l=$(t,r);i.push({x:t,y:l,z:r,sx:o,sy:o,sz:o,rotation:n()*6,color:new G(`#ffffff`)}),e.colliders.push({x:t,z:r,w:.82*o,d:.82*o,radius:.41*o,top:l+4.8*o,label:`Tree trunk`});let u=new G(c?`#acc8c0`:s?`#b6cbb5`:[`#bac8ac`,`#cbc7a4`,`#adc4a6`][Math.floor(n()*3)]);for(let e=0;e<(s?12:22);e++){let i=e*2.399+n()*.6,c=s?e*.38:Math.sin(e*1.7)*1.4,d=s?Math.max(.3,2-e*.12):1+n()*1.55,f=s?Math.max(.45,1.5-e*.09):.8+n()*.5,p=u.clone().multiplyScalar(.9+n()*.24);a.push({x:t+Math.cos(i)*d*o*(s?.23:1),y:l+(5.3+c)*o,z:r+Math.sin(i)*d*o*(s?.23:1),sx:f*o,sy:f*o*(s?.55:.78),sz:f*o,rotation:n()*6,color:p})}};for(let e=0;e<510;e++){let e=(n()-.5)*294,t=(n()-.5)*294,r=wo(e,t);$c(e,t)<6||Math.hypot(e,t)<18||Math.hypot(e,t-50)<23||Ka.some(n=>Math.hypot(e-n.x,t-n.z)<13)||r===`Saffron Wastes`||r===`Cinderpeak`||e>100||Math.hypot(e-119,t-55)<39||l(e,t,.8+n()*.95,r===`Frostveil Heights`||n()<.12)}for(let[e,t,n]of[[24,58,1.45],[-25,53,1.25],[21,30,1.5],[-20,21,1.5],[17,-6,1.4],[-18,-13,1.4],[-29,74,1.25],[-78,-1,2.1],[-58,-1,2.1]])l(e,t,n);let u=gt(`Alder_Trunk`);Pc(u.geometry,u.material,i,!1,e.group,r);let d=gt(`Alder_Leaves`),f=gt(`Alder_Leaves_Far`);Pc(d.geometry,jc(d.material.map),a,!1,e.group,r,f.geometry);let p=e.colliders.filter(e=>e.gate===void 0);for(let e=0;e<76e3;e++){let t=(n()-.5)*276,r=(n()-.5)*276,i=$c(t,r);if(i<2.45||Math.hypot(t,r)<10.3||Math.hypot(t,r-47)<3||t>100||Math.hypot(t-119,r-55)<38||wo(t,r)===`Saffron Wastes`||wo(t,r)===`Cinderpeak`||Ka.some(e=>Math.hypot(t-e.x,r-e.z)<6.8)||p.some(e=>Math.abs(t-e.x)<e.w*.5+.4&&Math.abs(r-e.z)<e.d*.5+.4))continue;let a=.6+n()*.6,l=new G(c?`#536855`:`#53663f`);l.lerp(new G(`#747958`),n()*.5),wo(t,r)===`Whisperwood`&&l.multiplyScalar(.86);let u={x:t,y:$(t,r)-.02,z:r,sx:a,sy:a*(i<4?.4:.7),sz:a,rotation:n()*6.28,color:l};o.push(u),e%110==0&&s.push({...u,y:u.y+.4,sx:.11,sy:.11,sz:.11,color:new G(e%220==0?`#f8dfa0`:`#b2b5e3`)})}Pc(Fc(),Mc(),o,!0,e.group,r),Pc(new ut(1,0),new $e({color:`#ffffff`,roughness:1,emissive:`#4d3515`,emissiveIntensity:.15}),s,!0,e.group,r),e.nature=r}function Lc(e,t,n){if(!e.nature)return;let r=[44,64,78,96][n];for(let i of e.nature){let e=Math.hypot(i.x-t.x,i.z-t.z);i.mesh.visible=e<(i.grass?r+35:190),i.near&&i.far&&(i.mesh.geometry=e>[52,75,105,135][n]?i.far:i.near),i.grass&&(i.mesh.count=Math.floor(i.fullCount*(n===0?.42:n===1?.76:1)))}}function Rc(e,t,n,r,i,a,o,s){let c=Q(Jc(e,t,n),r,i,a,o,s);return c.material=kc(r),c}function zc(e,t,n,r,i){let a=mt(t<0?`Cottage_Slate`:`Cottage_Terracotta`);a.position.set(t,$(t,n),n),a.rotation.y=r,e.group.add(a);let o=Math.cos(r),s=Math.sin(r),c=(i,a,c,l)=>e.colliders.push({x:t+i*o+a*s,z:n-i*s+a*o,w:c,d:l,rotation:r,top:$(t,n)+(c<1?3.2:7.3),label:`Cottage`});c(0,0,6.3,5.4),t>=0&&c(-3.7,-.1,1.7,3.8);for(let e of[-1,1])c(e*1.1,3.25,.22,.22)}function Bc(e,n,r=0){let i=e.group,a=n.id===`sun`?`#bdab83`:n.id===`ember`?`#797e76`:`#a0b7ad`,o=Q(Jc(36,.5,88),`#697e7c`,0,11.8,-10,i);o.material=kc(`#697e7c`);for(let e of[-18,18])Rc(1.5,4,88,a,e,10,-10,i);for(let e of[-54,34])Rc(36,4,1.5,a,0,10,e,i);for(let e of[26,14,2,-10,-24,-38,-51]){let t=Array.from({length:25},(t,n)=>{let r=n/24*Math.PI;return new W(Math.cos(r)*17,5.3+Math.sin(r)*6,e)}),n=Q(new Be(new Je(t),24,.28,6,!1),a,0,0,0,i);n.material=kc(a)}for(let e of[24,12,0,-12,-26,-39,-50])for(let t of[-16.7,16.7]){Rc(1.9,.35,2.3,a,t,.18,e,i),Rc(1.45,.35,1.9,a,t,6.9,e,i);let n=Q(new h(3.5,.22,6,24,Math.PI),a,t,4.1,e,i);n.rotation.y=Math.PI/2,n.material=kc(a)}for(let e of[-17,17])for(let t of[.4,7.6])if(t<1&&e===r*17){let n=X.z-X.door/2,r=X.z+X.door/2;Rc(.4,.35,n+53.5,a,e,t,(n-53.5)/2,i),Rc(.4,.35,33.5-r,a,e,t,(r+33.5)/2,i)}else Rc(.4,.35,87,a,e,t,-10,i);for(let e of[17,-8,-39]){let t=Q(new s(4.5,4.65,48),n.color,0,.055,e,i);t.rotation.x=-Math.PI/2;for(let t=0;t<8;t++){let n=t/8*Math.PI*2,r=Q(Jc(.16,.025,.7),`#d0bb88`,Math.sin(n)*4.1,.055,e+Math.cos(n)*4.1,i);r.rotation.y=n}}if(n.id===`root`||n.id===`moon`)for(let e=0;e<15;e++){let t=(e%2?1:-1)*(14+e%3*.4),n=25-e*5,r=Q(Xc(.1,.23,5,6),`#6b7359`,t,2.5,n,i);r.rotation.z=Math.sin(e)*.35;for(let e=0;e<3;e++)Q(Yc(.7),`#4d8569`,t+Math.sin(e),4+e*.6,n,i).scale.set(1,.5,1)}else if(n.id===`frost`)for(let e=0;e<12;e++){let t=e%2?15:-15,n=Q(new Ee(.65,3.5,5),`#a9dce0`,t,1.75,25-e*6,i);n.rotation.z=(e%2?1:-1)*.2}let c=new Uint8Array(4096);for(let e=0;e<32;e++)for(let t=0;t<32;t++){let n=Math.hypot((t-15.5)/15.5,(e-15.5)/15.5),r=(e*32+t)*4;c[r]=c[r+1]=c[r+2]=255,c[r+3]=Math.max(0,Math.exp(-n*n*5)-.0067)*200}let l=new k(c,32,32);l.needsUpdate=!0,l.magFilter=ye;for(let[e,r]of[18,-12,-43].entries()){let o=e===1?n.color:`#ffd19a`,s=e===1?-12:12,c=new t(o,145,25,2);c.position.set(s,4,r),i.add(c),Rc(.7,.35,.7,a,s,2.7,r,i),Q(Xc(.27,.12,.5),`#b1945d`,s,3.1,r,i),Q(new j(.24),`#ffce8e`,s,3.6,r,i).material=qc(`#ffce8e`,!0);let u=new d({map:l,color:o,transparent:!0,depthWrite:!1,blending:2,opacity:.42,toneMapped:!1});u.userData.ownedTexture=!0;let f=new M(u);f.position.set(s,3.65,r),f.scale.setScalar(3.5),i.add(f)}}function Vc(e,t){let n=ss[t.id];if(!n)return;let r=e.group,i=t.color;for(let t of[...n.hall,...n.arena]){let n=new p;n.position.set(t.x,0,t.z),n.rotation.y=t.rotation??0,r.add(n),Hc(t,n,i);let a=![`wall`,`shelf`,`tomb`,`obelisk`].includes(t.shape);e.colliders.push({x:t.x,z:t.z,w:t.w,d:a?t.w:t.d,rotation:a?void 0:t.rotation,radius:a?t.w/2:void 0,top:t.h,label:`Sanctuary ${t.shape}`})}for(let e of n.decals)if(e.shape===`pool`){let t=Q(new _e(e.r,32).rotateX(-Math.PI/2),`#2f6f7d`,e.x,.04,e.z,r);t.material=new $e({color:`#2f6f7d`,roughness:.15,metalness:.1,transparent:!0,opacity:.8}),t.castShadow=!1,Q(new s(e.r,e.r+.25,32).rotateX(-Math.PI/2),`#8fa9a3`,e.x,.05,e.z,r).castShadow=!1}else if(e.shape===`vent`){let t=Q(new _e(e.r,6).rotateX(-Math.PI/2),`#f08a4a`,e.x,.04,e.z,r);t.material=qc(`#f08a4a`,!0),t.castShadow=!1,Q(new s(e.r,e.r+.35,6).rotateX(-Math.PI/2),`#3e3836`,e.x,.05,e.z,r).castShadow=!1}else{let t=Q(new s(e.r-.12,e.r,64).rotateX(-Math.PI/2),i,e.x,.035,e.z,r);t.material=qc(i,!0),t.castShadow=!1}}function Hc(e,t,n){let r=e.w/2;if(e.shape===`root`){Q(Xc(r*.55,r,e.h,7),`#5b4632`,0,e.h/2,0,t);for(let e=0;e<4;e++){let n=e/4*Math.PI*2+.4;Q(new Ee(r*.45,r*2.2,5),`#4d3b2a`,Math.cos(n)*r*.9,r*.5,Math.sin(n)*r*.9,t).rotation.set(Math.sin(n)*1.1,0,-Math.cos(n)*1.1)}e.h>4&&(Q(Yc(r*.35),n,0,e.h*.6,r*.7,t).material=qc(n,!0))}else if(e.shape===`column`||e.shape===`basalt`){let i=e.shape===`basalt`?6:14,a=e.shape===`basalt`?`#3e3836`:`#8d9887`;Rc(e.w*1.25,.4,e.w*1.25,a,0,.2,0,t);let o=Q(Xc(r*.9,r,e.h-.4,i),a,0,.4+(e.h-.4)/2,0,t);o.material=kc(a),e.shape===`column`?Q(Yc(.18),n,0,Math.min(e.h,3.2),r*.95,t).material=qc(n,!0):Q(Jc(.08,e.h*.6,.08),`#f08a4a`,r*.86,e.h*.4,0,t).material=qc(`#f08a4a`,!0)}else if(e.shape===`crystal`)for(let[i,a,o,s]of[[0,0,1,0],[r*.55,r*.3,.65,.35],[-r*.45,-r*.35,.7,-.3],[r*.1,-r*.6,.5,.25]]){let c=Q(new j(r*.55*o),`#bfe3ec`,i,e.h*.5*o,a,t);c.scale.set(1,e.h/(r*1.1)*.9,1),c.rotation.z=s,o===1&&(c.material=qc(n,!0))}else if(e.shape===`obelisk`){Rc(e.w,e.h,e.d,`#bdab83`,0,e.h/2,0,t);let r=Q(new Ee(e.w*.72,e.w*.9,4),n,0,e.h+e.w*.45,0,t);r.rotation.y=Math.PI/4,r.material=qc(n,!0)}else if(e.shape===`wall`)Rc(e.w,e.h,e.d,`#4f4945`,0,e.h/2,0,t),Rc(e.w+.2,.18,e.d+.2,`#3e3836`,0,e.h+.09,0,t);else if(e.shape===`shelf`){Q(Jc(e.w,e.h,e.d),`#5e4632`,0,e.h/2,0,t).rotation.z=.06;for(let n of[.55,1.15,1.75].filter(t=>t<e.h))Q(Jc(e.w*.94,.08,e.d+.04),`#8a6a46`,0,n,0,t);for(let n=0;n<5;n++)Q(Jc(.22,.32,.5),[`#7d4c3a`,`#3f5d67`,`#8c7a4b`][n%3],-e.w/2+.5+n*(e.w/5.3),.18,e.d/2+.3,t).rotation.y=n*.7}else e.shape===`tomb`&&(Rc(e.w,e.h,e.d,`#73817a`,0,e.h/2,0,t),Rc(e.w+.16,.16,e.d+.16,`#a2aa97`,0,e.h+.08,0,t),Q(Jc(.12,.04,e.d*.6),n,0,e.h+.18,0,t).material=qc(n,!0))}function Uc(e,t,n,r,i){let a=e.group,o=e=>n*e,{z:s,door:c}=X,l=s-c/2,u=s+c/2;Rc(1.2,8,l+6,r,o(18),4,(l-6)/2,a),Rc(1.2,8,-u,r,o(18),4,u/2,a),Rc(1.2,4.6,c,r,o(18),5.7,s,a),e.colliders.push({x:o(18),z:s,w:1.5,d:c,bottom:3.3,top:8,overhead:!0,label:`Alcove lintel`});let d=new p;d.position.set(o(18),0,s),a.add(d),Rc(1,3.4,c,`#5b6763`,0,1.7,0,d);let f=qc(t.color,!0),m=-n*.51,h=[...t.id].reduce((e,t)=>e*31+t.charCodeAt(0),7)%9973,g=()=>(h=h*16807%2147483647)/2147483647;for(let e=0;e<6;e++){let n=.1,r=1.55,i=e/6*Math.PI*2+g()*.6;for(let e=0;e<4;e++){let a=.22+g()*.2;i+=(g()-.5)*1.1;let o=n+Math.cos(i)*a,s=r+Math.sin(i)*a;if(Math.abs(o)>c/2-.12||s<.15||s>3.25)break;let l=Q(Jc(.02,.03-e*.004,a+.02),t.color,m,(r+s)/2,(n+o)/2,d);l.rotation.x=-i,l.material=f,l.castShadow=!1,n=o,r=s}}e.colliders.push({x:o(18),z:s,w:1.5,d:c,top:3.4,crack:!0,label:`Cracked wall`});let _=new p;_.visible=!1,a.add(_);let v=[[17,l+.3,.55,.3],[16.6,l+.15,.35,1.1],[17.3,u-.25,.5,.7],[16.7,u-.1,.3,2.1],[19.4,l+.2,.45,1.6],[19.6,u-.2,.4,.2]];for(let[e,t,n,r]of v){let i=Rc(n,n*.7,n*1.2,`#5b6763`,0,0,0,_);i.position.set(o(e),n*.35,t),i.rotation.set(r*.3,r,r*.2)}e.crack={wall:d,rubble:_,x:o(18),z:s},e.interactables.push({id:`crack`,kind:`crack`,x:o(X.examine),z:s,label:`Examine the cracked wall`,mesh:d});let y=(X.inner+X.outer)/2,b=X.outer-X.inner,x=2*X.half;Q(Jc(b+1.6,1,x+2),i,o(y),-.5,s,a),Q(Jc(b,.025,x),i,o(y),.015,s,a);let S=mt(`Dungeon_Wall`);S.position.set(o(X.outer+.5),0,s),S.rotation.y=-n*(Math.PI/2),a.add(S);for(let[t,n]of[[X.z-X.half-.5,0],[X.z+X.half+.5,Math.PI]]){let r=mt(`Dungeon_Wall`);r.position.set(o(y),0,t),r.rotation.y=n,a.add(r),e.colliders.push({x:o(y),z:t,w:b+1,d:1,label:`Alcove wall`})}e.colliders.push({x:o(X.outer+.5),z:s,w:1,d:x+2,label:`Alcove wall`});for(let e of[X.z-X.half-.25,X.z+X.half+.25])Rc(.6,8,.6,r,o(X.outer+.2),4,e,a);Rc(b+2.2,.5,x+2.4,`#697e7c`,o(y),8.2,s,a);let C=new p;C.position.set(o(X.tablet),0,s),C.rotation.y=-n*(Math.PI/2),a.add(C),Rc(1.7,.3,.8,`#8d9887`,0,.15,0,C),Rc(1.5,2.1,.35,`#a5ae9d`,0,1.35,0,C);let w=Q(Xc(.08,.2,.26,10),t.color,0,1.95,.2,C);w.material=qc(t.color,!0);for(let e=0;e<4;e++){let n=Q(Jc(.9-e*.12,.035,.02),t.color,0,1.6-e*.18,.19,C);n.material=f}for(let e of[-1.3,1.3])Q(Xc(.12,.16,.5),`#8b7756`,e,.25,.3,C),Q(new j(.12),`#ffce8e`,e,.6,.3,C).material=qc(`#ffce8e`,!0);e.colliders.push({x:o(X.tablet),z:s,w:.8,d:1.8,top:2.4,label:`Carved tablet`}),e.interactables.push({id:`carving`,kind:`carving`,x:o(X.read),z:s,label:`Read the carved tablet`,mesh:C})}function Wc(e){let t=new Uint8Array(1638400),n=new G,r=new G(e?`#4a6755`:`#526f43`),i=new G(`#36543f`),a=new G(`#8a8b59`),o=new G(`#a48e6b`),s=new G(`#c5b18a`),c=new G(`#8a8e7c`),l=new G(e?`#c6d9d9`:`#96bda9`),u=new G(`#538e83`),d=(e,t,n,r,i,a)=>1-ge.smoothstep(Math.hypot(e-n,t-r),i,a);for(let e=0;e<640;e++)for(let f=0;f<640;f++){let p=(f/639-.5)*320,m=(.5-e/639)*320,h=(Math.sin(p*.11+Math.sin(m*.057)*2)*Math.cos(m*.093)+1)*.5;n.copy(r).lerp(a,h*.26).lerp(i,d(p,m,-65,8,20,75)*.7),n.lerp(c,d(p,m,73,-47,18,43)),n.lerp(s,d(p,m,65,-106,24,52)),n.lerp(l,d(p,m,-72,-70,18,55)),n.lerp(u,d(p,m,-84,70,20,50)),n.lerp(s,d(p,m,108,56,21,55));let g=$c(p,m)+Math.sin(p*2.1+m*.63)*.15,_=1-ge.smoothstep(g,1.65,3.5);n.lerp(o,_*.92);let v=Math.sin(p*11.71+m*18.27)*Math.cos(m*7.38-p*3.24);n.multiplyScalar(.94+v*.045+h*.075),n.convertLinearToSRGB();let y=(e*640+f)*4;t[y]=Math.min(255,n.r*255),t[y+1]=Math.min(255,n.g*255),t[y+2]=Math.min(255,n.b*255),t[y+3]=255}let f=new k(t,640,640);f.colorSpace=Ae,f.magFilter=ye,f.minFilter=qe,f.generateMipmaps=!0,f.anisotropy=4,f.needsUpdate=!0;let p=new B(320,320,128,128);p.rotateX(-Math.PI/2);let m=p.attributes.position;for(let e=0;e<m.count;e++)m.setY(e,$(m.getX(e),m.getZ(e)));p.computeVertexNormals();let h=Ac(f);h.userData.ownedTexture=!0;let g=new L(p,h);return g.receiveShadow=!0,g.name=`Painted meadow terrain`,g}var Gc=new W(0,1,0),Kc=new Map;function qc(e,t=!1){if(!t&&[`#8b978d`,`#aea886`,`#727e6c`,`#8d9887`,`#b5b8a1`,`#c5c3a7`,`#aab09c`,`#ccd0b8`,`#aeb5a1`,`#7a928a`,`#4f4945`,`#92816a`,`#748e94`,`#607370`,`#aa9574`,`#81908a`,`#73817a`,`#a5ae9d`,`#a2aa97`].includes(e))return kc(e);let n=e+t;return Kc.has(n)||Kc.set(n,new $e({color:e,roughness:.88,flatShading:!1,...t?{emissive:e,emissiveIntensity:.65}:{}})),Kc.get(n)}function Q(e,t,n=0,r=0,i=0,a){let o=new L(e,qc(t));return o.position.set(n,r,i),o.castShadow=!0,o.receiveShadow=!0,a?.add(o),o}var Jc=(e,t,n)=>new Le(e,t,n),Yc=e=>new ut(e,2),Xc=(e,t,n,r=12)=>new st(e,t,n,r);function Zc(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Qc(e,t,n,r,i,a){let o=i-n,s=a-r,c=Math.max(0,Math.min(1,((e-n)*o+(t-r)*s)/(o*o+s*s)));return Math.hypot(e-n-c*o,t-r-c*s)}function $c(e,t){let n=Qc(e,t,0,60,0,-122);for(let r of Ka)n=Math.min(n,Qc(e,t,0,r.z>30?40:0,r.x,r.z));return n}function $(e,t){let n=Math.sin(e*.045)*Math.cos(t*.038)*2.3+Math.sin(e*.092+t*.035)*.7,r=[{x:0,z:48},{x:0,z:0},...Ka];for(let i of r){let r=Math.hypot(e-i.x,t-i.z);n*=ge.smoothstep(r,9,22)}let i=1-ge.smoothstep(Math.hypot(e-119,t-55),29,37);return ge.lerp(n,-.8,i)}var el=class{groups=new Map;add(e,t,n,r,i,a=1,o=1,s=1,c=0){let l=e.clone(),u=new Xe().compose(new W(n,r,i),new D().setFromAxisAngle(Gc,c),new W(a,o,s));l.applyMatrix4(u),this.groups.has(t)||this.groups.set(t,[]),this.groups.get(t).push(l)}finish(e){for(let[t,n]of this.groups){let r=ht(n,!1);r&&Q(r,t,0,0,0,e),n.forEach(e=>e.dispose())}}};function tl(e,t=[]){e.updateMatrixWorld(!0);let n=new Set;t.forEach(e=>e.traverse(e=>n.add(e)));let r=t=>t.visible&&(!t.parent||t===e||r(t.parent)),i=new Map;e.traverse(e=>{if(e instanceof L&&!n.has(e)&&!(e instanceof u)&&(!e.userData.noBatch||e.userData.sharedGeometry)&&r(e)&&!Array.isArray(e.material)&&!e.geometry.hasAttribute(`color`)){let t=new W().setFromMatrixPosition(e.matrixWorld),n=`${e.material.uuid}:${Math.floor(t.x/32)}:${Math.floor(t.z/32)}:${Object.keys(e.geometry.attributes).sort().join(`,`)}`;i.has(n)||i.set(n,{material:e.material,objects:[]}),i.get(n).objects.push(e)}});for(let{material:t,objects:n}of i.values()){if(n.length<2)continue;let r=n.map(e=>{let t=pt(e.geometry,e.matrixWorld),n=t.getAttribute(`uv`);if(n&&!(n.array instanceof Float32Array)){let e=new Float32Array(n.count*2);for(let t=0;t<n.count;t++)e[t*2]=n.getX(t),e[t*2+1]=n.getY(t);t.setAttribute(`uv`,new We(e,2))}if(!t.index)return t;let r=t.toNonIndexed();return t.dispose(),r}),i=ht(r,!1);if(r.forEach(e=>e.dispose()),!i)continue;let a=new L(i,t);a.castShadow=!0,a.receiveShadow=!0,n.forEach(e=>{e.removeFromParent(),e.userData.sharedGeometry||e.geometry.dispose()}),e.add(a)}}function nl(e=!1,t=`#507f8c`){return ft(e,t===`#bfa679`?`Rowan`:t===`#b67967`?`Mira`:t===`#6d6c70`?`Smith`:void 0)}function rl(e,t){let n=Zc(29),r=new Float32Array(540);for(let t=0;t<180;t++)r[t*3]=(n()-.5)*(e?30:230),r[t*3+1]=n()*10+1,r[t*3+2]=e?n()*80-48:(n()-.5)*260;let i=new he;i.setAttribute(`position`,new We(r,3));let a=new b({color:t?`#aedce2`:`#fff0b5`,size:.1,transparent:!0,opacity:.7,depthWrite:!1});return a.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
float radius=length(gl_PointCoord-vec2(.5));if(radius>.48)discard;diffuseColor.a*=1.-smoothstep(.12,.48,radius);`)},new je(i,a)}function il(e,t,n,r,i,a,o,s){e.interactables.push({id:t,kind:n,x:r,z:i,label:a,mesh:o,value:s})}function al(e,t,n){let r=new p;r.position.set(t.x,$(t.x,t.z),t.z),e.group.add(r);let i=n.completed.includes(t.id);r.add(mt(`Portal`));let a=Q(new B(4.8,6.9),`#182e31`,0,3.6,1.53,r);a.material=new $e({color:i?`#a7d8a3`:t.color,emissive:i?`#a7d8a3`:t.color,emissiveIntensity:.2,transparent:!0,opacity:.7,side:2});let o=Q(new h(1,.09,5,24),t.color,0,5.1,1.65,r);o.material=qc(t.color,!0),Q(new j(.4),t.color,0,5.1,1.7,r).material=qc(t.color,!0),e.colliders.push({x:t.x-3.5,z:t.z,w:2.2,d:3},{x:t.x+3.5,z:t.z,w:2.2,d:3},{x:t.x,z:t.z+1.5,w:4.8,d:.24,label:`Sanctuary door`}),il(e,t.id,`portal`,t.x,t.z+3,i?`${t.name} · restored`:`Enter ${t.name}`,r)}var ol=zc;function sl(e){let t=new p,n={group:t,colliders:[],interactables:[],water:[],particles:rl(!1,e.age===`adult`),gates:[],puzzle:[],spawn:e.position};t.add(n.particles);let r=Zc(429),i=e.age===`adult`;t.add(Wc(i));let a=new el;fl(n,r);for(let e=0;e<14;e++){let n=e/14*Math.PI*2,r=mt(`Mountain_Ridge`);r.position.set(Math.cos(n)*190,-5,Math.sin(n)*190),r.rotation.y=-n+Math.PI/2,r.scale.set(1.18,1.05+e%3*.18,1.5),r.traverse(e=>{e instanceof L&&(e.castShadow=!1)}),t.add(r)}a.finish(t),ol(n,-12,50,.18,`#d5c8a5`),ol(n,13,45,-.35,`#c4b991`),ol(n,-14,66,.35,`#b6b899`),ol(n,14,64,-.2,`#d5c1a3`),ol(n,2,77,Math.PI,`#b9b79a`);let o=mt(`Well`);o.position.set(0,$(0,47),47),t.add(o),n.colliders.push({x:0,z:47,w:2.8,d:2.8,radius:1.4,top:$(0,47)+4.8,label:`Village well`});let s=nl(!0,`#bfa679`);s.group.position.set(3.1,$(3.1,49),49),s.group.rotation.y=-.7,s.sword.visible=!1,t.add(s.group),il(n,`elder`,`npc`,3.1,49,`Speak with Elder Rowan`,s.group);let c=nl(!1,`#b67967`);c.group.position.set(-5,$(-5,57),57),e.age===`adult`&&c.group.scale.setScalar(1.26),c.group.rotation.y=-1.7,c.sword.visible=!1,t.add(c.group),il(n,`mira`,`npc`,-5,57,`Speak with Mira`,c.group);let l=nl(!0,`#6d6c70`);l.group.position.set(10,$(10,54),54),l.sword.visible=!1,t.add(l.group),il(n,`smith`,`npc`,10,54,`Speak with the smith`,l.group);let u=new p;u.position.set(-4,$(-4,40),40),t.add(u);for(let e=0;e<6;e++)Q(Yc(.22),`#858c7b`,Math.cos(e)*.8,.2,Math.sin(e)*.8,u);Q(new Ee(.45,1.3,7),`#efb66a`,0,.65,0,u).material=qc(`#efb66a`,!0),il(n,`camp`,`heal`,-4,40,`Rest at the campfire`,u);let d=mt(`Bell_Sanctuary`);t.add(d);for(let e of[-3.2,3.2])n.colliders.push({x:e,z:.6,w:1.4,d:1.5});for(let e=0;e<7;e++){let t=Math.PI/7*e+Math.PI/14;n.colliders.push({x:Math.cos(t)*6.8,z:-(Math.sin(t)*6.8-1.3),w:1.6,d:1.6})}il(n,`ages`,`bell`,0,5,`Listen to the Bell of Ages`,d);let f=Q(new _e(36,64),`#72abb0`,119,-.04,55,t);f.rotation.x=-Math.PI/2,f.material=Nc(),f.castShadow=!1,f.userData.skipAO=!0,n.water.push(f);for(let e=0;e<9;e++)Q(Jc(2,.18,3.3),`#9c8a64`,95+e*2.1,.55,56,t);for(let t of Ka)al(n,t,e);for(let{id:r,x:i,z:a}of Eo){if(e.chests.includes(r))continue;let o=mt(`Chest`);o.position.set(i,$(i,a),a),t.add(o),n.colliders.push({x:i,z:a,w:1.5,d:1,top:$(i,a)+1,label:`Chest`}),il(n,r,`chest`,i,a,`Open weathered chest`,o)}for(let r of To){if(e.fireflies.includes(r.id))continue;let i=new p;i.position.set(r.x,$(r.x,r.z)+1.5,r.z),t.add(i);let a=Q(new j(.23),`#f6df8a`,0,0,0,i);a.material=qc(`#f6df8a`,!0);let o=Q(new h(.43,.025,4,24),`#f6df8a`,0,0,0,i);o.rotation.y=.8,il(n,r.id,`firefly`,r.x,r.z,`Catch a wandering light`,i)}return cl(n,e),dl(n),tl(t,[...n.water,n.particles,...n.interactables.filter(e=>[`chest`,`firefly`,`npc`].includes(e.kind)).map(e=>e.mesh)]),Ic(n,e),n}function cl(e,t){let n=e.group;t.age;let r=mt(`Caldera`);r.position.set(105,0,-64),n.add(r);let i=Q(new _e(7.8,32),`#e6a071`,105,23.2,-64,n);i.rotation.x=-Math.PI/2,i.material=qc(`#e6a071`,!0),e.colliders.push({x:105,z:-64,w:68,d:68,radius:34,top:28,label:`Caldera`});for(let e=0;e<4;e++){let t=Q(Yc(3+e*.5),`#a4afa0`,105+e*1.2,28+e*3,-64,n);t.scale.y=.5,t.castShadow=!1}let a=mt(`Watchtower`);a.position.set(98,$(98,75),75),n.add(a),e.colliders.push({x:98,z:75,w:6,d:6});for(let e=0;e<5;e++){let t=Q(new h(3.5,.15,5,12,Math.PI),`#c9c7a8`,99+e,1,39,n);t.rotation.y=Math.PI/2}for(let[t,r,i,a]of[[-87,19,.7,1.7],[94,28,.15,1.4],[139,75,1.7,1.3],[-78,-87,.4,2.8]]){let o=mt(`Cliff`);o.position.set(t,$(t,r),r),o.rotation.y=i,o.scale.setScalar(a),n.add(o),e.colliders.push({x:t,z:r,w:10.8*a,d:2.7*a,rotation:i,top:$(t,r)+5*a,label:`Cliff`})}for(let[t,r,i]of[[-81,-79,17],[-59,-85,24],[-86,-64,11]]){let a=mt(`Cliff`);a.position.set(t,0,r),a.scale.set(.6,i/5,.6),a.rotation.y=.45,n.add(a),e.colliders.push({x:t,z:r,w:5,d:5})}let o=mt(`Observatory`);o.position.set(64,$(64,-122),-122),n.add(o),e.colliders.push({x:64,z:-122,w:5,d:5});for(let t=0;t<5;t++){let r=-96+t*6;Q(Xc(.7,1,5+t%2*2),`#758781`,r,2.5,85,n),e.colliders.push({x:r,z:85,w:1.5,d:1.5})}let s=Q(new _e(13,32),`#749f9a`,-85,.08,87,n);s.rotation.x=-Math.PI/2,s.material=new $e({color:`#749f9a`,transparent:!0,opacity:.7,roughness:.3}),e.water.push(s);for(let t of[-13,13]){let r=mt(`Watchtower`);r.position.set(t,0,-132),r.scale.set(1.15,1.28,1.15),n.add(r),e.colliders.push({x:t,z:-132,w:8,d:8})}Q(Jc(25,10,3),`#7a8980`,0,5,-134,n),e.colliders.push({x:0,z:-134,w:25,d:3});for(let t of[-1,1])for(let r=0;r<4;r++){let i=t*7,a=29+r*2.2,o=mt(`Fence`);o.position.set(i,$(i,a),a),o.rotation.y=Math.PI/2,n.add(o),e.colliders.push({x:i,z:a,w:2.3,d:.25,rotation:Math.PI/2,top:$(i,a)+1.3,label:`Meadow fence`})}}function ll(e,t){let n=new p,r={group:n,colliders:[],interactables:[],water:[],particles:rl(!0,!0),gates:[],puzzle:[],spawn:{x:0,z:29},dungeon:e};n.add(r.particles);let i=e.id===`ember`?`#4f4945`:e.id===`sun`?`#92816a`:e.id===`frost`?`#748e94`:`#607370`,a=e.id===`sun`?`#aa9574`:`#81908a`;Q(Jc(36,1,88),a,0,-.5,-10,n);let o=ss[e.id]?.alcove??1;for(let e of[-18,18])for(let t=-51;t<34;t+=6){if(e===o*X.wall&&Math.abs(t-X.z)<3+X.door/2)continue;let r=mt(`Dungeon_Wall`);r.position.set(e,0,t),r.rotation.y=e<0?Math.PI/2:-Math.PI/2,n.add(r)}for(let e of[-54,34])for(let t=-15;t<18;t+=6){let r=mt(`Dungeon_Wall`);r.position.set(t,0,e),r.rotation.y=e<0?0:Math.PI,n.add(r)}let s=X.z-X.door/2,c=X.z+X.door/2;r.colliders.push({x:-o*18,z:-10,w:1.5,d:88},{x:o*18,z:(-54+s)/2,w:1.5,d:s+54},{x:o*18,z:(c+34)/2,w:1.5,d:34-c},{x:0,z:-54,w:36,d:1.5},{x:0,z:34,w:36,d:1.5});for(let t=-49;t<34;t+=6){for(let i of[-15.9,15.9]){let a=mt(`Dungeon_Pier`);a.position.set(i,0,t),a.rotation.y=i<0?Math.PI/2:-Math.PI/2,n.add(a),r.colliders.push({x:i,z:t,w:1.35,d:1.55,top:7.5,label:`Dungeon pier`}),Q(new j(.27),e.color,i,3.9,t+1,n).material=qc(e.color,!0)}for(let e=-12;e<=12;e+=6)Q(Jc(5.85,.025,5.85),a,e,.015,t,n)}for(let[e,t]of[5,-21].entries()){let a=new p;n.add(a);for(let e of[-11,11])Q(Jc(14,7,1),i,e,3.5,t,n),r.colliders.push({x:e,z:t,w:14,d:1});Q(Jc(8,1,1.5),i,0,7,t,n),r.colliders.push({x:0,z:t,w:8,d:1.5,bottom:6.5,top:7.5,overhead:!0,label:`Gate lintel`});for(let e=-3;e<=3;e+=1)Q(Jc(.18,6.8,.25),`#adad91`,e,3.4,t,a);Q(Jc(7,.16,.4),`#c5b27c`,0,3,t,a),r.colliders.push({x:0,z:t,w:8,d:1,gate:e}),r.gates.push(a)}Q(Xc(4,4.5,.16,32),`#a2aa97`,0,.12,17,n);for(let t=0;t<3;t++){let a=(t-1)*7,o=t===1?12:18,s=new p;if(s.position.set(a,0,o),n.add(s),Q(Xc(.8,1,.7),i,0,.35,0,s),e.puzzle===`mirrors`){Q(Jc(.15,2.5,1.5),`#bdd9d7`,0,2,0,s);let n=new L(Jc(.14,.14,9),new Se({color:e.color,transparent:!0,opacity:.3,depthWrite:!1}));n.name=`beam`,n.position.set(0,2,-4.5),n.userData.skipAO=!0,s.add(n),s.rotation.y=Math.PI/2*(t+1)}else if(e.puzzle===`torches`){Q(Xc(.2,.3,1.5),`#938569`,0,1.1,0,s);let t=Q(new j(.45),e.color,0,2.1,0,s);t.name=`flame`,t.material=qc(e.color,!0),t.visible=!1}else{let t=Q(e.puzzle===`bells`?Xc(.25,.6,1):new j(.55),e.color,0,1.5,0,s);t.material=qc(e.color,!0)}r.puzzle.push(s),il(r,`puzzle-${t}`,`puzzle`,a,o,e.puzzle===`mirrors`?`Turn the star mirror`:e.puzzle===`torches`?`Kindle or extinguish flame`:e.puzzle===`bells`?`Ring the old bell`:`Touch the memory stone`,s,t)}if(e.puzzle===`block`){r.puzzle.forEach(e=>e.visible=!1),r.interactables=r.interactables.filter(e=>e.kind!==`puzzle`);let e=new p;e.position.set(0,0,22),n.add(e),Q(Jc(2,2,2),`#a5997b`,0,1,0,e),Q(Jc(2.05,.2,2.05),`#d4b579`,0,1.3,0,e),r.block=e,il(r,`block`,`puzzle`,0,22,`Push the stone toward the seal`,e,0),Q(Xc(1.7,1.7,.09,8),`#e1c185`,0,.07,14,n)}(e.puzzle===`song`||e.puzzle===`final`)&&(r.puzzle.forEach((e,t)=>{t!==1&&(e.visible=!1)}),r.interactables=r.interactables.filter(e=>e.kind!==`puzzle`),il(r,`song`,`puzzle`,0,12,`Read the melody altar`,r.puzzle[1],1)),il(r,`exit`,`exit`,0,31,`Return to the meadow`,Q(new h(1.5,.13,6,24),e.color,0,2.5,32.6,n));let l=new p;return l.position.set(0,1.7,-45),n.add(l),Q(new j(.7),e.color,0,0,0,l).material=qc(e.color,!0),Q(new h(1.1,.055,5,32),e.color,0,0,0,l),l.visible=!1,il(r,`relic`,`relic`,0,-45,`Claim ${e.relic}`,l),Bc(r,e,o),Vc(r,e),Uc(r,e,o,i,a),tl(n,[...r.gates,...r.puzzle,r.block,r.crack?.wall,r.crack?.rubble,...r.interactables.filter(e=>e.kind===`relic`).map(e=>e.mesh)].filter(e=>!!e)),r}function ul(e){let t=new Set;for(let n of e.nature||[])n.near&&t.add(n.near),n.far&&t.add(n.far);t.forEach(e=>e.dispose()),e.group.traverse(e=>{e instanceof M&&(e.material.map?.dispose(),e.material.dispose()),(e instanceof L||e instanceof je)&&(e.userData.sharedGeometry||e.geometry.dispose(),e instanceof u&&e.dispose(),e.customDepthMaterial?.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>{e.userData.ownedTexture&&e.map?.dispose(),!e.userData.shared&&![...Kc.values()].includes(e)&&e.dispose()}))}),e.group.removeFromParent()}function dl(e){for(let t=35;t<78;t+=2.9){let n=mt(`Cobble_Patch`);n.position.set(0,0,t),n.updateMatrixWorld(!0),n.traverse(e=>{if(!(e instanceof L))return;e.geometry=e.geometry.clone(),e.userData.sharedGeometry=!1;let t=e.geometry.getAttribute(`position`),n=new Float32Array(t.count*3),r=new W,i=e.matrixWorld.clone().invert();for(let a=0;a<t.count;a++)r.fromBufferAttribute(t,a).applyMatrix4(e.matrixWorld),r.y+=$(r.x,r.z)+.018,r.applyMatrix4(i),n[a*3]=r.x,n[a*3+1]=r.y,n[a*3+2]=r.z;e.geometry.setAttribute(`position`,new We(n,3)),e.geometry.computeBoundingSphere()}),e.group.add(n)}for(let[t,n,r,i]of[[`Cart`,-18,47,.7],[`Barrel`,-16,52,0],[`Barrel`,-16.5,53,.4],[`Crate`,16.8,48,.2],[`Crate`,17.9,48.2,-.1],[`Barrel`,17,46.5,0],[`Barrel`,-17,67,.5],[`Signpost`,5.7,37,.25],[`Crate`,10.5,65,0]]){let a=mt(t);if(a.position.set(n,$(n,r),r),a.rotation.y=i,e.group.add(a),e.colliders.push({x:n,z:r,w:t===`Cart`?2.3:t===`Signpost`?.25:1.2,d:t===`Cart`?2.4:t===`Signpost`?.25:1.2,rotation:i,top:$(n,r)+(t===`Signpost`?2:1.6),label:t}),t===`Cart`)for(let t of[-1,1]){let a=t*.7,o=1.95;e.colliders.push({x:n+a*Math.cos(i)+o*Math.sin(i),z:r-a*Math.sin(i)+o*Math.cos(i),w:.18,d:2.5,rotation:i,top:$(n,r)+.8,label:`Cart shaft`})}}}function fl(e,t){let n=new Map;for(let r=0;r<190;r++){let r=(t()-.5)*300,i=(t()-.5)*300;if($c(r,i)<5||Ka.some(e=>Math.hypot(r-e.x,i-e.z)<13)||Math.hypot(r,i-48)<24||Math.hypot(r,i)<16)continue;let a=.5+t()*1.6,o=t()*6.28;if(Do.some(e=>Math.hypot(r-e.x,i-e.z)<3+1.4*a))continue;let s=`${Math.floor(r/48)},${Math.floor(i/48)}`;n.has(s)||n.set(s,[]),n.get(s).push({x:r,z:i,scale:a,angle:o}),e.colliders.push({x:r,z:i,w:2.2*a,d:1.75*a,rotation:o,top:$(r,i)+1.4*a,label:`Rock`})}let{geometry:r,material:i}=gt(`Rock_0`),a=new nt;for(let t of n.values()){let n=new u(r,i,t.length);n.userData.noBatch=!0,t.forEach((e,t)=>{a.position.set(e.x,$(e.x,e.z),e.z),a.scale.set(e.scale,e.scale*.8,e.scale),a.rotation.y=e.angle,a.updateMatrix(),n.setMatrixAt(t,a.matrix)}),n.castShadow=!0,n.receiveShadow=!0,n.computeBoundingSphere(),e.group.add(n)}}function pl(){let e=new E({side:1,depthWrite:!1,uniforms:{time:Cc,zenith:{value:new G(`#6badd6`)},horizon:{value:new G(`#d9e6da`)},sun:{value:new W(-.45,.62,-.55).normalize()}},vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 direction;uniform vec3 zenith,horizon,sun;uniform float time;${Ec}
 void main(){vec3 d=normalize(direction);float h=max(d.y,0.);vec3 color=mix(horizon,zenith,pow(h,.48));float sunDot=max(dot(d,sun),0.);color+=vec3(1.,.69,.28)*pow(sunDot,24.)*.32+vec3(1.,.8,.46)*pow(sunDot,800.)*2.;
 if(d.y>.018){vec2 uv=d.xz/(d.y+.25)*2.3+vec2(time*.006,0.);float field=fbm(uv)*.76+noise21(uv*.45)*.24;float cloud=smoothstep(.57,.75,field)*smoothstep(.02,.13,d.y);vec3 cloudColor=mix(vec3(.56,.7,.77),vec3(1.,.96,.86),smoothstep(.5,.76,field));color=mix(color,cloudColor,cloud*.9);}
 gl_FragColor=vec4(color,1.);#include <tonemapping_fragment>
 #include <colorspace_fragment>}`.replace(`;#include`,`;
#include`)});e.toneMapped=!1;let t=new L(new dt(430,24,12),e);return t.frustumCulled=!1,t.userData.skipAO=!0,t.renderOrder=-10,t}var ml={low:{pixelCap:1,resolution:.85,adaptive:!1,post:!1,contactScale:.5,contactSamples:8,bloom:0,grade:!1,antialias:`fxaa`,depthOfField:!1,shadowSize:1024,shadowRadius:1,shadowInterval:.033,anisotropy:1,detail:0,sparks:1},medium:{pixelCap:1.5,resolution:1,adaptive:!0,post:!0,contactScale:.5,contactSamples:8,bloom:0,grade:!1,antialias:`fxaa`,depthOfField:!1,shadowSize:2048,shadowRadius:1,shadowInterval:.033,anisotropy:1,detail:1,sparks:1},high:{pixelCap:1.75,resolution:1,adaptive:!1,post:!0,contactScale:.5,contactSamples:8,bloom:.45,grade:!0,antialias:`fxaa`,depthOfField:!1,shadowSize:2048,shadowRadius:1,shadowInterval:.033,anisotropy:4,detail:2,sparks:1},ultra:{pixelCap:2,resolution:1.5,adaptive:!1,post:!0,contactScale:1,contactSamples:16,bloom:.6,grade:!0,antialias:`smaa`,depthOfField:!0,shadowSize:4096,shadowRadius:2.5,shadowInterval:0,anisotropy:8,detail:3,sparks:1.6}},hl=class{renderer;fidelity=`medium`;scale=1;samples=[];stableWindows=0;reducedEffects=!1;constructor(e,t=`medium`){this.renderer=e,this.set(t)}get profile(){return ml[this.fidelity]}get post(){return this.profile.post&&!this.reducedEffects}get level(){return this.reducedEffects?0:this.profile.detail}get label(){return rc[this.fidelity]}touchCap=1/0;get pixelRatio(){let e=this.profile,t=this.fidelity===`medium`?Math.min(e.pixelCap,this.touchCap):e.pixelCap;return(e.resolution<=1?Math.min(devicePixelRatio,t)*e.resolution:Math.min(devicePixelRatio*e.resolution,t))*this.scale}apply(){this.renderer.setPixelRatio(this.pixelRatio)}set(e){this.fidelity=e,this.scale=1,this.samples=[],this.stableWindows=0,this.reducedEffects=!1,this.apply()}sample(e){if(!this.profile.adaptive||document.hidden||e>100||e<2||(this.samples.push(e),this.samples.length<120))return;let t=this.samples.sort((e,t)=>e-t)[90];this.samples=[],t>25&&this.scale>.72?(this.scale=Math.max(.72,this.scale-.08),this.stableWindows=0,this.apply()):t<18.5&&this.scale<1?++this.stableWindows>=3&&(this.scale=Math.min(1,this.scale+.04),this.stableWindows=0,this.apply()):this.stableWindows=0,t>25&&this.scale<=.81&&(this.reducedEffects=!0),t<18.5&&this.scale>=.94&&(this.reducedEffects=!1)}},gl={keyboard:e=>`<span><kbd>${Bs(e).toUpperCase()}</kbd> Move</span><span><kbd>${e.attack}</kbd> Sword</span><span><kbd>${e.dodge.toUpperCase()}</kbd> Dodge</span><span><kbd>${e.target}</kbd> Lock on</span><span><kbd>${e.flute}</kbd> Flute</span><span><kbd>${e.journal.toUpperCase()}</kbd> Journal</span>`,gamepad:(e,t)=>`<span><kbd>LS</kbd> Move</span><span><kbd>${t.attack}</kbd> Sword</span><span><kbd>${t.dodge}</kbd> Dodge</span><span><kbd>${t.shield}</kbd> Shield</span><span><kbd>${t.target}</kbd> Lock on</span><span><kbd>${t.flute}</kbd> Flute</span><span><kbd>${t.pause.toUpperCase()}</kbd> Pause</span>`,touch:()=>``},_l={keyboard:e=>`<b>${Bs(e)}</b> move · <b>Mouse drag / arrows</b> camera · <b>${e.interact}</b> interact<br><b>${e.attack} / click</b> sword · <b>${e.dodge}</b> dodge · <b>${e.shield}</b> shield<br><b>${e.target}</b> lock on (<b>← →</b> switch) · <b>${e.flute}</b> flute · <b>${e.checkpoint}</b> return to checkpoint<br>In menus: <b>↑ ↓</b> or <b>Tab</b> move · <b>Enter</b> choose · <b>Esc</b> back`,gamepad:(e,t)=>`<b>Left stick</b> move · <b>Right stick</b> camera · <b>${t.interact}</b> interact<br><b>${t.attack}</b> sword · <b>${t.dodge}</b> dodge · <b>${t.shield}</b> shield · <b>${t.target}</b> lock on (flick the right stick to switch)<br><b>${t.flute}</b> flute · <b>${t.map}</b> map · <b>${t.journal}</b> journal · <b>${t.pause}</b> pause`,touch:()=>`<b>Thumbstick</b> move · <b>Drag the scene</b> camera · <b>Use</b> interact<br><b>Sword</b> or tap the scene to strike · <b>Dodge</b> · hold <b>Shield</b><br><b>Lock</b> on (swipe sideways to switch) · <b>Flute</b> · <b>Ⅱ</b> pause`},vl=()=>!!document.fullscreenEnabled,yl=()=>!!document.fullscreenElement,bl=class{root=document.querySelector(`#ui`);panel=`title`;onAction=()=>{};onMark=()=>{};toastTimer=0;device=`keyboard`;keys=zs();pad=Hs();padStyle=`xbox`;toggleShield=!1;inJourney=()=>!1;constructor(){this.root.innerHTML=`
 <div id="vignette"></div><div id="hud" hidden>
 <div class="vitals"><div class="eyebrow" id="age">THE FIRST AGE</div><div id="hearts" role="img" aria-label="Health"></div><div class="pocket"><span class="crystal">◆</span><span id="money">0</span><span class="pocket-rule"></span><span id="relics">0 / 7 relics</span></div></div>
 <div class="location"><span class="location-line"></span><span id="region">Alder Village</span><span class="location-line"></span><small id="compass"><i id="compass-arrow" aria-hidden="true" hidden></i><span id="compass-text">N</span></small></div>
 <button class="menu-button" data-action="pause" aria-label="Pause game">Ⅱ <span>ESC</span></button>
 <div class="quest"><span class="quest-mark">◇</span><div><small>THE JOURNEY</small><h3 id="quest-title"></h3><p id="quest-detail"></p></div></div>
 <div class="bottom-left"><canvas id="minimap" width="160" height="160" aria-label="Nearby map" data-action="map"></canvas><button class="map-label" data-action="map">THE KINGDOM <kbd id="map-key">M</kbd></button></div>
 <div id="prompt" hidden></div><div id="boss" hidden><small id="boss-name"></small><div><i id="boss-fill"></i></div></div>
 <div class="controls" id="controls"></div>
 <div id="target-dot" aria-hidden="true" hidden></div><div id="threats" aria-hidden="true"></div><div id="save-indicator">Progress saved</div></div>
 <input type="file" id="import-file" accept=".json,application/json" hidden><div id="toast" role="status"></div><div id="graphics-notice" role="alert" hidden></div><div id="damage-flash"></div><div id="panel"></div>
 <div id="touch" hidden><div class="touch-stick" id="touch-stick" role="application" aria-label="Movement thumbstick"><i id="touch-knob"></i></div><div class="touch-actions"><button data-action="target">Lock</button><button data-action="flute">Flute</button><button id="touch-shield" aria-label="Shield (hold)">Shield</button><button data-action="dodge">Dodge</button><button data-action="interact">Use</button><button class="touch-sword" data-action="attack">Sword</button></div></div>`,this.setDevice(this.device),this.root.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action]`);t&&!t.closest(`#touch`)&&this.onAction(t.dataset.action);let n=e.target.closest(`.kingdom-map`);if(n&&!t){let t=n.getBoundingClientRect(),r=Vo((e.clientX-t.left)/t.width,(e.clientY-t.top)/t.height);this.onMark(r.x,r.z)}}),this.el(`touch`).addEventListener(`pointerdown`,e=>{let t=e.target.closest(`[data-action]`);t&&(e.preventDefault(),this.onAction(t.dataset.action))})}setDevice(e){this.device=e,document.body.dataset.device=e,this.el(`controls`).innerHTML=gl[e](this.keys,this.pad),this.el(`map-key`).textContent=e===`gamepad`?this.pad.map.toUpperCase():this.keys.map,this.el(`map-key`).hidden=e===`touch`,this.hudSignature=``;let t=this.lastPrompt;this.lastPrompt=``,this.prompt(t)}setKeys(e,t=Hs(),n=!1,r=`xbox`){this.keys=e,this.pad=t,this.padStyle=r,this.toggleShield=n,this.el(`touch-shield`).setAttribute(`aria-label`,n?`Shield (tap to raise or lower)`:`Shield (hold)`),this.setDevice(this.device)}get names(){return{keys:this.keys,pad:this.pad,toggleShield:this.toggleShield}}shortcut(e,t){return this.device===`keyboard`?this.keys[e]:this.device===`gamepad`?this.pad[e]:t}say(e){return qs(e,this.device,this.names)}el(e){return document.getElementById(e)}setPanel(e,t=``){let n=e!==this.panel;this.panel=e,e&&document.pointerLockElement&&document.exitPointerLock(),this.el(`panel`).innerHTML=t,this.el(`panel`).className=e?`panel-wrap ${e}${n?` opening`:``}`:``,this.el(`hud`).hidden=e===`title`||!this.inJourney(),this.el(`touch`).hidden=e!==null,this.device===`gamepad`&&e!==`flute`&&this.el(`panel`).querySelector(`button[data-action]`)?.focus({preventScroll:!0})}title(e,t=``,n=!1){let r=document.activeElement?.dataset?.action;this.setPanel(`title`,`<div class="title-top"><span class="small-emblem">✧</span> AN ORIGINAL ADVENTURE <span class="chapter-label">A KINGDOM IN TWO AGES</span></div><div class="title-content${e?` with-journey`:``}"><div class="eyebrow"><span></span> SOME PROMISES OUTLIVE A LIFETIME</div><h1><span>The Bell</span><em>of Ages</em></h1><p>A boy. A forgotten song.<br>A world waiting for you to grow.</p><div class="title-actions">${e?`<button class="primary" data-action="continue"${t?` aria-describedby="journey-summary"`:``}>Continue your journey <span>→</span></button>${t?`<small class="journey-summary" id="journey-summary">${t}</small>`:``}<div class="title-links"><button class="quiet" data-action="new">Begin a new story</button>${n?`<button class="quiet" data-action="journeys">Choose a journey</button>`:``}</div>`:`<button class="primary" data-action="new">Begin your journey <span>→</span></button>`}<div class="title-links"><button class="quiet" data-action="import">Import a journey file</button><button class="quiet" data-action="settings">Settings</button>${vl()?`<button class="quiet" data-action="fullscreen" aria-pressed="${yl()}">${yl()?`Leave full screen`:`Full screen`}</button>`:``}</div></div><div class="title-chapters"><span>01 <i>Wonder</i></span><span>02 <i>The years between</i></span><span>03 <i>Return</i></span></div></div><div class="title-footer"><span>EXPLORE. REMEMBER. BECOME.</span><span>Headphones recommended <span class="tiny-dot">·</span> Keyboard & mouse, gamepad, or touch</span></div>`),this.refocus(r)}journeys(e){let t=document.activeElement?.dataset?.action;this.setPanel(`journeys`,`<div class="sheet journeys-sheet"><button class="close" data-action="close" aria-label="Back to the title">×</button><div class="eyebrow">JOURNEYS</div><h2>Three journeys, one device.</h2><p>Each journey keeps its own story, so several people can play here. Settings are shared.</p><div class="journey-list">${e.map(e=>`<section class="journey-row${e.summary?``:` empty`}" aria-label="Journey ${e.n}"><div><h4>Journey ${e.n}${e.last?` <small>PLAYED LAST</small>`:``}</h4><p>${e.summary??`Empty`}</p></div><div class="journey-buttons">${e.summary?`<button class="primary" data-action="journey-continue-${e.n}" aria-label="Continue journey ${e.n}">Continue <span>→</span></button><button class="quiet" data-action="journey-new-${e.n}" aria-label="Begin a new story in place of journey ${e.n}">Begin again here</button>`:`<button class="primary" data-action="journey-new-${e.n}" aria-label="Begin a new story as journey ${e.n}">Begin a new story <span>→</span></button>`}</div></section>`).join(``)}</div><p class="save-note">Journeys stay in this browser on this device. Export a journey file from the pause menu to keep a copy.</p></div>`),this.refocus(t)}hudSignature=``;hud(e,t,n){let r=[e.age,e.health,e.maxHealth,e.crystals,e.completed.join(`,`),e.talked,e.won,e.story.prologue,e.story.reunited,e.fireflies.join(`,`),t,n].join(`|`);if(r===this.hudSignature)return;this.hudSignature=r,this.el(`age`).textContent=e.age===`child`?`THE FIRST AGE · CHILDHOOD`:`THE SECOND AGE · SEVEN YEARS LATER`;let i=this.el(`hearts`);i.innerHTML=ho(e.health,e.maxHealth).map(e=>`<span class="heart ${e}">♥</span>`).join(``),i.classList.toggle(`low`,go(e.health)),i.setAttribute(`aria-label`,vo(e.health,e.maxHealth)),this.el(`money`).textContent=String(e.crystals),this.el(`relics`).textContent=`${e.completed.length} / 7 relics`,this.el(`region`).textContent=t;let a=Co(e);this.el(`quest-title`).textContent=n?`The sanctuary trial`:a.title,this.el(`quest-detail`).textContent=this.say(n||a.detail).replace(/(\d) \/ (\d)/g,`$1\xA0/\xA0$2`)}lastPrompt=``;prompt(e){e!==this.lastPrompt&&(this.lastPrompt=e,this.el(`prompt`).hidden=!e,this.el(`prompt`).innerHTML=e?`<kbd>${Js(this.device,this.names)}</kbd><span>${e}</span>`:``)}wardenBar(e,t=1){this.el(`boss`).hidden=!e,this.el(`hud`).classList.toggle(`warden-fight`,!!e),e&&(this.el(`boss-name`).textContent=e,this.el(`boss-fill`).style.width=`${t*100}%`)}toast(e,t=4200){this.el(`toast`).textContent=this.say(e),this.el(`toast`).classList.add(`visible`),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.el(`toast`).classList.remove(`visible`),t)}graphicsNotice(e,t=!1){let n=this.el(`graphics-notice`);n.hidden=!e,n.innerHTML=e?`<p>The picture was lost. Waiting for your device to bring it back. Your journey is saved.</p>${t?`<button class="quiet" data-action="reload">Reload the game</button>`:``}`:``}saved(){this.el(`save-indicator`).classList.add(`visible`),setTimeout(()=>this.el(`save-indicator`).classList.remove(`visible`),1800)}dialogue(e,t,n=`close`,r=`Continue`,i=``){this.setPanel(`dialogue`,`<div class="dialogue-box"><div class="eyebrow">${e}</div><p>${this.say(t)}</p><div class="dialogue-buttons"><button class="dialogue-next" data-action="${n}">${r} <span>↵</span></button>${i?`<button class="dialogue-next dialogue-cancel" data-action="close">${i} <span>Esc</span></button>`:``}</div></div>`)}story(e,t,n){let r=e.pages[t],i=t===e.pages.length-1,a=this.say(Ua(e,t,n));this.setPanel(`dialogue`,`<div class="story-heading"><span>${e.chapter}</span><h2>${e.title}</h2></div><div class="dialogue-box story-box" role="dialog" aria-label="${e.title}" aria-live="polite"><div class="story-meta"><div class="eyebrow">${r.speaker}</div><small>${String(t+1).padStart(2,`0`)} / ${String(e.pages.length).padStart(2,`0`)}</small></div><p>${a}</p>${i&&e.choice?`<div class="story-choices"><button data-action="promise-home">“I’ll find my way home.” <span>↵</span></button><button data-action="promise-remember">“I’ll remember us as we are.”</button></div><small class="story-choice-note">Your promise will be remembered. Either choice begins the seven-year crossing.</small>`:`<button class="dialogue-next" data-action="story-next">${i?`Continue the journey`:`Continue`} <span>↵</span></button>`}</div>`),this.el(`hud`).hidden=!0}pause(e,t,n=`Medium`){let r=document.activeElement?.dataset?.action;this.setPanel(`pause`,`<div class="sheet pause-sheet"><div class="eyebrow">A MOMENT BETWEEN ADVENTURES</div><h2>The story waits.</h2><p>${e.age===`child`?`Alder, the young wanderer`:`Alder, keeper of the echoes`} · ${e.completed.length} sanctuaries restored</p><div class="menu-list"><button class="primary" data-action="close">Return to the world <span>→</span></button><div class="menu-pair"><button data-action="journal">Journey & equipment <span>${this.shortcut(`journal`,`▤`)}</span></button><button data-action="map">Map of the kingdom <span>${this.shortcut(`map`,`◎`)}</span></button></div><button data-action="save">Save your journey <span>◇</span></button><div class="menu-pair"><button data-action="export">Export journey file <span>↓</span></button><button data-action="import">Import a file <span>↑</span></button></div><div class="menu-pair"><button data-action="graphics">Graphics <span>${n}</span></button><button data-action="sound">Sound <span>${t?`OFF`:`ON`}</span></button></div>${vl()?`<button data-action="fullscreen" aria-pressed="${yl()}">Full screen <span>${yl()?`ON`:`OFF`}</span></button>`:``}<button data-action="settings">Settings · sound, camera, comfort <span>⚙</span></button><div class="menu-pair"><button data-action="checkpoint">Return to checkpoint <span>${this.device===`keyboard`?this.keys.checkpoint:`↺`}</span></button><button data-action="home">Save & return to title <span>↗</span></button></div></div><div class="help">${_l[this.device](this.keys,this.pad)}</div><p class="save-note">Saves stay in this browser on this device. Export a journey file to keep a copy or move it to another browser.</p></div>`),this.refocus(r)}fidelity(e){let t=nc.indexOf(e);return`<div class="setting-row fidelity-row"><span id="fidelity-label">Graphics fidelity<small>${ic[e]}</small></span><output>${rc[e]}</output></div><div class="fidelity" role="radiogroup" aria-labelledby="fidelity-label" data-slider style="--at:${t}"><i class="fidelity-track"><i class="fidelity-fill"></i></i>${nc.map((n,r)=>`<button role="radio" aria-checked="${n===e}" class="${r<=t?`reached`:``}" data-action="set-fidelity-${n}"><b></b><span>${rc[n]}</span></button>`).join(``)}</div>`}focusFidelity(){let e=this.el(`panel`).querySelector(`.fidelity [aria-checked="true"]`);e?.focus({preventScroll:!0}),e?.closest(`section`)?.scrollIntoView({block:`nearest`})}refocus(e){e&&this.el(`panel`).querySelector(`[data-action="${e}"]`)?.focus({preventScroll:!0})}settings(e,t=null,n=``,r=null,i=``){let a=document.activeElement?.dataset?.action,o=(e,t,n,r=``)=>`<div class="setting-row"><span>${t}${r?`<small>${r}</small>`:``}</span><div class="stepper"><button data-action="set-${e}-down" aria-label="Lower ${t}">−</button><output>${n}</output><button data-action="set-${e}-up" aria-label="Raise ${t}">+</button></div></div>`,s=(e,t,n,r)=>`<button class="setting-row toggle" data-action="toggle-${e}" aria-pressed="${n}"><span>${t}<small>${r}</small></span><b>${n?`ON`:`OFF`}</b></button>`;this.setPanel(`settings`,`<div class="sheet settings-sheet"><button class="close" data-action="pause" aria-label="Back to the ${this.inJourney()?`pause menu`:`title`}">×</button><div class="eyebrow">SETTINGS</div><h2>Make the journey yours.</h2><section><h4>GRAPHICS</h4>${this.fidelity(e.fidelity)}</section><section><h4>SOUND</h4>${o(`master`,`Master volume`,`${e.master}%`)}${o(`effects`,`Effects`,`${e.effects}%`)}${o(`ambience`,`Ambience`,`${e.ambience}%`)}${o(`music`,`Music`,`${e.music}%`)}${s(`muted`,`Mute all sound`,e.muted,``)}</section><section><h4>CAMERA</h4>${o(`sensitivity`,`Camera speed`,`${Math.round(e.sensitivity*100)}%`)}${s(`invertY`,`Invert vertical camera`,e.invertY,``)}${s(`mouseLook`,`Captured mouse look`,e.mouseLook,`Click the scene to capture the pointer. The mouse turns the camera, the left button swings, and the right button holds the shield. Esc releases it`)}${o(`distance`,`Camera distance`,`${Math.round(e.cameraDistance/fc.normal*100)}%`)}${o(`cameraFollow`,`Camera follows`,e.cameraFollow===`auto`?`Automatic · ${tc(`auto`,this.device)?`on`:`off`}`:$s[e.cameraFollow],`The view trails behind you as you walk. Automatic follows with a gamepad or touch, not a keyboard and mouse`)}</section><section><h4>COMFORT</h4>${s(`reducedMotion`,`Reduced motion`,e.reducedMotion,`No hit-stop pauses, camera shake, damage flash, or sliding interface`)}${s(`largeText`,`Larger interface text`,e.largeText,``)}</section><section><h4>COMBAT AIDS</h4>${s(`threatArrows`,`Off-screen attack warnings`,e.threatArrows,`An arrow on the screen edge points to a foe winding up an attack out of view`)}${s(`toggleShield`,`Toggle shield`,e.toggleShield,`One press raises the shield and the next lowers it, instead of holding. A dodge lowers it too`)}</section><section><h4>TOUCH</h4>${s(`touchLeft`,`Left-handed layout`,e.touchLeft,`Thumbstick on the right, buttons on the left`)}${o(`touchSize`,`Button size`,yc[e.touchSize])}</section><section><h4>KEYBOARD</h4><div class="bind-grid">${Os.map(e=>`<button class="setting-row bind${t===e?` capturing`:``}" data-action="bind-${e}" aria-label="${As[e]}: ${t===e?`press a key`:this.keys[e]}"><span>${As[e]}</span><kbd>${t===e?`Press a key`:this.keys[e]}</kbd></button>`).join(``)}</div><p class="bind-note" role="status">${n||`Choose an action, then press its new key. Esc cancels. Escape, the arrow keys, and 1 to 3 stay as they are.`}</p><button class="setting-row toggle" data-action="bind-reset"><span>Reset keys to defaults</span><b>↺</b></button></section><section><h4>GAMEPAD</h4>${o(`padStyle`,`Button names`,e.padStyle===`auto`?`Automatic · ${ps[this.padStyle]}`:ps[e.padStyle])}<div class="bind-grid">${ls.map(e=>`<button class="setting-row bind${r===e?` capturing`:``}" data-action="padbind-${e}" aria-label="${ds[e]}: ${r===e?`press a button`:this.pad[e]}"><span>${ds[e]}</span><kbd>${r===e?`Press a button`:this.pad[e]}</kbd></button>`).join(``)}</div><p class="bind-note pad-note" role="status">${i||`Choose an action, then press its new button on the gamepad. ${this.pad.pause} cancels. ${this.pad.pause}, menus (${this.pad.confirm}, ${this.pad.back}, D-pad), and the flute's notes stay as they are.`}</p><button class="setting-row toggle" data-action="padbind-reset"><span>Reset buttons to defaults</span><b>↺</b></button>${s(`vibration`,`Controller vibration`,e.vibration,`A short rumble when you're hit, guard a blow, land a sword hit, or feel a heavy impact`)}</section><div class="menu-list"><button class="primary" data-action="pause">Back <span>←</span></button></div><p class="save-note">Settings stay in this browser and apply to every journey.</p></div>`),this.refocus(a)}journal(e){let t=Co(e),n=Ha(e);this.setPanel(`journal`,`<div class="sheet wide"><button class="close" data-action="close" aria-label="Close journal">×</button><div class="eyebrow">THE WANDERER’S JOURNAL</div><h2>A promise, kept.</h2><div class="journal-layout"><section><h3>${t.title}</h3><p>${this.say(t.detail)}</p><blockquote>“When the last bell falls silent, listen for the small things that still sing.”</blockquote><div class="equipment"><h4>IN YOUR SATCHEL</h4><p>⚔ ${e.story.prologue<4?`No blade yet`:e.sword===3?`Star-forged blade`:e.age===`adult`?`Keeper’s longsword`:`Practice sword`} <small>${e.sword} damage</small></p><p>◈ ${e.story.prologue<4?`Visit Soren for equipment`:`Oak shield`} <small>${this.say(`{Shield}`)}</small></p><p>♫ Reed flute <small>${this.say(`{Flute}`)}</small></p><p>▣ Treasure chests <small>${e.chests.length} / ${Eo.length}</small></p><p>✧ Wandering lights <small>${e.fireflies.length} / 3</small></p><p>✎ Hidden carvings <small>${e.carvings.length} / 7</small></p></div><p class="journal-tip">Mira is looking for three lights near the orchard, Whisperwood path, and coastal road. The smith can temper your sword for 60 crystals.</p></section><section class="relic-list">${Ka.map(t=>`<div class="relic-row ${e.completed.includes(t.id)?`complete`:``}"><span>${e.completed.includes(t.id)?`✦`:`◇`}</span><div><h4>${t.name}</h4><p>${t.region} · ${t.age===`child`?`First age`:`Second age`}</p></div><small>${e.completed.includes(t.id)?`RESTORED`:t.age===e.age?`UNDISCOVERED`:`ANOTHER AGE`}</small></div>`).join(``)}</section></div><section class="story-journal"><h3>What I remember</h3>${e.story.promise?`<p class="promise-entry">My promise to Mira: “${e.story.promise===`home`?`I’ll find my way home.`:`I’ll remember us as we are.`}”</p>`:``}${n.length?n.map(e=>`<details><summary>${e.title}</summary>${e.pages.map(e=>`<p><b>${e.speaker}</b><br>${this.say(e.text)}</p>`).join(``)}</details>`).join(``):`<p>The first page is still waiting.</p>`}</section><section class="story-journal carvings"><h3>Carvings in hidden places</h3>${e.carvings.length?Ka.filter(t=>e.carvings.includes(t.id)&&Va[t.id]).map(e=>`<details><summary>${Va[e.id].title} <small>${e.name}</small></summary><p>${Va[e.id].text}</p></details>`).join(``):`<p>Some sanctuary walls sound hollow. Listen for them in the guardian halls.</p>`}</section></div>`)}map(e,t,n,r){let i=document.activeElement?.dataset?.action,a=e=>(e+145)/290*100,o=e=>`left:${a(e.x)}%;top:${a(e.z)}%`,s=t=>!!e.marker&&Math.hypot(e.marker.x-t.x,e.marker.z-t.z)<1,c=(e,t,n)=>`<button class="map-point ${t}${s(Ao[e])?` marked`:``}" data-action="mark-${e}" style="${o(Ao[e])}" aria-label="${Ao[e].name}: ${s(Ao[e])?`clear your marker`:`set your marker here`}">${n}</button>`,l={keyboard:`Click anywhere on the map, or choose a place, to set your marker. Choose it again to clear it.`,gamepad:`Choose a place with the D-pad and ${this.pad.confirm} to set your marker. Choose it again to clear it.`,touch:`Tap anywhere on the map, or a place, to set your marker. Tap it again to clear it.`}[this.device];this.setPanel(`map`,`<div class="sheet map-sheet"><button class="close" data-action="close" aria-label="Close map">×</button><div class="eyebrow">A MAP OF WHAT REMAINS</div><h2>The kingdom of Aevora</h2><div class="kingdom-map"><div class="map-compass">N<br>↑</div><div class="map-road vertical"></div>${Ka.map(t=>c(t.id,`${e.completed.includes(t.id)?`restored`:``} ${t.age===e.age?``:`other-age`}`,`<span>${e.completed.includes(t.id)?`✦`:`◇`}</span><b>${t.region}</b><small>${t.name}${e.carvings.includes(t.id)?` <em class="map-carving" title="Hidden carving found">✎</em>`:``}</small>`)).join(``)}${ko(e).map(e=>`<button class="map-find ${e.kind}${e.found?` found`:``}${s(e)?` marked`:``}" data-find="${e.id}" data-action="mark-${e.id}" style="${o(e)}" title="${e.kind===`chest`?e.found?`Treasure chest · opened`:`Treasure chest · not yet opened`:e.found?`Wandering light · caught`:`Wandering light · still loose`}" aria-label="${e.kind===`chest`?`Treasure chest`:`Wandering light`}: ${s(e)?`clear your marker`:`set your marker here`}"></button>`).join(``)}${c(`village`,`village`,`<span>⌂</span><b>Alder Village</b>`)}${c(`bell`,`sanctuary`,`<span>♧</span><b>Bell Sanctuary</b>`)}${r?`<div class="story-map-pin" style="${o(r)}" title="${r.name}">◇</div>`:``}${e.marker?`<div class="marker-pin" style="${o(e.marker)}" title="Your marker"></div>`:``}<div class="player-pin" style="left:${a(t)}%;top:${a(n)}%" title="You are here"></div><span class="map-sea">THE LARK SEA</span></div><div class="map-legend"><span><i class="legend-you"></i> You are here</span><span>◇ Sanctuary</span><span>✦ Restored</span><span>Faded · Another age</span><span><i class="legend-find chest found"></i> Chest opened</span><span><i class="legend-find chest"></i> Chest seen</span><span><i class="legend-find light found"></i> Light caught</span><span><i class="legend-find light"></i> Light seen</span><span>✎ Carving found</span><span><i class="legend-marker"></i> Your marker</span></div><p class="save-note">${r?`Destination: ${r.name} · the gold ring on your nearby map, and the arrow under the region name. `:``}${l}</p>${e.marker?`<div class="menu-list map-actions"><button data-action="mark-clear">Clear your marker <span>✕</span></button></div>`:``}</div>`),this.refocus(i)}flute(e,t){let n=Ys(this.device,this.pad);this.setPanel(`flute`,`<div class="sheet flute-sheet"><button class="close" data-action="close" aria-label="Put away flute">×</button><div class="eyebrow">THE REED FLUTE</div><h2>Let the world listen.</h2><p>${e.length?`Echo the inscription at this altar.`:`A small song for a wide world.`}</p><div class="notes">${[1,2,3].map(e=>`<button data-action="note-${e}"><span>${[``,`●`,`◒`,`○`][e]}</span><b>${[``,`Low`,`Middle`,`High`][e]}</b>${n?`<kbd>${n[e-1]}</kbd>`:``}</button>`).join(``)}</div><div class="played-notes">${t.length?t.map(e=>[``,`●`,`◒`,`○`][e]).join(`　`):`—　—　—`}</div><p class="save-note">${e.length?`Inscription: ${e.map(e=>[``,`low`,`middle`,`high`][e]).join(` · `)}`:{keyboard:`Number keys 1, 2, 3 to play · Esc to put away`,gamepad:`${this.pad.low}, ${this.pad.middle}, ${this.pad.high} to play · ${this.pad.back} to put away`,touch:`Tap a note to play · × to put away`}[this.device]}</p></div>`)}ending(e){this.setPanel(`ending`,`<div class="sheet ending-sheet"><div class="eyebrow">THE PROMISE YOU KEPT</div><div class="ending-symbol">✧</div><h2>A place<br>at the table.</h2><p>${e.story.promise===`remember`?`Mira opens her book at the first page. Together, you begin with the years you missed.`:`Mira moves a chair closer to the fire. This time, you are here to stay for supper.`}</p><p>Your father’s lantern hangs beside the door.<br>Tomorrow, you will mend its crooked handle.</p><button class="primary" data-action="close">Stay a little longer <span>→</span></button><small>THE BELL OF AGES · THE END</small></div>`)}},xl=new ut(1,0),Sl=new Xe,Cl=new W,wl=new W,Tl=new D,El=new G,Dl=new W(0,1,0),Ol=new W,kl=class{capacity;mesh;life;max;size;position;velocity;next=0;alive=0;density=1;constructor(e=192){this.capacity=e;let t=new $e({color:`#ffffff`,roughness:.6,emissive:`#ffffff`,emissiveIntensity:1});t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`vec3 totalEmissiveRadiance = emissive;`,`float heat = clamp((max(vColor.r, max(vColor.g, vColor.b)) - min(vColor.r, min(vColor.g, vColor.b))) * 1.8, 0., 1.);
vec3 totalEmissiveRadiance = emissive * mix(vColor.rgb * .65, vColor.rgb * vColor.rgb * 1.9, heat);`).replace(`#include <color_fragment>`,`#include <color_fragment>
diffuseColor.rgb *= 1. - .75 * heat;`)},this.mesh=new u(xl,t,e),this.mesh.instanceMatrix.setUsage(i),this.mesh.setColorAt(0,El.set(`#ffffff`)),this.mesh.instanceColor.setUsage(i),this.mesh.frustumCulled=!1,this.mesh.visible=!1,this.mesh.userData.sharedGeometry=!0,this.life=new Float32Array(e),this.max=new Float32Array(e),this.size=new Float32Array(e),this.position=new Float32Array(e*3),this.velocity=new Float32Array(e*3),Sl.makeScale(0,0,0);for(let t=0;t<e;t++)this.mesh.setMatrixAt(t,Sl)}burst(e,t,n,r,i){El.set(r),i=Math.round(i*this.density);for(let r=0;r<i;r++){let r=this.next;this.next=(this.next+1)%this.capacity,this.life[r]<=0&&this.alive++,this.size[r]=.07+Math.random()*.05;let i=.45+Math.random()*.5;this.life[r]=i,this.max[r]=i,this.position.set([e,t,n],r*3),this.velocity.set([(Math.random()-.5)*6,Math.random()*4,(Math.random()-.5)*6],r*3),this.mesh.setColorAt(r,El)}this.mesh.instanceColor.needsUpdate=!0,this.mesh.visible=!0}update(e){if(this.alive){for(let t=0;t<this.capacity;t++){if(this.life[t]<=0)continue;this.life[t]-=e;let n=t*3;this.velocity[n+1]-=e*6,this.position[n]+=this.velocity[n]*e,this.position[n+1]+=this.velocity[n+1]*e,this.position[n+2]+=this.velocity[n+2]*e,this.life[t]<=0&&(this.life[t]=0,this.alive--);let r=this.size[t]*Math.max(0,this.life[t]/this.max[t]);Cl.fromArray(this.position,n),Ol.fromArray(this.velocity,n);let i=Ol.length();i>1e-4?Tl.setFromUnitVectors(Dl,Ol.divideScalar(i)):Tl.identity(),Sl.compose(Cl,Tl,wl.set(r*.8,r*(1+i*.22),r*.8)),this.mesh.setMatrixAt(t,Sl)}this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.visible=this.alive>0}}clear(){this.life.fill(0),this.alive=0,Sl.makeScale(0,0,0);for(let e=0;e<this.capacity;e++)this.mesh.setMatrixAt(e,Sl);this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.visible=!1}};function Al(e,t){let n=null,r=1/0;for(let i of t){let t=Math.hypot(i.x-e.x,i.z-e.z);t<r&&(n=i,r=t)}return n}function jl(e,t,n,r){let i=t.x-e.x,a=t.z-e.z,o=null,s=1/0;for(let c of n){if(c===t)continue;let n=c.x-e.x,l=c.z-e.z,u=Math.atan2(i*l-a*n,i*n+a*l)*r;u>1e-4&&u<s&&(o=c,s=u)}return o}function Ml(e,t,n,r){let i=e.z>1,a=(i?-e.x:e.x)*(t/2),o=(i?e.y:-e.y)*(n/2),s=!i&&Math.abs(e.x)<=1&&Math.abs(e.y)<=1;i&&Math.hypot(a,o)<1&&(o=n/2);let c=Math.atan2(o,a);if(!s){let e=Math.max(1,t/2-r),i=Math.max(1,n/2-r),s=Math.min(e/Math.max(Math.abs(a),1e-6),i/Math.max(Math.abs(o),1e-6));a*=s,o*=s}return{x:t/2+a,y:n/2+o,onScreen:s,angle:c}}function Nl(e,t){return Math.atan2(Math.sin(t-e),Math.cos(t-e))}var Pl=.6;function Fl(e,t,n,r){return-(e*Math.cos(n)-t*Math.sin(n))/Math.max(1,r)*Pl}var Il=.62;function Ll(e){let t=Math.min(1,Math.max(0,(e-1)/1.2));return .25+.75*t*t*(3-2*t)}function Rl(e,t,n){return e||t===`Alder Village`&&n<1.6?`stone`:n<2.4?`path`:t===`Saffron Wastes`||t===`Larkwater Coast`?`sand`:t===`Frostveil Heights`?`snow`:`grass`}function zl(e,t){return Math.max(0,Math.floor(t/Math.PI)-Math.floor(e/Math.PI))}function Bl(e,t,n){if(n)return{notes:[110,130.81,146.83],type:`sine`,every:4.2,accent:`drips`};switch(e){case`Whisperwood`:return{notes:[146.83,174.61,220,261.63],type:`triangle`,every:3.6,accent:`birds`};case`Larkwater Coast`:return{notes:[196,246.94,293.66],type:`sine`,every:4.4,accent:`waves`};case`Cinderpeak`:case`Saffron Wastes`:return{notes:[73.42,98,110],type:`sine`,every:4.8,accent:`wind`};case`Frostveil Heights`:return{notes:[587.33,739.99,880,987.77],type:`sine`,every:3.4,accent:`chimes`};case`Mourning Fen`:return{notes:[130.81,155.56,196],type:`triangle`,every:4,accent:`drips`};case`Crownfall`:return{notes:[98,116.54,146.83],type:`sine`,every:5,accent:`chimes`};default:return{notes:t?[146.83,174.61,220,261.63]:[146.83,185,220,293.66,329.63],type:`sine`,every:3.2,accent:t?null:`birds`}}}var Vl=class{ctx=null;gains={effects:1,ambience:1,music:1};timer=0;accentTimer=2;beat=0;beatTimer=0;stats={};configure(e){this.gains.effects=Sc(e,`effects`),this.gains.ambience=Sc(e,`ambience`),this.gains.music=Sc(e,`music`)}start(){this.ctx||=new AudioContext,this.ctx.resume().catch(()=>{})}suspend(){this.ctx?.state===`running`&&this.ctx.suspend().catch(()=>{})}wake(){this.ctx&&this.ctx.state!==`running`&&this.ctx.state!==`closed`&&this.ctx.resume().catch(()=>{})}count(e){this.stats[e]=(this.stats[e]??0)+1}tone(e,t=.3,n=`sine`,r=.055,i=0,a=`effects`,o=0,s=`tone`){if(r*=this.gains[a],r<=0||!this.ctx)return;this.count(s);let c=this.ctx.currentTime+i,l=this.ctx.createOscillator(),u=this.ctx.createGain();l.type=n,l.frequency.setValueAtTime(e,c),o>0&&l.frequency.exponentialRampToValueAtTime(o,c+t*.8),u.gain.setValueAtTime(0,c),u.gain.linearRampToValueAtTime(r,c+Math.min(.02,t/4)),u.gain.exponentialRampToValueAtTime(1e-4,c+t),l.connect(u),u.connect(this.ctx.destination),l.start(c),l.stop(c+t)}note(e){this.tone([0,293.66,369.99,440][e],.7,`sine`,.13),this.tone([0,587.32,739.99,880][e],.4,`sine`,.015)}chime(){[293.66,369.99,440,587.32].forEach((e,t)=>this.tone(e,.9,`sine`,.09,t*.12))}hit(){this.noise(.075,480,.7,.1),this.tone(85,.1,`triangle`,.065)}noise(e,t,n,r,i={}){if(r*=this.gains[i.bus??`effects`],r<=0||!this.ctx)return;this.count(i.tag??`noise`);let a=this.ctx,o=a.currentTime+(i.delay??0),s=a.createBuffer(1,Math.ceil(a.sampleRate*e),a.sampleRate),c=s.getChannelData(0);for(let e=0;e<c.length;e++)c[e]=(Math.random()*2-1)*(1-e/c.length);let l=a.createBufferSource(),u=a.createBiquadFilter(),d=a.createGain();l.buffer=s,u.type=i.filter??`bandpass`,u.frequency.value=t,u.Q.value=n,i.swell?(d.gain.setValueAtTime(1e-4,o),d.gain.linearRampToValueAtTime(r,o+i.swell)):d.gain.setValueAtTime(r,o),d.gain.exponentialRampToValueAtTime(1e-4,o+e),l.connect(u),u.connect(d),d.connect(a.destination),l.start(o),l.stop(o+e)}swing(e){this.noise(.18,e===2?1800:1150,.6,.12)}clang(){for(let[e,t]of[[740,.055],[1193,.026],[1879,.015]])this.tone(e,.21,`sine`,t);this.noise(.045,2400,1,.1)}lastSurface=null;step(e){this.lastSurface=e;let t={stone:[1700,2.2,.05,.045],path:[900,1.2,.035,.06],grass:[2600,.7,.02,.07],sand:[1300,.8,.03,.08],snow:[700,1.6,.035,.09]}[e];this.noise(t[3],t[0]*(.9+Math.random()*.2),t[1],t[2],{tag:`step`}),e===`stone`&&this.tone(160+Math.random()*30,.05,`triangle`,.012,0,`effects`,0,`step`)}heartbeat(e=3){for(let t=0;t<e;t++){let e=.25+t*.85;this.tone(64,.16,`sine`,.09,e,`effects`,46,`heartbeat`),this.tone(56,.2,`sine`,.065,e+.19,`effects`,42,`heartbeat`)}}ui(){this.tone(1320,.05,`sine`,.025,0,`effects`,0,`ui`)}focus(){this.tone(1760,.035,`sine`,.011,0,`effects`,0,`focus`)}pickup(){this.tone(1174.66,.18,`sine`,.035,0,`effects`,0,`pickup`),this.tone(1567.98,.22,`sine`,.025,.07,`effects`,0,`pickup`)}ambient(e,t,n=``,r=!1){let i=Bl(n,t,r);if(this.timer-=e,this.accentTimer-=e,this.timer<=0&&(this.timer=i.every,this.tone(i.notes[Math.floor(Math.random()*i.notes.length)],3,i.type,.025,0,`ambience`,0,`ambient`)),this.accentTimer>0||!i.accent)return;this.accentTimer=2.5+Math.random()*3.5;let a={bus:`ambience`,tag:`accent`};if(i.accent===`birds`)for(let e=0;e<2+Math.floor(Math.random()*2);e++)this.tone(2400+Math.random()*900,.12,`sine`,.012,e*.16,`ambience`,3300,`accent`);else i.accent===`waves`?this.noise(2.6,500,.4,.05,{...a,filter:`lowpass`,swell:1.1}):i.accent===`wind`?this.noise(3,380,.8,.03,{...a,swell:1.4}):i.accent===`drips`?this.tone(1500+Math.random()*500,.16,`sine`,.018,0,`ambience`,900,`accent`):[1318.51,1567.98].forEach((e,t)=>this.tone(e,1.2,`sine`,.01,t*.22,`ambience`,0,`accent`))}battle(e,t){if(!t){this.beat=0,this.beatTimer=0;return}if(this.beatTimer-=e,this.beatTimer>0)return;this.beatTimer=.62;let n=this.beat%4==0;this.beat++,this.tone(n?70:58,.32,`sine`,n?.11:.07,0,`music`,38,`drum`),this.beat%4==3&&this.noise(.12,900,.9,.035,{bus:`music`,tag:`drum`})}},Hl=yt({Game:()=>tu});function Ul(e,t,n=!0){let r=ht(e.map(([e,n])=>new s(e,n,t)));return n?r.rotateX(-Math.PI/2):r}function Wl(){let e=(e,t,n,r)=>new B(e,t).rotateX(-Math.PI/2).translate(n,0,r);return ht([e(.12,1.08,-.56,0),e(.12,1.08,.56,0),e(1,.04,0,-.52),e(1,.04,0,.52)])}var Gl={plane:new B(1,1).rotateX(-Math.PI/2),ring:new s(.9,1,56).rotateX(-Math.PI/2),disc:new _e(1,40).rotateX(-Math.PI/2),stone:new ut(.32,1),planeEdge:Wl(),ringEdge:Ul([[.86,.9],[1,1.04]],56),discEdge:Ul([[1,1.09]],40),slamEdge:Ul([[1.56,1.7],[2,2.14]],40,!1),wardenSlamEdge:Ul([[3.44,3.6],[4,4.16]],40,!1)};function Kl(e,t){let n=new L(e,new Se({color:`#1e1309`,transparent:!0,opacity:0,side:2,depthWrite:!1}));n.name=`edge`,n.userData.sharedGeometry=!0,n.userData.skipAO=!0,n.renderOrder=1,t.add(n)}function ql(e,t){e.material.opacity=t;let n=e.getObjectByName(`edge`);n&&(n.material.opacity=ns(t))}function Jl(e,t,n,r){let i=new L(e,new Se({color:n,transparent:!0,opacity:0,side:2,depthWrite:!1}));return i.userData.sharedGeometry=!0,i.userData.skipAO=!0,i.renderOrder=2,i.visible=!1,t&&Kl(t,i),r.add(i),i}var Yl=-1.2,Xl=.65,Zl=.62,Ql=.14,$l=new W(-4,2.8,44);function eu(){return matchMedia(`(pointer: coarse)`).matches&&!matchMedia(`(any-pointer: fine)`).matches}var tu=class{scene=new S;camera=new a(52,innerWidth/innerHeight,.1,650);renderer;worldRenderer;quality;sky=pl();hemisphere=new O(`#d8eceb`,`#879777`,1.9);fill=new o(`#f4e3c2`,.9);review=new URLSearchParams(location.search).has(`review`);inspectMode=!1;renderTimes=[];shadowClock=0;ui=new bl;sound=new Vl;save=to();world;hero=nl();sun=new o(`#ffe2ab`,3.1);keys=new Set;enemies=[];sparks=new kl;started=!1;elapsed=0;last=0;hudTime=0;saveTime=0;region=`Alder Village`;yaw=0;heroFade=1;destination=null;compassAngle=NaN;pitch=.26;padId=``;activePad=null;rumbling=null;rumbleUntil=0;recentering=!1;cameraIdle=0;pinching=!1;distance=7.6;attackTime=0;collision=new Yi([]);movingBlock=null;blockPush=0;blockSlide=null;attackElapsed=-1;combo=0;attackQueued=!1;hitEnemies=new Set;recoil=-1;recoilPose=null;hitStop=0;gait=0;walkBlend=0;guardBlend=0;trailHistory=[];trailVertices=new Float32Array(126);trailColors=new Float32Array(168);trailFade=0;bladeBase=new W;bladeTip=new W;dodgeTime=0;dodgeCooldown=0;invulnerable=0;hurt=0;target=null;dragSwitch=0;padFlick=0;move=new W;velocity=new W;puzzleProgress=0;puzzleSolved=!1;arenaClear=!1;crackHits=0;crackBroken=!1;bossDead=!1;mirrorTurns=[1,2,3];torchStates=[!1,!1,!1];notes=[];currentInteraction=null;dragging=!1;pointerMoved=!1;lastPointer={x:0,y:0};trail;storageOK=!0;pendingImport=null;journey=1;pendingPlace=1;frameTimes=[];settings=xc(null);padMove={x:0,y:0};padHeld=[];padShield=!1;padNav=0;touchMove={x:0,y:0};touchShield=!1;mouseShield=!1;binding=null;padBinding=null;shieldUp=!1;keyLayout;environment;lostGraphics=!1;veilTime=0;veil=document.getElementById(`veil`);appliedFidelity;lostTimer=0;constructor(){this.ui.inJourney=()=>this.started;let e=document.querySelector(`#world`);this.renderer=new Li({canvas:e,antialias:!0,powerPreference:`high-performance`}),this.renderer.setSize(innerWidth,innerHeight),this.quality=new hl(this.renderer),eu()&&(this.quality.touchCap=1.25),this.worldRenderer=new Na(this.renderer,this.scene,this.camera),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=1,this.renderer.shadowMap.autoUpdate=!1,this.renderer.outputColorSpace=Ae,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=.92,this.buildEnvironment(),this.scene.environmentIntensity=.32,this.scene.background=new G(`#cbd2b3`),this.scene.fog=new x(`#cbd2b3`,65,195),this.fill.position.set(25,35,70),this.scene.add(this.hemisphere,this.sky,this.fill),this.sun.position.set(-45,70,-20),this.sun.target.position.set(0,0,35),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),Object.assign(this.sun.shadow.camera,{left:-42,right:42,top:42,bottom:-42,near:1,far:160}),this.sun.shadow.bias=-35e-5,this.sun.shadow.normalBias=.025,this.scene.add(this.sun,this.sun.target);let t=new he;t.setAttribute(`position`,new We(this.trailVertices,3).setUsage(i)),t.setAttribute(`color`,new We(this.trailColors,4).setUsage(i)),t.setDrawRange(0,0),this.trail=new L(t,new Se({color:new G(1.35,1.28,1.12),vertexColors:!0,side:2,transparent:!0,opacity:Zl,depthWrite:!1})),this.trail.frustumCulled=!1,this.trail.userData.skipAO=!0,this.trail.visible=!1,this.scene.add(this.trail,this.sparks.mesh),this.scene.add(this.hero.group),this.loadWorld(),this.hero.group.position.set(0,$(0,57),57),this.camera.position.set(34,22,84),this.camera.lookAt(-4,2.8,44),this.loadSettings(),eu()&&this.setDevice(`touch`),this.watchForCrash(),this.showTitle(),this.ui.onAction=e=>{this.started&&this.sound.ui(),this.action(e)},this.ui.onMark=(e,t)=>{this.ui.panel===`map`&&(this.sound.ui(),this.setMarker({x:e,z:t}))},this.bindInput(),e.addEventListener(`webglcontextlost`,()=>this.graphicsLost()),e.addEventListener(`webglcontextrestored`,()=>this.graphicsRestored()),window.addEventListener(`resize`,()=>{this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(innerWidth,innerHeight)}),document.addEventListener(`visibilitychange`,()=>{document.hidden&&(this.sound.suspend(),this.started&&(this.persist(!1),this.ui.panel||this.action(`pause`)))}),window.addEventListener(`pagehide`,()=>this.persist(!1)),document.addEventListener(`pointerlockchange`,()=>{this.captured()||(this.mouseShield=!1,this.settings.mouseLook&&this.started&&!this.ui.panel&&this.ui.toast(`Mouse released. Click the scene to capture it again.`))}),document.addEventListener(`fullscreenchange`,()=>{this.ui.panel===`title`?this.showTitle():this.ui.panel===`pause`&&this.ui.pause(this.save,this.settings.muted,this.quality.label)}),window.addEventListener(`beforeunload`,()=>this.persist(!1)),this.expose(),requestAnimationFrame(e=>this.frame(e))}buildEnvironment(){let e=new Ut(this.renderer),t=new Pa;this.environment?.dispose(),this.environment=e.fromScene(t,.04),this.scene.environment=this.environment.texture,t.dispose(),e.dispose()}graphicsLost(){this.lostGraphics=!0,this.persist(!1),this.started&&!this.ui.panel&&this.action(`pause`),this.ui.graphicsNotice(!0),clearTimeout(this.lostTimer),this.lostTimer=window.setTimeout(()=>{this.lostGraphics&&this.ui.graphicsNotice(!0,!0)},5e3)}graphicsRestored(){this.lostGraphics=!1,clearTimeout(this.lostTimer),this.buildEnvironment(),this.renderer.shadowMap.needsUpdate=!0,this.ui.graphicsNotice(!1),this.last=0}loadSettings(){let e=matchMedia(`(prefers-reduced-motion: reduce)`).matches,t=cc(eu(),Math.min(screen.width,screen.height));try{this.settings=xc(localStorage.getItem(uc),e,localStorage.getItem(ac),t)}catch{this.settings=xc(null,e,null,t)}this.applySettings()}watchForCrash(){if(this.review)return;let e=`bell-of-ages-on-screen`,t=t=>{try{t?sessionStorage.setItem(e,`1`):sessionStorage.removeItem(e)}catch{}},n=!1;try{n=sessionStorage.getItem(e)===`1`}catch{}if(t(!document.hidden),document.addEventListener(`visibilitychange`,()=>t(!document.hidden)),window.addEventListener(`pagehide`,()=>t(!1)),window.addEventListener(`pageshow`,()=>t(!document.hidden)),!n)return;let r=lc(this.settings.fidelity);r!==this.settings.fidelity&&(this.settings.fidelity=r,this.applySettings(!0)),this.ui.toast(`The last visit closed unexpectedly, perhaps short of memory. Graphics are now ${this.quality.label}; Settings can change them. Your journey continues from its last save.`,1e4)}applySettings(e=!1){if(this.sound.configure(this.settings),this.applyFidelity(),this.distance=this.settings.cameraDistance,this.ui.setKeys(zs(this.settings.keys,this.keyLayout),Hs(this.settings.pad,this.padStyle()),this.settings.toggleShield,this.padStyle()),document.body.classList.toggle(`reduced-motion`,this.settings.reducedMotion),document.body.classList.toggle(`large-text`,this.settings.largeText),document.body.classList.toggle(`touch-left`,this.settings.touchLeft),document.body.dataset.touchSize=String(this.settings.touchSize),e)try{localStorage.setItem(uc,JSON.stringify(this.settings))}catch{}}applyFidelity(e=!1){let t=this.settings.fidelity;if(!e&&t===this.appliedFidelity)return;this.appliedFidelity=t,this.quality.set(t);let n=this.quality.profile;this.worldRenderer.configure(n),this.sun.shadow.mapSize.x!==n.shadowSize&&(this.sun.shadow.mapSize.set(n.shadowSize,n.shadowSize),this.sun.shadow.map?.dispose(),this.sun.shadow.map=null),this.sun.shadow.radius=n.shadowRadius,this.renderer.shadowMap.needsUpdate=!0,this.sparks.density=n.sparks,this.filterTextures()}filterTextures(){let e=Math.min(this.quality.profile.anisotropy,this.renderer.capabilities.getMaxAnisotropy()),t=new Set;this.scene.traverse(n=>{let r=n.material;if(r)for(let n of Array.isArray(r)?r:[r])for(let r of Object.values(n))r instanceof re&&!t.has(r)&&(t.add(r),r.anisotropy!==e&&(r.anisotropy=e,r.needsUpdate=!0))})}padStyle(){return _s(this.settings.padStyle,this.padId)}captureKey(e){let t=this.binding,n=As[t],r=e=>Rs(e,this.keyLayout),i;if(this.binding=null,e===`Escape`)i=`${n} stays on ${r(this.settings.keys[t])}.`;else{let a=Is(this.settings.keys,t,e);a?(this.settings.keys=a.keys,this.applySettings(!0),i=`${n} is now ${r(e)}.`,a.swapped&&(i+=` ${As[a.swapped]} moved to ${r(a.keys[a.swapped])}.`),this.sound.ui()):(this.binding=t,i=`${r(e)} is kept for the menu, camera, or flute. Choose another key, or Esc to cancel.`)}this.ui.settings(this.settings,this.binding,i)}capturePad(e){let t=this.padBinding,n=ds[t],r;this.padBinding=null;let i=e===Z.Start?null:Ss(this.settings.pad,t,e),a=e=>ys(e,this.padStyle());i?(this.settings.pad=i.pad,this.applySettings(!0),r=`${n} is now ${a(e)}.`,i.swapped&&(r+=` ${ds[i.swapped]} moved to ${a(i.pad[i.swapped])}.`),this.sound.ui()):r=`${n} stays on ${a(this.settings.pad[t])}.`,this.ui.settings(this.settings,null,``,null,r)}changeSetting(e){let t=this.settings,[,n,r]=e.split(`-`),i=r===`up`?1:-1;if(e.startsWith(`toggle-`))(n===`muted`||n===`invertY`||n===`mouseLook`||n===`reducedMotion`||n===`largeText`||n===`threatArrows`||n===`toggleShield`||n===`touchLeft`||n===`vibration`)&&(t[n]=!t[n]),this.raiseShield(!1);else if(n===`sensitivity`)t.sensitivity=_c(t.sensitivity+i*dc);else if(n===`touchSize`)t.touchSize=bc(t.touchSize+i);else if(n===`padStyle`){let e=fs.length;t.padStyle=fs[(fs.indexOf(t.padStyle)+i+e)%e]}else if(n===`cameraFollow`){let e=Qs.length;t.cameraFollow=Qs[(Qs.indexOf(t.cameraFollow)+i+e)%e]}else n===`fidelity`?t.fidelity=sc(r,t.fidelity):n===`distance`?t.cameraDistance=vc(t.cameraDistance+i*fc.step):(n===`master`||n===`effects`||n===`ambience`||n===`music`)&&(t[n]=gc(t[n]+i*10,t[n]));this.applySettings(!0),this.sound.start(),n===`ambience`?this.sound.tone(220,1.2,`sine`,.05,0,`ambience`):n===`music`?this.sound.tone(70,.4,`sine`,.11,0,`music`,38):(n===`master`||n===`effects`||n===`muted`&&!t.muted)&&this.sound.note(2),this.ui.settings(t)}showTitle(){let e=this.keptJourneys(),t=$a(this.lastJourney(),e),n=t?this.readSave(t):null;this.ui.title(!!n,n?yo(n):``,e.length>1)}keptJourneys(){return Ya.filter(e=>this.readSave(e))}lastJourney(){try{return Qa(localStorage.getItem(Za))}catch{return 1}}showJourneys(){let e=$a(this.lastJourney(),this.keptJourneys());this.ui.journeys(Ya.map(t=>{let n=this.readSave(t);return{n:t,summary:n?yo(n):null,last:t===e}}))}readSave(e=this.journey){if(this.review)return null;try{return oo(localStorage.getItem(Xa(e)))}catch{return this.storageOK=!1,null}}syncPosition(){this.save.visit=this.currentVisit(),this.world.dungeon||(this.save.position={x:this.hero.group.position.x,z:this.hero.group.position.z})}currentVisit(){let e=this.world.dungeon;return e?{id:e.id,puzzle:this.puzzleSolved,fallen:this.enemies.filter(e=>!e.boss).flatMap((e,t)=>e.state===`dead`?[t]:[]),seal:this.arenaClear,wall:this.crackBroken,warden:this.bossDead}:null}resumeVisit(e){let t=Ka.find(t=>t.id===e.id);this.loadWorld(t);let n=this.enemies.filter(e=>!e.boss);for(let t of e.fallen){let e=n[t];e&&(e.state=`dead`,e.mesh.visible=!1)}if(e.puzzle&&this.showSolved(),e.seal&&(this.arenaClear=!0,this.world.gates[1].visible=!1),e.wall&&this.setCrackBroken(!0),e.warden){let e=this.enemies.find(e=>e.boss);e.state=`dead`,e.mesh.visible=!1,this.bossDead=!0,this.world.interactables.find(e=>e.kind===`relic`).mesh.visible=!0}this.restartChamber(),this.renderer.shadowMap.needsUpdate=!0,e.puzzle&&this.ui.toast(`${t.name} · Your progress here holds.`)}showSolved(){let e=this.world.dungeon;this.puzzleSolved=!0,this.world.gates[0].visible=!1,e.puzzle===`block`&&(this.setBlockZ(14),this.world.block.position.y=Yl),e.puzzle===`mirrors`&&(this.mirrorTurns=[0,0,0],this.world.puzzle.forEach(e=>e.rotation.y=0),this.updateMirrorBeams()),e.puzzle===`torches`&&(this.torchStates=[!0,!1,!0],this.world.puzzle.forEach((e,t)=>e.getObjectByName(`flame`).visible=this.torchStates[t]))}persist(e=!0){if(this.started&&!this.review){this.syncPosition();try{localStorage.setItem(Xa(this.journey),JSON.stringify(this.save)),localStorage.setItem(Za,String(this.journey)),e&&this.ui.saved()}catch{this.storageOK&&this.ui.toast(`Browser storage is unavailable. Keep this tab open to preserve this journey.`),this.storageOK=!1}}}begin(e,t){this.inspectMode=!1;let n=this.readSave();this.save=t??(e?to():n||to()),this.started=!0,this.sound.start(),this.replaceHero(),this.save.visit?this.resumeVisit(this.save.visit):this.loadWorld(),this.ui.setPanel(null),this.yaw=0,this.snapCamera(),this.save.story.pending?this.showStoryPage():this.save.story.prologue===0&&this.startStory(`opening`),this.persist(!1)}startStory(e){Ia[e]&&!this.save.story.seen.includes(e)&&(this.keys.clear(),this.save.story.pending={id:e,page:0},this.showStoryPage(),this.persist(!1))}showStoryPage(){let e=this.save.story.pending;if(!e)return;let t=Ia[e.id];this.ui.story(t,e.page,this.save.story.promise);let n=this.hero.group.position;e.id===`opening`?(this.camera.position.set(-4,5.8,79),this.camera.lookAt(-7,2,59)):(this.camera.position.set(n.x+5,n.y+3.5,n.z+7),this.camera.lookAt(n.x,n.y+1.3,n.z-1))}advanceStory(e){let t=this.save.story.pending;if(!t)return;let n=Ia[t.id];if(t.page<n.pages.length-1)t.page++,this.showStoryPage();else{if(n.choice&&!e)return;e&&(this.save.story.promise=e);let r=t.id;Ra(this.save,r),this.ui.setPanel(null),this.keys.clear(),this.snapCamera(),r===`silence`&&(this.sound.tone(90,1.4,`sine`),this.ui.toast(`The village has fallen quiet. Find Soren.`)),r===`farewell`&&this.transitionAge(),r===`crown`&&(this.save.position={x:-5,z:60},this.loadWorld(),this.ui.ending(this.save)),this.hero.sword.visible=this.save.story.prologue>=4,this.refreshHUD()}this.persist(!1)}storyNPC(e){let t=this.save;if(t.age===`child`&&t.story.prologue<5){let n=t.story.prologue;return e===`mira`&&n===1?this.startStory(`lantern`):e===`mira`&&n===2&&t.fireflies.includes(`orchard`)?this.startStory(`silence`):e===`smith`&&n===3?this.startStory(`smith`):e===`elder`&&n===4?this.startStory(`commission`):this.ui.dialogue(e===`mira`?`MIRA`:e===`smith`?`SOREN`:`ROWAN`,Ba(t)),!0}return e===`mira`&&t.age===`adult`&&!t.story.reunited&&(this.startStory(`reunion`),!0)}replaceHero(){this.hero.group.traverse(e=>{e instanceof L&&!e.userData.sharedGeometry&&e.geometry.dispose(),e instanceof L&&e.userData.ownMaterial&&e.material.dispose()}),this.heroFade=1,this.hero.group.removeFromParent(),this.hero=nl(this.save.age===`adult`),this.scene.add(this.hero.group)}fadeHero(e){if(Math.abs(e-this.heroFade)<.01&&e===1==(this.heroFade===1))return;let t=e>=1,n=[];this.hero.group.traverse(e=>{e instanceof L&&!e.userData.depthOnly&&n.push(e)});for(let r of n){if(Array.isArray(r.material))continue;if(!r.userData.ownMaterial){if(t)continue;r.material=r.material.clone(),r.userData.ownMaterial=!0;let e=new L(r.geometry,this.depthOnly);e.userData={depthOnly:!0,sharedGeometry:!0},e.renderOrder=999,r.add(e)}let n=r.material;n.transparent!==!t&&(n.transparent=!t,n.needsUpdate=!0),n.opacity=t?1:e,r.renderOrder=t?0:1e3;for(let e of r.children)e.userData.depthOnly&&(e.visible=!t)}this.hero.group.userData.skipAO=!t,this.heroFade=e}depthOnly=new Se({colorWrite:!1,transparent:!0});loadWorld(e){this.started&&!this.inspectMode&&this.raiseVeil(),this.world&&ul(this.world),this.enemies.forEach(e=>{e.mesh.traverse(e=>{e instanceof L&&!e.userData.sharedGeometry&&e.geometry.dispose()}),e.mesh.removeFromParent(),e.marks.traverse(e=>{e instanceof L&&e.material.dispose()}),e.marks.removeFromParent()}),this.enemies=[],this.sparks.clear(),this.world=e?ll(e,this.save):sl(this.save),this.scene.add(this.world.group);for(let t of this.world.colliders){let n=e?0:$(t.x,t.z);t.bottom??=n-.8,t.top??=n+8}let t=e?30:145,n=e?-54:-145,r=e?34:145,i=[{x:-t-5,z:0,w:10,d:1e3,top:100,label:`World boundary`},{x:t+5,z:0,w:10,d:1e3,top:100,label:`World boundary`},{x:0,z:n-5,w:1e3,d:10,top:100,label:`World boundary`},{x:0,z:r+5,w:1e3,d:10,top:100,label:`World boundary`}];this.collision=new Yi([...this.world.colliders,...i],e=>(e.gate===void 0||this.world.gates[e.gate].visible)&&!(e.crack&&this.crackBroken)),this.movingBlock=this.world.block?{x:this.world.block.position.x,z:this.world.block.position.z,w:2,d:2,top:2.2,label:`Puzzle block`}:null,this.collision.dynamic=this.movingBlock?[this.movingBlock]:[],this.blockPush=0,this.blockSlide=null,this.attackElapsed=-1,this.attackQueued=!1,this.recoil=-1,this.hitStop=0,this.hitEnemies.clear(),this.dodgeCooldown=0,this.bladeBase.set(0,0,0),this.bladeTip.set(0,0,0),this.walkBlend=0,this.trailHistory=[],this.trail.visible=!1,this.target=null,this.raiseShield(!1),this.puzzleProgress=0,this.puzzleSolved=!1,this.arenaClear=!1,this.bossDead=!1,this.crackHits=0,this.setCrackBroken(!!e&&this.save.carvings.includes(e.id)),this.mirrorTurns=[1,2,3],e?.puzzle===`mirrors`&&this.updateMirrorBeams(),this.torchStates=[!1,!1,!1],this.notes=[],this.attackTime=0,this.dodgeTime=0,this.keys.clear();let a=this.save.age===`adult`,o=e?`#152f39`:a&&!this.save.won?`#b0c9ce`:`#c9dfd8`;if(this.scene.background=new G(o),this.scene.fog=new x(o,e?25:110,e?90:275),this.sky.visible=!e,this.sun.color.set(e?`#a7cbd5`:`#fff0c9`),this.sun.intensity=e?1.05:3.05,this.hemisphere.color.set(e?`#789fa7`:`#d8eceb`),this.hemisphere.groundColor.set(e?`#304951`:`#606e50`),this.hemisphere.intensity=e?.65:.82,this.fill.intensity=e?.15:.38,this.renderer.shadowMap.needsUpdate=!0,this.hero.group.position.set(this.world.spawn.x,this.ground(this.world.spawn.x,this.world.spawn.z),this.world.spawn.z),!e&&Math.hypot(this.hero.group.position.x-119,this.hero.group.position.z-55)<34.8&&!(this.hero.group.position.x>93.5&&this.hero.group.position.x<112.6&&Math.abs(this.hero.group.position.z-56)<1.28)&&this.hero.group.position.set(94,this.ground(94,56),56),!e&&this.blocked(this.hero.group.position.x,this.hero.group.position.z)){let e=this.hero.group.position.clone(),t=!1;for(let n=1;n<=8&&!t;n+=.5)for(let r=0;r<16&&!t;r++){let i=r*Math.PI/8,a=e.x+Math.cos(i)*n,o=e.z+Math.sin(i)*n;this.blocked(a,o)||(this.hero.group.position.set(a,this.ground(a,o),o),t=!0)}}this.yaw=0,this.snapCamera();let s=this.started?this.hero.group.position.z:35;if(this.sun.position.set(this.hero.group.position.x-45,70,s-55),this.sun.target.position.set(this.hero.group.position.x,0,s),e){let t=es[e.id]??[];for(let[n,[r,i]]of(ss[e.id]?.guardians??[]).entries())this.spawnEnemy(r,i,!1,t[n]);this.spawnEnemy(0,-39,!0),this.ui.toast(`${e.name} · ${e.hint}`)}else for(let[e,[t,n]]of[[-33,4],[-51,13],[43,-20],[54,-34],[40,49],[62,51],[-42,-41],[-56,-56],[41,-82],[-47,53],[-68,58],[9,-85]].entries())this.spawnEnemy(t,n,!1,ts[e]);this.hero.sword.visible=this.save.story.prologue>=4,this.refreshHUD()}spawnEnemy(e,t,n,r=`guardian`){let i=this.collision.move({x:e,z:t},{x:0,z:0},n?1:.5);e=i.x,t=i.z;let a=new p,o=this.world.dungeon?.color||`#b7826c`,c=mt(`Warden`);c.rotation.y=Math.PI,c.scale.setScalar(n?1.85:.92),a.add(c);let l=null;if(!n&&r===`skirmisher`){c.scale.set(.6,.56,.68),c.rotation.x=.2;for(let e of[-1,1]){let t=Q(new Ee(.09,.55,5),o,e*.26,1.45,.1,a);t.rotation.set(-.7,0,e*-.45),t.material=qc(o,!0)}}else!n&&r===`warder`&&(c.scale.set(.7,1.1,.7),Q(new h(.42,.04,5,24),o,0,2.95,0,a).rotation.x=Math.PI/2,l=Q(new ut(.24,1),o,0,2.95,0,a),l.material=qc(o,!0));if(n)for(let e=0;e<5;e++){let t=e/5*Math.PI*2;Q(new Ee(.14,.65,5),o,Math.cos(t)*.48,4.4,Math.sin(t)*.48,a).material=qc(o,!0)}let u=new L(new s(n?3.6:1.7,n?4:2,40),new Se({color:`#e4a56f`,transparent:!0,opacity:0,side:2,depthWrite:!1}));u.rotation.x=-Math.PI/2,u.position.y=.08,u.renderOrder=2,Kl(n?Gl.wardenSlamEdge:Gl.slamEdge,u),a.add(u),tl(a,l?[u,l]:[u]);let d=new de().setFromObject(a).max.y;a.position.set(e,this.ground(e,t),t),this.scene.add(a);let f=new p;this.scene.add(f),n&&(r=`guardian`);let m=n||r===`skirmisher`?Jl(Gl.plane,Gl.planeEdge,`#e7c27a`,f):null,g=n?Jl(Gl.ring,Gl.ringEdge,`#f0a35e`,f):null,_=n?[0,1,2].map(()=>Jl(Gl.disc,Gl.discEdge,`#e9b26c`,f)):r===`warder`?[Jl(Gl.disc,Gl.discEdge,`#e9b26c`,f)]:[],v=r===`warder`?Jl(Gl.stone,null,`#cdbb94`,f):null,y=n?this.save.age===`adult`?24:13:Qo(r,this.save.age===`adult`);this.enemies.push({mesh:a,x:e,z:t,homeX:e,homeZ:t,hp:y,maxHp:y,boss:n,state:`idle`,timer:Math.random(),speed:n?2.1:Zo[r].speed,hitFlash:0,fall:-1,indicator:u,phase:0,facing:0,kind:r,move:`slam`,cooldown:1.5+Math.random()*1.5,forced:null,struck:!1,marks:f,lane:m,wave:g,spots:_,targets:[],from:{x:e,z:t},to:{x:e,z:t},waveRadius:0,orb:l,stone:v,top:d})}ground(e,t){return this.world.dungeon?0:Math.hypot(e,t)<7.9?.69:Math.hypot(e,t)<9.2?.48:Math.hypot(e,t)<9.8?.23:e>94&&e<113&&Math.abs(t-56)<1.65?.66:$(e,t)}bindInput(){navigator.keyboard?.getLayoutMap?.().then(e=>{this.keyLayout=e,this.applySettings()}).catch(()=>{}),window.addEventListener(`pointerdown`,()=>this.sound.wake(),!0);for(let e of[`touchend`,`click`])window.addEventListener(e,()=>this.sound.wake(),!0);window.addEventListener(`keydown`,e=>{this.sound.wake();let t=Ms(e.code),n=this.settings.keys;if(this.binding&&this.ui.panel===`settings`){e.preventDefault(),e.repeat||this.captureKey(t);return}if(this.padBinding&&this.ui.panel===`settings`&&t===`Escape`){e.preventDefault(),this.capturePad(Z.Start);return}([`Space`,`Tab`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`].includes(t)||this.started&&!this.ui.panel&&Object.values(n).includes(t))&&e.preventDefault();let r=this.ui.panel,i=r&&r!==`flute`?Ts(t,e.shiftKey):null;if(e.repeat){(i?.startsWith(`focus-`)||i?.startsWith(`adjust-`))&&this.menuInput(i);return}if(this.keys.add(t),this.setDevice(`keyboard`),r===`flute`){[`Digit1`,`Digit2`,`Digit3`].includes(t)&&this.action(`note-${t.slice(-1)}`),(t===`Escape`||t===n.flute)&&this.action(`close`);return}if(t===`Escape`){if(r===`title`)return;r===`settings`?this.menuInput(`back`):this.action(r?`close`:`pause`);return}if(!this.started||r){t===n.journal&&r===`journal`||t===n.map&&r===`map`?this.action(`close`):i&&(e.preventDefault(),this.menuInput(i));return}let a={[n.interact]:`interact`,[n.attack]:`attack`,[n.dodge]:`dodge`,[n.target]:`target`,[n.flute]:`flute`,[n.journal]:`journal`,[n.map]:`map`,[n.checkpoint]:`checkpoint`,[n.shield]:`shield`};a[t]?this.action(a[t]):this.target&&(t===`ArrowLeft`||t===`ArrowRight`)&&this.switchTarget(t===`ArrowRight`?1:-1)}),window.addEventListener(`keyup`,e=>this.keys.delete(Ms(e.code)));let e=this.ui.el(`import-file`);e.addEventListener(`change`,()=>{let t=e.files?.[0];t&&this.readJourneyFile(t)}),window.addEventListener(`blur`,()=>{this.releaseHeld(),this.pauseForInterruption()}),window.addEventListener(`gamepaddisconnected`,e=>{this.activePad&&e.gamepad.index!==this.activePad.index||(this.activePad=null,this.ui.device===`gamepad`&&this.pauseForInterruption())}),window.addEventListener(`pointerdown`,e=>this.setDevice(e.pointerType===`mouse`?`keyboard`:`touch`),{capture:!0}),window.addEventListener(`pointermove`,e=>{e.pointerType===`mouse`&&this.ui.device===`touch`&&(e.movementX||e.movementY)&&this.setDevice(`keyboard`)},{capture:!0,passive:!0});let t=this.renderer.domElement;t.addEventListener(`contextmenu`,e=>e.preventDefault());let n=new Map,r=0,i=()=>{let[e,t]=[...n.values()];return Math.hypot(e.x-t.x,e.y-t.y)},a=e=>{n.delete(e.pointerId),this.pinching&&!n.size&&(this.pinching=!1,this.applySettings(!0))};t.addEventListener(`pointerdown`,e=>{if(!this.ui.panel){if(e.pointerType===`mouse`&&this.settings.mouseLook&&this.started){this.captured()?e.button===0?this.attack():e.button===2&&(this.mouseShield=!0):this.capturePointer();return}e.pointerType===`touch`&&(n.set(e.pointerId,{x:e.clientX,y:e.clientY}),n.size===2&&(this.pinching=!0,this.dragging=!1,this.pointerMoved=!0,r=i())),!this.pinching&&(this.dragging=!0,this.pointerMoved=!1,this.dragSwitch=0,this.lastPointer={x:e.clientX,y:e.clientY},t.setPointerCapture(e.pointerId))}}),t.addEventListener(`pointermove`,e=>{if(n.has(e.pointerId)&&n.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pinching){if(n.size===2&&r>0){let e=i();e>0&&this.zoomCamera(this.distance*(r/e)),r=e}return}if(this.captured()){this.ui.panel||this.mouseTurn(e.movementX,e.movementY);return}if(!this.dragging||this.ui.panel)return;let t=e.clientX-this.lastPointer.x,a=e.clientY-this.lastPointer.y;Math.abs(t)+Math.abs(a)>2&&(this.pointerMoved=!0),this.mouseTurn(t,a),this.lastPointer={x:e.clientX,y:e.clientY}}),t.addEventListener(`pointerup`,e=>{if(e.pointerType===`mouse`&&this.settings.mouseLook&&this.started){e.button===2&&(this.mouseShield=!1);return}let t=this.pinching;a(e),!t&&(!this.pointerMoved&&e.button===0&&!this.ui.panel&&this.attack(),this.dragging=!1)}),t.addEventListener(`pointercancel`,a);let o=0;t.addEventListener(`wheel`,e=>{this.zoomCamera(this.distance+e.deltaY*.008),clearTimeout(o),o=window.setTimeout(()=>this.applySettings(!0),400)},{passive:!0});let s=this.ui.el(`touch-stick`),c=this.ui.el(`touch-knob`),l=-1,u=e=>{let t=s.getBoundingClientRect(),n=t.width/2,r=(e.clientX-t.left-n)/n,i=(e.clientY-t.top-n)/n,a=Math.hypot(r,i);a>1&&(r/=a,i/=a),this.touchMove=cs(r,i,.12,.85),c.style.transform=`translate(${r*n*.6}px, ${i*n*.6}px)`},d=()=>{l=-1,this.touchMove={x:0,y:0},c.style.transform=``};s.addEventListener(`pointerdown`,e=>{e.preventDefault(),l=e.pointerId,s.setPointerCapture(e.pointerId),u(e)}),s.addEventListener(`pointermove`,e=>{e.pointerId===l&&u(e)});for(let e of[`pointerup`,`pointercancel`,`lostpointercapture`])s.addEventListener(e,d);let f=this.ui.el(`touch-shield`);f.addEventListener(`pointerdown`,e=>{e.preventDefault(),f.setPointerCapture(e.pointerId),this.settings.toggleShield?this.action(`shield`):this.touchShield=!0});for(let e of[`pointerup`,`pointercancel`,`lostpointercapture`])f.addEventListener(e,()=>this.touchShield=!1)}pauseForInterruption(){this.started&&!this.ui.panel&&!this.save.story.pending&&this.action(`pause`)}rumble(e){let t=performance.now()<this.rumbleUntil?this.rumbling:null,n=Zs(e,this.ui.device,this.settings.vibration,t),r=this.activePad?.vibrationActuator;n&&r&&(this.rumbling=n,this.rumbleUntil=performance.now()+n.duration,r.playEffect(`dual-rumble`,{startDelay:0,...n}).catch(()=>{}))}releaseHeld(){this.keys.clear(),this.touchMove={x:0,y:0},this.touchShield=!1,this.mouseShield=!1}captured(){return document.pointerLockElement===this.renderer.domElement}capturePointer(){if(this.settings.mouseLook&&this.started&&!this.ui.panel&&!(this.ui.device!==`keyboard`||this.captured()))try{this.renderer.domElement.requestPointerLock()?.catch?.(()=>{})}catch{}}mouseTurn(e,t){this.target?(this.dragSwitch+=e,Math.abs(this.dragSwitch)>70&&(this.switchTarget(this.dragSwitch>0?1:-1),this.dragSwitch=0),this.turnCamera(0,t*.004)):this.turnCamera(e*.006,t*.004)}setDevice(e){this.ui.device!==e&&(this.ui.setDevice(e),this.ui.panel===`pause`?this.ui.pause(this.save,this.settings.muted,this.quality.label):this.ui.panel===`flute`&&this.ui.flute(this.songSequence(),this.notes))}raiseShield(e){this.shieldUp=e,this.ui.el(`touch-shield`).classList.toggle(`on`,e)}shieldHeld(){return this.settings.toggleShield?this.shieldUp:this.keys.has(this.settings.keys.shield)||this.padShield||this.touchShield||this.mouseShield}pollGamepad(e){let t=navigator.getGamepads?.()??[],n=null;for(let e of t)e?.connected&&(!n||e.mapping===`standard`)&&(n=e);if(this.activePad=n,n&&n.id!==this.padId){let e=this.padStyle();this.padId=n.id,this.padStyle()!==e&&this.applySettings()}if(!n){this.padMove={x:0,y:0},this.padShield=!1,this.padHeld=[];return}let r=n.buttons.map(e=>e.pressed||e.value>.5);r.some((e,t)=>e&&!this.padHeld[t])&&this.sound.wake();let i=cs(n.axes[0]??0,n.axes[1]??0),a=cs(n.axes[2]??0,n.axes[3]??0,.15);(r.some(Boolean)||i.x||i.y||a.x||a.y)&&this.setDevice(`gamepad`);let o=this.ui.panel,s=o===`flute`?`flute`:o||!this.started||this.save.story.pending?`menu`:`play`;if(this.padBinding&&o===`settings`){let e=Ds(this.padHeld,r);this.padHeld=r,e>=0&&this.capturePad(e);return}let c=ws(this.padHeld,r,s,this.settings.pad);if(this.padHeld=r,this.padShield=s===`play`&&Es(r,this.settings.pad),this.padMove=s===`play`?i:{x:0,y:0},s===`play`){if(this.target){let t=Math.sign(a.x);Math.abs(a.x)>.6&&t!==this.padFlick?(this.padFlick=t,this.switchTarget(t)):Math.abs(a.x)<.3&&(this.padFlick=0),a.y&&this.turnCamera(0,a.y*e*1.6)}else this.padFlick=Math.abs(a.x)>.3?Math.sign(a.x):0,(a.x||a.y)&&this.turnCamera(a.x*e*2.6,a.y*e*1.6);for(let e of c)this.action(e);return}if(s===`flute`){for(let e of c)this.action(e);return}this.padNav=Math.max(0,this.padNav-e),Math.abs(i.y)>.6&&this.padNav<=0?(c.push(i.y<0?`focus-prev`:`focus-next`),this.padNav=.22):Math.abs(i.x)>.6&&this.padNav<=0?(c.push(i.x<0?`adjust-prev`:`adjust-next`),this.padNav=.22):Math.abs(i.y)<.3&&Math.abs(i.x)<.3&&(this.padNav=0);for(let e of c)this.menuInput(e)}menuInput(e){let t=[...this.ui.el(`panel`).querySelectorAll(`button[data-action]`)].filter(e=>e.offsetParent!==null),n=t.indexOf(document.activeElement);if(e===`adjust-prev`||e===`adjust-next`){let r=t[n]?.closest(`[data-slider]`);if(r){let i=t.filter(e=>r.contains(e)),a=i[i.indexOf(t[n])+(e===`adjust-next`?1:-1)];a&&(a.focus(),a.click());return}e=e===`adjust-next`?`focus-next`:`focus-prev`}if(e===`focus-prev`||e===`focus-next`){if(!t.length)return;let r=e===`focus-next`?1:-1,i=n<0?r>0?0:t.length-1:(n+r+t.length)%t.length,a=t[n]?.closest(`[data-slider]`);for(;a&&a.contains(t[i])&&i!==n;)i=(i+r+t.length)%t.length;let o=t[i].closest(`[data-slider]`)?.querySelector(`[aria-checked="true"]`)??t[i];o!==t[n]&&this.sound.focus(),o.focus();return}let r=this.ui.panel;e===`confirm`?(n>=0?t[n]:t[0])?.click():e===`back`?r===`settings`?this.action(`pause`):r!==`title`&&!this.save.story.pending&&this.action(`close`):e===`start`?r===`title`?t[0]?.click():this.save.story.pending||this.action(`close`):e===`map`&&r===`map`&&this.action(`close`)}action(e){if(this.binding&&!e.startsWith(`bind-`)&&(this.binding=null),this.padBinding&&!e.startsWith(`padbind-`)&&(this.padBinding=null),e===`story-next`||e===`promise-home`||e===`promise-remember`){this.advanceStory(e===`promise-home`?`home`:e===`promise-remember`?`remember`:void 0);return}if(this.save.story.pending&&this.started){e===`close`&&this.advanceStory();return}if(e===`new`){this.keptJourneys().length?this.showJourneys():(this.journey=1,this.begin(!0));return}if(e===`journeys`){this.showJourneys();return}if(e.startsWith(`journey-new-`)){let t=Qa(e.slice(12)),n=this.readSave(t);n?(this.pendingPlace=t,this.ui.dialogue(`A NEW STORY`,`Beginning again replaces Journey ${t} (${yo(n)}). That story will be lost.`,`new-confirm`,`Begin again`,`Keep that journey`)):(this.journey=t,this.begin(!0));return}if(e===`new-confirm`){this.journey=this.pendingPlace,this.begin(!0);return}if(e.startsWith(`journey-continue-`)){this.journey=Qa(e.slice(17)),this.begin(!1);return}if(e===`continue`){this.journey=$a(this.lastJourney(),this.keptJourneys())??1,this.begin(!1);return}if(e===`import`){let e=this.ui.el(`import-file`);e.value=``,e.click();return}if(e===`import-confirm`){let e=this.pendingImport;if(this.pendingImport=null,!e)return;this.started&&this.persist(!1),this.journey=this.pendingPlace,this.begin(!1,e);return}if(e===`close`){if(!this.started){this.showTitle();return}this.ui.setPanel(null),this.keys.clear(),this.capturePointer();return}if(e===`fullscreen`){this.toggleFullscreen();return}if(e===`reload`){this.persist(!1),location.reload();return}if(e===`settings`){this.ui.settings(this.settings);return}if(e.startsWith(`set-`)||e.startsWith(`toggle-`)){this.changeSetting(e);return}if(e===`bind-reset`){this.settings.keys={...ks},this.applySettings(!0),this.ui.settings(this.settings,null,`Keys reset to the defaults.`);return}if(e===`padbind-reset`){this.settings.pad={...us},this.applySettings(!0),this.ui.settings(this.settings,null,``,null,`Buttons reset to the defaults.`);return}if(e.startsWith(`padbind-`)){let t=e.slice(8);if(!(t in ds))return;this.padBinding=t,this.ui.settings(this.settings,null,``,t,`Press the new gamepad button for ${ds[t].toLowerCase()}. ${this.ui.pad.pause} or Esc cancels.`);return}if(e.startsWith(`bind-`)){let t=e.slice(5);if(!(t in As))return;this.binding=t,this.ui.settings(this.settings,t,`Press the new key for ${As[t].toLowerCase()}. Esc cancels.`);return}if(!this.started){e===`pause`&&this.ui.panel===`settings`&&this.showTitle();return}if(e===`pause`){this.keys.clear(),this.ui.pause(this.save,this.settings.muted,this.quality.label);return}if(e===`graphics`){this.ui.settings(this.settings),this.ui.focusFidelity();return}if(e===`map`){this.showMap();return}if(e.startsWith(`mark-`)){let t=e.slice(5),n=Ao[t]??Do.find(e=>e.id===t);t===`clear`?this.setMarker(null):n&&this.setMarker({x:n.x,z:n.z});return}if(e===`journal`){this.ui.journal(this.save);return}if(e===`save`){this.persist();return}if(e===`export`){this.exportJourney();return}if(e===`sound`){this.settings.muted=!this.settings.muted,this.applySettings(!0),this.ui.pause(this.save,this.settings.muted,this.quality.label);return}if(e===`home`){this.persist(!1),this.started=!1,this.save.position={x:0,z:57},this.loadWorld(),this.showTitle();return}if(e===`grow`){this.transitionAge();return}if(e===`upgrade`){this.save.crystals>=60&&this.save.sword<3&&(this.save.crystals-=60,this.save.sword=3,this.persist(),this.sound.chime(),this.ui.dialogue(`SOREN · THE VILLAGE SMITH`,`A star-forged edge. Treat it kindly, and it will carry you through the dark.`));return}if(e===`checkpoint`&&this.ui.panel===`pause`&&(this.ui.setPanel(null),this.keys.clear()),e===`leave-confirm`){this.ui.setPanel(null),this.loadWorld(),this.persist(),this.refreshHUD();return}if(e===`checkpoint-confirm`){this.ui.setPanel(null),this.checkpoint();return}if(e.startsWith(`note-`)){this.playNote(Number(e.slice(-1)));return}this.ui.panel||(e===`interact`&&this.interact(),e===`attack`&&this.attack(),e===`dodge`&&this.dodge(),e===`target`&&this.lockTarget(),e===`shield`&&this.settings.toggleShield&&this.raiseShield(!this.shieldUp),e===`flute`&&(this.notes=[],this.sound.start(),this.ui.flute(this.songSequence(),this.notes)),e===`checkpoint`&&(this.world.dungeon?this.ui.dialogue(`RETURN TO CHECKPOINT`,`Return to the start of this chamber? Broken seals stay broken, but any guardians still standing, and the warden, recover their strength.`,`checkpoint-confirm`,`Return`,`Stay here`):this.checkpoint()))}toggleFullscreen(){(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen({navigationUI:`hide`})).catch(()=>this.ui.toast(`Full screen needs a click, tap, or key press: browsers don't allow it from a gamepad button.`))}mapPosition(){return this.world.dungeon?this.save.position:{x:this.hero.group.position.x,z:this.hero.group.position.z}}showMap(){let e=this.mapPosition();this.ui.map(this.save,e.x,e.z,jo(this.save,e.x,e.z))}setMarker(e){let t=this.save.marker;this.save.marker=e&&!(t&&Math.hypot(t.x-e.x,t.z-e.z)<1)?{x:e.x,z:e.z}:null,this.persist(!1),this.refreshHUD(),this.ui.panel===`map`&&this.showMap()}exportJourney(){this.syncPosition();let e=uo(),t=URL.createObjectURL(new Blob([lo(this.save)],{type:`application/json`})),n=document.createElement(`a`);n.href=t,n.download=e,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3),this.ui.toast(`Journey file saved as ${e}. Import it here or in another browser to continue.`)}async readJourneyFile(e){let t=fo(await e.text());if(t.error!==void 0){this.pendingImport=null,this.ui.dialogue(`JOURNEY FILE`,t.error);return}this.pendingImport=t.save;let n=this.keptJourneys();this.started&&!this.review&&!n.includes(this.journey)&&n.push(this.journey);let r=this.started?this.journey:$a(this.lastJourney(),n)??1,{place:i,replaces:a}=this.review?{place:this.journey,replaces:this.started}:eo(n,r);this.pendingPlace=i,this.ui.dialogue(`IMPORT A JOURNEY`,`In this file: ${po(t.save)}.${a?` It will replace Journey ${i}, the journey ${this.started?`you are playing`:`saved on this device`}.`:n.length?` It will be kept as Journey ${i}; your other journeys stay as they are.`:``}`,`import-confirm`,`Continue this journey`,a?`Keep my journey`:`Not now`)}interact(){let e=this.nearest();if(!e)return;let t=this.save;if(e.kind===`npc`){if(this.storyNPC(e.id))return;if(e.id===`elder`){t.talked=!0;let e=Ga(t,`elder`)||(t.won?`I thought the world had forgotten how to sing. But you remembered. Welcome home, Alder.`:ro(t)?`Three promises, kept. The great bell is ready. Go to the sanctuary north of the village. The crossing will ask for seven years of your life.`:t.age===`adult`?`Seven winters, and still I knew your footsteps. The northern frost, the eastern sands, and the western fen hold the echoes. Bring them to Crownfall.`:`The silence is spreading from Crownfall. Take your sword and reed flute. Seek the Rootbound Hollow west of here, the Ember Vault in the northeast, and the Tidal Archive by the sea. Follow the pale paths. The map will guide you.`);this.ui.dialogue(`ELDER ROWAN`,e),this.persist(!1)}e.id===`mira`&&(t.fireflies.length===3&&!t.reward?(t.reward=!0,t.maxHealth+=2,t.health=t.maxHealth,this.sound.chime(),this.persist(),this.ui.dialogue(`MIRA · KEEPER OF SMALL THINGS`,`All three! They still remember us. Here, take this heart charm. Now you can carry a little more courage.`)):this.ui.dialogue(`MIRA · KEEPER OF SMALL THINGS`,Ga(t,`mira`)||(t.reward?`They glow brightest when you come home. I think they missed you.`:`My three wandering lights slipped away. One went to the orchard east of the village, one followed the western forest path, and one drifted toward the coast. Bring them home? You have found ${t.fireflies.length} of three.`))),e.id===`smith`&&this.ui.dialogue(`SOREN · THE VILLAGE SMITH`,t.sword===3?`That star-forged blade will serve you well. Remember: raise your shield as the enemy strikes, then answer while they recover.`:t.crystals>=60?`You have enough crystals. For sixty, I can forge a blade that strikes with the strength of three.`:`${Ga(t,`smith`)||`A good sword needs a brave hand.`} Bring me 60 crystals and I will temper yours. {Shield} to brace your shield.`,t.sword<3&&t.crystals>=60?`upgrade`:`close`,t.sword<3&&t.crystals>=60?`Temper the blade · 60 ◆`:`Continue`)}else if(e.kind===`portal`){let n=Ka.find(t=>t.id===e.id),r=no(t,n);if(r){this.ui.toast(r);return}t.position={x:n.x,z:n.z+7},t.visited.includes(n.id)||t.visited.push(n.id),t.marker&&Math.hypot(t.marker.x-n.x,t.marker.z-n.z)<12&&(t.marker=null),this.persist(!1),this.loadWorld(n),n.id===`crown`&&this.startStory(`crownArrival`)}else if(e.kind===`bell`)ro(t)?this.startStory(`farewell`):this.ui.dialogue(`THE BELL OF AGES`,t.age===`adult`?`The bell remembers the boy you were. Its song is still unfinished. Seek the elder echoes in Frostveil, the Saffron Wastes, and Mourning Fen.`:`Three empty hollows in the altar: a seed, an ember, a pearl. Somewhere beyond the meadow, their stories are waiting.`);else if(e.kind===`heal`)t.health=t.maxHealth,this.persist(),this.sound.chime(),this.ui.toast(`A little warmth, a little courage. Health restored.`);else if(e.kind===`chest`)t.chests.push(e.id),t.crystals+=20,t.health=Math.min(t.maxHealth,t.health+2),e.mesh.visible=!1,this.sound.chime(),this.burst(e.x,1,e.z,`#e9cf8c`,12),this.ui.toast(`Inside: 20 crystals and a healing herb.`),this.persist();else if(e.kind===`firefly`)t.fireflies.push(e.id),e.mesh.visible=!1,this.sound.chime(),this.ui.toast(`A wandering light found its way home · ${t.fireflies.length} / 3`),this.persist();else if(e.kind===`crack`)this.ui.toast(`The stone here is cracked, and it sounds hollow. A few strong blows from your sword might break it.`);else if(e.kind===`carving`){let e=this.world.dungeon,n=Va[e.id];if(!n)return;let r=!t.carvings.includes(e.id);r&&(t.carvings.push(e.id),this.sound.chime(),this.persist()),this.ui.dialogue(n.by,n.text+(r?`<br><small class="carving-note">Copied into your journal · ${t.carvings.length} / 7 carvings</small>`:``))}else if(e.kind===`exit`){if(this.puzzleSolved||this.crackBroken||this.enemies.some(e=>e.state===`dead`)){this.ui.dialogue(`RETURN TO THE MEADOW`,`Leave ${this.world.dungeon.name.replace(/^The /,`the `)}? What you've opened here closes again: the puzzle resets, and its guardians and warden return.`,`leave-confirm`,`Leave`,`Stay here`);return}this.loadWorld(),this.persist()}else if(e.kind===`puzzle`)this.activatePuzzle(e);else if(e.kind===`relic`){let e=this.world.dungeon;if(!this.bossDead)return;io(t,e.id)&&(this.sound.chime(),this.loadWorld(),this.persist(),this.startStory(e.id))}this.refreshHUD()}setCrackBroken(e){this.crackBroken=e;let t=this.world.crack;t&&(t.wall.visible=!e,t.rubble.visible=e)}strikeCrack(){let e=this.world.crack;if(this.crackHits++,this.crackHits<3){this.sound.tone(82,.35,`triangle`,.06),this.ui.toast(this.crackHits===1?`The cracked stone shudders.`:`Dust pours from the cracks. One more blow.`);return}this.setCrackBroken(!0),this.persist(!1),this.renderer.shadowMap.needsUpdate=!0,this.sound.tone(58,.9,`triangle`,.09),this.sound.tone(96,.5,`sawtooth`,.025,.05),this.burst(e.x,1.4,e.z,`#8f9a8e`,18),this.ui.toast(`The wall gives way. Something was hidden behind it.`)}transitionAge(){ao(this.save)&&(this.sound.chime(),this.save.position={x:0,z:10},this.replaceHero(),this.loadWorld(),this.persist(),this.startStory(`crossing`))}activatePuzzle(e){if(this.puzzleSolved){this.ui.toast(`The mechanism is awake. Continue through the open gate.`);return}let t=this.world.dungeon,n=e.value||0;(t.puzzle===`sequence`||t.puzzle===`bells`)&&(this.puzzleProgress=So(t.sequence,this.puzzleProgress,n),this.sound.note(n+1),this.burst(e.x,1.7,e.z,t.color,7),this.puzzleProgress===t.sequence.length?this.solvePuzzle():this.ui.toast(this.puzzleProgress?`The memory answers · ${this.puzzleProgress} / ${t.sequence.length}`:`The memory fades. Try the inscription’s order again.`)),t.puzzle===`block`&&(this.finishBlockSlide(),this.setBlockZ(Math.max(14,e.z-2)),this.sound.tone(95,.3,`triangle`),this.ui.toast(`Stone grinds against stone.`),e.z===14&&this.solvePuzzle()),t.puzzle===`mirrors`&&(this.mirrorTurns[n]=(this.mirrorTurns[n]+1)%4,e.mesh.rotation.y=this.mirrorTurns[n]*Math.PI/2,this.updateMirrorBeams(),this.sound.note(n+1),this.mirrorTurns.every(e=>e===0)?this.solvePuzzle():this.ui.toast([`North`,`West`,`South`,`East`][this.mirrorTurns[n]]+` · the beam turns.`)),t.puzzle===`torches`&&(this.torchStates[n]=!this.torchStates[n],e.mesh.getObjectByName(`flame`).visible=this.torchStates[n],this.sound.note(n+1),this.torchStates[0]&&!this.torchStates[1]&&this.torchStates[2]&&this.solvePuzzle()),(t.puzzle===`song`||t.puzzle===`final`)&&this.ui.dialogue(`THE MELODY ALTAR`,t.hint+` Stand near this altar and {flute} to play.`)}blockInteractable(){return this.world.interactables.find(e=>e.mesh===this.world.block)}setBlockZ(e){let t=this.blockInteractable();t&&(t.mesh.position.z=e,t.z=e,this.movingBlock&&(this.movingBlock.z=e))}finishBlockSlide(){this.blockSlide&&=(this.setBlockZ(this.blockSlide.to),null)}updateBlock(e,t){let n=this.blockInteractable();if(!n||this.world.dungeon?.puzzle!==`block`)return;if(this.puzzleSolved&&!this.blockSlide&&n.mesh.position.y>Yl){n.mesh.position.y=this.settings.reducedMotion?Yl:Math.max(Yl,n.mesh.position.y-e*2.4),this.renderer.shadowMap.needsUpdate=!0;return}if(this.blockSlide){let t=this.blockSlide;t.t=Math.min(1,t.t+e/.3);let n=t.t*t.t*(3-2*t.t);this.setBlockZ(t.from+(t.to-t.from)*n),t.t>=1&&(this.blockSlide=null,this.setBlockZ(t.to),t.to===14&&this.solvePuzzle());return}let r=this.hero.group.position,i=!this.puzzleSolved&&n.z>14&&t.z<-.5&&Math.abs(r.x-n.x)<1.05&&r.z>n.z+1.1&&r.z<n.z+1.8;this.blockPush=i?this.blockPush+e:0,!(this.blockPush<.35)&&(this.blockPush=0,this.blockSlide={from:n.z,to:Math.max(14,n.z-2),t:0},this.sound.tone(95,.3,`triangle`),this.sound.tone(62,.35,`triangle`,.04))}updateMirrorBeams(){this.world.puzzle.forEach((e,t)=>{let n=e.getObjectByName(`beam`);if(!n)return;let r=this.mirrorTurns[t]===0;n.material.opacity=r?.9:.3,n.scale.set(r?1.8:1,r?1.8:1,1)})}solvePuzzle(){this.puzzleSolved=!0,this.world.gates[0].visible=!1,this.sound.chime(),this.ui.toast(`The first seal opens. Defeat the guardians beyond.`),this.refreshHUD(),this.persist(!1)}songSequence(){let e=this.world.dungeon;return e&&!this.puzzleSolved&&(e.puzzle===`song`||e.puzzle===`final`)&&Math.hypot(this.hero.group.position.x,this.hero.group.position.z-12)<6?e.sequence:[]}playNote(e){if(this.ui.panel!==`flute`)return;this.sound.note(e),this.notes.push(e);let t=this.songSequence();this.notes.length>8&&this.notes.shift(),this.ui.flute(t,this.notes),t.length&&this.notes.slice(-t.length).join(`,`)===t.join(`,`)?(this.ui.setPanel(null),this.solvePuzzle()):!t.length&&this.notes.slice(-3).join(`,`)===`1,2,3`&&this.ui.toast(`A small melody drifts across the world.`)}nearest(){let e=this.hero.group.position,t=null,n=3.4;for(let r of this.world.interactables){if(!r.mesh.visible)continue;let i=Math.hypot(e.x-r.x,e.z-r.z);i<n&&this.clearSight(e.x,e.z,r.x,r.z,this.world.block===r.mesh&&this.movingBlock||void 0)&&(t=r,n=i)}return t}clearSight(e,t,n,r,i){return this.collision.cast({x:e,z:t,y:this.ground(e,t)+1.25},{x:n,z:r,y:this.ground(n,r)+1.25},0,i)>=.999}attack(){if(!(this.save.story.prologue<4||this.dodgeTime>0||this.recoil>=0)){if(this.attackElapsed>=0){this.attackElapsed>.12&&(this.attackQueued=!0);return}this.beginAttack(0)}}beginAttack(e){this.combo=e,this.attackElapsed=0,this.attackTime=Xi[e].duration,this.attackQueued=!1,this.hitEnemies.clear(),this.trailHistory=[];let t=this.hero.group.position,n=this.hero.group.rotation.y,r=this.target||this.enemies.filter(e=>e.state!==`dead`&&Math.hypot(e.x-t.x,e.z-t.z)<2.8&&aa(n,e.x-t.x,e.z-t.z,.57)&&this.clearSight(t.x,t.z,e.x,e.z)).sort((e,n)=>Math.hypot(e.x-t.x,e.z-t.z)-Math.hypot(n.x-t.x,n.z-t.z))[0];r&&this.clearSight(t.x,t.z,r.x,r.z)&&(this.hero.group.rotation.y=Math.atan2(t.x-r.x,t.z-r.z))}applyAttackPose(e){this.hero.body.rotation.set(e.lean,e.torso,0),this.hero.arms[1].rotation.set(...e.shoulder),this.hero.forearms[1].rotation.x=e.elbow,this.hero.sword.rotation.x=e.wrist,this.hero.arms[0].rotation.set(e.offhand,0,-.2),this.hero.forearms[0].rotation.x=.7,this.hero.shield.rotation.set(-(e.offhand+.7),Math.PI/2,0)}sampleBlade(){this.hero.group.updateMatrixWorld(!0),this.bladeBase.set(0,0,-.24).applyMatrix4(this.hero.sword.matrixWorld),this.bladeTip.set(0,0,-1.06).applyMatrix4(this.hero.sword.matrixWorld)}drawTrail(){let e=this.trailHistory,t=e.length-1,n=0,r=0;for(let i=1;i<e.length;i++){let a=e[i-1],o=e[i],s=e=>(e/t)**1.4,c=(t,n)=>t===e[n].tip?1:.08;for(let[e,t]of[[a.base,i-1],[a.tip,i-1],[o.tip,i],[a.base,i-1],[o.tip,i],[o.base,i]])this.trailVertices[n++]=e.x,this.trailVertices[n++]=e.y,this.trailVertices[n++]=e.z,this.trailColors.set([1,1,1,s(t)*c(e,t)],r),r+=4}let i=this.trail.geometry;i.attributes.position.needsUpdate=!0,i.attributes.color.needsUpdate=!0,i.setDrawRange(0,n/3),this.trail.material.opacity=Zl,this.trail.visible=n>0}updateAttack(e){if(this.recoil>=0){this.recoil+=e,this.applyAttackPose(na(this.recoilPose,ra(0,0),this.recoil/.22)),this.recoil>=.22&&(this.recoil=-1,this.attackElapsed=-1,this.attackTime=0),this.trail.visible=!1;return}if(this.attackElapsed<0){this.trail.visible=!1;return}let t=this.attackElapsed,n=Xi[this.combo];this.attackElapsed+=e,this.attackTime=Math.max(0,n.duration-this.attackElapsed);let r=ia(t,this.attackElapsed,this.combo);if(t<n.start&&this.attackElapsed>=n.start&&this.sound.swing(this.combo),r){let e=Math.max(1,Math.ceil((r.end-r.start)*120));for(let t=0;t<=e;t++){let i=r.start+(r.end-r.start)*t/e;this.applyAttackPose(ra(i,this.combo)),this.sampleBlade();let a=this.collision.cast(this.bladeBase,this.bladeTip,.025);if(a<.99){let e=this.bladeBase.clone().lerp(this.bladeTip,a);this.burst(e.x,e.y,e.z,`#c6b497`,4),this.sound.clang();let t=this.world.crack;t&&!this.crackBroken&&Math.abs(e.x-t.x)<1.2&&Math.abs(e.z-t.z)<X.door/2+.3&&e.y<3.6&&this.strikeCrack(),this.recoil=0,this.recoilPose=ra(i,this.combo),this.attackQueued=!1,this.hitStop=.025;break}let o=this.hero.group.position;for(let e of this.enemies){if(e.state===`dead`||this.hitEnemies.has(e)||Math.hypot(e.x-o.x,e.z-o.z)>3.5||!aa(this.hero.group.rotation.y,e.x-o.x,e.z-o.z,-.25)||!this.clearSight(o.x,o.z,e.x,e.z))continue;let t=this.ground(e.x,e.z),r=e.boss?.95:.52;la(this.bladeBase,this.bladeTip,{x:e.x,y:t+.35,z:e.z},{x:e.x,y:t+(e.boss?3.2:1.6),z:e.z})<(r+.1)**2&&(this.hitEnemies.add(e),this.damageEnemy(e,this.save.sword+n.damage),this.hitStop=.045)}}}this.recoil<0&&this.applyAttackPose(ra(this.attackElapsed,this.combo)),this.sampleBlade(),this.attackElapsed>=n.start&&this.attackElapsed<=n.end&&this.recoil<0?(this.trailHistory.push({base:this.bladeBase.clone().lerp(this.bladeTip,.35),tip:this.bladeTip.clone()}),this.trailHistory.length>8&&this.trailHistory.shift(),this.trailFade=1,this.drawTrail()):this.trailFade>0&&this.attackElapsed>n.end?(this.trailFade=Math.max(0,this.trailFade-e/Ql),this.trail.material.opacity=Zl*this.trailFade,this.trail.visible=this.trailFade>0):this.trail.visible=!1,this.attackElapsed>=n.duration&&(this.attackQueued?this.beginAttack((this.combo+1)%3):(this.attackElapsed=-1,this.attackTime=0))}damageEnemy(e,t){if(e.state!==`dead`){if(e.hp-=t,e.hitFlash=.2,this.sound.hit(),this.rumble(`strike`),this.burst(e.x,this.ground(e.x,e.z)+1.4,e.z,this.world.dungeon?.color||`#ddc18c`,7),e.hp<=0)e.state=`dead`,e.fall=0,e.hitFlash=0,e.mesh.scale.setScalar(1),e.mesh.rotation.order=`YXZ`,e.mesh.rotation.set(0,e.facing,0),this.clearMarks(e),this.save.crystals+=e.boss?15:3,this.sound.pickup(),this.save.health=Math.min(this.save.maxHealth,this.save.health+(e.boss?4:1)),this.target===e&&(this.target=Al(this.hero.group.position,this.lockCandidates())),e.boss?(this.bossDead=!0,this.world.interactables.find(e=>e.kind===`relic`).mesh.visible=!0,this.ui.toast(`The silence breaks. Claim the relic beyond the chamber.`),this.sound.chime()):this.world.dungeon&&this.enemies.filter(e=>!e.boss).every(e=>e.state===`dead`)&&(this.arenaClear=!0,this.world.gates[1].visible=!1,this.ui.toast(`The guardian seal breaks. The chamber beyond is open.`),this.sound.chime()),this.world.dungeon&&this.persist(!1);else if(!e.boss&&e.state!==`strike`){e.state=`recover`,e.timer=.4;let t=e.x-this.hero.group.position.x,n=e.z-this.hero.group.position.z,r=Math.hypot(t,n)||1;this.moveEnemy(e,t/r*.65,n/r*.65)}this.refreshHUD()}}dodge(){if(this.dodgeCooldown>0||this.recoil>=0||this.attackElapsed>=0&&this.attackElapsed<Xi[this.combo].end)return;this.attackElapsed=-1,this.attackTime=0,this.attackQueued=!1,this.trail.visible=!1,this.dodgeTime=.42,this.dodgeCooldown=.85,this.raiseShield(!1),this.invulnerable=.46;let e=this.movementVector();e.lengthSq()<.01&&e.set(-Math.sin(this.hero.group.rotation.y),0,-Math.cos(this.hero.group.rotation.y)),this.velocity.copy(e).normalize().multiplyScalar(15),this.sound.tone(145,.12,`triangle`,.025)}lockCandidates(){let e=this.hero.group.position;return this.enemies.filter(t=>t.state!==`dead`&&Math.hypot(t.x-e.x,t.z-e.z)<18&&this.clearSight(e.x,e.z,t.x,t.z))}lockTarget(){if(this.target){this.target=null;return}this.target=Al(this.hero.group.position,this.lockCandidates()),this.target||this.recenterCamera()}switchTarget(e){if(!this.target)return!1;let t=jl(this.camera.position,this.target,this.lockCandidates(),e);return t&&(this.target=t,this.sound.ui()),!!t}updateThreats(){let e=this.ui.el(`threats`),t=0;if(this.started&&!this.ui.panel&&this.settings.threatArrows)for(let n of this.enemies){if(n.state!==`windup`)continue;let r=Ml(new W(n.x,n.mesh.position.y+n.top*.5,n.z).project(this.camera),innerWidth,innerHeight,46);if(r.onScreen)continue;let i=e.children[t];i||(i=document.createElement(`i`),e.append(i)),i.hidden=!1,i.style.transform=`translate(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px) rotate(${r.angle.toFixed(3)}rad)`,t++}for(let n=t;n<e.children.length;n++)e.children[n].hidden=!0}updateLockMarker(){let e=this.ui.el(`target-dot`),t=this.target;if(!t||!this.started||this.ui.panel){e.hidden=!0;return}let n=Ml(new W(t.x,t.mesh.position.y+t.top+.35,t.z).project(this.camera),innerWidth,innerHeight,34);e.hidden=!1,e.classList.toggle(`edge`,!n.onScreen),e.style.transform=`translate(${n.x.toFixed(1)}px, ${n.y.toFixed(1)}px)`,e.style.setProperty(`--angle`,`${n.angle.toFixed(3)}rad`)}zoomCamera(e){this.settings.cameraDistance=vc(e),this.distance=this.settings.cameraDistance}recenterCamera(){let e=this.hero.group.rotation.y;this.settings.reducedMotion?(this.yaw+=Nl(this.yaw,e),this.recentering=!1):this.recentering=!0}followCamera(e,t,n){this.cameraIdle+=n,!(!tc(this.settings.cameraFollow,this.ui.device)||this.target||this.dragging||this.recentering||this.cameraIdle<.8)&&(this.yaw+=Fl(e,t,this.yaw,Math.cos(this.pitch)*this.distance))}turnCamera(e,t){e&&(this.recentering=!1),(e||t)&&(this.cameraIdle=0);let n=this.settings.sensitivity;this.yaw-=e*n,this.pitch=ge.clamp(this.pitch+t*n*(this.settings.invertY?-1:1),.17,1.08)}movementVector(){let e=this.settings.keys,t=Number(this.keys.has(e.right))-Number(this.keys.has(e.left)),n=Number(this.keys.has(e.back))-Number(this.keys.has(e.forward)),r=Math.hypot(t,n);if(r>0)t/=r,n/=r;else{let e=Math.hypot(this.padMove.x,this.padMove.y)>=Math.hypot(this.touchMove.x,this.touchMove.y)?this.padMove:this.touchMove;t=e.x,n=e.y}return new W(t*Math.cos(this.yaw)+n*Math.sin(this.yaw),0,-t*Math.sin(this.yaw)+n*Math.cos(this.yaw))}blocked(e,t,n=.4){return this.collision.blocked({x:e,z:t},n)}moveActor(e,t,n,r,i=.4){let a=this.collision.move({x:e,z:t},{x:n,z:r},i);if(!this.world.dungeon){let n=Math.max(1,Math.ceil(Math.hypot(a.x-e,a.z-t)/.12));for(let r=1;r<=n;r++){let i=e+(a.x-e)*r/n,o=t+(a.z-t)*r/n;if(Math.hypot(i-119,o-55)<34.8&&!(i>93.5&&i<112.6&&Math.abs(o-56)<1.28))return{x:e+(a.x-e)*(r-1)/n,z:t+(a.z-t)*(r-1)/n}}}return a}moveEnemy(e,t,n){let r=this.moveActor(e.x,e.z,t,n,e.boss?.95:.5);e.x=r.x,e.z=r.z,e.mesh.position.set(e.x,this.ground(e.x,e.z),e.z)}updatePlayer(e){let t=this.hero.group.position;this.dodgeTime=Math.max(0,this.dodgeTime-e),this.dodgeCooldown=Math.max(0,this.dodgeCooldown-e),this.invulnerable=Math.max(0,this.invulnerable-e),this.hurt=Math.max(0,this.hurt-e),this.turnCamera(this.target?0:(Number(this.keys.has(`ArrowRight`))-Number(this.keys.has(`ArrowLeft`)))*e*1.8,(Number(this.keys.has(`ArrowUp`))-Number(this.keys.has(`ArrowDown`)))*e);let n=this.movementVector(),r=this.shieldHeld()&&this.attackElapsed<0&&this.dodgeTime<=0,i=r?2.8:this.save.age===`adult`?7:6.5,a=this.dodgeTime>0?this.velocity.clone().multiplyScalar(e):n.clone().multiplyScalar(e*i*(this.attackTime>0?.45:1)),o=t.x,s=t.z,c=this.moveActor(t.x,t.z,a.x,a.z);t.x=c.x,t.z=c.z;for(let e of this.enemies){if(e.state===`dead`)continue;let n=t.x-e.x,r=t.z-e.z,i=Math.hypot(n,r),a=e.boss?1.32:.8;if(i<a&&i>.001){let e=this.moveActor(t.x,t.z,n/i*(a-i),r/i*(a-i));t.x=e.x,t.z=e.z}}for(let e of this.world.interactables){if(e.kind!==`npc`)continue;let n=t.x-e.x,r=t.z-e.z,i=Math.hypot(n,r);if(i<.72&&i>.001){let e=this.moveActor(t.x,t.z,n/i*(.72-i),r/i*(.72-i));t.x=e.x,t.z=e.z}}this.updateBlock(e,n);let l=Math.hypot(t.x-o,t.z-s);if(this.followCamera(t.x-o,t.z-s,e),t.y=this.ground(t.x,t.z)+(this.dodgeTime>0?Math.sin(this.dodgeTime/.42*Math.PI)*.4:0),this.target?.state===`dead`&&(this.target=Al(t,this.lockCandidates())),this.target){if(Math.hypot(t.x-this.target.x,t.z-this.target.z)>23)this.target=null;else{let n=Math.atan2(-(this.target.x-t.x),-(this.target.z-t.z));this.attackElapsed<0&&(this.hero.group.rotation.y=n),this.dragging||(this.yaw+=Nl(this.yaw,n)*Math.min(1,e*3))}}else if(n.lengthSq()>.01&&this.attackTime<=0){let t=Math.atan2(-n.x,-n.z);this.hero.group.rotation.y+=Math.atan2(Math.sin(t-this.hero.group.rotation.y),Math.cos(t-this.hero.group.rotation.y))*Math.min(1,e*14)}let u=l>e*.15&&this.dodgeTime<=0;this.walkBlend=ge.damp(this.walkBlend,u?Math.min(1,l/(e*i)):0,14,e);let d=this.gait;this.gait+=l*2.1,u&&zl(d,this.gait)&&this.sound.step(Rl(!!this.world.dungeon,wo(t.x,t.z),$c(t.x,t.z)));let f=Math.sin(this.gait)*.48*this.walkBlend;this.hero.legs[0].rotation.x=f,this.hero.legs[1].rotation.x=-f,this.guardBlend=ge.damp(this.guardBlend,+!!r,18,e),this.hero.arms[0].rotation.set(ge.lerp(-f*.65,.85,this.guardBlend),0,-.1),this.hero.arms[1].rotation.set(.1+f*.5,0,.08),this.hero.forearms[0].rotation.set(ge.lerp(.24,1.2,this.guardBlend),0,0),this.hero.shield.rotation.set(-2.05*this.guardBlend,Math.PI/2*this.guardBlend,0),this.hero.forearms[1].rotation.set(.2+this.walkBlend*.15,0,0),this.hero.sword.rotation.x=-.55,this.hero.body.rotation.set(this.dodgeTime>0?.48:this.walkBlend*.035,Math.sin(this.gait)*.035*this.walkBlend,0),this.hero.body.position.y=this.hero.bodyHeight+Math.abs(Math.sin(this.gait))*.027*this.walkBlend+Math.sin(this.elapsed*1.8)*.006,this.hero.group.visible=!0,this.updateAttack(e),this.world.dungeon||this.save.noticed.push(...Oo(this.save,t.x,t.z)),this.currentInteraction=this.nearest(),this.ui.prompt(this.currentInteraction?.label||``)}updateEnemies(e){let t=this.hero.group.position;for(let n of this.enemies){if(n.state===`dead`)continue;let r=Math.hypot(t.x-n.x,t.z-n.z),i=this.world.dungeon?n.boss?this.arenaClear&&t.z<-22:this.puzzleSolved&&t.z<4&&t.z>-21:r<(n.kind===`warder`?14:11);if(n.hitFlash=Math.max(0,n.hitFlash-e),n.mesh.scale.setScalar(1+n.hitFlash*.25),(n.state===`idle`||n.state===`chase`)&&(n.facing=Math.atan2(-(t.x-n.x),-(t.z-n.z))),n.mesh.rotation.y=n.facing,n.phase+=e,n.mesh.position.y=this.ground(n.x,n.z)+Math.sin(n.phase*3)*.06,n.orb&&(n.orb.position.y=2.95+Math.sin(n.phase*2.2)*.12),!i){n.state=`idle`,this.clearMarks(n);continue}if(n.state===`idle`&&(n.state=`chase`),n.timer-=e,n.cooldown=Math.max(0,n.cooldown-e),n.state===`chase`){let i=this.clearSight(n.x,n.z,t.x,t.z),a=n.forced?n.forced:i?n.boss?Ko(Ho[this.world.dungeon?.id??``]??[],r,n.cooldown,Math.random()):this.guardianMove(n,r):null;if(a)this.beginWindup(n,a);else{let i=n.kind===`warder`?$o(r):1,a=(t.x-n.x)/r*e*n.speed*i,o=(t.z-n.z)/r*e*n.speed*i;i&&this.moveEnemy(n,a,o)}}else n.state===`windup`?this.windup(n,r):n.state===`strike`?this.strike(n,e):n.state===`stagger`?(n.mesh.rotation.z=Math.sin(n.phase*22)*.07,n.timer<=0&&(n.mesh.rotation.z=0,n.state=`chase`)):n.state===`recover`&&n.timer<=0&&(n.state=`chase`);n.mesh.position.x=n.x,n.mesh.position.z=n.z}let n=this.enemies.find(e=>e.boss&&e.state!==`dead`&&this.hero.group.position.z<-21);this.ui.wardenBar(n?this.world.dungeon.boss:null,n?n.hp/n.maxHp:1)}guardianMove(e,t){return e.kind===`skirmisher`?t<Zo.skirmisher.reach?`charge`:null:e.kind===`warder`?e.cooldown<=0&&t<=Zo.warder.reach?`volley`:null:t<Zo.guardian.reach?`slam`:null}windupTime(e){return e.boss?Uo[e.move].windup:Zo[e.kind].windup}dashSpec(e){return e.boss?Uo.charge:{length:Zo.skirmisher.lunge,dash:Zo.skirmisher.dash,halfWidth:Zo.skirmisher.halfWidth}}beginWindup(e,t){let n=this.hero.group.position;if(e.forced=null,e.move=t,e.state=`windup`,e.struck=!1,e.timer=this.windupTime(e),e.facing=Math.atan2(-(n.x-e.x),-(n.z-e.z)),t===`charge`&&e.lane){let t=this.dashSpec(e);e.from={x:e.x,z:e.z},e.to=Xo(e.x,e.z,n.x,n.z,t.length);let r=e.to.x-e.x,i=e.to.z-e.z;e.lane.position.set((e.x+e.to.x)/2,this.ground(e.x,e.z)+.07,(e.z+e.to.z)/2),e.lane.rotation.y=Math.atan2(r,i),e.lane.scale.set(t.halfWidth*2,1,t.length),e.lane.visible=!0}else t===`shockwave`&&e.wave?(e.wave.position.set(e.x,this.ground(e.x,e.z)+.08,e.z),e.wave.scale.setScalar(Uo.shockwave.reach),e.wave.visible=!0):t===`volley`&&(e.targets=e.boss?Yo(e.x,e.z,n.x,n.z):[{x:n.x,z:n.z}],e.spots.forEach((t,n)=>{let r=e.targets[n];t.position.set(r.x,this.ground(r.x,r.z)+.07,r.z),t.scale.setScalar(e.boss?Uo.volley.radius:Zo.warder.radius),t.visible=!0}))}windup(e,t){let n=this.hero.group.position,r=this.windupTime(e),i=.35+Math.sin(this.elapsed*16)*.22,a=1-Math.max(0,e.timer)/r;if(e.move===`slam`)ql(e.indicator,i);else if(e.move===`charge`&&e.lane)ql(e.lane,.18+a*.3);else if(e.move===`shockwave`&&e.wave)ql(e.wave,i);else if(e.move===`volley`)for(let t of e.spots)ql(t,.15+a*.4);if(e.mesh.rotation.x=-.16*a,e.stone&&e.move===`volley`){let t=Math.max(0,Math.min(1,(.5-e.timer)/.5)),n=e.targets[0];e.stone.visible=t>0,n&&e.stone.position.set(e.x+(n.x-e.x)*t,this.ground(e.x,e.z)+2.9*(1-t)+Math.sin(t*Math.PI)*3,e.z+(n.z-e.z)*t)}if(e.timer>0)return;e.state=`strike`,e.mesh.rotation.x=.22;let o=this.ground(e.x,e.z);if(e.move===`slam`)e.timer=.18,t<(e.boss?Uo.slam.max:Zo.guardian.reach)+.35&&aa(e.facing,n.x-e.x,n.z-e.z,.15)&&this.clearSight(e.x,e.z,n.x,n.z)&&this.hitPlayer(e,e.boss?2:1),this.burst(e.x,o+.2,e.z,`#e5b06e`,e.boss?20:7),e.boss&&this.shakeCamera(.55);else if(e.move===`charge`)e.timer=this.dashSpec(e).dash,this.sound.swing(e.boss?2:0);else if(e.move===`shockwave`)e.timer=Uo.shockwave.travel,e.waveRadius=.8,this.burst(e.x,o+.2,e.z,`#f0a35e`,16),this.sound.hit(),this.shakeCamera(.7);else if(e.move===`volley`){e.timer=.25;let t=e.boss?Uo.volley.radius:Zo.warder.radius;for(let r of e.targets)this.burst(r.x,this.ground(r.x,r.z)+.2,r.z,`#e9b26c`,e.boss?9:6),!e.struck&&Math.hypot(n.x-r.x,n.z-r.z)<t+.3&&this.hitPlayer(e,e.boss?2:1);this.sound.hit(),e.boss&&this.shakeCamera(.45)}}strike(e,t){let n=this.hero.group.position;if(e.move===`charge`&&e.timer>0){let r=this.dashSpec(e),i=r.length/r.dash*t,a=e.to.x-e.from.x,o=e.to.z-e.from.z,s=Math.hypot(a,o)||1,c=e.x,l=e.z;this.moveEnemy(e,a/s*i,o/s*i),!e.struck&&qo(c,l,e.x,e.z,n.x,n.z)<r.halfWidth+.4&&this.hitPlayer(e,e.boss?2:1),Math.hypot(e.x-c,e.z-l)<i*.3&&(e.timer=0)}if(e.move===`shockwave`&&e.wave&&e.timer>0){let r=e.waveRadius;e.waveRadius=Math.min(Uo.shockwave.reach,e.waveRadius+Uo.shockwave.reach/Uo.shockwave.travel*t),e.wave.scale.setScalar(e.waveRadius),ql(e.wave,.75),!e.struck&&Jo(Math.hypot(n.x-e.x,n.z-e.z),r,e.waveRadius)&&this.hitPlayer(e,2)}e.state!==`strike`||e.timer>0||(e.state=`recover`,e.timer=e.boss?Uo[e.move].recover:Zo[e.kind].recover,e.kind===`warder`&&!e.boss&&(e.cooldown=Zo.warder.cooldown+Math.random()),e.boss&&e.move!==`slam`&&(e.cooldown=Wo(this.world.dungeon?.id===`crown`&&e.hp<e.maxHp/2,Math.random())),e.mesh.rotation.z=0,e.mesh.rotation.x=0,this.clearMarks(e))}hitPlayer(e,t){e.struck=!0;let n=!e.boss||Go(e.move);this.damagePlayer(t,e,!n)===`guarded`&&(e.state=`stagger`,e.timer=e.boss?2.2:1.3,this.clearMarks(e),e.mesh.rotation.x=0,this.burst(e.x,this.ground(e.x,e.z)+1.6,e.z,`#f3e2b0`,8))}wardenAwake(){return!!this.world.dungeon&&this.arenaClear&&this.hero.group.position.z<-22&&this.enemies.some(e=>e.boss&&e.state!==`dead`)}clearMarks(e){ql(e.indicator,0);for(let t of e.marks.children)t.visible=!1}shake=0;shakeOffset=new W;shakeCamera(e){this.rumble(`impact`),this.settings.reducedMotion||(this.shake=Math.max(this.shake,e))}damagePlayer(e,t,n=!1){if(this.invulnerable>0||this.ui.panel)return`ignored`;let r=this.hero.group.position;if(!n&&this.shieldHeld()&&this.attackElapsed<0&&this.dodgeTime<=0&&(!t||aa(this.hero.group.rotation.y,t.x-r.x,t.z-r.z,.35)))return this.sound.clang(),this.rumble(`guard`),this.hitStop=.035,this.invulnerable=.4,this.ui.toast(`Guarded. Strike while the enemy recovers.`),`guarded`;if(this.save.health=Math.max(0,this.save.health-e),this.hurt=.7,this.hitStop=.06,this.attackElapsed=-1,this.attackTime=0,this.attackQueued=!1,this.recoil=-1,this.invulnerable=1,this.sound.hit(),this.rumble(`hurt`),this.settings.reducedMotion||(this.ui.el(`damage-flash`).style.opacity=`.7`,setTimeout(()=>this.ui.el(`damage-flash`).style.opacity=`0`,170)),this.refreshHUD(),go(this.save.health)&&this.sound.heartbeat(),this.save.health<=0){let e=this.checkpoint();this.ui.dialogue(`A BREATH, THEN ANOTHER`,`The dark does not get the last word. You wake ${e}, sword still in hand. Watch the golden warning rings. Dodge before the blow, then strike as the guardian rests.`)}return`hit`}checkpoint(){this.raiseVeil(),this.save.health=this.save.maxHealth;let e;if(this.world.dungeon){let t=this.restartChamber();e=t===`puzzle`?`at the sanctuary entrance`:t===`guardians`?`before the guardian hall`:`before the warden's chamber`,this.ui.toast(t===`puzzle`?`Returned to the sanctuary entrance.`:`Returned to the last broken seal. Your progress here holds.`)}else{let t=this.hero.group.position,n=xo(this.save,t.x,t.z);this.save.position={x:n.x,z:n.z},this.loadWorld(),e=`near ${n.name}`,this.ui.toast(`Returned safely to ${n.name}.`)}return this.invulnerable=2,this.persist(),e}restartChamber(){let e=bo(this.puzzleSolved,this.arenaClear);for(let e of this.enemies){if(e.state===`dead`){e.fall>=0&&(e.fall=-1,e.mesh.visible=!1);continue}e.hp=e.maxHp,e.x=e.homeX,e.z=e.homeZ,e.state=`idle`,e.hitFlash=0,e.mesh.rotation.set(0,e.facing,0),e.mesh.position.set(e.x,this.ground(e.x,e.z),e.z),e.cooldown=1.5,e.forced=null,this.clearMarks(e)}return this.attackElapsed=-1,this.attackTime=0,this.attackQueued=!1,this.recoil=-1,this.hitStop=0,this.dodgeTime=0,this.trail.visible=!1,this.target=null,this.keys.clear(),this.hero.group.position.set(e.x,this.ground(e.x,e.z),e.z),this.hero.group.rotation.y=0,this.yaw=0,this.snapCamera(),this.refreshHUD(),e.chamber}burst(e,t,n,r,i){this.sparks.burst(e,t,n,r,i)}raiseVeil(){this.settings?.reducedMotion||(this.veilTime=Xl,this.drawVeil())}drawVeil(){if(!this.veil)return;let e=Math.min(1,this.veilTime/.53);this.veil.style.opacity=this.veilTime>0?(e*e).toFixed(3):`0`}updateEffects(e){this.veilTime>0&&(this.veilTime=Math.max(0,this.veilTime-e),this.drawVeil()),this.sparks.update(e);for(let t of this.world.interactables)(t.kind===`firefly`||t.kind===`relic`)&&(t.mesh.rotation.y+=e*.8,t.mesh.position.y=(t.kind===`relic`?1.7:this.ground(t.x,t.z)+1.5)+Math.sin(this.elapsed*2+t.x)*.14);this.world.particles.rotation.y=Math.sin(this.elapsed*.025)*.025,this.world.particles.position.y=Math.sin(this.elapsed*.4)*.3}updateFalls(e){for(let t of this.enemies){if(t.fall<0)continue;let n=t.boss?rs.warden:rs.guardian,r=as(t.fall,n);t.fall+=e;let i=as(t.fall,n),a=this.ground(t.x,t.z);if(i.landed&&!r.landed&&this.burst(t.x,a+.3,t.z,`#cdbd96`,t.boss?24:10),i.gone){t.fall=-1,t.mesh.visible=!1;continue}t.mesh.rotation.x=i.tilt,t.mesh.position.y=a-i.sink*t.top*1.1}}cameraFocus(){let e=this.hero.group.position;return new W(e.x,this.ground(e.x,e.z)+(this.save.age===`adult`?1.65:1.38),e.z)}constrainCamera(e,t){this.world.dungeon||(t.y=Math.max(t.y,$(t.x,t.z)+.35));let n=this.collision.cast(e,t,.24);return n<1&&t.lerpVectors(e,t,Math.max(0,n-.025)),t}cameraDestination(e){let t=Math.cos(this.pitch)*this.distance;return this.constrainCamera(e,new W(e.x+Math.sin(this.yaw)*t,e.y+Math.sin(this.pitch)*this.distance,e.z+Math.cos(this.yaw)*t))}snapCamera(){let e=this.cameraFocus();this.camera.position.copy(this.cameraDestination(e)),this.camera.lookAt(e)}updateCamera(e){if(this.recentering){let t=Nl(this.yaw,this.hero.group.rotation.y);(this.target||Math.abs(t)<.004)&&(this.recentering=!1),this.yaw+=Math.abs(t)<.004?t:t*Math.min(1,e*12)}this.camera.position.sub(this.shakeOffset),this.shakeOffset.set(0,0,0);let t=this.hero.group.position,n=this.cameraFocus(),r=this.cameraDestination(n),i=r.distanceToSquared(n)<this.camera.position.distanceToSquared(n);if(this.camera.position.lerp(r,i?1:1-Math.exp(-e*8)),this.constrainCamera(n,this.camera.position),this.camera.lookAt(n),this.shake>0){this.settings.reducedMotion&&(this.shake=0);let t=this.shake*this.shake*.35;this.shakeOffset.set((Math.random()-.5)*t,(Math.random()-.5)*t,(Math.random()-.5)*t),this.camera.position.add(this.shakeOffset),this.shake=Math.max(0,this.shake-e*2.4)}let a=this.camera.position.distanceTo(n);this.hero.group.visible=a>Il,this.fadeHero(Ll(a)),this.sun.position.set(t.x-45,70,t.z-55),this.sun.target.position.set(t.x,0,t.z)}refreshHUD(){this.region=this.world.dungeon?.name||wo(this.hero.group.position.x,this.hero.group.position.z);let e=this.world.dungeon,t,n=this.enemies.filter(e=>!e.boss),r=n.filter(e=>e.state===`dead`).length;e&&(t=this.puzzleSolved?this.arenaClear?this.bossDead?`Claim ${e.relic} at the far end of the chamber.`:`Face ${e.boss}. Watch the warning ring; dodge, then strike.`:`Defeat the four guardians to break the second seal · ${r} / ${n.length}\u00a0fallen`:e.hint),this.ui.hud(this.save,this.region,t);let i=this.hero.group.position,a=this.save.marker;a&&!e&&this.started&&Math.hypot(i.x-a.x,i.z-a.z)<6&&(this.save.marker=null,this.sound.ui(),this.ui.toast(`You reached your marker.`),this.persist(!1));let o=this.destination=!e&&this.started?Mo(this.save,i.x,i.z):null;this.ui.el(`compass-text`).textContent=o?`${o.name} · ${Lo(o.paces??Math.hypot(i.x-o.x,i.z-o.z))}`:`N`;let s=this.ui.el(`compass-arrow`);s.hidden=!o,s.classList.toggle(`marker`,!!o?.marker),this.updateCompass()}updateCompass(){let e=this.destination;if(!e)return;let t=this.hero.group.position,n=this.camera.position,r=zo(Math.atan2(n.x-t.x,n.z-t.z),t.x,t.z,e.x,e.z);Math.abs(r-this.compassAngle)<.005||(this.compassAngle=r,this.ui.el(`compass-arrow`).style.transform=`rotate(${r.toFixed(3)}rad)`)}minimap(){let e=this.ui.el(`minimap`).getContext(`2d`),t=this.hero.group.position;e.clearRect(0,0,160,160),e.save(),e.beginPath(),e.arc(80,80,79,0,Math.PI*2),e.clip(),e.fillStyle=`#203b33cc`,e.fillRect(0,0,160,160);let n=this.world.dungeon?1.7:1.3,r=e=>80+(e-t.x)*n,i=e=>80+(e-t.z)*n;if(e.strokeStyle=`#cbbb8240`,e.lineWidth=3,this.world.dungeon){if(e.strokeStyle=`#cbbb8288`,e.lineWidth=1,e.strokeRect(r(-18),i(-54),36*n,88*n),this.crackBroken&&this.world.crack){let t=this.world.crack.x>0?18:-18-(X.outer-18);e.strokeRect(r(t),i(X.z-X.half),(X.outer-18)*n,2*X.half*n)}e.fillStyle=`#dab987`,e.fillRect(r(0)-2,i(-45)-2,4,4)}else{e.beginPath(),e.moveTo(r(0),i(78)),e.lineTo(r(0),i(-122));for(let t of Ka)e.moveTo(r(0),i(t.z>30?40:0)),e.lineTo(r(t.x),i(t.z));e.stroke();for(let t of Ka)e.fillStyle=this.save.completed.includes(t.id)?`#a7d79d`:t.age===this.save.age?`#dfbd77`:`#7d9080`,e.save(),e.translate(r(t.x),i(t.z)),e.rotate(Math.PI/4),e.fillRect(-3,-3,6,6),e.restore();e.fillStyle=`#d6caa1`,e.fillRect(r(0)-3,i(48)-3,6,6)}let a=(r,i,a,o)=>{let s=Bo(r-t.x,i-t.z,n,72);e.save(),e.translate(80+s.x,80+s.y),e.strokeStyle=e.fillStyle=a,e.lineWidth=2,e.beginPath(),s.onRim?(e.rotate(s.angle),e.moveTo(0,-6),e.lineTo(5,3),e.lineTo(-5,3),e.closePath(),e.fill()):o?(e.rotate(Math.PI/4),e.strokeRect(-4,-4,8,8)):(e.arc(0,0,5,0,Math.PI*2),e.stroke()),e.restore()};if(!this.world.dungeon){let e=jo(this.save,t.x,t.z);e&&a(e.x,e.z,`#ffe2a2`,!1);let n=this.save.marker;n&&a(n.x,n.z,`#bfe6f2`,!0)}for(let t of this.enemies){if(t.state===`dead`)continue;let n=r(t.x),a=i(t.z);e.fillStyle=`#d79b7b`,e.beginPath(),!t.boss&&t.kind===`skirmisher`?(e.moveTo(n,a-2.6),e.lineTo(n+2.4,a+1.8),e.lineTo(n-2.4,a+1.8)):!t.boss&&t.kind===`warder`?(e.moveTo(n,a-2.6),e.lineTo(n+2.2,a),e.lineTo(n,a+2.6),e.lineTo(n-2.2,a)):e.arc(n,a,t.boss?3:1.8,0,Math.PI*2),e.fill()}e.save(),e.translate(80,80),e.rotate(-this.hero.group.rotation.y),e.fillStyle=`#fae6b1`,e.beginPath(),e.moveTo(0,-6),e.lineTo(4,5),e.lineTo(0,3),e.lineTo(-4,5),e.closePath(),e.fill(),e.restore(),e.fillStyle=`#ddd4b2`,e.font=`9px sans-serif`,e.textAlign=`center`,e.fillText(`N`,80,14),e.restore()}simulate(e){this.save.elapsed+=e,this.settings.reducedMotion&&(this.hitStop=0),this.hitStop>0?this.hitStop=Math.max(0,this.hitStop-e):(this.updatePlayer(e),this.save.story.prologue>=5&&this.updateEnemies(e),this.updateFalls(e)),this.updateCamera(e)}frame(e){requestAnimationFrame(e=>this.frame(e));let t=this.last?(e-this.last)/1e3:1/60,n=Math.min(t,.05);if(document.hidden||this.lostGraphics){this.last=e;return}let r=performance.now();if(this.last=e,this.elapsed+=n,this.frameTimes.length>120&&this.frameTimes.shift(),t<.1&&this.frameTimes.push(t*1e3),this.quality.sample(t*1e3),this.pollGamepad(n),this.started&&!this.ui.panel&&!this.inspectMode&&(this.simulate(n),this.sound.ambient(n,this.save.age===`adult`,this.region,!!this.world.dungeon),this.sound.battle(n,this.wardenAwake()),this.saveTime+=n,this.saveTime>25&&(this.saveTime=0,this.persist(!1))),!this.started){let e=this.settings.reducedMotion?0:this.elapsed;this.camera.position.set(6+Math.sin(e*.025)*.6,5.6+Math.sin(e*.04)*.12,69),this.camera.lookAt(-4,2.8,44),this.hero.group.rotation.y=-.5}this.updateEffects(n),this.hudTime+=n,this.hudTime>.16&&(this.hudTime=0,this.started&&(this.refreshHUD(),this.minimap())),Cc.value=this.elapsed,wc.value.copy(this.camera.position),Tc.value=[42,58,75,92][this.quality.level],Lc(this.world,this.camera.position,this.quality.level),this.shadowClock+=n,this.started&&!this.inspectMode&&this.shadowClock>=this.quality.profile.shadowInterval&&(this.renderer.shadowMap.needsUpdate=!0,this.shadowClock=0),this.updateLockMarker(),this.updateThreats(),this.started&&this.updateCompass(),this.worldRenderer.render(this.quality.post,this.focusDistance(),n),this.renderTimes.push(performance.now()-r),this.renderTimes.length>120&&this.renderTimes.shift()}focusDistance(){return this.started?this.ui.panel===`dialogue`?this.camera.position.distanceTo(this.hero.group.position):0:this.camera.position.distanceTo($l)}expose(){window.__BELL_OF_AGES__={getState:()=>({combat:{elapsed:this.attackElapsed,combo:this.combo,queued:this.attackQueued,recoil:this.recoil,hitCount:this.hitEnemies.size,blade:{base:this.bladeBase.toArray(),tip:this.bladeTip.toArray()}},cameraClear:this.collision.cast(this.cameraFocus(),this.camera.position,.2)>=.999,playerBlocked:this.blocked(this.hero.group.position.x,this.hero.group.position.z),camera:{x:this.camera.position.x,y:this.camera.position.y,z:this.camera.position.z},facing:this.hero.group.rotation.y,story:structuredClone(this.save.story),age:this.save.age,health:this.save.health,maxHealth:this.save.maxHealth,completed:[...this.save.completed],crystals:this.save.crystals,position:{x:this.hero.group.position.x,y:this.hero.group.position.y,z:this.hero.group.position.z},region:this.region,dungeon:this.world.dungeon?.id||null,puzzleSolved:this.puzzleSolved,alcove:{hits:this.crackHits,broken:this.crackBroken},carvings:[...this.save.carvings],puzzleProgress:this.puzzleProgress,arenaClear:this.arenaClear,bossDead:this.bossDead,panel:this.ui.panel,interaction:this.nearest()?.id||null,enemies:this.enemies.map(e=>({x:e.x,z:e.z,hp:e.hp,boss:e.boss,state:e.state,move:e.move,kind:e.boss?`warden`:e.kind})),shake:this.shake,render:{drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,averageFrameMs:this.frameTimes.reduce((e,t)=>e+t,0)/Math.max(1,this.frameTimes.length),p95FrameMs:[...this.frameTimes].sort((e,t)=>e-t)[Math.floor(this.frameTimes.length*.95)]||0,cpuSubmitMs:this.renderTimes.reduce((e,t)=>e+t,0)/Math.max(1,this.renderTimes.length),quality:this.quality.fidelity,passes:this.quality.post?this.worldRenderer.passes:null,veil:this.veilTime,shadowSize:this.sun.shadow.mapSize.x,resolutionScale:this.quality.scale,pixelRatio:this.renderer.getPixelRatio(),textures:this.renderer.info.memory.textures,visibleNatureCells:this.world.nature?.filter(e=>e.mesh.visible).length||0,totalNatureCells:this.world.nature?.length||0},saveAvailable:!!this.readSave(),won:this.save.won})}}};export{tu as Game,Vi as n,Ri as r,Hl as t};