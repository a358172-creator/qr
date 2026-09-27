import{c as qa,N as Ct,S as Za,C as je,R as $a,V as mt,w as Hn,M as tn,F as Ea,W as si,a as Yt,b as at,L as jt,H as Sn,U as Ot,D as Rt,B as vt,d as nn,e as Ie,f as xn,p as ja,E as Qa,g as qe,P as hn,A as Ja,h as bn,i as bt,j as gn,k as $n,l as an,m as rn,n as Sa,o as er,q as on,r as Kt,s as dt,O as tr,t as nr,u as jn,v as Vt,x as vn,y as ir,z as ar,G as $t,I as rr,J as or,K as sr,Q as lr,T as cr,X as fr,Y as dr,Z as ur,_ as pr,$ as hr,a0 as mr,a1 as _r,a2 as gr,a3 as vr,a4 as Er,a5 as Sr,a6 as xr,a7 as Mr,a8 as Cn,a9 as kt,aa as cn,ab as Tr,ac as Jt,ad as Ar,ae as Rr,af as br,ag as Cr,ah as xa,ai as Pr,aj as Dr,ak as Lr,al as Ma,am as Be,an as Ur,ao as wr,ap as yr,aq as Ft,ar as Qn,as as en,at as Ta,au as Nt,av as At,aw as En,ax as Aa,ay as Ra,az as ba,aA as Ca,aB as Mn,aC as Ir,aD as Nr,aE as Or,aF as Fr,aG as Pa,aH as It,aI as Br,aJ as Hr,aK as Gr,aL as Da,aM as Vr,aN as La,aO as Ua,aP as Pn,aQ as Dn,aR as Ln,aS as Un,aT as Ke,aU as li,aV as ci,aW as fi,aX as di,aY as ui,aZ as pi,a_ as hi,a$ as mi,b0 as _i,b1 as gi,b2 as vi,b3 as Ei,b4 as Si,b5 as xi,b6 as Mi,b7 as Ti,b8 as Ai,b9 as Ri,ba as bi,bb as Ci,bc as Pi,bd as Di,be as Li,bf as Ui,bg as wi,bh as yi,bi as Ii,bj as Ni,bk as Gn,bl as Vn,bm as kn,bn as zn,bo as Wn,bp as Xn,bq as Yn,br as kr,bs as Oi,bt as zr,bu as mn,bv as Wr,bw as Fi,bx as Bi,by as Hi,bz as Kn,bA as qn,bB as Xr,bC as wa,bD as Yr,bE as Kr,bF as qr,bG as ya,bH as Gi,bI as Ia,bJ as Vi,bK as Na,bL as Zr,bM as $r,bN as jr,bO as ki,bP as ht,bQ as Qr,bR as Jr,bS as eo,bT as to,bU as no,bV as io,bW as ao,bX as ro,bY as oo,bZ as so,b_ as lo,b$ as co,c0 as fo,c1 as uo,c2 as po,c3 as ho,c4 as mo,c5 as _o,c6 as go,c7 as Xt,c8 as zt,c9 as zi,ca as Wi,cb as vo,cc as Eo,cd as So,ce as Xi,cf as xo,cg as Mo,ch as To,ci as Ao}from"./three-core-5IYGOvDt.js";function Oa(){let e=null,n=!1,t=null,i=null;function s(r,d){t(r,d),i=e.requestAnimationFrame(s)}return{start:function(){n!==!0&&t!==null&&(i=e.requestAnimationFrame(s),n=!0)},stop:function(){e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(r){t=r},setContext:function(r){e=r}}}function Ro(e){const n=new WeakMap;function t(c,T){const x=c.array,M=c.usage,_=x.byteLength,v=e.createBuffer();e.bindBuffer(T,v),e.bufferData(T,x,M),c.onUploadCallback();let g;if(x instanceof Float32Array)g=e.FLOAT;else if(typeof Float16Array<"u"&&x instanceof Float16Array)g=e.HALF_FLOAT;else if(x instanceof Uint16Array)c.isFloat16BufferAttribute?g=e.HALF_FLOAT:g=e.UNSIGNED_SHORT;else if(x instanceof Int16Array)g=e.SHORT;else if(x instanceof Uint32Array)g=e.UNSIGNED_INT;else if(x instanceof Int32Array)g=e.INT;else if(x instanceof Int8Array)g=e.BYTE;else if(x instanceof Uint8Array)g=e.UNSIGNED_BYTE;else if(x instanceof Uint8ClampedArray)g=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+x);return{buffer:v,type:g,bytesPerElement:x.BYTES_PER_ELEMENT,version:c.version,size:_}}function i(c,T,x){const M=T.array,_=T.updateRanges;if(e.bindBuffer(x,c),_.length===0)e.bufferSubData(x,0,M);else{_.sort((g,I)=>g.start-I.start);let v=0;for(let g=1;g<_.length;g++){const I=_[v],L=_[g];L.start<=I.start+I.count+1?I.count=Math.max(I.count,L.start+L.count-I.start):(++v,_[v]=L)}_.length=v+1;for(let g=0,I=_.length;g<I;g++){const L=_[g];e.bufferSubData(x,L.start*M.BYTES_PER_ELEMENT,M,L.start,L.count)}T.clearUpdateRanges()}T.onUploadCallback()}function s(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const T=n.get(c);T&&(e.deleteBuffer(T.buffer),n.delete(c))}function d(c,T){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const M=n.get(c);(!M||M.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const x=n.get(c);if(x===void 0)n.set(c,t(c,T));else if(x.version<c.version){if(x.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(x.buffer,c,T),x.version=c.version}}return{get:s,remove:r,update:d}}var bo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Co=`#ifdef USE_ALPHAHASH
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
#endif`,Po=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Do=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Uo=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wo=`#ifdef USE_AOMAP
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
#endif`,yo=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Io=`#ifdef USE_BATCHING
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
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,No=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Oo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Fo=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bo=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ho=`#ifdef USE_IRIDESCENCE
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
#endif`,Go=`#ifdef USE_BUMPMAP
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
#endif`,Vo=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ko=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wo=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xo=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yo=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ko=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,qo=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Zo=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,$o=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,jo=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Qo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jo=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,es=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ts=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ns="gl_FragColor = linearToOutputTexel( gl_FragColor );",is=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,as=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,rs=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,os=`#ifdef USE_ENVMAP
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
#endif`,ss=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ls=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,cs=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fs=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ds=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,us=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ps=`#ifdef USE_GRADIENTMAP
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
}`,hs=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ms=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_s=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gs=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
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
#endif`,vs=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
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
	#endif
#endif`,Es=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ss=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xs=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ms=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ts=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,As=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Rs=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bs=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Cs=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ps=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ds=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ls=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Us=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ws=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ys=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Is=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ns=`#if defined( USE_POINTS_UV )
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
#endif`,Os=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Fs=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Bs=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Hs=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gs=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vs=`#ifdef USE_MORPHTARGETS
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
#endif`,ks=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zs=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ws=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Xs=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ys=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ks=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qs=`#ifdef USE_NORMALMAP
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
#endif`,Zs=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$s=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,js=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qs=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Js=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,el=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,tl=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,il=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,al=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ol=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sl=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ll=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
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
#endif`,cl=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,fl=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,dl=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ul=`#ifdef USE_SKINNING
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
#endif`,pl=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hl=`#ifdef USE_SKINNING
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
#endif`,ml=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_l=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vl=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,El=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sl=`#ifdef USE_TRANSMISSION
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
#endif`,xl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ml=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Al=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Rl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bl=`uniform sampler2D t2D;
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
}`,Cl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pl=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ll=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ul=`#include <common>
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
}`,wl=`#if DEPTH_PACKING == 3200
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
}`,yl=`#define DISTANCE
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
}`,Il=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Nl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ol=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fl=`uniform float scale;
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
}`,Bl=`uniform vec3 diffuse;
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
}`,Hl=`#include <common>
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
}`,Gl=`uniform vec3 diffuse;
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
}`,Vl=`#define LAMBERT
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
}`,kl=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,zl=`#define MATCAP
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
}`,Wl=`#define MATCAP
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
}`,Xl=`#define NORMAL
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
}`,Yl=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Kl=`#define PHONG
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
}`,ql=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,Zl=`#define STANDARD
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
}`,$l=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,jl=`#define TOON
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
}`,Ql=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Jl=`uniform float size;
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
}`,ec=`uniform vec3 diffuse;
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
}`,tc=`#include <common>
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
}`,nc=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,ic=`uniform float rotation;
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
}`,ac=`uniform vec3 diffuse;
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
}`,ye={alphahash_fragment:bo,alphahash_pars_fragment:Co,alphamap_fragment:Po,alphamap_pars_fragment:Do,alphatest_fragment:Lo,alphatest_pars_fragment:Uo,aomap_fragment:wo,aomap_pars_fragment:yo,batching_pars_vertex:Io,batching_vertex:No,begin_vertex:Oo,beginnormal_vertex:Fo,bsdfs:Bo,iridescence_fragment:Ho,bumpmap_pars_fragment:Go,clipping_planes_fragment:Vo,clipping_planes_pars_fragment:ko,clipping_planes_pars_vertex:zo,clipping_planes_vertex:Wo,color_fragment:Xo,color_pars_fragment:Yo,color_pars_vertex:Ko,color_vertex:qo,common:Zo,cube_uv_reflection_fragment:$o,defaultnormal_vertex:jo,displacementmap_pars_vertex:Qo,displacementmap_vertex:Jo,emissivemap_fragment:es,emissivemap_pars_fragment:ts,colorspace_fragment:ns,colorspace_pars_fragment:is,envmap_fragment:as,envmap_common_pars_fragment:rs,envmap_pars_fragment:os,envmap_pars_vertex:ss,envmap_physical_pars_fragment:vs,envmap_vertex:ls,fog_vertex:cs,fog_pars_vertex:fs,fog_fragment:ds,fog_pars_fragment:us,gradientmap_pars_fragment:ps,lightmap_pars_fragment:hs,lights_lambert_fragment:ms,lights_lambert_pars_fragment:_s,lights_pars_begin:gs,lights_toon_fragment:Es,lights_toon_pars_fragment:Ss,lights_phong_fragment:xs,lights_phong_pars_fragment:Ms,lights_physical_fragment:Ts,lights_physical_pars_fragment:As,lights_fragment_begin:Rs,lights_fragment_maps:bs,lights_fragment_end:Cs,logdepthbuf_fragment:Ps,logdepthbuf_pars_fragment:Ds,logdepthbuf_pars_vertex:Ls,logdepthbuf_vertex:Us,map_fragment:ws,map_pars_fragment:ys,map_particle_fragment:Is,map_particle_pars_fragment:Ns,metalnessmap_fragment:Os,metalnessmap_pars_fragment:Fs,morphinstance_vertex:Bs,morphcolor_vertex:Hs,morphnormal_vertex:Gs,morphtarget_pars_vertex:Vs,morphtarget_vertex:ks,normal_fragment_begin:zs,normal_fragment_maps:Ws,normal_pars_fragment:Xs,normal_pars_vertex:Ys,normal_vertex:Ks,normalmap_pars_fragment:qs,clearcoat_normal_fragment_begin:Zs,clearcoat_normal_fragment_maps:$s,clearcoat_pars_fragment:js,iridescence_pars_fragment:Qs,opaque_fragment:Js,packing:el,premultiplied_alpha_fragment:tl,project_vertex:nl,dithering_fragment:il,dithering_pars_fragment:al,roughnessmap_fragment:rl,roughnessmap_pars_fragment:ol,shadowmap_pars_fragment:sl,shadowmap_pars_vertex:ll,shadowmap_vertex:cl,shadowmask_pars_fragment:fl,skinbase_vertex:dl,skinning_pars_vertex:ul,skinning_vertex:pl,skinnormal_vertex:hl,specularmap_fragment:ml,specularmap_pars_fragment:_l,tonemapping_fragment:gl,tonemapping_pars_fragment:vl,transmission_fragment:El,transmission_pars_fragment:Sl,uv_pars_fragment:xl,uv_pars_vertex:Ml,uv_vertex:Tl,worldpos_vertex:Al,background_vert:Rl,background_frag:bl,backgroundCube_vert:Cl,backgroundCube_frag:Pl,cube_vert:Dl,cube_frag:Ll,depth_vert:Ul,depth_frag:wl,distanceRGBA_vert:yl,distanceRGBA_frag:Il,equirect_vert:Nl,equirect_frag:Ol,linedashed_vert:Fl,linedashed_frag:Bl,meshbasic_vert:Hl,meshbasic_frag:Gl,meshlambert_vert:Vl,meshlambert_frag:kl,meshmatcap_vert:zl,meshmatcap_frag:Wl,meshnormal_vert:Xl,meshnormal_frag:Yl,meshphong_vert:Kl,meshphong_frag:ql,meshphysical_vert:Zl,meshphysical_frag:$l,meshtoon_vert:jl,meshtoon_frag:Ql,points_vert:Jl,points_frag:ec,shadow_vert:tc,shadow_frag:nc,sprite_vert:ic,sprite_frag:ac},ie={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},Mt={basic:{uniforms:ht([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:ye.meshbasic_vert,fragmentShader:ye.meshbasic_frag},lambert:{uniforms:ht([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new je(0)}}]),vertexShader:ye.meshlambert_vert,fragmentShader:ye.meshlambert_frag},phong:{uniforms:ht([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:ye.meshphong_vert,fragmentShader:ye.meshphong_frag},standard:{uniforms:ht([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag},toon:{uniforms:ht([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new je(0)}}]),vertexShader:ye.meshtoon_vert,fragmentShader:ye.meshtoon_frag},matcap:{uniforms:ht([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:ye.meshmatcap_vert,fragmentShader:ye.meshmatcap_frag},points:{uniforms:ht([ie.points,ie.fog]),vertexShader:ye.points_vert,fragmentShader:ye.points_frag},dashed:{uniforms:ht([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ye.linedashed_vert,fragmentShader:ye.linedashed_frag},depth:{uniforms:ht([ie.common,ie.displacementmap]),vertexShader:ye.depth_vert,fragmentShader:ye.depth_frag},normal:{uniforms:ht([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:ye.meshnormal_vert,fragmentShader:ye.meshnormal_frag},sprite:{uniforms:ht([ie.sprite,ie.fog]),vertexShader:ye.sprite_vert,fragmentShader:ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ye.background_vert,fragmentShader:ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:ye.backgroundCube_vert,fragmentShader:ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ye.cube_vert,fragmentShader:ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ye.equirect_vert,fragmentShader:ye.equirect_frag},distanceRGBA:{uniforms:ht([ie.common,ie.displacementmap,{referencePosition:{value:new Ie},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ye.distanceRGBA_vert,fragmentShader:ye.distanceRGBA_frag},shadow:{uniforms:ht([ie.lights,ie.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:ye.shadow_vert,fragmentShader:ye.shadow_frag}};Mt.physical={uniforms:ht([Mt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag};const fn={r:0,b:0,g:0},Lt=new Ia,rc=new tn;function oc(e,n,t,i,s,r,d){const c=new je(0);let T=r===!0?0:1,x,M,_=null,v=0,g=null;function I(b){let E=b.isScene===!0?b.background:null;return E&&E.isTexture&&(E=(b.backgroundBlurriness>0?t:n).get(E)),E}function L(b){let E=!1;const O=I(b);O===null?a(c,T):O&&O.isColor&&(a(O,1),E=!0);const P=e.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,d):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,d),(e.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function f(b,E){const O=I(E);O&&(O.isCubeTexture||O.mapping===Mn)?(M===void 0&&(M=new dt(new jn(1,1,1),new Ft({name:"BackgroundCubeMaterial",uniforms:Gi(Mt.backgroundCube.uniforms),vertexShader:Mt.backgroundCube.vertexShader,fragmentShader:Mt.backgroundCube.fragmentShader,side:vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),M.geometry.deleteAttribute("normal"),M.geometry.deleteAttribute("uv"),M.onBeforeRender=function(P,N,z){this.matrixWorld.copyPosition(z.matrixWorld)},Object.defineProperty(M.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(M)),Lt.copy(E.backgroundRotation),Lt.x*=-1,Lt.y*=-1,Lt.z*=-1,O.isCubeTexture&&O.isRenderTargetTexture===!1&&(Lt.y*=-1,Lt.z*=-1),M.material.uniforms.envMap.value=O,M.material.uniforms.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,M.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,M.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,M.material.uniforms.backgroundRotation.value.setFromMatrix4(rc.makeRotationFromEuler(Lt)),M.material.toneMapped=at.getTransfer(O.colorSpace)!==Ke,(_!==O||v!==O.version||g!==e.toneMapping)&&(M.material.needsUpdate=!0,_=O,v=O.version,g=e.toneMapping),M.layers.enableAll(),b.unshift(M,M.geometry,M.material,0,0,null)):O&&O.isTexture&&(x===void 0&&(x=new dt(new Ca(2,2),new Ft({name:"BackgroundMaterial",uniforms:Gi(Mt.background.uniforms),vertexShader:Mt.background.vertexShader,fragmentShader:Mt.background.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),Object.defineProperty(x.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(x)),x.material.uniforms.t2D.value=O,x.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,x.material.toneMapped=at.getTransfer(O.colorSpace)!==Ke,O.matrixAutoUpdate===!0&&O.updateMatrix(),x.material.uniforms.uvTransform.value.copy(O.matrix),(_!==O||v!==O.version||g!==e.toneMapping)&&(x.material.needsUpdate=!0,_=O,v=O.version,g=e.toneMapping),x.layers.enableAll(),b.unshift(x,x.geometry,x.material,0,0,null))}function a(b,E){b.getRGB(fn,ya(e)),i.buffers.color.setClear(fn.r,fn.g,fn.b,E,d)}function U(){M!==void 0&&(M.geometry.dispose(),M.material.dispose(),M=void 0),x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0)}return{getClearColor:function(){return c},setClearColor:function(b,E=1){c.set(b),T=E,a(c,T)},getClearAlpha:function(){return T},setClearAlpha:function(b){T=b,a(c,T)},render:L,addToRenderList:f,dispose:U}}function sc(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=v(null);let r=s,d=!1;function c(u,C,B,X,Y){let Z=!1;const W=_(X,B,C);r!==W&&(r=W,x(r.object)),Z=g(u,X,B,Y),Z&&I(u,X,B,Y),Y!==null&&n.update(Y,e.ELEMENT_ARRAY_BUFFER),(Z||d)&&(d=!1,E(u,C,B,X),Y!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(Y).buffer))}function T(){return e.createVertexArray()}function x(u){return e.bindVertexArray(u)}function M(u){return e.deleteVertexArray(u)}function _(u,C,B){const X=B.wireframe===!0;let Y=i[u.id];Y===void 0&&(Y={},i[u.id]=Y);let Z=Y[C.id];Z===void 0&&(Z={},Y[C.id]=Z);let W=Z[X];return W===void 0&&(W=v(T()),Z[X]=W),W}function v(u){const C=[],B=[],X=[];for(let Y=0;Y<t;Y++)C[Y]=0,B[Y]=0,X[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:B,attributeDivisors:X,object:u,attributes:{},index:null}}function g(u,C,B,X){const Y=r.attributes,Z=C.attributes;let W=0;const ne=B.getAttributes();for(const G in ne)if(ne[G].location>=0){const Me=Y[G];let Ue=Z[G];if(Ue===void 0&&(G==="instanceMatrix"&&u.instanceMatrix&&(Ue=u.instanceMatrix),G==="instanceColor"&&u.instanceColor&&(Ue=u.instanceColor)),Me===void 0||Me.attribute!==Ue||Ue&&Me.data!==Ue.data)return!0;W++}return r.attributesNum!==W||r.index!==X}function I(u,C,B,X){const Y={},Z=C.attributes;let W=0;const ne=B.getAttributes();for(const G in ne)if(ne[G].location>=0){let Me=Z[G];Me===void 0&&(G==="instanceMatrix"&&u.instanceMatrix&&(Me=u.instanceMatrix),G==="instanceColor"&&u.instanceColor&&(Me=u.instanceColor));const Ue={};Ue.attribute=Me,Me&&Me.data&&(Ue.data=Me.data),Y[G]=Ue,W++}r.attributes=Y,r.attributesNum=W,r.index=X}function L(){const u=r.newAttributes;for(let C=0,B=u.length;C<B;C++)u[C]=0}function f(u){a(u,0)}function a(u,C){const B=r.newAttributes,X=r.enabledAttributes,Y=r.attributeDivisors;B[u]=1,X[u]===0&&(e.enableVertexAttribArray(u),X[u]=1),Y[u]!==C&&(e.vertexAttribDivisor(u,C),Y[u]=C)}function U(){const u=r.newAttributes,C=r.enabledAttributes;for(let B=0,X=C.length;B<X;B++)C[B]!==u[B]&&(e.disableVertexAttribArray(B),C[B]=0)}function b(u,C,B,X,Y,Z,W){W===!0?e.vertexAttribIPointer(u,C,B,Y,Z):e.vertexAttribPointer(u,C,B,X,Y,Z)}function E(u,C,B,X){L();const Y=X.attributes,Z=B.getAttributes(),W=C.defaultAttributeValues;for(const ne in Z){const G=Z[ne];if(G.location>=0){let ge=Y[ne];if(ge===void 0&&(ne==="instanceMatrix"&&u.instanceMatrix&&(ge=u.instanceMatrix),ne==="instanceColor"&&u.instanceColor&&(ge=u.instanceColor)),ge!==void 0){const Me=ge.normalized,Ue=ge.itemSize,He=n.get(ge);if(He===void 0)continue;const nt=He.buffer,et=He.type,ze=He.bytesPerElement,V=et===e.INT||et===e.UNSIGNED_INT||ge.gpuType===Pa;if(ge.isInterleavedBufferAttribute){const q=ge.data,ce=q.stride,Ce=ge.offset;if(q.isInstancedInterleavedBuffer){for(let Ee=0;Ee<G.locationSize;Ee++)a(G.location+Ee,q.meshPerAttribute);u.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let Ee=0;Ee<G.locationSize;Ee++)f(G.location+Ee);e.bindBuffer(e.ARRAY_BUFFER,nt);for(let Ee=0;Ee<G.locationSize;Ee++)b(G.location+Ee,Ue/G.locationSize,et,Me,ce*ze,(Ce+Ue/G.locationSize*Ee)*ze,V)}else{if(ge.isInstancedBufferAttribute){for(let q=0;q<G.locationSize;q++)a(G.location+q,ge.meshPerAttribute);u.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let q=0;q<G.locationSize;q++)f(G.location+q);e.bindBuffer(e.ARRAY_BUFFER,nt);for(let q=0;q<G.locationSize;q++)b(G.location+q,Ue/G.locationSize,et,Me,Ue*ze,Ue/G.locationSize*q*ze,V)}}else if(W!==void 0){const Me=W[ne];if(Me!==void 0)switch(Me.length){case 2:e.vertexAttrib2fv(G.location,Me);break;case 3:e.vertexAttrib3fv(G.location,Me);break;case 4:e.vertexAttrib4fv(G.location,Me);break;default:e.vertexAttrib1fv(G.location,Me)}}}}U()}function O(){z();for(const u in i){const C=i[u];for(const B in C){const X=C[B];for(const Y in X)M(X[Y].object),delete X[Y];delete C[B]}delete i[u]}}function P(u){if(i[u.id]===void 0)return;const C=i[u.id];for(const B in C){const X=C[B];for(const Y in X)M(X[Y].object),delete X[Y];delete C[B]}delete i[u.id]}function N(u){for(const C in i){const B=i[C];if(B[u.id]===void 0)continue;const X=B[u.id];for(const Y in X)M(X[Y].object),delete X[Y];delete B[u.id]}}function z(){h(),d=!0,r!==s&&(r=s,x(r.object))}function h(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:c,reset:z,resetDefaultState:h,dispose:O,releaseStatesOfGeometry:P,releaseStatesOfProgram:N,initAttributes:L,enableAttribute:f,disableUnusedAttributes:U}}function lc(e,n,t){let i;function s(x){i=x}function r(x,M){e.drawArrays(i,x,M),t.update(M,i,1)}function d(x,M,_){_!==0&&(e.drawArraysInstanced(i,x,M,_),t.update(M,i,_))}function c(x,M,_){if(_===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,x,0,M,0,_);let g=0;for(let I=0;I<_;I++)g+=M[I];t.update(g,i,1)}function T(x,M,_,v){if(_===0)return;const g=n.get("WEBGL_multi_draw");if(g===null)for(let I=0;I<x.length;I++)d(x[I],M[I],v[I]);else{g.multiDrawArraysInstancedWEBGL(i,x,0,M,0,v,0,_);let I=0;for(let L=0;L<_;L++)I+=M[L]*v[L];t.update(I,i,1)}}this.setMode=s,this.render=r,this.renderInstances=d,this.renderMultiDraw=c,this.renderMultiDrawInstances=T}function cc(e,n,t,i){let s;function r(){if(s!==void 0)return s;if(n.has("EXT_texture_filter_anisotropic")===!0){const N=n.get("EXT_texture_filter_anisotropic");s=e.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function d(N){return!(N!==bt&&i.convert(N)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(N){const z=N===Sn&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(N!==Ot&&i.convert(N)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==It&&!z)}function T(N){if(N==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let x=t.precision!==void 0?t.precision:"highp";const M=T(x);M!==x&&(console.warn("THREE.WebGLRenderer:",x,"not supported, using",M,"instead."),x=M);const _=t.logarithmicDepthBuffer===!0,v=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),g=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),I=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),L=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),a=e.getParameter(e.MAX_VERTEX_ATTRIBS),U=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),b=e.getParameter(e.MAX_VARYING_VECTORS),E=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),O=I>0,P=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:T,textureFormatReadable:d,textureTypeReadable:c,precision:x,logarithmicDepthBuffer:_,reversedDepthBuffer:v,maxTextures:g,maxVertexTextures:I,maxTextureSize:L,maxCubemapSize:f,maxAttributes:a,maxVertexUniforms:U,maxVaryings:b,maxFragmentUniforms:E,vertexTextures:O,maxSamples:P}}function fc(e){const n=this;let t=null,i=0,s=!1,r=!1;const d=new Ma,c=new Be,T={value:null,needsUpdate:!1};this.uniform=T,this.numPlanes=0,this.numIntersection=0,this.init=function(_,v){const g=_.length!==0||v||i!==0||s;return s=v,i=_.length,g},this.beginShadows=function(){r=!0,M(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(_,v){t=M(_,v,0)},this.setState=function(_,v,g){const I=_.clippingPlanes,L=_.clipIntersection,f=_.clipShadows,a=e.get(_);if(!s||I===null||I.length===0||r&&!f)r?M(null):x();else{const U=r?0:i,b=U*4;let E=a.clippingState||null;T.value=E,E=M(I,v,b,g);for(let O=0;O!==b;++O)E[O]=t[O];a.clippingState=E,this.numIntersection=L?this.numPlanes:0,this.numPlanes+=U}};function x(){T.value!==t&&(T.value=t,T.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function M(_,v,g,I){const L=_!==null?_.length:0;let f=null;if(L!==0){if(f=T.value,I!==!0||f===null){const a=g+L*4,U=v.matrixWorldInverse;c.getNormalMatrix(U),(f===null||f.length<a)&&(f=new Float32Array(a));for(let b=0,E=g;b!==L;++b,E+=4)d.copy(_[b]).applyMatrix4(U,c),d.normal.toArray(f,E),f[E+3]=d.constant}T.value=f,T.needsUpdate=!0}return n.numPlanes=L,n.numIntersection=0,f}}function dc(e){let n=new WeakMap;function t(d,c){return c===Kn?d.mapping=on:c===qn&&(d.mapping=Kt),d}function i(d){if(d&&d.isTexture){const c=d.mapping;if(c===Kn||c===qn)if(n.has(d)){const T=n.get(d).texture;return t(T,d.mapping)}else{const T=d.image;if(T&&T.height>0){const x=new Xr(T.height);return x.fromEquirectangularTexture(e,d),n.set(d,x),d.addEventListener("dispose",s),t(x.texture,d.mapping)}else return null}}return d}function s(d){const c=d.target;c.removeEventListener("dispose",s);const T=n.get(c);T!==void 0&&(n.delete(c),T.dispose())}function r(){n=new WeakMap}return{get:i,dispose:r}}const Wt=4,Yi=[.125,.215,.35,.446,.526,.582],yt=20,wn=new tr,Ki=new je;let yn=null,In=0,Nn=0,On=!1;const wt=(1+Math.sqrt(5))/2,Ht=1/wt,qi=[new Ie(-wt,Ht,0),new Ie(wt,Ht,0),new Ie(-Ht,0,wt),new Ie(Ht,0,wt),new Ie(0,wt,-Ht),new Ie(0,wt,Ht),new Ie(-1,1,-1),new Ie(1,1,-1),new Ie(-1,1,1),new Ie(1,1,1)],uc=new Ie;class Zi{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(n,t=0,i=.1,s=100,r={}){const{size:d=256,position:c=uc}=r;yn=this._renderer.getRenderTarget(),In=this._renderer.getActiveCubeFace(),Nn=this._renderer.getActiveMipmapLevel(),On=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const T=this._allocateTargets();return T.depthBuffer=!0,this._sceneToCubeUV(n,i,s,T,c),t>0&&this._blur(T,0,0,t),this._applyPMREM(T),this._cleanup(T),T}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qi(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ji(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodPlanes.length;n++)this._lodPlanes[n].dispose()}_cleanup(n){this._renderer.setRenderTarget(yn,In,Nn),this._renderer.xr.enabled=On,n.scissorTest=!1,dn(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===on||n.mapping===Kt?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),yn=this._renderer.getRenderTarget(),In=this._renderer.getActiveCubeFace(),Nn=this._renderer.getActiveMipmapLevel(),On=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:Sn,format:bt,colorSpace:xn,depthBuffer:!1},s=$i(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$i(n,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=pc(r)),this._blurMaterial=hc(r,n,t)}return s}_compileMaterial(n){const t=new dt(this._lodPlanes[0],n);this._renderer.compile(t,wn)}_sceneToCubeUV(n,t,i,s,r){const T=new hn(90,1,t,i),x=[1,-1,1,1,1,1],M=[1,1,1,-1,-1,-1],_=this._renderer,v=_.autoClear,g=_.toneMapping;_.getClearColor(Ki),_.toneMapping=Ct,_.autoClear=!1,_.state.buffers.depth.getReversed()&&(_.setRenderTarget(s),_.clearDepth(),_.setRenderTarget(null));const L=new nr({name:"PMREM.Background",side:vt,depthWrite:!1,depthTest:!1}),f=new dt(new jn,L);let a=!1;const U=n.background;U?U.isColor&&(L.color.copy(U),n.background=null,a=!0):(L.color.copy(Ki),a=!0);for(let b=0;b<6;b++){const E=b%3;E===0?(T.up.set(0,x[b],0),T.position.set(r.x,r.y,r.z),T.lookAt(r.x+M[b],r.y,r.z)):E===1?(T.up.set(0,0,x[b]),T.position.set(r.x,r.y,r.z),T.lookAt(r.x,r.y+M[b],r.z)):(T.up.set(0,x[b],0),T.position.set(r.x,r.y,r.z),T.lookAt(r.x,r.y,r.z+M[b]));const O=this._cubeSize;dn(s,E*O,b>2?O:0,O,O),_.setRenderTarget(s),a&&_.render(f,T),_.render(n,T)}f.geometry.dispose(),f.material.dispose(),_.toneMapping=g,_.autoClear=v,n.background=U}_textureToCubeUV(n,t){const i=this._renderer,s=n.mapping===on||n.mapping===Kt;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qi()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ji());const r=s?this._cubemapMaterial:this._equirectMaterial,d=new dt(this._lodPlanes[0],r),c=r.uniforms;c.envMap.value=n;const T=this._cubeSize;dn(t,0,0,3*T,2*T),i.setRenderTarget(t),i.render(d,wn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const d=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),c=qi[(s-r-1)%qi.length];this._blur(n,r-1,r,d,c)}t.autoClear=i}_blur(n,t,i,s,r){const d=this._pingPongRenderTarget;this._halfBlur(n,d,t,i,s,"latitudinal",r),this._halfBlur(d,n,i,i,s,"longitudinal",r)}_halfBlur(n,t,i,s,r,d,c){const T=this._renderer,x=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const M=3,_=new dt(this._lodPlanes[s],x),v=x.uniforms,g=this._sizeLods[i]-1,I=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*yt-1),L=r/I,f=isFinite(r)?1+Math.floor(M*L):yt;f>yt&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${yt}`);const a=[];let U=0;for(let N=0;N<yt;++N){const z=N/L,h=Math.exp(-z*z/2);a.push(h),N===0?U+=h:N<f&&(U+=2*h)}for(let N=0;N<a.length;N++)a[N]=a[N]/U;v.envMap.value=n.texture,v.samples.value=f,v.weights.value=a,v.latitudinal.value=d==="latitudinal",c&&(v.poleAxis.value=c);const{_lodMax:b}=this;v.dTheta.value=I,v.mipInt.value=b-i;const E=this._sizeLods[s],O=3*E*(s>b-Wt?s-b+Wt:0),P=4*(this._cubeSize-E);dn(t,O,P,3*E,2*E),T.setRenderTarget(t),T.render(_,wn)}}function pc(e){const n=[],t=[],i=[];let s=e;const r=e-Wt+1+Yi.length;for(let d=0;d<r;d++){const c=Math.pow(2,s);t.push(c);let T=1/c;d>e-Wt?T=Yi[d-e+Wt-1]:d===0&&(T=0),i.push(T);const x=1/(c-2),M=-x,_=1+x,v=[M,M,_,M,_,_,M,M,_,_,M,_],g=6,I=6,L=3,f=2,a=1,U=new Float32Array(L*I*g),b=new Float32Array(f*I*g),E=new Float32Array(a*I*g);for(let P=0;P<g;P++){const N=P%3*2/3-1,z=P>2?0:-1,h=[N,z,0,N+2/3,z,0,N+2/3,z+1,0,N,z,0,N+2/3,z+1,0,N,z+1,0];U.set(h,L*I*P),b.set(v,f*I*P);const u=[P,P,P,P,P,P];E.set(u,a*I*P)}const O=new Qn;O.setAttribute("position",new en(U,L)),O.setAttribute("uv",new en(b,f)),O.setAttribute("faceIndex",new en(E,a)),n.push(O),s>Wt&&s--}return{lodPlanes:n,sizeLods:t,sigmas:i}}function $i(e,n,t){const i=new Yt(e,n,t);return i.texture.mapping=Mn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function dn(e,n,t,i,s){e.viewport.set(n,t,i,s),e.scissor.set(n,t,i,s)}function hc(e,n,t){const i=new Float32Array(yt),s=new Ie(0,1,0);return new Ft({name:"SphericalGaussianBlur",defines:{n:yt,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Jn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function ji(){return new Ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jn(),fragmentShader:`

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
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function Qi(){return new Ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nt,depthTest:!1,depthWrite:!1})}function Jn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function mc(e){let n=new WeakMap,t=null;function i(c){if(c&&c.isTexture){const T=c.mapping,x=T===Kn||T===qn,M=T===on||T===Kt;if(x||M){let _=n.get(c);const v=_!==void 0?_.texture.pmremVersion:0;if(c.isRenderTargetTexture&&c.pmremVersion!==v)return t===null&&(t=new Zi(e)),_=x?t.fromEquirectangular(c,_):t.fromCubemap(c,_),_.texture.pmremVersion=c.pmremVersion,n.set(c,_),_.texture;if(_!==void 0)return _.texture;{const g=c.image;return x&&g&&g.height>0||M&&g&&s(g)?(t===null&&(t=new Zi(e)),_=x?t.fromEquirectangular(c):t.fromCubemap(c),_.texture.pmremVersion=c.pmremVersion,n.set(c,_),c.addEventListener("dispose",r),_.texture):null}}}return c}function s(c){let T=0;const x=6;for(let M=0;M<x;M++)c[M]!==void 0&&T++;return T===x}function r(c){const T=c.target;T.removeEventListener("dispose",r);const x=n.get(T);x!==void 0&&(n.delete(T),x.dispose())}function d(){n=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:d}}function _c(e){const n={};function t(i){if(n[i]!==void 0)return n[i];let s;switch(i){case"WEBGL_depth_texture":s=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=e.getExtension(i)}return n[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Hn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function gc(e,n,t,i){const s={},r=new WeakMap;function d(_){const v=_.target;v.index!==null&&n.remove(v.index);for(const I in v.attributes)n.remove(v.attributes[I]);v.removeEventListener("dispose",d),delete s[v.id];const g=r.get(v);g&&(n.remove(g),r.delete(v)),i.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,t.memory.geometries--}function c(_,v){return s[v.id]===!0||(v.addEventListener("dispose",d),s[v.id]=!0,t.memory.geometries++),v}function T(_){const v=_.attributes;for(const g in v)n.update(v[g],e.ARRAY_BUFFER)}function x(_){const v=[],g=_.index,I=_.attributes.position;let L=0;if(g!==null){const U=g.array;L=g.version;for(let b=0,E=U.length;b<E;b+=3){const O=U[b+0],P=U[b+1],N=U[b+2];v.push(O,P,P,N,N,O)}}else if(I!==void 0){const U=I.array;L=I.version;for(let b=0,E=U.length/3-1;b<E;b+=3){const O=b+0,P=b+1,N=b+2;v.push(O,P,P,N,N,O)}}else return;const f=new(jr(v)?Zr:$r)(v,1);f.version=L;const a=r.get(_);a&&n.remove(a),r.set(_,f)}function M(_){const v=r.get(_);if(v){const g=_.index;g!==null&&v.version<g.version&&x(_)}else x(_);return r.get(_)}return{get:c,update:T,getWireframeAttribute:M}}function vc(e,n,t){let i;function s(v){i=v}let r,d;function c(v){r=v.type,d=v.bytesPerElement}function T(v,g){e.drawElements(i,g,r,v*d),t.update(g,i,1)}function x(v,g,I){I!==0&&(e.drawElementsInstanced(i,g,r,v*d,I),t.update(g,i,I))}function M(v,g,I){if(I===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,r,v,0,I);let f=0;for(let a=0;a<I;a++)f+=g[a];t.update(f,i,1)}function _(v,g,I,L){if(I===0)return;const f=n.get("WEBGL_multi_draw");if(f===null)for(let a=0;a<v.length;a++)x(v[a]/d,g[a],L[a]);else{f.multiDrawElementsInstancedWEBGL(i,g,0,r,v,0,L,0,I);let a=0;for(let U=0;U<I;U++)a+=g[U]*L[U];t.update(a,i,1)}}this.setMode=s,this.setIndex=c,this.render=T,this.renderInstances=x,this.renderMultiDraw=M,this.renderMultiDrawInstances=_}function Ec(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,d,c){switch(t.calls++,d){case e.TRIANGLES:t.triangles+=c*(r/3);break;case e.LINES:t.lines+=c*(r/2);break;case e.LINE_STRIP:t.lines+=c*(r-1);break;case e.LINE_LOOP:t.lines+=c*r;break;case e.POINTS:t.points+=c*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Sc(e,n,t){const i=new WeakMap,s=new mt;function r(d,c,T){const x=d.morphTargetInfluences,M=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,_=M!==void 0?M.length:0;let v=i.get(c);if(v===void 0||v.count!==_){let h=function(){N.dispose(),i.delete(c),c.removeEventListener("dispose",h)};v!==void 0&&v.texture.dispose();const g=c.morphAttributes.position!==void 0,I=c.morphAttributes.normal!==void 0,L=c.morphAttributes.color!==void 0,f=c.morphAttributes.position||[],a=c.morphAttributes.normal||[],U=c.morphAttributes.color||[];let b=0;g===!0&&(b=1),I===!0&&(b=2),L===!0&&(b=3);let E=c.attributes.position.count*b,O=1;E>n.maxTextureSize&&(O=Math.ceil(E/n.maxTextureSize),E=n.maxTextureSize);const P=new Float32Array(E*O*4*_),N=new wa(P,E,O,_);N.type=It,N.needsUpdate=!0;const z=b*4;for(let u=0;u<_;u++){const C=f[u],B=a[u],X=U[u],Y=E*O*4*u;for(let Z=0;Z<C.count;Z++){const W=Z*z;g===!0&&(s.fromBufferAttribute(C,Z),P[Y+W+0]=s.x,P[Y+W+1]=s.y,P[Y+W+2]=s.z,P[Y+W+3]=0),I===!0&&(s.fromBufferAttribute(B,Z),P[Y+W+4]=s.x,P[Y+W+5]=s.y,P[Y+W+6]=s.z,P[Y+W+7]=0),L===!0&&(s.fromBufferAttribute(X,Z),P[Y+W+8]=s.x,P[Y+W+9]=s.y,P[Y+W+10]=s.z,P[Y+W+11]=X.itemSize===4?s.w:1)}}v={count:_,texture:N,size:new qe(E,O)},i.set(c,v),c.addEventListener("dispose",h)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)T.getUniforms().setValue(e,"morphTexture",d.morphTexture,t);else{let g=0;for(let L=0;L<x.length;L++)g+=x[L];const I=c.morphTargetsRelative?1:1-g;T.getUniforms().setValue(e,"morphTargetBaseInfluence",I),T.getUniforms().setValue(e,"morphTargetInfluences",x)}T.getUniforms().setValue(e,"morphTargetsTexture",v.texture,t),T.getUniforms().setValue(e,"morphTargetsTextureSize",v.size)}return{update:r}}function xc(e,n,t,i){let s=new WeakMap;function r(T){const x=i.render.frame,M=T.geometry,_=n.get(T,M);if(s.get(_)!==x&&(n.update(_),s.set(_,x)),T.isInstancedMesh&&(T.hasEventListener("dispose",c)===!1&&T.addEventListener("dispose",c),s.get(T)!==x&&(t.update(T.instanceMatrix,e.ARRAY_BUFFER),T.instanceColor!==null&&t.update(T.instanceColor,e.ARRAY_BUFFER),s.set(T,x))),T.isSkinnedMesh){const v=T.skeleton;s.get(v)!==x&&(v.update(),s.set(v,x))}return _}function d(){s=new WeakMap}function c(T){const x=T.target;x.removeEventListener("dispose",c),t.remove(x.instanceMatrix),x.instanceColor!==null&&t.remove(x.instanceColor)}return{update:r,dispose:d}}const Fa=new co,Ji=new Sa(1,1),Ba=new wa,Ha=new lo,Ga=new so,ea=[],ta=[],na=new Float32Array(16),ia=new Float32Array(9),aa=new Float32Array(4);function qt(e,n,t){const i=e[0];if(i<=0||i>0)return e;const s=n*t;let r=ea[s];if(r===void 0&&(r=new Float32Array(s),ea[s]=r),n!==0){i.toArray(r,0);for(let d=1,c=0;d!==n;++d)c+=t,e[d].toArray(r,c)}return r}function ot(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function st(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function Tn(e,n){let t=ta[n];t===void 0&&(t=new Int32Array(n),ta[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Mc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function Tc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ot(t,n))return;e.uniform2fv(this.addr,n),st(t,n)}}function Ac(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(ot(t,n))return;e.uniform3fv(this.addr,n),st(t,n)}}function Rc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ot(t,n))return;e.uniform4fv(this.addr,n),st(t,n)}}function bc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ot(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),st(t,n)}else{if(ot(t,i))return;aa.set(i),e.uniformMatrix2fv(this.addr,!1,aa),st(t,i)}}function Cc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ot(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),st(t,n)}else{if(ot(t,i))return;ia.set(i),e.uniformMatrix3fv(this.addr,!1,ia),st(t,i)}}function Pc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ot(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),st(t,n)}else{if(ot(t,i))return;na.set(i),e.uniformMatrix4fv(this.addr,!1,na),st(t,i)}}function Dc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function Lc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ot(t,n))return;e.uniform2iv(this.addr,n),st(t,n)}}function Uc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(ot(t,n))return;e.uniform3iv(this.addr,n),st(t,n)}}function wc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ot(t,n))return;e.uniform4iv(this.addr,n),st(t,n)}}function yc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function Ic(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ot(t,n))return;e.uniform2uiv(this.addr,n),st(t,n)}}function Nc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(ot(t,n))return;e.uniform3uiv(this.addr,n),st(t,n)}}function Oc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ot(t,n))return;e.uniform4uiv(this.addr,n),st(t,n)}}function Fc(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let r;this.type===e.SAMPLER_2D_SHADOW?(Ji.compareFunction=xa,r=Ji):r=Fa,t.setTexture2D(n||r,s)}function Bc(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(n||Ha,s)}function Hc(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(n||Ga,s)}function Gc(e,n,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(n||Ba,s)}function Vc(e){switch(e){case 5126:return Mc;case 35664:return Tc;case 35665:return Ac;case 35666:return Rc;case 35674:return bc;case 35675:return Cc;case 35676:return Pc;case 5124:case 35670:return Dc;case 35667:case 35671:return Lc;case 35668:case 35672:return Uc;case 35669:case 35673:return wc;case 5125:return yc;case 36294:return Ic;case 36295:return Nc;case 36296:return Oc;case 35678:case 36198:case 36298:case 36306:case 35682:return Fc;case 35679:case 36299:case 36307:return Bc;case 35680:case 36300:case 36308:case 36293:return Hc;case 36289:case 36303:case 36311:case 36292:return Gc}}function kc(e,n){e.uniform1fv(this.addr,n)}function zc(e,n){const t=qt(n,this.size,2);e.uniform2fv(this.addr,t)}function Wc(e,n){const t=qt(n,this.size,3);e.uniform3fv(this.addr,t)}function Xc(e,n){const t=qt(n,this.size,4);e.uniform4fv(this.addr,t)}function Yc(e,n){const t=qt(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function Kc(e,n){const t=qt(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function qc(e,n){const t=qt(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function Zc(e,n){e.uniform1iv(this.addr,n)}function $c(e,n){e.uniform2iv(this.addr,n)}function jc(e,n){e.uniform3iv(this.addr,n)}function Qc(e,n){e.uniform4iv(this.addr,n)}function Jc(e,n){e.uniform1uiv(this.addr,n)}function ef(e,n){e.uniform2uiv(this.addr,n)}function tf(e,n){e.uniform3uiv(this.addr,n)}function nf(e,n){e.uniform4uiv(this.addr,n)}function af(e,n,t){const i=this.cache,s=n.length,r=Tn(t,s);ot(i,r)||(e.uniform1iv(this.addr,r),st(i,r));for(let d=0;d!==s;++d)t.setTexture2D(n[d]||Fa,r[d])}function rf(e,n,t){const i=this.cache,s=n.length,r=Tn(t,s);ot(i,r)||(e.uniform1iv(this.addr,r),st(i,r));for(let d=0;d!==s;++d)t.setTexture3D(n[d]||Ha,r[d])}function of(e,n,t){const i=this.cache,s=n.length,r=Tn(t,s);ot(i,r)||(e.uniform1iv(this.addr,r),st(i,r));for(let d=0;d!==s;++d)t.setTextureCube(n[d]||Ga,r[d])}function sf(e,n,t){const i=this.cache,s=n.length,r=Tn(t,s);ot(i,r)||(e.uniform1iv(this.addr,r),st(i,r));for(let d=0;d!==s;++d)t.setTexture2DArray(n[d]||Ba,r[d])}function lf(e){switch(e){case 5126:return kc;case 35664:return zc;case 35665:return Wc;case 35666:return Xc;case 35674:return Yc;case 35675:return Kc;case 35676:return qc;case 5124:case 35670:return Zc;case 35667:case 35671:return $c;case 35668:case 35672:return jc;case 35669:case 35673:return Qc;case 5125:return Jc;case 36294:return ef;case 36295:return tf;case 36296:return nf;case 35678:case 36198:case 36298:case 36306:case 35682:return af;case 35679:case 36299:case 36307:return rf;case 35680:case 36300:case 36308:case 36293:return of;case 36289:case 36303:case 36311:case 36292:return sf}}class cf{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Vc(t.type)}}class ff{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lf(t.type)}}class df{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const s=this.seq;for(let r=0,d=s.length;r!==d;++r){const c=s[r];c.setValue(n,t[c.id],i)}}}const Fn=/(\w+)(\])?(\[|\.)?/g;function ra(e,n){e.seq.push(n),e.map[n.id]=n}function uf(e,n,t){const i=e.name,s=i.length;for(Fn.lastIndex=0;;){const r=Fn.exec(i),d=Fn.lastIndex;let c=r[1];const T=r[2]==="]",x=r[3];if(T&&(c=c|0),x===void 0||x==="["&&d+2===s){ra(t,x===void 0?new cf(c,e,n):new ff(c,e,n));break}else{let _=t.map[c];_===void 0&&(_=new df(c),ra(t,_)),t=_}}}class _n{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=n.getActiveUniform(t,s),d=n.getUniformLocation(t,r.name);uf(r,d,this)}}setValue(n,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(n,i,s)}setOptional(n,t,i){const s=t[i];s!==void 0&&this.setValue(n,i,s)}static upload(n,t,i,s){for(let r=0,d=t.length;r!==d;++r){const c=t[r],T=i[c.id];T.needsUpdate!==!1&&c.setValue(n,T.value,s)}}static seqWithValue(n,t){const i=[];for(let s=0,r=n.length;s!==r;++s){const d=n[s];d.id in t&&i.push(d)}return i}}function oa(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const pf=37297;let hf=0;function mf(e,n){const t=e.split(`
`),i=[],s=Math.max(n-6,0),r=Math.min(n+6,t.length);for(let d=s;d<r;d++){const c=d+1;i.push(`${c===n?">":" "} ${c}: ${t[d]}`)}return i.join(`
`)}const sa=new Be;function _f(e){at._getMatrix(sa,at.workingColorSpace,e);const n=`mat3( ${sa.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(e)){case Na:return[n,"LinearTransferOETF"];case Ke:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function la(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),r=(e.getShaderInfoLog(n)||"").trim();if(i&&r==="")return"";const d=/ERROR: 0:(\d+)/.exec(r);if(d){const c=parseInt(d[1]);return t.toUpperCase()+`

`+r+`

`+mf(e.getShaderSource(n),c)}else return r}function gf(e,n){const t=_f(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function vf(e,n){let t;switch(n){case oo:t="Linear";break;case ro:t="Reinhard";break;case ao:t="Cineon";break;case io:t="ACESFilmic";break;case no:t="AgX";break;case to:t="Neutral";break;case eo:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",n),t="Linear"}return"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const un=new Ie;function Ef(){at.getLuminanceCoefficients(un);const e=un.x.toFixed(4),n=un.y.toFixed(4),t=un.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Sf(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qt).join(`
`)}function xf(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Mf(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=e.getActiveAttrib(n,s),d=r.name;let c=1;r.type===e.FLOAT_MAT2&&(c=2),r.type===e.FLOAT_MAT3&&(c=3),r.type===e.FLOAT_MAT4&&(c=4),t[d]={type:r.type,location:e.getAttribLocation(n,d),locationSize:c}}return t}function Qt(e){return e!==""}function ca(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function fa(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Tf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zn(e){return e.replace(Tf,Rf)}const Af=new Map;function Rf(e,n){let t=ye[n];if(t===void 0){const i=Af.get(n);if(i!==void 0)t=ye[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return Zn(t)}const bf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function da(e){return e.replace(bf,Cf)}function Cf(e,n,t,i){let s="";for(let r=parseInt(n);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ua(e){let n=`precision ${e.precision} float;
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
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}function Pf(e){let n="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===Ta?n="SHADOWMAP_TYPE_PCF":e.shadowMapType===Jr?n="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===At&&(n="SHADOWMAP_TYPE_VSM"),n}function Df(e){let n="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case on:case Kt:n="ENVMAP_TYPE_CUBE";break;case Mn:n="ENVMAP_TYPE_CUBE_UV";break}return n}function Lf(e){let n="ENVMAP_MODE_REFLECTION";return e.envMap&&e.envMapMode===Kt&&(n="ENVMAP_MODE_REFRACTION"),n}function Uf(e){let n="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case ho:n="ENVMAP_BLENDING_MULTIPLY";break;case po:n="ENVMAP_BLENDING_MIX";break;case uo:n="ENVMAP_BLENDING_ADD";break}return n}function wf(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function yf(e,n,t,i){const s=e.getContext(),r=t.defines;let d=t.vertexShader,c=t.fragmentShader;const T=Pf(t),x=Df(t),M=Lf(t),_=Uf(t),v=wf(t),g=Sf(t),I=xf(r),L=s.createProgram();let f,a,U=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,I].filter(Qt).join(`
`),f.length>0&&(f+=`
`),a=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,I].filter(Qt).join(`
`),a.length>0&&(a+=`
`)):(f=[ua(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,I,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+M:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+T:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qt).join(`
`),a=[ua(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,I,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+x:"",t.envMap?"#define "+M:"",t.envMap?"#define "+_:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+T:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ct?"#define TONE_MAPPING":"",t.toneMapping!==Ct?ye.tonemapping_pars_fragment:"",t.toneMapping!==Ct?vf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ye.colorspace_pars_fragment,gf("linearToOutputTexel",t.outputColorSpace),Ef(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qt).join(`
`)),d=Zn(d),d=ca(d,t),d=fa(d,t),c=Zn(c),c=ca(c,t),c=fa(c,t),d=da(d),c=da(c),t.isRawShaderMaterial!==!0&&(U=`#version 300 es
`,f=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,a=["#define varying in",t.glslVersion===ki?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ki?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+a);const b=U+f+d,E=U+a+c,O=oa(s,s.VERTEX_SHADER,b),P=oa(s,s.FRAGMENT_SHADER,E);s.attachShader(L,O),s.attachShader(L,P),t.index0AttributeName!==void 0?s.bindAttribLocation(L,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(L,0,"position"),s.linkProgram(L);function N(C){if(e.debug.checkShaderErrors){const B=s.getProgramInfoLog(L)||"",X=s.getShaderInfoLog(O)||"",Y=s.getShaderInfoLog(P)||"",Z=B.trim(),W=X.trim(),ne=Y.trim();let G=!0,ge=!0;if(s.getProgramParameter(L,s.LINK_STATUS)===!1)if(G=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,L,O,P);else{const Me=la(s,O,"vertex"),Ue=la(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(L,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+Z+`
`+Me+`
`+Ue)}else Z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Z):(W===""||ne==="")&&(ge=!1);ge&&(C.diagnostics={runnable:G,programLog:Z,vertexShader:{log:W,prefix:f},fragmentShader:{log:ne,prefix:a}})}s.deleteShader(O),s.deleteShader(P),z=new _n(s,L),h=Mf(s,L)}let z;this.getUniforms=function(){return z===void 0&&N(this),z};let h;this.getAttributes=function(){return h===void 0&&N(this),h};let u=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return u===!1&&(u=s.getProgramParameter(L,pf)),u},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(L),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=hf++,this.cacheKey=n,this.usedTimes=1,this.program=L,this.vertexShader=O,this.fragmentShader=P,this}let If=0;class Nf{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){const t=n.vertexShader,i=n.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),d=this._getShaderCacheForMaterial(n);return d.has(s)===!1&&(d.add(s),s.usedTimes++),d.has(r)===!1&&(d.add(r),r.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new Of(n),t.set(n,i)),i}}class Of{constructor(n){this.id=If++,this.code=n,this.usedTimes=0}}function Ff(e,n,t,i,s,r,d){const c=new Qr,T=new Nf,x=new Set,M=[],_=s.logarithmicDepthBuffer,v=s.vertexTextures;let g=s.precision;const I={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function L(h){return x.add(h),h===0?"uv":`uv${h}`}function f(h,u,C,B,X){const Y=B.fog,Z=X.geometry,W=h.isMeshStandardMaterial?B.environment:null,ne=(h.isMeshStandardMaterial?t:n).get(h.envMap||W),G=ne&&ne.mapping===Mn?ne.image.height:null,ge=I[h.type];h.precision!==null&&(g=s.getMaxPrecision(h.precision),g!==h.precision&&console.warn("THREE.WebGLProgram.getParameters:",h.precision,"not supported, using",g,"instead."));const Me=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ue=Me!==void 0?Me.length:0;let He=0;Z.morphAttributes.position!==void 0&&(He=1),Z.morphAttributes.normal!==void 0&&(He=2),Z.morphAttributes.color!==void 0&&(He=3);let nt,et,ze,V;if(ge){const Ge=Mt[ge];nt=Ge.vertexShader,et=Ge.fragmentShader}else nt=h.vertexShader,et=h.fragmentShader,T.update(h),ze=T.getVertexShaderID(h),V=T.getFragmentShaderID(h);const q=e.getRenderTarget(),ce=e.state.buffers.depth.getReversed(),Ce=X.isInstancedMesh===!0,Ee=X.isBatchedMesh===!0,Oe=!!h.map,ct=!!h.matcap,m=!!ne,Ze=!!h.aoMap,De=!!h.lightMap,Re=!!h.bumpMap,ue=!!h.normalMap,$e=!!h.displacementMap,pe=!!h.emissiveMap,we=!!h.metalnessMap,lt=!!h.roughnessMap,it=h.anisotropy>0,p=h.clearcoat>0,o=h.dispersion>0,D=h.iridescence>0,H=h.sheen>0,K=h.transmission>0,F=it&&!!h.anisotropyMap,ve=p&&!!h.clearcoatMap,ee=p&&!!h.clearcoatNormalMap,he=p&&!!h.clearcoatRoughnessMap,me=D&&!!h.iridescenceMap,Q=D&&!!h.iridescenceThicknessMap,oe=H&&!!h.sheenColorMap,Ae=H&&!!h.sheenRoughnessMap,_e=!!h.specularMap,ae=!!h.specularColorMap,Le=!!h.specularIntensityMap,S=K&&!!h.transmissionMap,J=K&&!!h.thicknessMap,te=!!h.gradientMap,le=!!h.alphaMap,$=h.alphaTest>0,k=!!h.alphaHash,de=!!h.extensions;let Pe=Ct;h.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Pe=e.toneMapping);const Xe={shaderID:ge,shaderType:h.type,shaderName:h.name,vertexShader:nt,fragmentShader:et,defines:h.defines,customVertexShaderID:ze,customFragmentShaderID:V,isRawShaderMaterial:h.isRawShaderMaterial===!0,glslVersion:h.glslVersion,precision:g,batching:Ee,batchingColor:Ee&&X._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&X.instanceColor!==null,instancingMorph:Ce&&X.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:q===null?e.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:xn,alphaToCoverage:!!h.alphaToCoverage,map:Oe,matcap:ct,envMap:m,envMapMode:m&&ne.mapping,envMapCubeUVHeight:G,aoMap:Ze,lightMap:De,bumpMap:Re,normalMap:ue,displacementMap:v&&$e,emissiveMap:pe,normalMapObjectSpace:ue&&h.normalMapType===qr,normalMapTangentSpace:ue&&h.normalMapType===Kr,metalnessMap:we,roughnessMap:lt,anisotropy:it,anisotropyMap:F,clearcoat:p,clearcoatMap:ve,clearcoatNormalMap:ee,clearcoatRoughnessMap:he,dispersion:o,iridescence:D,iridescenceMap:me,iridescenceThicknessMap:Q,sheen:H,sheenColorMap:oe,sheenRoughnessMap:Ae,specularMap:_e,specularColorMap:ae,specularIntensityMap:Le,transmission:K,transmissionMap:S,thicknessMap:J,gradientMap:te,opaque:h.transparent===!1&&h.blending===mn&&h.alphaToCoverage===!1,alphaMap:le,alphaTest:$,alphaHash:k,combine:h.combine,mapUv:Oe&&L(h.map.channel),aoMapUv:Ze&&L(h.aoMap.channel),lightMapUv:De&&L(h.lightMap.channel),bumpMapUv:Re&&L(h.bumpMap.channel),normalMapUv:ue&&L(h.normalMap.channel),displacementMapUv:$e&&L(h.displacementMap.channel),emissiveMapUv:pe&&L(h.emissiveMap.channel),metalnessMapUv:we&&L(h.metalnessMap.channel),roughnessMapUv:lt&&L(h.roughnessMap.channel),anisotropyMapUv:F&&L(h.anisotropyMap.channel),clearcoatMapUv:ve&&L(h.clearcoatMap.channel),clearcoatNormalMapUv:ee&&L(h.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&L(h.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&L(h.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&L(h.iridescenceThicknessMap.channel),sheenColorMapUv:oe&&L(h.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&L(h.sheenRoughnessMap.channel),specularMapUv:_e&&L(h.specularMap.channel),specularColorMapUv:ae&&L(h.specularColorMap.channel),specularIntensityMapUv:Le&&L(h.specularIntensityMap.channel),transmissionMapUv:S&&L(h.transmissionMap.channel),thicknessMapUv:J&&L(h.thicknessMap.channel),alphaMapUv:le&&L(h.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(ue||it),vertexColors:h.vertexColors,vertexAlphas:h.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!Z.attributes.uv&&(Oe||le),fog:!!Y,useFog:h.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:h.flatShading===!0&&h.wireframe===!1,sizeAttenuation:h.sizeAttenuation===!0,logarithmicDepthBuffer:_,reversedDepthBuffer:ce,skinning:X.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Ue,morphTextureStride:He,numDirLights:u.directional.length,numPointLights:u.point.length,numSpotLights:u.spot.length,numSpotLightMaps:u.spotLightMap.length,numRectAreaLights:u.rectArea.length,numHemiLights:u.hemi.length,numDirLightShadows:u.directionalShadowMap.length,numPointLightShadows:u.pointShadowMap.length,numSpotLightShadows:u.spotShadowMap.length,numSpotLightShadowsWithMaps:u.numSpotLightShadowsWithMaps,numLightProbes:u.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:h.dithering,shadowMapEnabled:e.shadowMap.enabled&&C.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:Oe&&h.map.isVideoTexture===!0&&at.getTransfer(h.map.colorSpace)===Ke,decodeVideoTextureEmissive:pe&&h.emissiveMap.isVideoTexture===!0&&at.getTransfer(h.emissiveMap.colorSpace)===Ke,premultipliedAlpha:h.premultipliedAlpha,doubleSided:h.side===Rt,flipSided:h.side===vt,useDepthPacking:h.depthPacking>=0,depthPacking:h.depthPacking||0,index0AttributeName:h.index0AttributeName,extensionClipCullDistance:de&&h.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(de&&h.extensions.multiDraw===!0||Ee)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:h.customProgramCacheKey()};return Xe.vertexUv1s=x.has(1),Xe.vertexUv2s=x.has(2),Xe.vertexUv3s=x.has(3),x.clear(),Xe}function a(h){const u=[];if(h.shaderID?u.push(h.shaderID):(u.push(h.customVertexShaderID),u.push(h.customFragmentShaderID)),h.defines!==void 0)for(const C in h.defines)u.push(C),u.push(h.defines[C]);return h.isRawShaderMaterial===!1&&(U(u,h),b(u,h),u.push(e.outputColorSpace)),u.push(h.customProgramCacheKey),u.join()}function U(h,u){h.push(u.precision),h.push(u.outputColorSpace),h.push(u.envMapMode),h.push(u.envMapCubeUVHeight),h.push(u.mapUv),h.push(u.alphaMapUv),h.push(u.lightMapUv),h.push(u.aoMapUv),h.push(u.bumpMapUv),h.push(u.normalMapUv),h.push(u.displacementMapUv),h.push(u.emissiveMapUv),h.push(u.metalnessMapUv),h.push(u.roughnessMapUv),h.push(u.anisotropyMapUv),h.push(u.clearcoatMapUv),h.push(u.clearcoatNormalMapUv),h.push(u.clearcoatRoughnessMapUv),h.push(u.iridescenceMapUv),h.push(u.iridescenceThicknessMapUv),h.push(u.sheenColorMapUv),h.push(u.sheenRoughnessMapUv),h.push(u.specularMapUv),h.push(u.specularColorMapUv),h.push(u.specularIntensityMapUv),h.push(u.transmissionMapUv),h.push(u.thicknessMapUv),h.push(u.combine),h.push(u.fogExp2),h.push(u.sizeAttenuation),h.push(u.morphTargetsCount),h.push(u.morphAttributeCount),h.push(u.numDirLights),h.push(u.numPointLights),h.push(u.numSpotLights),h.push(u.numSpotLightMaps),h.push(u.numHemiLights),h.push(u.numRectAreaLights),h.push(u.numDirLightShadows),h.push(u.numPointLightShadows),h.push(u.numSpotLightShadows),h.push(u.numSpotLightShadowsWithMaps),h.push(u.numLightProbes),h.push(u.shadowMapType),h.push(u.toneMapping),h.push(u.numClippingPlanes),h.push(u.numClipIntersection),h.push(u.depthPacking)}function b(h,u){c.disableAll(),u.supportsVertexTextures&&c.enable(0),u.instancing&&c.enable(1),u.instancingColor&&c.enable(2),u.instancingMorph&&c.enable(3),u.matcap&&c.enable(4),u.envMap&&c.enable(5),u.normalMapObjectSpace&&c.enable(6),u.normalMapTangentSpace&&c.enable(7),u.clearcoat&&c.enable(8),u.iridescence&&c.enable(9),u.alphaTest&&c.enable(10),u.vertexColors&&c.enable(11),u.vertexAlphas&&c.enable(12),u.vertexUv1s&&c.enable(13),u.vertexUv2s&&c.enable(14),u.vertexUv3s&&c.enable(15),u.vertexTangents&&c.enable(16),u.anisotropy&&c.enable(17),u.alphaHash&&c.enable(18),u.batching&&c.enable(19),u.dispersion&&c.enable(20),u.batchingColor&&c.enable(21),u.gradientMap&&c.enable(22),h.push(c.mask),c.disableAll(),u.fog&&c.enable(0),u.useFog&&c.enable(1),u.flatShading&&c.enable(2),u.logarithmicDepthBuffer&&c.enable(3),u.reversedDepthBuffer&&c.enable(4),u.skinning&&c.enable(5),u.morphTargets&&c.enable(6),u.morphNormals&&c.enable(7),u.morphColors&&c.enable(8),u.premultipliedAlpha&&c.enable(9),u.shadowMapEnabled&&c.enable(10),u.doubleSided&&c.enable(11),u.flipSided&&c.enable(12),u.useDepthPacking&&c.enable(13),u.dithering&&c.enable(14),u.transmission&&c.enable(15),u.sheen&&c.enable(16),u.opaque&&c.enable(17),u.pointsUvs&&c.enable(18),u.decodeVideoTexture&&c.enable(19),u.decodeVideoTextureEmissive&&c.enable(20),u.alphaToCoverage&&c.enable(21),h.push(c.mask)}function E(h){const u=I[h.type];let C;if(u){const B=Mt[u];C=Yr.clone(B.uniforms)}else C=h.uniforms;return C}function O(h,u){let C;for(let B=0,X=M.length;B<X;B++){const Y=M[B];if(Y.cacheKey===u){C=Y,++C.usedTimes;break}}return C===void 0&&(C=new yf(e,u,h,r),M.push(C)),C}function P(h){if(--h.usedTimes===0){const u=M.indexOf(h);M[u]=M[M.length-1],M.pop(),h.destroy()}}function N(h){T.remove(h)}function z(){T.dispose()}return{getParameters:f,getProgramCacheKey:a,getUniforms:E,acquireProgram:O,releaseProgram:P,releaseShaderCache:N,programs:M,dispose:z}}function Bf(){let e=new WeakMap;function n(d){return e.has(d)}function t(d){let c=e.get(d);return c===void 0&&(c={},e.set(d,c)),c}function i(d){e.delete(d)}function s(d,c,T){e.get(d)[c]=T}function r(){e=new WeakMap}return{has:n,get:t,remove:i,update:s,dispose:r}}function Hf(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.z!==n.z?e.z-n.z:e.id-n.id}function pa(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function ha(){const e=[];let n=0;const t=[],i=[],s=[];function r(){n=0,t.length=0,i.length=0,s.length=0}function d(_,v,g,I,L,f){let a=e[n];return a===void 0?(a={id:_.id,object:_,geometry:v,material:g,groupOrder:I,renderOrder:_.renderOrder,z:L,group:f},e[n]=a):(a.id=_.id,a.object=_,a.geometry=v,a.material=g,a.groupOrder=I,a.renderOrder=_.renderOrder,a.z=L,a.group=f),n++,a}function c(_,v,g,I,L,f){const a=d(_,v,g,I,L,f);g.transmission>0?i.push(a):g.transparent===!0?s.push(a):t.push(a)}function T(_,v,g,I,L,f){const a=d(_,v,g,I,L,f);g.transmission>0?i.unshift(a):g.transparent===!0?s.unshift(a):t.unshift(a)}function x(_,v){t.length>1&&t.sort(_||Hf),i.length>1&&i.sort(v||pa),s.length>1&&s.sort(v||pa)}function M(){for(let _=n,v=e.length;_<v;_++){const g=e[_];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:T,finish:M,sort:x}}function Gf(){let e=new WeakMap;function n(i,s){const r=e.get(i);let d;return r===void 0?(d=new ha,e.set(i,[d])):s>=r.length?(d=new ha,r.push(d)):d=r[s],d}function t(){e=new WeakMap}return{get:n,dispose:t}}function Vf(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={direction:new Ie,color:new je};break;case"SpotLight":t={position:new Ie,direction:new Ie,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Ie,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Ie,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new Ie,halfWidth:new Ie,halfHeight:new Ie};break}return e[n.id]=t,t}}}function kf(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let zf=0;function Wf(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function Xf(e){const n=new Vf,t=kf(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let x=0;x<9;x++)i.probe.push(new Ie);const s=new Ie,r=new tn,d=new tn;function c(x){let M=0,_=0,v=0;for(let h=0;h<9;h++)i.probe[h].set(0,0,0);let g=0,I=0,L=0,f=0,a=0,U=0,b=0,E=0,O=0,P=0,N=0;x.sort(Wf);for(let h=0,u=x.length;h<u;h++){const C=x[h],B=C.color,X=C.intensity,Y=C.distance,Z=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)M+=B.r*X,_+=B.g*X,v+=B.b*X;else if(C.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(C.sh.coefficients[W],X);N++}else if(C.isDirectionalLight){const W=n.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const ne=C.shadow,G=t.get(C);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,i.directionalShadow[g]=G,i.directionalShadowMap[g]=Z,i.directionalShadowMatrix[g]=C.shadow.matrix,U++}i.directional[g]=W,g++}else if(C.isSpotLight){const W=n.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(B).multiplyScalar(X),W.distance=Y,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,i.spot[L]=W;const ne=C.shadow;if(C.map&&(i.spotLightMap[O]=C.map,O++,ne.updateMatrices(C),C.castShadow&&P++),i.spotLightMatrix[L]=ne.matrix,C.castShadow){const G=t.get(C);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,i.spotShadow[L]=G,i.spotShadowMap[L]=Z,E++}L++}else if(C.isRectAreaLight){const W=n.get(C);W.color.copy(B).multiplyScalar(X),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),i.rectArea[f]=W,f++}else if(C.isPointLight){const W=n.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){const ne=C.shadow,G=t.get(C);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,G.shadowCameraNear=ne.camera.near,G.shadowCameraFar=ne.camera.far,i.pointShadow[I]=G,i.pointShadowMap[I]=Z,i.pointShadowMatrix[I]=C.shadow.matrix,b++}i.point[I]=W,I++}else if(C.isHemisphereLight){const W=n.get(C);W.skyColor.copy(C.color).multiplyScalar(X),W.groundColor.copy(C.groundColor).multiplyScalar(X),i.hemi[a]=W,a++}}f>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ie.LTC_FLOAT_1,i.rectAreaLTC2=ie.LTC_FLOAT_2):(i.rectAreaLTC1=ie.LTC_HALF_1,i.rectAreaLTC2=ie.LTC_HALF_2)),i.ambient[0]=M,i.ambient[1]=_,i.ambient[2]=v;const z=i.hash;(z.directionalLength!==g||z.pointLength!==I||z.spotLength!==L||z.rectAreaLength!==f||z.hemiLength!==a||z.numDirectionalShadows!==U||z.numPointShadows!==b||z.numSpotShadows!==E||z.numSpotMaps!==O||z.numLightProbes!==N)&&(i.directional.length=g,i.spot.length=L,i.rectArea.length=f,i.point.length=I,i.hemi.length=a,i.directionalShadow.length=U,i.directionalShadowMap.length=U,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=U,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=E+O-P,i.spotLightMap.length=O,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=N,z.directionalLength=g,z.pointLength=I,z.spotLength=L,z.rectAreaLength=f,z.hemiLength=a,z.numDirectionalShadows=U,z.numPointShadows=b,z.numSpotShadows=E,z.numSpotMaps=O,z.numLightProbes=N,i.version=zf++)}function T(x,M){let _=0,v=0,g=0,I=0,L=0;const f=M.matrixWorldInverse;for(let a=0,U=x.length;a<U;a++){const b=x[a];if(b.isDirectionalLight){const E=i.directional[_];E.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(f),_++}else if(b.isSpotLight){const E=i.spot[g];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(f),E.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(f),g++}else if(b.isRectAreaLight){const E=i.rectArea[I];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(f),d.identity(),r.copy(b.matrixWorld),r.premultiply(f),d.extractRotation(r),E.halfWidth.set(b.width*.5,0,0),E.halfHeight.set(0,b.height*.5,0),E.halfWidth.applyMatrix4(d),E.halfHeight.applyMatrix4(d),I++}else if(b.isPointLight){const E=i.point[v];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(f),v++}else if(b.isHemisphereLight){const E=i.hemi[L];E.direction.setFromMatrixPosition(b.matrixWorld),E.direction.transformDirection(f),L++}}}return{setup:c,setupView:T,state:i}}function ma(e){const n=new Xf(e),t=[],i=[];function s(M){x.camera=M,t.length=0,i.length=0}function r(M){t.push(M)}function d(M){i.push(M)}function c(){n.setup(t)}function T(M){n.setupView(t,M)}const x={lightsArray:t,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:s,state:x,setupLights:c,setupLightsView:T,pushLight:r,pushShadow:d}}function Yf(e){let n=new WeakMap;function t(s,r=0){const d=n.get(s);let c;return d===void 0?(c=new ma(e),n.set(s,[c])):r>=d.length?(c=new ma(e),d.push(c)):c=d[r],c}function i(){n=new WeakMap}return{get:t,dispose:i}}const Kf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Zf(e,n,t){let i=new Ea;const s=new qe,r=new qe,d=new mt,c=new Ur({depthPacking:wr}),T=new yr,x={},M=t.maxTextureSize,_={[nn]:vt,[vt]:nn,[Rt]:Rt},v=new Ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new qe},radius:{value:4}},vertexShader:Kf,fragmentShader:qf}),g=v.clone();g.defines.HORIZONTAL_PASS=1;const I=new Qn;I.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const L=new dt(I,v),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ta;let a=this.type;this.render=function(P,N,z){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||P.length===0)return;const h=e.getRenderTarget(),u=e.getActiveCubeFace(),C=e.getActiveMipmapLevel(),B=e.state;B.setBlending(Nt),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const X=a!==At&&this.type===At,Y=a===At&&this.type!==At;for(let Z=0,W=P.length;Z<W;Z++){const ne=P[Z],G=ne.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const ge=G.getFrameExtents();if(s.multiply(ge),r.copy(G.mapSize),(s.x>M||s.y>M)&&(s.x>M&&(r.x=Math.floor(M/ge.x),s.x=r.x*ge.x,G.mapSize.x=r.x),s.y>M&&(r.y=Math.floor(M/ge.y),s.y=r.y*ge.y,G.mapSize.y=r.y)),G.map===null||X===!0||Y===!0){const Ue=this.type!==At?{minFilter:Jt,magFilter:Jt}:{};G.map!==null&&G.map.dispose(),G.map=new Yt(s.x,s.y,Ue),G.map.texture.name=ne.name+".shadowMap",G.camera.updateProjectionMatrix()}e.setRenderTarget(G.map),e.clear();const Me=G.getViewportCount();for(let Ue=0;Ue<Me;Ue++){const He=G.getViewport(Ue);d.set(r.x*He.x,r.y*He.y,r.x*He.z,r.y*He.w),B.viewport(d),G.updateMatrices(ne,Ue),i=G.getFrustum(),E(N,z,G.camera,ne,this.type)}G.isPointLightShadow!==!0&&this.type===At&&U(G,z),G.needsUpdate=!1}a=this.type,f.needsUpdate=!1,e.setRenderTarget(h,u,C)};function U(P,N){const z=n.update(L);v.defines.VSM_SAMPLES!==P.blurSamples&&(v.defines.VSM_SAMPLES=P.blurSamples,g.defines.VSM_SAMPLES=P.blurSamples,v.needsUpdate=!0,g.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Yt(s.x,s.y)),v.uniforms.shadow_pass.value=P.map.texture,v.uniforms.resolution.value=P.mapSize,v.uniforms.radius.value=P.radius,e.setRenderTarget(P.mapPass),e.clear(),e.renderBufferDirect(N,null,z,v,L,null),g.uniforms.shadow_pass.value=P.mapPass.texture,g.uniforms.resolution.value=P.mapSize,g.uniforms.radius.value=P.radius,e.setRenderTarget(P.map),e.clear(),e.renderBufferDirect(N,null,z,g,L,null)}function b(P,N,z,h){let u=null;const C=z.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(C!==void 0)u=C;else if(u=z.isPointLight===!0?T:c,e.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const B=u.uuid,X=N.uuid;let Y=x[B];Y===void 0&&(Y={},x[B]=Y);let Z=Y[X];Z===void 0&&(Z=u.clone(),Y[X]=Z,N.addEventListener("dispose",O)),u=Z}if(u.visible=N.visible,u.wireframe=N.wireframe,h===At?u.side=N.shadowSide!==null?N.shadowSide:N.side:u.side=N.shadowSide!==null?N.shadowSide:_[N.side],u.alphaMap=N.alphaMap,u.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,u.map=N.map,u.clipShadows=N.clipShadows,u.clippingPlanes=N.clippingPlanes,u.clipIntersection=N.clipIntersection,u.displacementMap=N.displacementMap,u.displacementScale=N.displacementScale,u.displacementBias=N.displacementBias,u.wireframeLinewidth=N.wireframeLinewidth,u.linewidth=N.linewidth,z.isPointLight===!0&&u.isMeshDistanceMaterial===!0){const B=e.properties.get(u);B.light=z}return u}function E(P,N,z,h,u){if(P.visible===!1)return;if(P.layers.test(N.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&u===At)&&(!P.frustumCulled||i.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,P.matrixWorld);const X=n.update(P),Y=P.material;if(Array.isArray(Y)){const Z=X.groups;for(let W=0,ne=Z.length;W<ne;W++){const G=Z[W],ge=Y[G.materialIndex];if(ge&&ge.visible){const Me=b(P,ge,h,u);P.onBeforeShadow(e,P,N,z,X,Me,G),e.renderBufferDirect(z,null,X,Me,P,G),P.onAfterShadow(e,P,N,z,X,Me,G)}}}else if(Y.visible){const Z=b(P,Y,h,u);P.onBeforeShadow(e,P,N,z,X,Z,null),e.renderBufferDirect(z,null,X,Z,P,null),P.onAfterShadow(e,P,N,z,X,Z,null)}}const B=P.children;for(let X=0,Y=B.length;X<Y;X++)E(B[X],N,z,h,u)}function O(P){P.target.removeEventListener("dispose",O);for(const z in x){const h=x[z],u=P.target.uuid;u in h&&(h[u].dispose(),delete h[u])}}}const $f={[Yn]:Xn,[Wn]:Vn,[zn]:Gn,[vn]:kn,[Xn]:Yn,[Vn]:Wn,[Gn]:zn,[kn]:vn};function jf(e,n){function t(){let S=!1;const J=new mt;let te=null;const le=new mt(0,0,0,0);return{setMask:function($){te!==$&&!S&&(e.colorMask($,$,$,$),te=$)},setLocked:function($){S=$},setClear:function($,k,de,Pe,Xe){Xe===!0&&($*=Pe,k*=Pe,de*=Pe),J.set($,k,de,Pe),le.equals(J)===!1&&(e.clearColor($,k,de,Pe),le.copy(J))},reset:function(){S=!1,te=null,le.set(-1,0,0,0)}}}function i(){let S=!1,J=!1,te=null,le=null,$=null;return{setReversed:function(k){if(J!==k){const de=n.get("EXT_clip_control");k?de.clipControlEXT(de.LOWER_LEFT_EXT,de.ZERO_TO_ONE_EXT):de.clipControlEXT(de.LOWER_LEFT_EXT,de.NEGATIVE_ONE_TO_ONE_EXT),J=k;const Pe=$;$=null,this.setClear(Pe)}},getReversed:function(){return J},setTest:function(k){k?q(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(k){te!==k&&!S&&(e.depthMask(k),te=k)},setFunc:function(k){if(J&&(k=$f[k]),le!==k){switch(k){case Yn:e.depthFunc(e.NEVER);break;case Xn:e.depthFunc(e.ALWAYS);break;case Wn:e.depthFunc(e.LESS);break;case vn:e.depthFunc(e.LEQUAL);break;case zn:e.depthFunc(e.EQUAL);break;case kn:e.depthFunc(e.GEQUAL);break;case Vn:e.depthFunc(e.GREATER);break;case Gn:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}le=k}},setLocked:function(k){S=k},setClear:function(k){$!==k&&(J&&(k=1-k),e.clearDepth(k),$=k)},reset:function(){S=!1,te=null,le=null,$=null,J=!1}}}function s(){let S=!1,J=null,te=null,le=null,$=null,k=null,de=null,Pe=null,Xe=null;return{setTest:function(Ge){S||(Ge?q(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(Ge){J!==Ge&&!S&&(e.stencilMask(Ge),J=Ge)},setFunc:function(Ge,Tt,xt){(te!==Ge||le!==Tt||$!==xt)&&(e.stencilFunc(Ge,Tt,xt),te=Ge,le=Tt,$=xt)},setOp:function(Ge,Tt,xt){(k!==Ge||de!==Tt||Pe!==xt)&&(e.stencilOp(Ge,Tt,xt),k=Ge,de=Tt,Pe=xt)},setLocked:function(Ge){S=Ge},setClear:function(Ge){Xe!==Ge&&(e.clearStencil(Ge),Xe=Ge)},reset:function(){S=!1,J=null,te=null,le=null,$=null,k=null,de=null,Pe=null,Xe=null}}}const r=new t,d=new i,c=new s,T=new WeakMap,x=new WeakMap;let M={},_={},v=new WeakMap,g=[],I=null,L=!1,f=null,a=null,U=null,b=null,E=null,O=null,P=null,N=new je(0,0,0),z=0,h=!1,u=null,C=null,B=null,X=null,Y=null;const Z=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,ne=0;const G=e.getParameter(e.VERSION);G.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(G)[1]),W=ne>=1):G.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),W=ne>=2);let ge=null,Me={};const Ue=e.getParameter(e.SCISSOR_BOX),He=e.getParameter(e.VIEWPORT),nt=new mt().fromArray(Ue),et=new mt().fromArray(He);function ze(S,J,te,le){const $=new Uint8Array(4),k=e.createTexture();e.bindTexture(S,k),e.texParameteri(S,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(S,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let de=0;de<te;de++)S===e.TEXTURE_3D||S===e.TEXTURE_2D_ARRAY?e.texImage3D(J,0,e.RGBA,1,1,le,0,e.RGBA,e.UNSIGNED_BYTE,$):e.texImage2D(J+de,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,$);return k}const V={};V[e.TEXTURE_2D]=ze(e.TEXTURE_2D,e.TEXTURE_2D,1),V[e.TEXTURE_CUBE_MAP]=ze(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[e.TEXTURE_2D_ARRAY]=ze(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),V[e.TEXTURE_3D]=ze(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),d.setClear(1),c.setClear(0),q(e.DEPTH_TEST),d.setFunc(vn),Re(!1),ue(Oi),q(e.CULL_FACE),Ze(Nt);function q(S){M[S]!==!0&&(e.enable(S),M[S]=!0)}function ce(S){M[S]!==!1&&(e.disable(S),M[S]=!1)}function Ce(S,J){return _[S]!==J?(e.bindFramebuffer(S,J),_[S]=J,S===e.DRAW_FRAMEBUFFER&&(_[e.FRAMEBUFFER]=J),S===e.FRAMEBUFFER&&(_[e.DRAW_FRAMEBUFFER]=J),!0):!1}function Ee(S,J){let te=g,le=!1;if(S){te=v.get(J),te===void 0&&(te=[],v.set(J,te));const $=S.textures;if(te.length!==$.length||te[0]!==e.COLOR_ATTACHMENT0){for(let k=0,de=$.length;k<de;k++)te[k]=e.COLOR_ATTACHMENT0+k;te.length=$.length,le=!0}}else te[0]!==e.BACK&&(te[0]=e.BACK,le=!0);le&&e.drawBuffers(te)}function Oe(S){return I!==S?(e.useProgram(S),I=S,!0):!1}const ct={[$t]:e.FUNC_ADD,[ar]:e.FUNC_SUBTRACT,[ir]:e.FUNC_REVERSE_SUBTRACT};ct[mo]=e.MIN,ct[_o]=e.MAX;const m={[Er]:e.ZERO,[vr]:e.ONE,[gr]:e.SRC_COLOR,[_r]:e.SRC_ALPHA,[mr]:e.SRC_ALPHA_SATURATE,[hr]:e.DST_COLOR,[pr]:e.DST_ALPHA,[ur]:e.ONE_MINUS_SRC_COLOR,[dr]:e.ONE_MINUS_SRC_ALPHA,[fr]:e.ONE_MINUS_DST_COLOR,[cr]:e.ONE_MINUS_DST_ALPHA,[lr]:e.CONSTANT_COLOR,[sr]:e.ONE_MINUS_CONSTANT_COLOR,[or]:e.CONSTANT_ALPHA,[rr]:e.ONE_MINUS_CONSTANT_ALPHA};function Ze(S,J,te,le,$,k,de,Pe,Xe,Ge){if(S===Nt){L===!0&&(ce(e.BLEND),L=!1);return}if(L===!1&&(q(e.BLEND),L=!0),S!==Wr){if(S!==f||Ge!==h){if((a!==$t||E!==$t)&&(e.blendEquation(e.FUNC_ADD),a=$t,E=$t),Ge)switch(S){case mn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Hi:e.blendFunc(e.ONE,e.ONE);break;case Bi:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Fi:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",S);break}else switch(S){case mn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Hi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Bi:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fi:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",S);break}U=null,b=null,O=null,P=null,N.set(0,0,0),z=0,f=S,h=Ge}return}$=$||J,k=k||te,de=de||le,(J!==a||$!==E)&&(e.blendEquationSeparate(ct[J],ct[$]),a=J,E=$),(te!==U||le!==b||k!==O||de!==P)&&(e.blendFuncSeparate(m[te],m[le],m[k],m[de]),U=te,b=le,O=k,P=de),(Pe.equals(N)===!1||Xe!==z)&&(e.blendColor(Pe.r,Pe.g,Pe.b,Xe),N.copy(Pe),z=Xe),f=S,h=!1}function De(S,J){S.side===Rt?ce(e.CULL_FACE):q(e.CULL_FACE);let te=S.side===vt;J&&(te=!te),Re(te),S.blending===mn&&S.transparent===!1?Ze(Nt):Ze(S.blending,S.blendEquation,S.blendSrc,S.blendDst,S.blendEquationAlpha,S.blendSrcAlpha,S.blendDstAlpha,S.blendColor,S.blendAlpha,S.premultipliedAlpha),d.setFunc(S.depthFunc),d.setTest(S.depthTest),d.setMask(S.depthWrite),r.setMask(S.colorWrite);const le=S.stencilWrite;c.setTest(le),le&&(c.setMask(S.stencilWriteMask),c.setFunc(S.stencilFunc,S.stencilRef,S.stencilFuncMask),c.setOp(S.stencilFail,S.stencilZFail,S.stencilZPass)),pe(S.polygonOffset,S.polygonOffsetFactor,S.polygonOffsetUnits),S.alphaToCoverage===!0?q(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function Re(S){u!==S&&(S?e.frontFace(e.CW):e.frontFace(e.CCW),u=S)}function ue(S){S!==kr?(q(e.CULL_FACE),S!==C&&(S===Oi?e.cullFace(e.BACK):S===zr?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):ce(e.CULL_FACE),C=S}function $e(S){S!==B&&(W&&e.lineWidth(S),B=S)}function pe(S,J,te){S?(q(e.POLYGON_OFFSET_FILL),(X!==J||Y!==te)&&(e.polygonOffset(J,te),X=J,Y=te)):ce(e.POLYGON_OFFSET_FILL)}function we(S){S?q(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function lt(S){S===void 0&&(S=e.TEXTURE0+Z-1),ge!==S&&(e.activeTexture(S),ge=S)}function it(S,J,te){te===void 0&&(ge===null?te=e.TEXTURE0+Z-1:te=ge);let le=Me[te];le===void 0&&(le={type:void 0,texture:void 0},Me[te]=le),(le.type!==S||le.texture!==J)&&(ge!==te&&(e.activeTexture(te),ge=te),e.bindTexture(S,J||V[S]),le.type=S,le.texture=J)}function p(){const S=Me[ge];S!==void 0&&S.type!==void 0&&(e.bindTexture(S.type,null),S.type=void 0,S.texture=void 0)}function o(){try{e.compressedTexImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function D(){try{e.compressedTexImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function H(){try{e.texSubImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function K(){try{e.texSubImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function F(){try{e.compressedTexSubImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function ve(){try{e.compressedTexSubImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function ee(){try{e.texStorage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function he(){try{e.texStorage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function me(){try{e.texImage2D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function Q(){try{e.texImage3D(...arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function oe(S){nt.equals(S)===!1&&(e.scissor(S.x,S.y,S.z,S.w),nt.copy(S))}function Ae(S){et.equals(S)===!1&&(e.viewport(S.x,S.y,S.z,S.w),et.copy(S))}function _e(S,J){let te=x.get(J);te===void 0&&(te=new WeakMap,x.set(J,te));let le=te.get(S);le===void 0&&(le=e.getUniformBlockIndex(J,S.name),te.set(S,le))}function ae(S,J){const le=x.get(J).get(S);T.get(J)!==le&&(e.uniformBlockBinding(J,le,S.__bindingPointIndex),T.set(J,le))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),d.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),M={},ge=null,Me={},_={},v=new WeakMap,g=[],I=null,L=!1,f=null,a=null,U=null,b=null,E=null,O=null,P=null,N=new je(0,0,0),z=0,h=!1,u=null,C=null,B=null,X=null,Y=null,nt.set(0,0,e.canvas.width,e.canvas.height),et.set(0,0,e.canvas.width,e.canvas.height),r.reset(),d.reset(),c.reset()}return{buffers:{color:r,depth:d,stencil:c},enable:q,disable:ce,bindFramebuffer:Ce,drawBuffers:Ee,useProgram:Oe,setBlending:Ze,setMaterial:De,setFlipSided:Re,setCullFace:ue,setLineWidth:$e,setPolygonOffset:pe,setScissorTest:we,activeTexture:lt,bindTexture:it,unbindTexture:p,compressedTexImage2D:o,compressedTexImage3D:D,texImage2D:me,texImage3D:Q,updateUBOMapping:_e,uniformBlockBinding:ae,texStorage2D:ee,texStorage3D:he,texSubImage2D:H,texSubImage3D:K,compressedTexSubImage2D:F,compressedTexSubImage3D:ve,scissor:oe,viewport:Ae,reset:Le}}function Qf(e,n,t,i,s,r,d){const c=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,T=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new qe,M=new WeakMap;let _;const v=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function I(p,o){return g?new OffscreenCanvas(p,o):fo("canvas")}function L(p,o,D){let H=1;const K=it(p);if((K.width>D||K.height>D)&&(H=D/Math.max(K.width,K.height)),H<1)if(typeof HTMLImageElement<"u"&&p instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&p instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&p instanceof ImageBitmap||typeof VideoFrame<"u"&&p instanceof VideoFrame){const F=Math.floor(H*K.width),ve=Math.floor(H*K.height);_===void 0&&(_=I(F,ve));const ee=o?I(F,ve):_;return ee.width=F,ee.height=ve,ee.getContext("2d").drawImage(p,0,0,F,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+F+"x"+ve+")."),ee}else return"data"in p&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),p;return p}function f(p){return p.generateMipmaps}function a(p){e.generateMipmap(p)}function U(p){return p.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:p.isWebGL3DRenderTarget?e.TEXTURE_3D:p.isWebGLArrayRenderTarget||p.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(p,o,D,H,K=!1){if(p!==null){if(e[p]!==void 0)return e[p];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+p+"'")}let F=o;if(o===e.RED&&(D===e.FLOAT&&(F=e.R32F),D===e.HALF_FLOAT&&(F=e.R16F),D===e.UNSIGNED_BYTE&&(F=e.R8)),o===e.RED_INTEGER&&(D===e.UNSIGNED_BYTE&&(F=e.R8UI),D===e.UNSIGNED_SHORT&&(F=e.R16UI),D===e.UNSIGNED_INT&&(F=e.R32UI),D===e.BYTE&&(F=e.R8I),D===e.SHORT&&(F=e.R16I),D===e.INT&&(F=e.R32I)),o===e.RG&&(D===e.FLOAT&&(F=e.RG32F),D===e.HALF_FLOAT&&(F=e.RG16F),D===e.UNSIGNED_BYTE&&(F=e.RG8)),o===e.RG_INTEGER&&(D===e.UNSIGNED_BYTE&&(F=e.RG8UI),D===e.UNSIGNED_SHORT&&(F=e.RG16UI),D===e.UNSIGNED_INT&&(F=e.RG32UI),D===e.BYTE&&(F=e.RG8I),D===e.SHORT&&(F=e.RG16I),D===e.INT&&(F=e.RG32I)),o===e.RGB_INTEGER&&(D===e.UNSIGNED_BYTE&&(F=e.RGB8UI),D===e.UNSIGNED_SHORT&&(F=e.RGB16UI),D===e.UNSIGNED_INT&&(F=e.RGB32UI),D===e.BYTE&&(F=e.RGB8I),D===e.SHORT&&(F=e.RGB16I),D===e.INT&&(F=e.RGB32I)),o===e.RGBA_INTEGER&&(D===e.UNSIGNED_BYTE&&(F=e.RGBA8UI),D===e.UNSIGNED_SHORT&&(F=e.RGBA16UI),D===e.UNSIGNED_INT&&(F=e.RGBA32UI),D===e.BYTE&&(F=e.RGBA8I),D===e.SHORT&&(F=e.RGBA16I),D===e.INT&&(F=e.RGBA32I)),o===e.RGB&&(D===e.UNSIGNED_INT_5_9_9_9_REV&&(F=e.RGB9_E5),D===e.UNSIGNED_INT_10F_11F_11F_REV&&(F=e.R11F_G11F_B10F)),o===e.RGBA){const ve=K?Na:at.getTransfer(H);D===e.FLOAT&&(F=e.RGBA32F),D===e.HALF_FLOAT&&(F=e.RGBA16F),D===e.UNSIGNED_BYTE&&(F=ve===Ke?e.SRGB8_ALPHA8:e.RGBA8),D===e.UNSIGNED_SHORT_4_4_4_4&&(F=e.RGBA4),D===e.UNSIGNED_SHORT_5_5_5_1&&(F=e.RGB5_A1)}return(F===e.R16F||F===e.R32F||F===e.RG16F||F===e.RG32F||F===e.RGBA16F||F===e.RGBA32F)&&n.get("EXT_color_buffer_float"),F}function E(p,o){let D;return p?o===null||o===rn||o===an?D=e.DEPTH24_STENCIL8:o===It?D=e.DEPTH32F_STENCIL8:o===En&&(D=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):o===null||o===rn||o===an?D=e.DEPTH_COMPONENT24:o===It?D=e.DEPTH_COMPONENT32F:o===En&&(D=e.DEPTH_COMPONENT16),D}function O(p,o){return f(p)===!0||p.isFramebufferTexture&&p.minFilter!==Jt&&p.minFilter!==kt?Math.log2(Math.max(o.width,o.height))+1:p.mipmaps!==void 0&&p.mipmaps.length>0?p.mipmaps.length:p.isCompressedTexture&&Array.isArray(p.image)?o.mipmaps.length:1}function P(p){const o=p.target;o.removeEventListener("dispose",P),z(o),o.isVideoTexture&&M.delete(o)}function N(p){const o=p.target;o.removeEventListener("dispose",N),u(o)}function z(p){const o=i.get(p);if(o.__webglInit===void 0)return;const D=p.source,H=v.get(D);if(H){const K=H[o.__cacheKey];K.usedTimes--,K.usedTimes===0&&h(p),Object.keys(H).length===0&&v.delete(D)}i.remove(p)}function h(p){const o=i.get(p);e.deleteTexture(o.__webglTexture);const D=p.source,H=v.get(D);delete H[o.__cacheKey],d.memory.textures--}function u(p){const o=i.get(p);if(p.depthTexture&&(p.depthTexture.dispose(),i.remove(p.depthTexture)),p.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(o.__webglFramebuffer[H]))for(let K=0;K<o.__webglFramebuffer[H].length;K++)e.deleteFramebuffer(o.__webglFramebuffer[H][K]);else e.deleteFramebuffer(o.__webglFramebuffer[H]);o.__webglDepthbuffer&&e.deleteRenderbuffer(o.__webglDepthbuffer[H])}else{if(Array.isArray(o.__webglFramebuffer))for(let H=0;H<o.__webglFramebuffer.length;H++)e.deleteFramebuffer(o.__webglFramebuffer[H]);else e.deleteFramebuffer(o.__webglFramebuffer);if(o.__webglDepthbuffer&&e.deleteRenderbuffer(o.__webglDepthbuffer),o.__webglMultisampledFramebuffer&&e.deleteFramebuffer(o.__webglMultisampledFramebuffer),o.__webglColorRenderbuffer)for(let H=0;H<o.__webglColorRenderbuffer.length;H++)o.__webglColorRenderbuffer[H]&&e.deleteRenderbuffer(o.__webglColorRenderbuffer[H]);o.__webglDepthRenderbuffer&&e.deleteRenderbuffer(o.__webglDepthRenderbuffer)}const D=p.textures;for(let H=0,K=D.length;H<K;H++){const F=i.get(D[H]);F.__webglTexture&&(e.deleteTexture(F.__webglTexture),d.memory.textures--),i.remove(D[H])}i.remove(p)}let C=0;function B(){C=0}function X(){const p=C;return p>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+p+" texture units while this GPU supports only "+s.maxTextures),C+=1,p}function Y(p){const o=[];return o.push(p.wrapS),o.push(p.wrapT),o.push(p.wrapR||0),o.push(p.magFilter),o.push(p.minFilter),o.push(p.anisotropy),o.push(p.internalFormat),o.push(p.format),o.push(p.type),o.push(p.generateMipmaps),o.push(p.premultiplyAlpha),o.push(p.flipY),o.push(p.unpackAlignment),o.push(p.colorSpace),o.join()}function Z(p,o){const D=i.get(p);if(p.isVideoTexture&&we(p),p.isRenderTargetTexture===!1&&p.isExternalTexture!==!0&&p.version>0&&D.__version!==p.version){const H=p.image;if(H===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(D,p,o);return}}else p.isExternalTexture&&(D.__webglTexture=p.sourceTexture?p.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,D.__webglTexture,e.TEXTURE0+o)}function W(p,o){const D=i.get(p);if(p.isRenderTargetTexture===!1&&p.version>0&&D.__version!==p.version){V(D,p,o);return}t.bindTexture(e.TEXTURE_2D_ARRAY,D.__webglTexture,e.TEXTURE0+o)}function ne(p,o){const D=i.get(p);if(p.isRenderTargetTexture===!1&&p.version>0&&D.__version!==p.version){V(D,p,o);return}t.bindTexture(e.TEXTURE_3D,D.__webglTexture,e.TEXTURE0+o)}function G(p,o){const D=i.get(p);if(p.version>0&&D.__version!==p.version){q(D,p,o);return}t.bindTexture(e.TEXTURE_CUBE_MAP,D.__webglTexture,e.TEXTURE0+o)}const ge={[Mr]:e.REPEAT,[xr]:e.CLAMP_TO_EDGE,[Sr]:e.MIRRORED_REPEAT},Me={[Jt]:e.NEAREST,[Tr]:e.NEAREST_MIPMAP_NEAREST,[cn]:e.NEAREST_MIPMAP_LINEAR,[kt]:e.LINEAR,[Cn]:e.LINEAR_MIPMAP_NEAREST,[jt]:e.LINEAR_MIPMAP_LINEAR},Ue={[Lr]:e.NEVER,[Dr]:e.ALWAYS,[Pr]:e.LESS,[xa]:e.LEQUAL,[Cr]:e.EQUAL,[br]:e.GEQUAL,[Rr]:e.GREATER,[Ar]:e.NOTEQUAL};function He(p,o){if(o.type===It&&n.has("OES_texture_float_linear")===!1&&(o.magFilter===kt||o.magFilter===Cn||o.magFilter===cn||o.magFilter===jt||o.minFilter===kt||o.minFilter===Cn||o.minFilter===cn||o.minFilter===jt)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(p,e.TEXTURE_WRAP_S,ge[o.wrapS]),e.texParameteri(p,e.TEXTURE_WRAP_T,ge[o.wrapT]),(p===e.TEXTURE_3D||p===e.TEXTURE_2D_ARRAY)&&e.texParameteri(p,e.TEXTURE_WRAP_R,ge[o.wrapR]),e.texParameteri(p,e.TEXTURE_MAG_FILTER,Me[o.magFilter]),e.texParameteri(p,e.TEXTURE_MIN_FILTER,Me[o.minFilter]),o.compareFunction&&(e.texParameteri(p,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(p,e.TEXTURE_COMPARE_FUNC,Ue[o.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(o.magFilter===Jt||o.minFilter!==cn&&o.minFilter!==jt||o.type===It&&n.has("OES_texture_float_linear")===!1)return;if(o.anisotropy>1||i.get(o).__currentAnisotropy){const D=n.get("EXT_texture_filter_anisotropic");e.texParameterf(p,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(o.anisotropy,s.getMaxAnisotropy())),i.get(o).__currentAnisotropy=o.anisotropy}}}function nt(p,o){let D=!1;p.__webglInit===void 0&&(p.__webglInit=!0,o.addEventListener("dispose",P));const H=o.source;let K=v.get(H);K===void 0&&(K={},v.set(H,K));const F=Y(o);if(F!==p.__cacheKey){K[F]===void 0&&(K[F]={texture:e.createTexture(),usedTimes:0},d.memory.textures++,D=!0),K[F].usedTimes++;const ve=K[p.__cacheKey];ve!==void 0&&(K[p.__cacheKey].usedTimes--,ve.usedTimes===0&&h(o)),p.__cacheKey=F,p.__webglTexture=K[F].texture}return D}function et(p,o,D){return Math.floor(Math.floor(p/D)/o)}function ze(p,o,D,H){const F=p.updateRanges;if(F.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,o.width,o.height,D,H,o.data);else{F.sort((Q,oe)=>Q.start-oe.start);let ve=0;for(let Q=1;Q<F.length;Q++){const oe=F[ve],Ae=F[Q],_e=oe.start+oe.count,ae=et(Ae.start,o.width,4),Le=et(oe.start,o.width,4);Ae.start<=_e+1&&ae===Le&&et(Ae.start+Ae.count-1,o.width,4)===ae?oe.count=Math.max(oe.count,Ae.start+Ae.count-oe.start):(++ve,F[ve]=Ae)}F.length=ve+1;const ee=e.getParameter(e.UNPACK_ROW_LENGTH),he=e.getParameter(e.UNPACK_SKIP_PIXELS),me=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,o.width);for(let Q=0,oe=F.length;Q<oe;Q++){const Ae=F[Q],_e=Math.floor(Ae.start/4),ae=Math.ceil(Ae.count/4),Le=_e%o.width,S=Math.floor(_e/o.width),J=ae,te=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Le),e.pixelStorei(e.UNPACK_SKIP_ROWS,S),t.texSubImage2D(e.TEXTURE_2D,0,Le,S,J,te,D,H,o.data)}p.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ee),e.pixelStorei(e.UNPACK_SKIP_PIXELS,he),e.pixelStorei(e.UNPACK_SKIP_ROWS,me)}}function V(p,o,D){let H=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(H=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(H=e.TEXTURE_3D);const K=nt(p,o),F=o.source;t.bindTexture(H,p.__webglTexture,e.TEXTURE0+D);const ve=i.get(F);if(F.version!==ve.__version||K===!0){t.activeTexture(e.TEXTURE0+D);const ee=at.getPrimaries(at.workingColorSpace),he=o.colorSpace===Vt?null:at.getPrimaries(o.colorSpace),me=o.colorSpace===Vt||ee===he?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let Q=L(o.image,!1,s.maxTextureSize);Q=lt(o,Q);const oe=r.convert(o.format,o.colorSpace),Ae=r.convert(o.type);let _e=b(o.internalFormat,oe,Ae,o.colorSpace,o.isVideoTexture);He(H,o);let ae;const Le=o.mipmaps,S=o.isVideoTexture!==!0,J=ve.__version===void 0||K===!0,te=F.dataReady,le=O(o,Q);if(o.isDepthTexture)_e=E(o.format===gn,o.type),J&&(S?t.texStorage2D(e.TEXTURE_2D,1,_e,Q.width,Q.height):t.texImage2D(e.TEXTURE_2D,0,_e,Q.width,Q.height,0,oe,Ae,null));else if(o.isDataTexture)if(Le.length>0){S&&J&&t.texStorage2D(e.TEXTURE_2D,le,_e,Le[0].width,Le[0].height);for(let $=0,k=Le.length;$<k;$++)ae=Le[$],S?te&&t.texSubImage2D(e.TEXTURE_2D,$,0,0,ae.width,ae.height,oe,Ae,ae.data):t.texImage2D(e.TEXTURE_2D,$,_e,ae.width,ae.height,0,oe,Ae,ae.data);o.generateMipmaps=!1}else S?(J&&t.texStorage2D(e.TEXTURE_2D,le,_e,Q.width,Q.height),te&&ze(o,Q,oe,Ae)):t.texImage2D(e.TEXTURE_2D,0,_e,Q.width,Q.height,0,oe,Ae,Q.data);else if(o.isCompressedTexture)if(o.isCompressedArrayTexture){S&&J&&t.texStorage3D(e.TEXTURE_2D_ARRAY,le,_e,Le[0].width,Le[0].height,Q.depth);for(let $=0,k=Le.length;$<k;$++)if(ae=Le[$],o.format!==bt)if(oe!==null)if(S){if(te)if(o.layerUpdates.size>0){const de=Vi(ae.width,ae.height,o.format,o.type);for(const Pe of o.layerUpdates){const Xe=ae.data.subarray(Pe*de/ae.data.BYTES_PER_ELEMENT,(Pe+1)*de/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,$,0,0,Pe,ae.width,ae.height,1,oe,Xe)}o.clearLayerUpdates()}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,$,0,0,0,ae.width,ae.height,Q.depth,oe,ae.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,$,_e,ae.width,ae.height,Q.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else S?te&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,$,0,0,0,ae.width,ae.height,Q.depth,oe,Ae,ae.data):t.texImage3D(e.TEXTURE_2D_ARRAY,$,_e,ae.width,ae.height,Q.depth,0,oe,Ae,ae.data)}else{S&&J&&t.texStorage2D(e.TEXTURE_2D,le,_e,Le[0].width,Le[0].height);for(let $=0,k=Le.length;$<k;$++)ae=Le[$],o.format!==bt?oe!==null?S?te&&t.compressedTexSubImage2D(e.TEXTURE_2D,$,0,0,ae.width,ae.height,oe,ae.data):t.compressedTexImage2D(e.TEXTURE_2D,$,_e,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):S?te&&t.texSubImage2D(e.TEXTURE_2D,$,0,0,ae.width,ae.height,oe,Ae,ae.data):t.texImage2D(e.TEXTURE_2D,$,_e,ae.width,ae.height,0,oe,Ae,ae.data)}else if(o.isDataArrayTexture)if(S){if(J&&t.texStorage3D(e.TEXTURE_2D_ARRAY,le,_e,Q.width,Q.height,Q.depth),te)if(o.layerUpdates.size>0){const $=Vi(Q.width,Q.height,o.format,o.type);for(const k of o.layerUpdates){const de=Q.data.subarray(k*$/Q.data.BYTES_PER_ELEMENT,(k+1)*$/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,k,Q.width,Q.height,1,oe,Ae,de)}o.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,oe,Ae,Q.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,_e,Q.width,Q.height,Q.depth,0,oe,Ae,Q.data);else if(o.isData3DTexture)S?(J&&t.texStorage3D(e.TEXTURE_3D,le,_e,Q.width,Q.height,Q.depth),te&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,oe,Ae,Q.data)):t.texImage3D(e.TEXTURE_3D,0,_e,Q.width,Q.height,Q.depth,0,oe,Ae,Q.data);else if(o.isFramebufferTexture){if(J)if(S)t.texStorage2D(e.TEXTURE_2D,le,_e,Q.width,Q.height);else{let $=Q.width,k=Q.height;for(let de=0;de<le;de++)t.texImage2D(e.TEXTURE_2D,de,_e,$,k,0,oe,Ae,null),$>>=1,k>>=1}}else if(Le.length>0){if(S&&J){const $=it(Le[0]);t.texStorage2D(e.TEXTURE_2D,le,_e,$.width,$.height)}for(let $=0,k=Le.length;$<k;$++)ae=Le[$],S?te&&t.texSubImage2D(e.TEXTURE_2D,$,0,0,oe,Ae,ae):t.texImage2D(e.TEXTURE_2D,$,_e,oe,Ae,ae);o.generateMipmaps=!1}else if(S){if(J){const $=it(Q);t.texStorage2D(e.TEXTURE_2D,le,_e,$.width,$.height)}te&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,oe,Ae,Q)}else t.texImage2D(e.TEXTURE_2D,0,_e,oe,Ae,Q);f(o)&&a(H),ve.__version=F.version,o.onUpdate&&o.onUpdate(o)}p.__version=o.version}function q(p,o,D){if(o.image.length!==6)return;const H=nt(p,o),K=o.source;t.bindTexture(e.TEXTURE_CUBE_MAP,p.__webglTexture,e.TEXTURE0+D);const F=i.get(K);if(K.version!==F.__version||H===!0){t.activeTexture(e.TEXTURE0+D);const ve=at.getPrimaries(at.workingColorSpace),ee=o.colorSpace===Vt?null:at.getPrimaries(o.colorSpace),he=o.colorSpace===Vt||ve===ee?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const me=o.isCompressedTexture||o.image[0].isCompressedTexture,Q=o.image[0]&&o.image[0].isDataTexture,oe=[];for(let k=0;k<6;k++)!me&&!Q?oe[k]=L(o.image[k],!0,s.maxCubemapSize):oe[k]=Q?o.image[k].image:o.image[k],oe[k]=lt(o,oe[k]);const Ae=oe[0],_e=r.convert(o.format,o.colorSpace),ae=r.convert(o.type),Le=b(o.internalFormat,_e,ae,o.colorSpace),S=o.isVideoTexture!==!0,J=F.__version===void 0||H===!0,te=K.dataReady;let le=O(o,Ae);He(e.TEXTURE_CUBE_MAP,o);let $;if(me){S&&J&&t.texStorage2D(e.TEXTURE_CUBE_MAP,le,Le,Ae.width,Ae.height);for(let k=0;k<6;k++){$=oe[k].mipmaps;for(let de=0;de<$.length;de++){const Pe=$[de];o.format!==bt?_e!==null?S?te&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de,0,0,Pe.width,Pe.height,_e,Pe.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de,Le,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):S?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de,0,0,Pe.width,Pe.height,_e,ae,Pe.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de,Le,Pe.width,Pe.height,0,_e,ae,Pe.data)}}}else{if($=o.mipmaps,S&&J){$.length>0&&le++;const k=it(oe[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,le,Le,k.width,k.height)}for(let k=0;k<6;k++)if(Q){S?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,0,0,0,oe[k].width,oe[k].height,_e,ae,oe[k].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,0,Le,oe[k].width,oe[k].height,0,_e,ae,oe[k].data);for(let de=0;de<$.length;de++){const Xe=$[de].image[k].image;S?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de+1,0,0,Xe.width,Xe.height,_e,ae,Xe.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de+1,Le,Xe.width,Xe.height,0,_e,ae,Xe.data)}}else{S?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,0,0,0,_e,ae,oe[k]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,0,Le,_e,ae,oe[k]);for(let de=0;de<$.length;de++){const Pe=$[de];S?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de+1,0,0,_e,ae,Pe.image[k]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+k,de+1,Le,_e,ae,Pe.image[k])}}}f(o)&&a(e.TEXTURE_CUBE_MAP),F.__version=K.version,o.onUpdate&&o.onUpdate(o)}p.__version=o.version}function ce(p,o,D,H,K,F){const ve=r.convert(D.format,D.colorSpace),ee=r.convert(D.type),he=b(D.internalFormat,ve,ee,D.colorSpace),me=i.get(o),Q=i.get(D);if(Q.__renderTarget=o,!me.__hasExternalTextures){const oe=Math.max(1,o.width>>F),Ae=Math.max(1,o.height>>F);K===e.TEXTURE_3D||K===e.TEXTURE_2D_ARRAY?t.texImage3D(K,F,he,oe,Ae,o.depth,0,ve,ee,null):t.texImage2D(K,F,he,oe,Ae,0,ve,ee,null)}t.bindFramebuffer(e.FRAMEBUFFER,p),pe(o)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,H,K,Q.__webglTexture,0,$e(o)):(K===e.TEXTURE_2D||K>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,H,K,Q.__webglTexture,F),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(p,o,D){if(e.bindRenderbuffer(e.RENDERBUFFER,p),o.depthBuffer){const H=o.depthTexture,K=H&&H.isDepthTexture?H.type:null,F=E(o.stencilBuffer,K),ve=o.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ee=$e(o);pe(o)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,ee,F,o.width,o.height):D?e.renderbufferStorageMultisample(e.RENDERBUFFER,ee,F,o.width,o.height):e.renderbufferStorage(e.RENDERBUFFER,F,o.width,o.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ve,e.RENDERBUFFER,p)}else{const H=o.textures;for(let K=0;K<H.length;K++){const F=H[K],ve=r.convert(F.format,F.colorSpace),ee=r.convert(F.type),he=b(F.internalFormat,ve,ee,F.colorSpace),me=$e(o);D&&pe(o)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,me,he,o.width,o.height):pe(o)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,me,he,o.width,o.height):e.renderbufferStorage(e.RENDERBUFFER,he,o.width,o.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ee(p,o){if(o&&o.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(e.FRAMEBUFFER,p),!(o.depthTexture&&o.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const H=i.get(o.depthTexture);H.__renderTarget=o,(!H.__webglTexture||o.depthTexture.image.width!==o.width||o.depthTexture.image.height!==o.height)&&(o.depthTexture.image.width=o.width,o.depthTexture.image.height=o.height,o.depthTexture.needsUpdate=!0),Z(o.depthTexture,0);const K=H.__webglTexture,F=$e(o);if(o.depthTexture.format===$n)pe(o)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,K,0,F):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,K,0);else if(o.depthTexture.format===gn)pe(o)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,K,0,F):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Oe(p){const o=i.get(p),D=p.isWebGLCubeRenderTarget===!0;if(o.__boundDepthTexture!==p.depthTexture){const H=p.depthTexture;if(o.__depthDisposeCallback&&o.__depthDisposeCallback(),H){const K=()=>{delete o.__boundDepthTexture,delete o.__depthDisposeCallback,H.removeEventListener("dispose",K)};H.addEventListener("dispose",K),o.__depthDisposeCallback=K}o.__boundDepthTexture=H}if(p.depthTexture&&!o.__autoAllocateDepthBuffer){if(D)throw new Error("target.depthTexture not supported in Cube render targets");const H=p.texture.mipmaps;H&&H.length>0?Ee(o.__webglFramebuffer[0],p):Ee(o.__webglFramebuffer,p)}else if(D){o.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer[H]),o.__webglDepthbuffer[H]===void 0)o.__webglDepthbuffer[H]=e.createRenderbuffer(),Ce(o.__webglDepthbuffer[H],p,!1);else{const K=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,F=o.__webglDepthbuffer[H];e.bindRenderbuffer(e.RENDERBUFFER,F),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,F)}}else{const H=p.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer),o.__webglDepthbuffer===void 0)o.__webglDepthbuffer=e.createRenderbuffer(),Ce(o.__webglDepthbuffer,p,!1);else{const K=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,F=o.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,F),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,F)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function ct(p,o,D){const H=i.get(p);o!==void 0&&ce(H.__webglFramebuffer,p,p.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),D!==void 0&&Oe(p)}function m(p){const o=p.texture,D=i.get(p),H=i.get(o);p.addEventListener("dispose",N);const K=p.textures,F=p.isWebGLCubeRenderTarget===!0,ve=K.length>1;if(ve||(H.__webglTexture===void 0&&(H.__webglTexture=e.createTexture()),H.__version=o.version,d.memory.textures++),F){D.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(o.mipmaps&&o.mipmaps.length>0){D.__webglFramebuffer[ee]=[];for(let he=0;he<o.mipmaps.length;he++)D.__webglFramebuffer[ee][he]=e.createFramebuffer()}else D.__webglFramebuffer[ee]=e.createFramebuffer()}else{if(o.mipmaps&&o.mipmaps.length>0){D.__webglFramebuffer=[];for(let ee=0;ee<o.mipmaps.length;ee++)D.__webglFramebuffer[ee]=e.createFramebuffer()}else D.__webglFramebuffer=e.createFramebuffer();if(ve)for(let ee=0,he=K.length;ee<he;ee++){const me=i.get(K[ee]);me.__webglTexture===void 0&&(me.__webglTexture=e.createTexture(),d.memory.textures++)}if(p.samples>0&&pe(p)===!1){D.__webglMultisampledFramebuffer=e.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let ee=0;ee<K.length;ee++){const he=K[ee];D.__webglColorRenderbuffer[ee]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,D.__webglColorRenderbuffer[ee]);const me=r.convert(he.format,he.colorSpace),Q=r.convert(he.type),oe=b(he.internalFormat,me,Q,he.colorSpace,p.isXRRenderTarget===!0),Ae=$e(p);e.renderbufferStorageMultisample(e.RENDERBUFFER,Ae,oe,p.width,p.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ee,e.RENDERBUFFER,D.__webglColorRenderbuffer[ee])}e.bindRenderbuffer(e.RENDERBUFFER,null),p.depthBuffer&&(D.__webglDepthRenderbuffer=e.createRenderbuffer(),Ce(D.__webglDepthRenderbuffer,p,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(F){t.bindTexture(e.TEXTURE_CUBE_MAP,H.__webglTexture),He(e.TEXTURE_CUBE_MAP,o);for(let ee=0;ee<6;ee++)if(o.mipmaps&&o.mipmaps.length>0)for(let he=0;he<o.mipmaps.length;he++)ce(D.__webglFramebuffer[ee][he],p,o,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,he);else ce(D.__webglFramebuffer[ee],p,o,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);f(o)&&a(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ee=0,he=K.length;ee<he;ee++){const me=K[ee],Q=i.get(me);let oe=e.TEXTURE_2D;(p.isWebGL3DRenderTarget||p.isWebGLArrayRenderTarget)&&(oe=p.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(oe,Q.__webglTexture),He(oe,me),ce(D.__webglFramebuffer,p,me,e.COLOR_ATTACHMENT0+ee,oe,0),f(me)&&a(oe)}t.unbindTexture()}else{let ee=e.TEXTURE_2D;if((p.isWebGL3DRenderTarget||p.isWebGLArrayRenderTarget)&&(ee=p.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(ee,H.__webglTexture),He(ee,o),o.mipmaps&&o.mipmaps.length>0)for(let he=0;he<o.mipmaps.length;he++)ce(D.__webglFramebuffer[he],p,o,e.COLOR_ATTACHMENT0,ee,he);else ce(D.__webglFramebuffer,p,o,e.COLOR_ATTACHMENT0,ee,0);f(o)&&a(ee),t.unbindTexture()}p.depthBuffer&&Oe(p)}function Ze(p){const o=p.textures;for(let D=0,H=o.length;D<H;D++){const K=o[D];if(f(K)){const F=U(p),ve=i.get(K).__webglTexture;t.bindTexture(F,ve),a(F),t.unbindTexture()}}}const De=[],Re=[];function ue(p){if(p.samples>0){if(pe(p)===!1){const o=p.textures,D=p.width,H=p.height;let K=e.COLOR_BUFFER_BIT;const F=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ve=i.get(p),ee=o.length>1;if(ee)for(let me=0;me<o.length;me++)t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);const he=p.texture.mipmaps;he&&he.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let me=0;me<o.length;me++){if(p.resolveDepthBuffer&&(p.depthBuffer&&(K|=e.DEPTH_BUFFER_BIT),p.stencilBuffer&&p.resolveStencilBuffer&&(K|=e.STENCIL_BUFFER_BIT)),ee){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);const Q=i.get(o[me]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Q,0)}e.blitFramebuffer(0,0,D,H,0,0,D,H,K,e.NEAREST),T===!0&&(De.length=0,Re.length=0,De.push(e.COLOR_ATTACHMENT0+me),p.depthBuffer&&p.resolveDepthBuffer===!1&&(De.push(F),Re.push(F),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Re)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,De))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ee)for(let me=0;me<o.length;me++){t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.RENDERBUFFER,ve.__webglColorRenderbuffer[me]);const Q=i.get(o[me]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,ve.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.TEXTURE_2D,Q,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(p.depthBuffer&&p.resolveDepthBuffer===!1&&T){const o=p.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[o])}}}function $e(p){return Math.min(s.maxSamples,p.samples)}function pe(p){const o=i.get(p);return p.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&o.__useRenderToTexture!==!1}function we(p){const o=d.render.frame;M.get(p)!==o&&(M.set(p,o),p.update())}function lt(p,o){const D=p.colorSpace,H=p.format,K=p.type;return p.isCompressedTexture===!0||p.isVideoTexture===!0||D!==xn&&D!==Vt&&(at.getTransfer(D)===Ke?(H!==bt||K!==Ot)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",D)),o}function it(p){return typeof HTMLImageElement<"u"&&p instanceof HTMLImageElement?(x.width=p.naturalWidth||p.width,x.height=p.naturalHeight||p.height):typeof VideoFrame<"u"&&p instanceof VideoFrame?(x.width=p.displayWidth,x.height=p.displayHeight):(x.width=p.width,x.height=p.height),x}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.setTexture2D=Z,this.setTexture2DArray=W,this.setTexture3D=ne,this.setTextureCube=G,this.rebindTextures=ct,this.setupRenderTarget=m,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=pe}function Jf(e,n){function t(i,s=Vt){let r;const d=at.getTransfer(s);if(i===Ot)return e.UNSIGNED_BYTE;if(i===Aa)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Ra)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Ir)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Nr)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Or)return e.BYTE;if(i===Fr)return e.SHORT;if(i===En)return e.UNSIGNED_SHORT;if(i===Pa)return e.INT;if(i===rn)return e.UNSIGNED_INT;if(i===It)return e.FLOAT;if(i===Sn)return e.HALF_FLOAT;if(i===Br)return e.ALPHA;if(i===Hr)return e.RGB;if(i===bt)return e.RGBA;if(i===$n)return e.DEPTH_COMPONENT;if(i===gn)return e.DEPTH_STENCIL;if(i===Gr)return e.RED;if(i===Da)return e.RED_INTEGER;if(i===Vr)return e.RG;if(i===La)return e.RG_INTEGER;if(i===Ua)return e.RGBA_INTEGER;if(i===Pn||i===Dn||i===Ln||i===Un)if(d===Ke)if(r=n.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Pn)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Dn)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ln)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Un)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=n.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Pn)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Dn)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ln)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Un)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===li||i===ci||i===fi||i===di)if(r=n.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===li)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ci)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===fi)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===di)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ui||i===pi||i===hi)if(r=n.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ui||i===pi)return d===Ke?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===hi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===mi||i===_i||i===gi||i===vi||i===Ei||i===Si||i===xi||i===Mi||i===Ti||i===Ai||i===Ri||i===bi||i===Ci||i===Pi)if(r=n.get("WEBGL_compressed_texture_astc"),r!==null){if(i===mi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_i)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===gi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ei)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Si)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===xi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Mi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ti)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ai)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ri)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ci)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pi)return d===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Di||i===Li||i===Ui)if(r=n.get("EXT_texture_compression_bptc"),r!==null){if(i===Di)return d===Ke?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Li)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ui)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wi||i===yi||i===Ii||i===Ni)if(r=n.get("EXT_texture_compression_rgtc"),r!==null){if(i===wi)return r.COMPRESSED_RED_RGTC1_EXT;if(i===yi)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ii)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ni)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===an?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const ed=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,td=`
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

}`;class nd{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new ba(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new Ft({vertexShader:ed,fragmentShader:td,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new dt(new Ca(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class id extends Qa{constructor(n,t){super();const i=this;let s=null,r=1,d=null,c="local-floor",T=1,x=null,M=null,_=null,v=null,g=null,I=null;const L=typeof XRWebGLBinding<"u",f=new nd,a={},U=t.getContextAttributes();let b=null,E=null;const O=[],P=[],N=new qe;let z=null;const h=new hn;h.viewport=new mt;const u=new hn;u.viewport=new mt;const C=[h,u],B=new Ja;let X=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let q=O[V];return q===void 0&&(q=new bn,O[V]=q),q.getTargetRaySpace()},this.getControllerGrip=function(V){let q=O[V];return q===void 0&&(q=new bn,O[V]=q),q.getGripSpace()},this.getHand=function(V){let q=O[V];return q===void 0&&(q=new bn,O[V]=q),q.getHandSpace()};function Z(V){const q=P.indexOf(V.inputSource);if(q===-1)return;const ce=O[q];ce!==void 0&&(ce.update(V.inputSource,V.frame,x||d),ce.dispatchEvent({type:V.type,data:V.inputSource}))}function W(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",ne);for(let V=0;V<O.length;V++){const q=P[V];q!==null&&(P[V]=null,O[V].disconnect(q))}X=null,Y=null,f.reset();for(const V in a)delete a[V];n.setRenderTarget(b),g=null,v=null,_=null,s=null,E=null,ze.stop(),i.isPresenting=!1,n.setPixelRatio(z),n.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){c=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return x||d},this.setReferenceSpace=function(V){x=V},this.getBaseLayer=function(){return v!==null?v:g},this.getBinding=function(){return _===null&&L&&(_=new XRWebGLBinding(s,t)),_},this.getFrame=function(){return I},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(b=n.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",W),s.addEventListener("inputsourceschange",ne),U.xrCompatible!==!0&&await t.makeXRCompatible(),z=n.getPixelRatio(),n.getSize(N),L&&"createProjectionLayer"in XRWebGLBinding.prototype){let ce=null,Ce=null,Ee=null;U.depth&&(Ee=U.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=U.stencil?gn:$n,Ce=U.stencil?an:rn);const Oe={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};_=this.getBinding(),v=_.createProjectionLayer(Oe),s.updateRenderState({layers:[v]}),n.setPixelRatio(1),n.setSize(v.textureWidth,v.textureHeight,!1),E=new Yt(v.textureWidth,v.textureHeight,{format:bt,type:Ot,depthTexture:new Sa(v.textureWidth,v.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:U.stencil,colorSpace:n.outputColorSpace,samples:U.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1,resolveStencilBuffer:v.ignoreDepthValues===!1})}else{const ce={antialias:U.antialias,alpha:!0,depth:U.depth,stencil:U.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,ce),s.updateRenderState({baseLayer:g}),n.setPixelRatio(1),n.setSize(g.framebufferWidth,g.framebufferHeight,!1),E=new Yt(g.framebufferWidth,g.framebufferHeight,{format:bt,type:Ot,colorSpace:n.outputColorSpace,stencilBuffer:U.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(T),x=null,d=await s.requestReferenceSpace(c),ze.setContext(s),ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function ne(V){for(let q=0;q<V.removed.length;q++){const ce=V.removed[q],Ce=P.indexOf(ce);Ce>=0&&(P[Ce]=null,O[Ce].disconnect(ce))}for(let q=0;q<V.added.length;q++){const ce=V.added[q];let Ce=P.indexOf(ce);if(Ce===-1){for(let Oe=0;Oe<O.length;Oe++)if(Oe>=P.length){P.push(ce),Ce=Oe;break}else if(P[Oe]===null){P[Oe]=ce,Ce=Oe;break}if(Ce===-1)break}const Ee=O[Ce];Ee&&Ee.connect(ce)}}const G=new Ie,ge=new Ie;function Me(V,q,ce){G.setFromMatrixPosition(q.matrixWorld),ge.setFromMatrixPosition(ce.matrixWorld);const Ce=G.distanceTo(ge),Ee=q.projectionMatrix.elements,Oe=ce.projectionMatrix.elements,ct=Ee[14]/(Ee[10]-1),m=Ee[14]/(Ee[10]+1),Ze=(Ee[9]+1)/Ee[5],De=(Ee[9]-1)/Ee[5],Re=(Ee[8]-1)/Ee[0],ue=(Oe[8]+1)/Oe[0],$e=ct*Re,pe=ct*ue,we=Ce/(-Re+ue),lt=we*-Re;if(q.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(lt),V.translateZ(we),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Ee[10]===-1)V.projectionMatrix.copy(q.projectionMatrix),V.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const it=ct+we,p=m+we,o=$e-lt,D=pe+(Ce-lt),H=Ze*m/p*it,K=De*m/p*it;V.projectionMatrix.makePerspective(o,D,H,K,it,p),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function Ue(V,q){q===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(q.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let q=V.near,ce=V.far;f.texture!==null&&(f.depthNear>0&&(q=f.depthNear),f.depthFar>0&&(ce=f.depthFar)),B.near=u.near=h.near=q,B.far=u.far=h.far=ce,(X!==B.near||Y!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),X=B.near,Y=B.far),B.layers.mask=V.layers.mask|6,h.layers.mask=B.layers.mask&3,u.layers.mask=B.layers.mask&5;const Ce=V.parent,Ee=B.cameras;Ue(B,Ce);for(let Oe=0;Oe<Ee.length;Oe++)Ue(Ee[Oe],Ce);Ee.length===2?Me(B,h,u):B.projectionMatrix.copy(h.projectionMatrix),He(V,B,Ce)};function He(V,q,ce){ce===null?V.matrix.copy(q.matrixWorld):(V.matrix.copy(ce.matrixWorld),V.matrix.invert(),V.matrix.multiply(q.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(q.projectionMatrix),V.projectionMatrixInverse.copy(q.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=er*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(v===null&&g===null))return T},this.setFoveation=function(V){T=V,v!==null&&(v.fixedFoveation=V),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=V)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(B)},this.getCameraTexture=function(V){return a[V]};let nt=null;function et(V,q){if(M=q.getViewerPose(x||d),I=q,M!==null){const ce=M.views;g!==null&&(n.setRenderTargetFramebuffer(E,g.framebuffer),n.setRenderTarget(E));let Ce=!1;ce.length!==B.cameras.length&&(B.cameras.length=0,Ce=!0);for(let m=0;m<ce.length;m++){const Ze=ce[m];let De=null;if(g!==null)De=g.getViewport(Ze);else{const ue=_.getViewSubImage(v,Ze);De=ue.viewport,m===0&&(n.setRenderTargetTextures(E,ue.colorTexture,ue.depthStencilTexture),n.setRenderTarget(E))}let Re=C[m];Re===void 0&&(Re=new hn,Re.layers.enable(m),Re.viewport=new mt,C[m]=Re),Re.matrix.fromArray(Ze.transform.matrix),Re.matrix.decompose(Re.position,Re.quaternion,Re.scale),Re.projectionMatrix.fromArray(Ze.projectionMatrix),Re.projectionMatrixInverse.copy(Re.projectionMatrix).invert(),Re.viewport.set(De.x,De.y,De.width,De.height),m===0&&(B.matrix.copy(Re.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Ce===!0&&B.cameras.push(Re)}const Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&L){_=i.getBinding();const m=_.getDepthInformation(ce[0]);m&&m.isValid&&m.texture&&f.init(m,s.renderState)}if(Ee&&Ee.includes("camera-access")&&L){n.state.unbindTexture(),_=i.getBinding();for(let m=0;m<ce.length;m++){const Ze=ce[m].camera;if(Ze){let De=a[Ze];De||(De=new ba,a[Ze]=De);const Re=_.getCameraImage(Ze);De.sourceTexture=Re}}}}for(let ce=0;ce<O.length;ce++){const Ce=P[ce],Ee=O[ce];Ce!==null&&Ee!==void 0&&Ee.update(Ce,q,x||d)}nt&&nt(V,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),I=null}const ze=new Oa;ze.setAnimationLoop(et),this.setAnimationLoop=function(V){nt=V},this.dispose=function(){}}}const Ut=new Ia,ad=new tn;function rd(e,n){function t(f,a){f.matrixAutoUpdate===!0&&f.updateMatrix(),a.value.copy(f.matrix)}function i(f,a){a.color.getRGB(f.fogColor.value,ya(e)),a.isFog?(f.fogNear.value=a.near,f.fogFar.value=a.far):a.isFogExp2&&(f.fogDensity.value=a.density)}function s(f,a,U,b,E){a.isMeshBasicMaterial||a.isMeshLambertMaterial?r(f,a):a.isMeshToonMaterial?(r(f,a),_(f,a)):a.isMeshPhongMaterial?(r(f,a),M(f,a)):a.isMeshStandardMaterial?(r(f,a),v(f,a),a.isMeshPhysicalMaterial&&g(f,a,E)):a.isMeshMatcapMaterial?(r(f,a),I(f,a)):a.isMeshDepthMaterial?r(f,a):a.isMeshDistanceMaterial?(r(f,a),L(f,a)):a.isMeshNormalMaterial?r(f,a):a.isLineBasicMaterial?(d(f,a),a.isLineDashedMaterial&&c(f,a)):a.isPointsMaterial?T(f,a,U,b):a.isSpriteMaterial?x(f,a):a.isShadowMaterial?(f.color.value.copy(a.color),f.opacity.value=a.opacity):a.isShaderMaterial&&(a.uniformsNeedUpdate=!1)}function r(f,a){f.opacity.value=a.opacity,a.color&&f.diffuse.value.copy(a.color),a.emissive&&f.emissive.value.copy(a.emissive).multiplyScalar(a.emissiveIntensity),a.map&&(f.map.value=a.map,t(a.map,f.mapTransform)),a.alphaMap&&(f.alphaMap.value=a.alphaMap,t(a.alphaMap,f.alphaMapTransform)),a.bumpMap&&(f.bumpMap.value=a.bumpMap,t(a.bumpMap,f.bumpMapTransform),f.bumpScale.value=a.bumpScale,a.side===vt&&(f.bumpScale.value*=-1)),a.normalMap&&(f.normalMap.value=a.normalMap,t(a.normalMap,f.normalMapTransform),f.normalScale.value.copy(a.normalScale),a.side===vt&&f.normalScale.value.negate()),a.displacementMap&&(f.displacementMap.value=a.displacementMap,t(a.displacementMap,f.displacementMapTransform),f.displacementScale.value=a.displacementScale,f.displacementBias.value=a.displacementBias),a.emissiveMap&&(f.emissiveMap.value=a.emissiveMap,t(a.emissiveMap,f.emissiveMapTransform)),a.specularMap&&(f.specularMap.value=a.specularMap,t(a.specularMap,f.specularMapTransform)),a.alphaTest>0&&(f.alphaTest.value=a.alphaTest);const U=n.get(a),b=U.envMap,E=U.envMapRotation;b&&(f.envMap.value=b,Ut.copy(E),Ut.x*=-1,Ut.y*=-1,Ut.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ut.y*=-1,Ut.z*=-1),f.envMapRotation.value.setFromMatrix4(ad.makeRotationFromEuler(Ut)),f.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=a.reflectivity,f.ior.value=a.ior,f.refractionRatio.value=a.refractionRatio),a.lightMap&&(f.lightMap.value=a.lightMap,f.lightMapIntensity.value=a.lightMapIntensity,t(a.lightMap,f.lightMapTransform)),a.aoMap&&(f.aoMap.value=a.aoMap,f.aoMapIntensity.value=a.aoMapIntensity,t(a.aoMap,f.aoMapTransform))}function d(f,a){f.diffuse.value.copy(a.color),f.opacity.value=a.opacity,a.map&&(f.map.value=a.map,t(a.map,f.mapTransform))}function c(f,a){f.dashSize.value=a.dashSize,f.totalSize.value=a.dashSize+a.gapSize,f.scale.value=a.scale}function T(f,a,U,b){f.diffuse.value.copy(a.color),f.opacity.value=a.opacity,f.size.value=a.size*U,f.scale.value=b*.5,a.map&&(f.map.value=a.map,t(a.map,f.uvTransform)),a.alphaMap&&(f.alphaMap.value=a.alphaMap,t(a.alphaMap,f.alphaMapTransform)),a.alphaTest>0&&(f.alphaTest.value=a.alphaTest)}function x(f,a){f.diffuse.value.copy(a.color),f.opacity.value=a.opacity,f.rotation.value=a.rotation,a.map&&(f.map.value=a.map,t(a.map,f.mapTransform)),a.alphaMap&&(f.alphaMap.value=a.alphaMap,t(a.alphaMap,f.alphaMapTransform)),a.alphaTest>0&&(f.alphaTest.value=a.alphaTest)}function M(f,a){f.specular.value.copy(a.specular),f.shininess.value=Math.max(a.shininess,1e-4)}function _(f,a){a.gradientMap&&(f.gradientMap.value=a.gradientMap)}function v(f,a){f.metalness.value=a.metalness,a.metalnessMap&&(f.metalnessMap.value=a.metalnessMap,t(a.metalnessMap,f.metalnessMapTransform)),f.roughness.value=a.roughness,a.roughnessMap&&(f.roughnessMap.value=a.roughnessMap,t(a.roughnessMap,f.roughnessMapTransform)),a.envMap&&(f.envMapIntensity.value=a.envMapIntensity)}function g(f,a,U){f.ior.value=a.ior,a.sheen>0&&(f.sheenColor.value.copy(a.sheenColor).multiplyScalar(a.sheen),f.sheenRoughness.value=a.sheenRoughness,a.sheenColorMap&&(f.sheenColorMap.value=a.sheenColorMap,t(a.sheenColorMap,f.sheenColorMapTransform)),a.sheenRoughnessMap&&(f.sheenRoughnessMap.value=a.sheenRoughnessMap,t(a.sheenRoughnessMap,f.sheenRoughnessMapTransform))),a.clearcoat>0&&(f.clearcoat.value=a.clearcoat,f.clearcoatRoughness.value=a.clearcoatRoughness,a.clearcoatMap&&(f.clearcoatMap.value=a.clearcoatMap,t(a.clearcoatMap,f.clearcoatMapTransform)),a.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=a.clearcoatRoughnessMap,t(a.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),a.clearcoatNormalMap&&(f.clearcoatNormalMap.value=a.clearcoatNormalMap,t(a.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(a.clearcoatNormalScale),a.side===vt&&f.clearcoatNormalScale.value.negate())),a.dispersion>0&&(f.dispersion.value=a.dispersion),a.iridescence>0&&(f.iridescence.value=a.iridescence,f.iridescenceIOR.value=a.iridescenceIOR,f.iridescenceThicknessMinimum.value=a.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=a.iridescenceThicknessRange[1],a.iridescenceMap&&(f.iridescenceMap.value=a.iridescenceMap,t(a.iridescenceMap,f.iridescenceMapTransform)),a.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=a.iridescenceThicknessMap,t(a.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),a.transmission>0&&(f.transmission.value=a.transmission,f.transmissionSamplerMap.value=U.texture,f.transmissionSamplerSize.value.set(U.width,U.height),a.transmissionMap&&(f.transmissionMap.value=a.transmissionMap,t(a.transmissionMap,f.transmissionMapTransform)),f.thickness.value=a.thickness,a.thicknessMap&&(f.thicknessMap.value=a.thicknessMap,t(a.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=a.attenuationDistance,f.attenuationColor.value.copy(a.attenuationColor)),a.anisotropy>0&&(f.anisotropyVector.value.set(a.anisotropy*Math.cos(a.anisotropyRotation),a.anisotropy*Math.sin(a.anisotropyRotation)),a.anisotropyMap&&(f.anisotropyMap.value=a.anisotropyMap,t(a.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=a.specularIntensity,f.specularColor.value.copy(a.specularColor),a.specularColorMap&&(f.specularColorMap.value=a.specularColorMap,t(a.specularColorMap,f.specularColorMapTransform)),a.specularIntensityMap&&(f.specularIntensityMap.value=a.specularIntensityMap,t(a.specularIntensityMap,f.specularIntensityMapTransform))}function I(f,a){a.matcap&&(f.matcap.value=a.matcap)}function L(f,a){const U=n.get(a).light;f.referencePosition.value.setFromMatrixPosition(U.matrixWorld),f.nearDistance.value=U.shadow.camera.near,f.farDistance.value=U.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function od(e,n,t,i){let s={},r={},d=[];const c=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function T(U,b){const E=b.program;i.uniformBlockBinding(U,E)}function x(U,b){let E=s[U.id];E===void 0&&(I(U),E=M(U),s[U.id]=E,U.addEventListener("dispose",f));const O=b.program;i.updateUBOMapping(U,O);const P=n.render.frame;r[U.id]!==P&&(v(U),r[U.id]=P)}function M(U){const b=_();U.__bindingPointIndex=b;const E=e.createBuffer(),O=U.__size,P=U.usage;return e.bindBuffer(e.UNIFORM_BUFFER,E),e.bufferData(e.UNIFORM_BUFFER,O,P),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,b,E),E}function _(){for(let U=0;U<c;U++)if(d.indexOf(U)===-1)return d.push(U),U;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(U){const b=s[U.id],E=U.uniforms,O=U.__cache;e.bindBuffer(e.UNIFORM_BUFFER,b);for(let P=0,N=E.length;P<N;P++){const z=Array.isArray(E[P])?E[P]:[E[P]];for(let h=0,u=z.length;h<u;h++){const C=z[h];if(g(C,P,h,O)===!0){const B=C.__offset,X=Array.isArray(C.value)?C.value:[C.value];let Y=0;for(let Z=0;Z<X.length;Z++){const W=X[Z],ne=L(W);typeof W=="number"||typeof W=="boolean"?(C.__data[0]=W,e.bufferSubData(e.UNIFORM_BUFFER,B+Y,C.__data)):W.isMatrix3?(C.__data[0]=W.elements[0],C.__data[1]=W.elements[1],C.__data[2]=W.elements[2],C.__data[3]=0,C.__data[4]=W.elements[3],C.__data[5]=W.elements[4],C.__data[6]=W.elements[5],C.__data[7]=0,C.__data[8]=W.elements[6],C.__data[9]=W.elements[7],C.__data[10]=W.elements[8],C.__data[11]=0):(W.toArray(C.__data,Y),Y+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,B,C.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function g(U,b,E,O){const P=U.value,N=b+"_"+E;if(O[N]===void 0)return typeof P=="number"||typeof P=="boolean"?O[N]=P:O[N]=P.clone(),!0;{const z=O[N];if(typeof P=="number"||typeof P=="boolean"){if(z!==P)return O[N]=P,!0}else if(z.equals(P)===!1)return z.copy(P),!0}return!1}function I(U){const b=U.uniforms;let E=0;const O=16;for(let N=0,z=b.length;N<z;N++){const h=Array.isArray(b[N])?b[N]:[b[N]];for(let u=0,C=h.length;u<C;u++){const B=h[u],X=Array.isArray(B.value)?B.value:[B.value];for(let Y=0,Z=X.length;Y<Z;Y++){const W=X[Y],ne=L(W),G=E%O,ge=G%ne.boundary,Me=G+ge;E+=ge,Me!==0&&O-Me<ne.storage&&(E+=O-Me),B.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=E,E+=ne.storage}}}const P=E%O;return P>0&&(E+=O-P),U.__size=E,U.__cache={},this}function L(U){const b={boundary:0,storage:0};return typeof U=="number"||typeof U=="boolean"?(b.boundary=4,b.storage=4):U.isVector2?(b.boundary=8,b.storage=8):U.isVector3||U.isColor?(b.boundary=16,b.storage=12):U.isVector4?(b.boundary=16,b.storage=16):U.isMatrix3?(b.boundary=48,b.storage=48):U.isMatrix4?(b.boundary=64,b.storage=64):U.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",U),b}function f(U){const b=U.target;b.removeEventListener("dispose",f);const E=d.indexOf(b.__bindingPointIndex);d.splice(E,1),e.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function a(){for(const U in s)e.deleteBuffer(s[U]);d=[],s={},r={}}return{bind:T,update:x,dispose:a}}class xd{constructor(n={}){const{canvas:t=qa(),context:i=null,depth:s=!0,stencil:r=!1,alpha:d=!1,antialias:c=!1,premultipliedAlpha:T=!0,preserveDrawingBuffer:x=!1,powerPreference:M="default",failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:v=!1}=n;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=d;const I=new Uint32Array(4),L=new Int32Array(4);let f=null,a=null;const U=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ct,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let O=!1;this._outputColorSpace=Za;let P=0,N=0,z=null,h=-1,u=null;const C=new mt,B=new mt;let X=null;const Y=new je(0);let Z=0,W=t.width,ne=t.height,G=1,ge=null,Me=null;const Ue=new mt(0,0,W,ne),He=new mt(0,0,W,ne);let nt=!1;const et=new Ea;let ze=!1,V=!1;const q=new tn,ce=new Ie,Ce=new mt,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Oe=!1;function ct(){return z===null?G:1}let m=i;function Ze(l,A){return t.getContext(l,A)}try{const l={alpha:!0,depth:s,stencil:r,antialias:c,premultipliedAlpha:T,preserveDrawingBuffer:x,powerPreference:M,failIfMajorPerformanceCaveat:_};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$a}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",$,!1),m===null){const A="webgl2";if(m=Ze(A,l),m===null)throw Ze(A)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(l){throw console.error("THREE.WebGLRenderer: "+l.message),l}let De,Re,ue,$e,pe,we,lt,it,p,o,D,H,K,F,ve,ee,he,me,Q,oe,Ae,_e,ae,Le;function S(){De=new _c(m),De.init(),_e=new Jf(m,De),Re=new cc(m,De,n,_e),ue=new jf(m,De),Re.reversedDepthBuffer&&v&&ue.buffers.depth.setReversed(!0),$e=new Ec(m),pe=new Bf,we=new Qf(m,De,ue,pe,Re,_e,$e),lt=new dc(E),it=new mc(E),p=new Ro(m),ae=new sc(m,p),o=new gc(m,p,$e,ae),D=new xc(m,o,p,$e),Q=new Sc(m,Re,we),ee=new fc(pe),H=new Ff(E,lt,it,De,Re,ae,ee),K=new rd(E,pe),F=new Gf,ve=new Yf(De),me=new oc(E,lt,it,ue,D,g,T),he=new Zf(E,D,Re),Le=new od(m,$e,Re,ue),oe=new lc(m,De,$e),Ae=new vc(m,De,$e),$e.programs=H.programs,E.capabilities=Re,E.extensions=De,E.properties=pe,E.renderLists=F,E.shadowMap=he,E.state=ue,E.info=$e}S();const J=new id(E,m);this.xr=J,this.getContext=function(){return m},this.getContextAttributes=function(){return m.getContextAttributes()},this.forceContextLoss=function(){const l=De.get("WEBGL_lose_context");l&&l.loseContext()},this.forceContextRestore=function(){const l=De.get("WEBGL_lose_context");l&&l.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(l){l!==void 0&&(G=l,this.setSize(W,ne,!1))},this.getSize=function(l){return l.set(W,ne)},this.setSize=function(l,A,w=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=l,ne=A,t.width=Math.floor(l*G),t.height=Math.floor(A*G),w===!0&&(t.style.width=l+"px",t.style.height=A+"px"),this.setViewport(0,0,l,A)},this.getDrawingBufferSize=function(l){return l.set(W*G,ne*G).floor()},this.setDrawingBufferSize=function(l,A,w){W=l,ne=A,G=w,t.width=Math.floor(l*w),t.height=Math.floor(A*w),this.setViewport(0,0,l,A)},this.getCurrentViewport=function(l){return l.copy(C)},this.getViewport=function(l){return l.copy(Ue)},this.setViewport=function(l,A,w,y){l.isVector4?Ue.set(l.x,l.y,l.z,l.w):Ue.set(l,A,w,y),ue.viewport(C.copy(Ue).multiplyScalar(G).round())},this.getScissor=function(l){return l.copy(He)},this.setScissor=function(l,A,w,y){l.isVector4?He.set(l.x,l.y,l.z,l.w):He.set(l,A,w,y),ue.scissor(B.copy(He).multiplyScalar(G).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(l){ue.setScissorTest(nt=l)},this.setOpaqueSort=function(l){ge=l},this.setTransparentSort=function(l){Me=l},this.getClearColor=function(l){return l.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor(...arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha(...arguments)},this.clear=function(l=!0,A=!0,w=!0){let y=0;if(l){let R=!1;if(z!==null){const j=z.texture.format;R=j===Ua||j===La||j===Da}if(R){const j=z.texture.type,re=j===Ot||j===rn||j===En||j===an||j===Aa||j===Ra,fe=me.getClearColor(),se=me.getClearAlpha(),Te=fe.r,be=fe.g,Se=fe.b;re?(I[0]=Te,I[1]=be,I[2]=Se,I[3]=se,m.clearBufferuiv(m.COLOR,0,I)):(L[0]=Te,L[1]=be,L[2]=Se,L[3]=se,m.clearBufferiv(m.COLOR,0,L))}else y|=m.COLOR_BUFFER_BIT}A&&(y|=m.DEPTH_BUFFER_BIT),w&&(y|=m.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),m.clear(y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",$,!1),me.dispose(),F.dispose(),ve.dispose(),pe.dispose(),lt.dispose(),it.dispose(),D.dispose(),ae.dispose(),Le.dispose(),H.dispose(),J.dispose(),J.removeEventListener("sessionstart",xt),J.removeEventListener("sessionend",ti),Pt.stop()};function te(l){l.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),O=!0}function le(){console.log("THREE.WebGLRenderer: Context Restored."),O=!1;const l=$e.autoReset,A=he.enabled,w=he.autoUpdate,y=he.needsUpdate,R=he.type;S(),$e.autoReset=l,he.enabled=A,he.autoUpdate=w,he.needsUpdate=y,he.type=R}function $(l){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",l.statusMessage)}function k(l){const A=l.target;A.removeEventListener("dispose",k),de(A)}function de(l){Pe(l),pe.remove(l)}function Pe(l){const A=pe.get(l).programs;A!==void 0&&(A.forEach(function(w){H.releaseProgram(w)}),l.isShaderMaterial&&H.releaseShaderCache(l))}this.renderBufferDirect=function(l,A,w,y,R,j){A===null&&(A=Ee);const re=R.isMesh&&R.matrixWorld.determinant()<0,fe=ka(l,A,w,y,R);ue.setMaterial(y,re);let se=w.index,Te=1;if(y.wireframe===!0){if(se=o.getWireframeAttribute(w),se===void 0)return;Te=2}const be=w.drawRange,Se=w.attributes.position;let Ne=be.start*Te,Ve=(be.start+be.count)*Te;j!==null&&(Ne=Math.max(Ne,j.start*Te),Ve=Math.min(Ve,(j.start+j.count)*Te)),se!==null?(Ne=Math.max(Ne,0),Ve=Math.min(Ve,se.count)):Se!=null&&(Ne=Math.max(Ne,0),Ve=Math.min(Ve,Se.count));const tt=Ve-Ne;if(tt<0||tt===1/0)return;ae.setup(R,y,fe,w,se);let Ye,We=oe;if(se!==null&&(Ye=p.get(se),We=Ae,We.setIndex(Ye)),R.isMesh)y.wireframe===!0?(ue.setLineWidth(y.wireframeLinewidth*ct()),We.setMode(m.LINES)):We.setMode(m.TRIANGLES);else if(R.isLine){let xe=y.linewidth;xe===void 0&&(xe=1),ue.setLineWidth(xe*ct()),R.isLineSegments?We.setMode(m.LINES):R.isLineLoop?We.setMode(m.LINE_LOOP):We.setMode(m.LINE_STRIP)}else R.isPoints?We.setMode(m.POINTS):R.isSprite&&We.setMode(m.TRIANGLES);if(R.isBatchedMesh)if(R._multiDrawInstances!==null)Hn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),We.renderMultiDrawInstances(R._multiDrawStarts,R._multiDrawCounts,R._multiDrawCount,R._multiDrawInstances);else if(De.get("WEBGL_multi_draw"))We.renderMultiDraw(R._multiDrawStarts,R._multiDrawCounts,R._multiDrawCount);else{const xe=R._multiDrawStarts,Qe=R._multiDrawCounts,Fe=R._multiDrawCount,_t=se?p.get(se).bytesPerElement:1,Bt=pe.get(y).currentProgram.getUniforms();for(let gt=0;gt<Fe;gt++)Bt.setValue(m,"_gl_DrawID",gt),We.render(xe[gt]/_t,Qe[gt])}else if(R.isInstancedMesh)We.renderInstances(Ne,tt,R.count);else if(w.isInstancedBufferGeometry){const xe=w._maxInstanceCount!==void 0?w._maxInstanceCount:1/0,Qe=Math.min(w.instanceCount,xe);We.renderInstances(Ne,tt,Qe)}else We.render(Ne,tt)};function Xe(l,A,w){l.transparent===!0&&l.side===Rt&&l.forceSinglePass===!1?(l.side=vt,l.needsUpdate=!0,ln(l,A,w),l.side=nn,l.needsUpdate=!0,ln(l,A,w),l.side=Rt):ln(l,A,w)}this.compile=function(l,A,w=null){w===null&&(w=l),a=ve.get(w),a.init(A),b.push(a),w.traverseVisible(function(R){R.isLight&&R.layers.test(A.layers)&&(a.pushLight(R),R.castShadow&&a.pushShadow(R))}),l!==w&&l.traverseVisible(function(R){R.isLight&&R.layers.test(A.layers)&&(a.pushLight(R),R.castShadow&&a.pushShadow(R))}),a.setupLights();const y=new Set;return l.traverse(function(R){if(!(R.isMesh||R.isPoints||R.isLine||R.isSprite))return;const j=R.material;if(j)if(Array.isArray(j))for(let re=0;re<j.length;re++){const fe=j[re];Xe(fe,w,R),y.add(fe)}else Xe(j,w,R),y.add(j)}),a=b.pop(),y},this.compileAsync=function(l,A,w=null){const y=this.compile(l,A,w);return new Promise(R=>{function j(){if(y.forEach(function(re){pe.get(re).currentProgram.isReady()&&y.delete(re)}),y.size===0){R(l);return}setTimeout(j,10)}De.get("KHR_parallel_shader_compile")!==null?j():setTimeout(j,10)})};let Ge=null;function Tt(l){Ge&&Ge(l)}function xt(){Pt.stop()}function ti(){Pt.start()}const Pt=new Oa;Pt.setAnimationLoop(Tt),typeof self<"u"&&Pt.setContext(self),this.setAnimationLoop=function(l){Ge=l,J.setAnimationLoop(l),l===null?Pt.stop():Pt.start()},J.addEventListener("sessionstart",xt),J.addEventListener("sessionend",ti),this.render=function(l,A){if(A!==void 0&&A.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;if(l.matrixWorldAutoUpdate===!0&&l.updateMatrixWorld(),A.parent===null&&A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(A),A=J.getCamera()),l.isScene===!0&&l.onBeforeRender(E,l,A,z),a=ve.get(l,b.length),a.init(A),b.push(a),q.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),et.setFromProjectionMatrix(q,si,A.reversedDepth),V=this.localClippingEnabled,ze=ee.init(this.clippingPlanes,V),f=F.get(l,U.length),f.init(),U.push(f),J.enabled===!0&&J.isPresenting===!0){const j=E.xr.getDepthSensingMesh();j!==null&&An(j,A,-1/0,E.sortObjects)}An(l,A,0,E.sortObjects),f.finish(),E.sortObjects===!0&&f.sort(ge,Me),Oe=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,Oe&&me.addToRenderList(f,l),this.info.render.frame++,ze===!0&&ee.beginShadows();const w=a.state.shadowsArray;he.render(w,l,A),ze===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset();const y=f.opaque,R=f.transmissive;if(a.setupLights(),A.isArrayCamera){const j=A.cameras;if(R.length>0)for(let re=0,fe=j.length;re<fe;re++){const se=j[re];ii(y,R,l,se)}Oe&&me.render(l);for(let re=0,fe=j.length;re<fe;re++){const se=j[re];ni(f,l,se,se.viewport)}}else R.length>0&&ii(y,R,l,A),Oe&&me.render(l),ni(f,l,A);z!==null&&N===0&&(we.updateMultisampleRenderTarget(z),we.updateRenderTargetMipmap(z)),l.isScene===!0&&l.onAfterRender(E,l,A),ae.resetDefaultState(),h=-1,u=null,b.pop(),b.length>0?(a=b[b.length-1],ze===!0&&ee.setGlobalState(E.clippingPlanes,a.state.camera)):a=null,U.pop(),U.length>0?f=U[U.length-1]:f=null};function An(l,A,w,y){if(l.visible===!1)return;if(l.layers.test(A.layers)){if(l.isGroup)w=l.renderOrder;else if(l.isLOD)l.autoUpdate===!0&&l.update(A);else if(l.isLight)a.pushLight(l),l.castShadow&&a.pushShadow(l);else if(l.isSprite){if(!l.frustumCulled||et.intersectsSprite(l)){y&&Ce.setFromMatrixPosition(l.matrixWorld).applyMatrix4(q);const re=D.update(l),fe=l.material;fe.visible&&f.push(l,re,fe,w,Ce.z,null)}}else if((l.isMesh||l.isLine||l.isPoints)&&(!l.frustumCulled||et.intersectsObject(l))){const re=D.update(l),fe=l.material;if(y&&(l.boundingSphere!==void 0?(l.boundingSphere===null&&l.computeBoundingSphere(),Ce.copy(l.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),Ce.copy(re.boundingSphere.center)),Ce.applyMatrix4(l.matrixWorld).applyMatrix4(q)),Array.isArray(fe)){const se=re.groups;for(let Te=0,be=se.length;Te<be;Te++){const Se=se[Te],Ne=fe[Se.materialIndex];Ne&&Ne.visible&&f.push(l,re,Ne,w,Ce.z,Se)}}else fe.visible&&f.push(l,re,fe,w,Ce.z,null)}}const j=l.children;for(let re=0,fe=j.length;re<fe;re++)An(j[re],A,w,y)}function ni(l,A,w,y){const R=l.opaque,j=l.transmissive,re=l.transparent;a.setupLightsView(w),ze===!0&&ee.setGlobalState(E.clippingPlanes,w),y&&ue.viewport(C.copy(y)),R.length>0&&sn(R,A,w),j.length>0&&sn(j,A,w),re.length>0&&sn(re,A,w),ue.buffers.depth.setTest(!0),ue.buffers.depth.setMask(!0),ue.buffers.color.setMask(!0),ue.setPolygonOffset(!1)}function ii(l,A,w,y){if((w.isScene===!0?w.overrideMaterial:null)!==null)return;a.state.transmissionRenderTarget[y.id]===void 0&&(a.state.transmissionRenderTarget[y.id]=new Yt(1,1,{generateMipmaps:!0,type:De.has("EXT_color_buffer_half_float")||De.has("EXT_color_buffer_float")?Sn:Ot,minFilter:jt,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:at.workingColorSpace}));const j=a.state.transmissionRenderTarget[y.id],re=y.viewport||C;j.setSize(re.z*E.transmissionResolutionScale,re.w*E.transmissionResolutionScale);const fe=E.getRenderTarget(),se=E.getActiveCubeFace(),Te=E.getActiveMipmapLevel();E.setRenderTarget(j),E.getClearColor(Y),Z=E.getClearAlpha(),Z<1&&E.setClearColor(16777215,.5),E.clear(),Oe&&me.render(w);const be=E.toneMapping;E.toneMapping=Ct;const Se=y.viewport;if(y.viewport!==void 0&&(y.viewport=void 0),a.setupLightsView(y),ze===!0&&ee.setGlobalState(E.clippingPlanes,y),sn(l,w,y),we.updateMultisampleRenderTarget(j),we.updateRenderTargetMipmap(j),De.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let Ve=0,tt=A.length;Ve<tt;Ve++){const Ye=A[Ve],We=Ye.object,xe=Ye.geometry,Qe=Ye.material,Fe=Ye.group;if(Qe.side===Rt&&We.layers.test(y.layers)){const _t=Qe.side;Qe.side=vt,Qe.needsUpdate=!0,ai(We,w,y,xe,Qe,Fe),Qe.side=_t,Qe.needsUpdate=!0,Ne=!0}}Ne===!0&&(we.updateMultisampleRenderTarget(j),we.updateRenderTargetMipmap(j))}E.setRenderTarget(fe,se,Te),E.setClearColor(Y,Z),Se!==void 0&&(y.viewport=Se),E.toneMapping=be}function sn(l,A,w){const y=A.isScene===!0?A.overrideMaterial:null;for(let R=0,j=l.length;R<j;R++){const re=l[R],fe=re.object,se=re.geometry,Te=re.group;let be=re.material;be.allowOverride===!0&&y!==null&&(be=y),fe.layers.test(w.layers)&&ai(fe,A,w,se,be,Te)}}function ai(l,A,w,y,R,j){l.onBeforeRender(E,A,w,y,R,j),l.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,l.matrixWorld),l.normalMatrix.getNormalMatrix(l.modelViewMatrix),R.onBeforeRender(E,A,w,y,l,j),R.transparent===!0&&R.side===Rt&&R.forceSinglePass===!1?(R.side=vt,R.needsUpdate=!0,E.renderBufferDirect(w,A,y,R,l,j),R.side=nn,R.needsUpdate=!0,E.renderBufferDirect(w,A,y,R,l,j),R.side=Rt):E.renderBufferDirect(w,A,y,R,l,j),l.onAfterRender(E,A,w,y,R,j)}function ln(l,A,w){A.isScene!==!0&&(A=Ee);const y=pe.get(l),R=a.state.lights,j=a.state.shadowsArray,re=R.state.version,fe=H.getParameters(l,R.state,j,A,w),se=H.getProgramCacheKey(fe);let Te=y.programs;y.environment=l.isMeshStandardMaterial?A.environment:null,y.fog=A.fog,y.envMap=(l.isMeshStandardMaterial?it:lt).get(l.envMap||y.environment),y.envMapRotation=y.environment!==null&&l.envMap===null?A.environmentRotation:l.envMapRotation,Te===void 0&&(l.addEventListener("dispose",k),Te=new Map,y.programs=Te);let be=Te.get(se);if(be!==void 0){if(y.currentProgram===be&&y.lightsStateVersion===re)return oi(l,fe),be}else fe.uniforms=H.getUniforms(l),l.onBeforeCompile(fe,E),be=H.acquireProgram(fe,se),Te.set(se,be),y.uniforms=fe.uniforms;const Se=y.uniforms;return(!l.isShaderMaterial&&!l.isRawShaderMaterial||l.clipping===!0)&&(Se.clippingPlanes=ee.uniform),oi(l,fe),y.needsLights=Wa(l),y.lightsStateVersion=re,y.needsLights&&(Se.ambientLightColor.value=R.state.ambient,Se.lightProbe.value=R.state.probe,Se.directionalLights.value=R.state.directional,Se.directionalLightShadows.value=R.state.directionalShadow,Se.spotLights.value=R.state.spot,Se.spotLightShadows.value=R.state.spotShadow,Se.rectAreaLights.value=R.state.rectArea,Se.ltc_1.value=R.state.rectAreaLTC1,Se.ltc_2.value=R.state.rectAreaLTC2,Se.pointLights.value=R.state.point,Se.pointLightShadows.value=R.state.pointShadow,Se.hemisphereLights.value=R.state.hemi,Se.directionalShadowMap.value=R.state.directionalShadowMap,Se.directionalShadowMatrix.value=R.state.directionalShadowMatrix,Se.spotShadowMap.value=R.state.spotShadowMap,Se.spotLightMatrix.value=R.state.spotLightMatrix,Se.spotLightMap.value=R.state.spotLightMap,Se.pointShadowMap.value=R.state.pointShadowMap,Se.pointShadowMatrix.value=R.state.pointShadowMatrix),y.currentProgram=be,y.uniformsList=null,be}function ri(l){if(l.uniformsList===null){const A=l.currentProgram.getUniforms();l.uniformsList=_n.seqWithValue(A.seq,l.uniforms)}return l.uniformsList}function oi(l,A){const w=pe.get(l);w.outputColorSpace=A.outputColorSpace,w.batching=A.batching,w.batchingColor=A.batchingColor,w.instancing=A.instancing,w.instancingColor=A.instancingColor,w.instancingMorph=A.instancingMorph,w.skinning=A.skinning,w.morphTargets=A.morphTargets,w.morphNormals=A.morphNormals,w.morphColors=A.morphColors,w.morphTargetsCount=A.morphTargetsCount,w.numClippingPlanes=A.numClippingPlanes,w.numIntersection=A.numClipIntersection,w.vertexAlphas=A.vertexAlphas,w.vertexTangents=A.vertexTangents,w.toneMapping=A.toneMapping}function ka(l,A,w,y,R){A.isScene!==!0&&(A=Ee),we.resetTextureUnits();const j=A.fog,re=y.isMeshStandardMaterial?A.environment:null,fe=z===null?E.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:xn,se=(y.isMeshStandardMaterial?it:lt).get(y.envMap||re),Te=y.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,be=!!w.attributes.tangent&&(!!y.normalMap||y.anisotropy>0),Se=!!w.morphAttributes.position,Ne=!!w.morphAttributes.normal,Ve=!!w.morphAttributes.color;let tt=Ct;y.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(tt=E.toneMapping);const Ye=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,We=Ye!==void 0?Ye.length:0,xe=pe.get(y),Qe=a.state.lights;if(ze===!0&&(V===!0||l!==u)){const ft=l===u&&y.id===h;ee.setState(y,l,ft)}let Fe=!1;y.version===xe.__version?(xe.needsLights&&xe.lightsStateVersion!==Qe.state.version||xe.outputColorSpace!==fe||R.isBatchedMesh&&xe.batching===!1||!R.isBatchedMesh&&xe.batching===!0||R.isBatchedMesh&&xe.batchingColor===!0&&R.colorTexture===null||R.isBatchedMesh&&xe.batchingColor===!1&&R.colorTexture!==null||R.isInstancedMesh&&xe.instancing===!1||!R.isInstancedMesh&&xe.instancing===!0||R.isSkinnedMesh&&xe.skinning===!1||!R.isSkinnedMesh&&xe.skinning===!0||R.isInstancedMesh&&xe.instancingColor===!0&&R.instanceColor===null||R.isInstancedMesh&&xe.instancingColor===!1&&R.instanceColor!==null||R.isInstancedMesh&&xe.instancingMorph===!0&&R.morphTexture===null||R.isInstancedMesh&&xe.instancingMorph===!1&&R.morphTexture!==null||xe.envMap!==se||y.fog===!0&&xe.fog!==j||xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==ee.numPlanes||xe.numIntersection!==ee.numIntersection)||xe.vertexAlphas!==Te||xe.vertexTangents!==be||xe.morphTargets!==Se||xe.morphNormals!==Ne||xe.morphColors!==Ve||xe.toneMapping!==tt||xe.morphTargetsCount!==We)&&(Fe=!0):(Fe=!0,xe.__version=y.version);let _t=xe.currentProgram;Fe===!0&&(_t=ln(y,A,R));let Bt=!1,gt=!1,Zt=!1;const Je=_t.getUniforms(),Et=xe.uniforms;if(ue.useProgram(_t.program)&&(Bt=!0,gt=!0,Zt=!0),y.id!==h&&(h=y.id,gt=!0),Bt||u!==l){ue.buffers.depth.getReversed()&&l.reversedDepth!==!0&&(l._reversedDepth=!0,l.updateProjectionMatrix()),Je.setValue(m,"projectionMatrix",l.projectionMatrix),Je.setValue(m,"viewMatrix",l.matrixWorldInverse);const ut=Je.map.cameraPosition;ut!==void 0&&ut.setValue(m,ce.setFromMatrixPosition(l.matrixWorld)),Re.logarithmicDepthBuffer&&Je.setValue(m,"logDepthBufFC",2/(Math.log(l.far+1)/Math.LN2)),(y.isMeshPhongMaterial||y.isMeshToonMaterial||y.isMeshLambertMaterial||y.isMeshBasicMaterial||y.isMeshStandardMaterial||y.isShaderMaterial)&&Je.setValue(m,"isOrthographic",l.isOrthographicCamera===!0),u!==l&&(u=l,gt=!0,Zt=!0)}if(R.isSkinnedMesh){Je.setOptional(m,R,"bindMatrix"),Je.setOptional(m,R,"bindMatrixInverse");const ft=R.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),Je.setValue(m,"boneTexture",ft.boneTexture,we))}R.isBatchedMesh&&(Je.setOptional(m,R,"batchingTexture"),Je.setValue(m,"batchingTexture",R._matricesTexture,we),Je.setOptional(m,R,"batchingIdTexture"),Je.setValue(m,"batchingIdTexture",R._indirectTexture,we),Je.setOptional(m,R,"batchingColorTexture"),R._colorsTexture!==null&&Je.setValue(m,"batchingColorTexture",R._colorsTexture,we));const St=w.morphAttributes;if((St.position!==void 0||St.normal!==void 0||St.color!==void 0)&&Q.update(R,w,_t),(gt||xe.receiveShadow!==R.receiveShadow)&&(xe.receiveShadow=R.receiveShadow,Je.setValue(m,"receiveShadow",R.receiveShadow)),y.isMeshGouraudMaterial&&y.envMap!==null&&(Et.envMap.value=se,Et.flipEnvMap.value=se.isCubeTexture&&se.isRenderTargetTexture===!1?-1:1),y.isMeshStandardMaterial&&y.envMap===null&&A.environment!==null&&(Et.envMapIntensity.value=A.environmentIntensity),gt&&(Je.setValue(m,"toneMappingExposure",E.toneMappingExposure),xe.needsLights&&za(Et,Zt),j&&y.fog===!0&&K.refreshFogUniforms(Et,j),K.refreshMaterialUniforms(Et,y,G,ne,a.state.transmissionRenderTarget[l.id]),_n.upload(m,ri(xe),Et,we)),y.isShaderMaterial&&y.uniformsNeedUpdate===!0&&(_n.upload(m,ri(xe),Et,we),y.uniformsNeedUpdate=!1),y.isSpriteMaterial&&Je.setValue(m,"center",R.center),Je.setValue(m,"modelViewMatrix",R.modelViewMatrix),Je.setValue(m,"normalMatrix",R.normalMatrix),Je.setValue(m,"modelMatrix",R.matrixWorld),y.isShaderMaterial||y.isRawShaderMaterial){const ft=y.uniformsGroups;for(let ut=0,Rn=ft.length;ut<Rn;ut++){const Dt=ft[ut];Le.update(Dt,_t),Le.bind(Dt,_t)}}return _t}function za(l,A){l.ambientLightColor.needsUpdate=A,l.lightProbe.needsUpdate=A,l.directionalLights.needsUpdate=A,l.directionalLightShadows.needsUpdate=A,l.pointLights.needsUpdate=A,l.pointLightShadows.needsUpdate=A,l.spotLights.needsUpdate=A,l.spotLightShadows.needsUpdate=A,l.rectAreaLights.needsUpdate=A,l.hemisphereLights.needsUpdate=A}function Wa(l){return l.isMeshLambertMaterial||l.isMeshToonMaterial||l.isMeshPhongMaterial||l.isMeshStandardMaterial||l.isShadowMaterial||l.isShaderMaterial&&l.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(l,A,w){const y=pe.get(l);y.__autoAllocateDepthBuffer=l.resolveDepthBuffer===!1,y.__autoAllocateDepthBuffer===!1&&(y.__useRenderToTexture=!1),pe.get(l.texture).__webglTexture=A,pe.get(l.depthTexture).__webglTexture=y.__autoAllocateDepthBuffer?void 0:w,y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(l,A){const w=pe.get(l);w.__webglFramebuffer=A,w.__useDefaultFramebuffer=A===void 0};const Xa=m.createFramebuffer();this.setRenderTarget=function(l,A=0,w=0){z=l,P=A,N=w;let y=!0,R=null,j=!1,re=!1;if(l){const se=pe.get(l);if(se.__useDefaultFramebuffer!==void 0)ue.bindFramebuffer(m.FRAMEBUFFER,null),y=!1;else if(se.__webglFramebuffer===void 0)we.setupRenderTarget(l);else if(se.__hasExternalTextures)we.rebindTextures(l,pe.get(l.texture).__webglTexture,pe.get(l.depthTexture).__webglTexture);else if(l.depthBuffer){const Se=l.depthTexture;if(se.__boundDepthTexture!==Se){if(Se!==null&&pe.has(Se)&&(l.width!==Se.image.width||l.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");we.setupDepthRenderbuffer(l)}}const Te=l.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(re=!0);const be=pe.get(l).__webglFramebuffer;l.isWebGLCubeRenderTarget?(Array.isArray(be[A])?R=be[A][w]:R=be[A],j=!0):l.samples>0&&we.useMultisampledRTT(l)===!1?R=pe.get(l).__webglMultisampledFramebuffer:Array.isArray(be)?R=be[w]:R=be,C.copy(l.viewport),B.copy(l.scissor),X=l.scissorTest}else C.copy(Ue).multiplyScalar(G).floor(),B.copy(He).multiplyScalar(G).floor(),X=nt;if(w!==0&&(R=Xa),ue.bindFramebuffer(m.FRAMEBUFFER,R)&&y&&ue.drawBuffers(l,R),ue.viewport(C),ue.scissor(B),ue.setScissorTest(X),j){const se=pe.get(l.texture);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_CUBE_MAP_POSITIVE_X+A,se.__webglTexture,w)}else if(re){const se=A;for(let Te=0;Te<l.textures.length;Te++){const be=pe.get(l.textures[Te]);m.framebufferTextureLayer(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0+Te,be.__webglTexture,w,se)}}else if(l!==null&&w!==0){const se=pe.get(l.texture);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,se.__webglTexture,w)}h=-1},this.readRenderTargetPixels=function(l,A,w,y,R,j,re,fe=0){if(!(l&&l.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let se=pe.get(l).__webglFramebuffer;if(l.isWebGLCubeRenderTarget&&re!==void 0&&(se=se[re]),se){ue.bindFramebuffer(m.FRAMEBUFFER,se);try{const Te=l.textures[fe],be=Te.format,Se=Te.type;if(!Re.textureFormatReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}A>=0&&A<=l.width-y&&w>=0&&w<=l.height-R&&(l.textures.length>1&&m.readBuffer(m.COLOR_ATTACHMENT0+fe),m.readPixels(A,w,y,R,_e.convert(be),_e.convert(Se),j))}finally{const Te=z!==null?pe.get(z).__webglFramebuffer:null;ue.bindFramebuffer(m.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(l,A,w,y,R,j,re,fe=0){if(!(l&&l.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let se=pe.get(l).__webglFramebuffer;if(l.isWebGLCubeRenderTarget&&re!==void 0&&(se=se[re]),se)if(A>=0&&A<=l.width-y&&w>=0&&w<=l.height-R){ue.bindFramebuffer(m.FRAMEBUFFER,se);const Te=l.textures[fe],be=Te.format,Se=Te.type;if(!Re.textureFormatReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=m.createBuffer();m.bindBuffer(m.PIXEL_PACK_BUFFER,Ne),m.bufferData(m.PIXEL_PACK_BUFFER,j.byteLength,m.STREAM_READ),l.textures.length>1&&m.readBuffer(m.COLOR_ATTACHMENT0+fe),m.readPixels(A,w,y,R,_e.convert(be),_e.convert(Se),0);const Ve=z!==null?pe.get(z).__webglFramebuffer:null;ue.bindFramebuffer(m.FRAMEBUFFER,Ve);const tt=m.fenceSync(m.SYNC_GPU_COMMANDS_COMPLETE,0);return m.flush(),await ja(m,tt,4),m.bindBuffer(m.PIXEL_PACK_BUFFER,Ne),m.getBufferSubData(m.PIXEL_PACK_BUFFER,0,j),m.deleteBuffer(Ne),m.deleteSync(tt),j}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(l,A=null,w=0){const y=Math.pow(2,-w),R=Math.floor(l.image.width*y),j=Math.floor(l.image.height*y),re=A!==null?A.x:0,fe=A!==null?A.y:0;we.setTexture2D(l,0),m.copyTexSubImage2D(m.TEXTURE_2D,w,0,0,re,fe,R,j),ue.unbindTexture()};const Ya=m.createFramebuffer(),Ka=m.createFramebuffer();this.copyTextureToTexture=function(l,A,w=null,y=null,R=0,j=null){j===null&&(R!==0?(Hn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),j=R,R=0):j=0);let re,fe,se,Te,be,Se,Ne,Ve,tt;const Ye=l.isCompressedTexture?l.mipmaps[j]:l.image;if(w!==null)re=w.max.x-w.min.x,fe=w.max.y-w.min.y,se=w.isBox3?w.max.z-w.min.z:1,Te=w.min.x,be=w.min.y,Se=w.isBox3?w.min.z:0;else{const St=Math.pow(2,-R);re=Math.floor(Ye.width*St),fe=Math.floor(Ye.height*St),l.isDataArrayTexture?se=Ye.depth:l.isData3DTexture?se=Math.floor(Ye.depth*St):se=1,Te=0,be=0,Se=0}y!==null?(Ne=y.x,Ve=y.y,tt=y.z):(Ne=0,Ve=0,tt=0);const We=_e.convert(A.format),xe=_e.convert(A.type);let Qe;A.isData3DTexture?(we.setTexture3D(A,0),Qe=m.TEXTURE_3D):A.isDataArrayTexture||A.isCompressedArrayTexture?(we.setTexture2DArray(A,0),Qe=m.TEXTURE_2D_ARRAY):(we.setTexture2D(A,0),Qe=m.TEXTURE_2D),m.pixelStorei(m.UNPACK_FLIP_Y_WEBGL,A.flipY),m.pixelStorei(m.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),m.pixelStorei(m.UNPACK_ALIGNMENT,A.unpackAlignment);const Fe=m.getParameter(m.UNPACK_ROW_LENGTH),_t=m.getParameter(m.UNPACK_IMAGE_HEIGHT),Bt=m.getParameter(m.UNPACK_SKIP_PIXELS),gt=m.getParameter(m.UNPACK_SKIP_ROWS),Zt=m.getParameter(m.UNPACK_SKIP_IMAGES);m.pixelStorei(m.UNPACK_ROW_LENGTH,Ye.width),m.pixelStorei(m.UNPACK_IMAGE_HEIGHT,Ye.height),m.pixelStorei(m.UNPACK_SKIP_PIXELS,Te),m.pixelStorei(m.UNPACK_SKIP_ROWS,be),m.pixelStorei(m.UNPACK_SKIP_IMAGES,Se);const Je=l.isDataArrayTexture||l.isData3DTexture,Et=A.isDataArrayTexture||A.isData3DTexture;if(l.isDepthTexture){const St=pe.get(l),ft=pe.get(A),ut=pe.get(St.__renderTarget),Rn=pe.get(ft.__renderTarget);ue.bindFramebuffer(m.READ_FRAMEBUFFER,ut.__webglFramebuffer),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,Rn.__webglFramebuffer);for(let Dt=0;Dt<se;Dt++)Je&&(m.framebufferTextureLayer(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,pe.get(l).__webglTexture,R,Se+Dt),m.framebufferTextureLayer(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,pe.get(A).__webglTexture,j,tt+Dt)),m.blitFramebuffer(Te,be,re,fe,Ne,Ve,re,fe,m.DEPTH_BUFFER_BIT,m.NEAREST);ue.bindFramebuffer(m.READ_FRAMEBUFFER,null),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,null)}else if(R!==0||l.isRenderTargetTexture||pe.has(l)){const St=pe.get(l),ft=pe.get(A);ue.bindFramebuffer(m.READ_FRAMEBUFFER,Ya),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,Ka);for(let ut=0;ut<se;ut++)Je?m.framebufferTextureLayer(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,St.__webglTexture,R,Se+ut):m.framebufferTexture2D(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,St.__webglTexture,R),Et?m.framebufferTextureLayer(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,ft.__webglTexture,j,tt+ut):m.framebufferTexture2D(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,ft.__webglTexture,j),R!==0?m.blitFramebuffer(Te,be,re,fe,Ne,Ve,re,fe,m.COLOR_BUFFER_BIT,m.NEAREST):Et?m.copyTexSubImage3D(Qe,j,Ne,Ve,tt+ut,Te,be,re,fe):m.copyTexSubImage2D(Qe,j,Ne,Ve,Te,be,re,fe);ue.bindFramebuffer(m.READ_FRAMEBUFFER,null),ue.bindFramebuffer(m.DRAW_FRAMEBUFFER,null)}else Et?l.isDataTexture||l.isData3DTexture?m.texSubImage3D(Qe,j,Ne,Ve,tt,re,fe,se,We,xe,Ye.data):A.isCompressedArrayTexture?m.compressedTexSubImage3D(Qe,j,Ne,Ve,tt,re,fe,se,We,Ye.data):m.texSubImage3D(Qe,j,Ne,Ve,tt,re,fe,se,We,xe,Ye):l.isDataTexture?m.texSubImage2D(m.TEXTURE_2D,j,Ne,Ve,re,fe,We,xe,Ye.data):l.isCompressedTexture?m.compressedTexSubImage2D(m.TEXTURE_2D,j,Ne,Ve,Ye.width,Ye.height,We,Ye.data):m.texSubImage2D(m.TEXTURE_2D,j,Ne,Ve,re,fe,We,xe,Ye);m.pixelStorei(m.UNPACK_ROW_LENGTH,Fe),m.pixelStorei(m.UNPACK_IMAGE_HEIGHT,_t),m.pixelStorei(m.UNPACK_SKIP_PIXELS,Bt),m.pixelStorei(m.UNPACK_SKIP_ROWS,gt),m.pixelStorei(m.UNPACK_SKIP_IMAGES,Zt),j===0&&A.generateMipmaps&&m.generateMipmap(Qe),ue.unbindTexture()},this.initRenderTarget=function(l){pe.get(l).__webglFramebuffer===void 0&&we.setupRenderTarget(l)},this.initTexture=function(l){l.isCubeTexture?we.setTextureCube(l,0):l.isData3DTexture?we.setTexture3D(l,0):l.isDataArrayTexture||l.isCompressedArrayTexture?we.setTexture2DArray(l,0):we.setTexture2D(l,0),ue.unbindTexture()},this.resetState=function(){P=0,N=0,z=null,ue.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=at._getDrawingBufferColorSpace(n),t.unpackColorSpace=at._getUnpackColorSpace()}}const _a={type:"change"},ei={type:"start"},Va={type:"end"},pn=new vo,ga=new Ma,sd=Math.cos(70*Eo.DEG2RAD),rt=new Ie,pt=2*Math.PI,ke={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Bn=1e-6;class Md extends go{constructor(n,t=null){super(n,t),this.state=ke.NONE,this.target=new Ie,this.cursor=new Ie,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Xt.ROTATE,MIDDLE:Xt.DOLLY,RIGHT:Xt.PAN},this.touches={ONE:zt.ROTATE,TWO:zt.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new Ie,this._lastQuaternion=new zi,this._lastTargetPosition=new Ie,this._quat=new zi().setFromUnitVectors(n.up,new Ie(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Wi,this._sphericalDelta=new Wi,this._scale=1,this._panOffset=new Ie,this._rotateStart=new qe,this._rotateEnd=new qe,this._rotateDelta=new qe,this._panStart=new qe,this._panEnd=new qe,this._panDelta=new qe,this._dollyStart=new qe,this._dollyEnd=new qe,this._dollyDelta=new qe,this._dollyDirection=new Ie,this._mouse=new qe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=cd.bind(this),this._onPointerDown=ld.bind(this),this._onPointerUp=fd.bind(this),this._onContextMenu=gd.bind(this),this._onMouseWheel=pd.bind(this),this._onKeyDown=hd.bind(this),this._onTouchStart=md.bind(this),this._onTouchMove=_d.bind(this),this._onMouseDown=dd.bind(this),this._onMouseMove=ud.bind(this),this._interceptControlDown=vd.bind(this),this._interceptControlUp=Ed.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(n){super.connect(n),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(n){n.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=n}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_a),this.update(),this.state=ke.NONE}update(n=null){const t=this.object.position;rt.copy(t).sub(this.target),rt.applyQuaternion(this._quat),this._spherical.setFromVector3(rt),this.autoRotate&&this.state===ke.NONE&&this._rotateLeft(this._getAutoRotationAngle(n)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=pt:i>Math.PI&&(i-=pt),s<-Math.PI?s+=pt:s>Math.PI&&(s-=pt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const d=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=d!=this._spherical.radius}if(rt.setFromSpherical(this._spherical),rt.applyQuaternion(this._quatInverse),t.copy(this.target).add(rt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let d=null;if(this.object.isPerspectiveCamera){const c=rt.length();d=this._clampDistance(c*this._scale);const T=c-d;this.object.position.addScaledVector(this._dollyDirection,T),this.object.updateMatrixWorld(),r=!!T}else if(this.object.isOrthographicCamera){const c=new Ie(this._mouse.x,this._mouse.y,0);c.unproject(this.object);const T=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=T!==this.object.zoom;const x=new Ie(this._mouse.x,this._mouse.y,0);x.unproject(this.object),this.object.position.sub(x).add(c),this.object.updateMatrixWorld(),d=rt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;d!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(d).add(this.object.position):(pn.origin.copy(this.object.position),pn.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(pn.direction))<sd?this.object.lookAt(this.target):(ga.setFromNormalAndCoplanarPoint(this.object.up,this.target),pn.intersectPlane(ga,this.target))))}else if(this.object.isOrthographicCamera){const d=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),d!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Bn||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Bn||this._lastTargetPosition.distanceToSquared(this.target)>Bn?(this.dispatchEvent(_a),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(n){return n!==null?pt/60*this.autoRotateSpeed*n:pt/60/60*this.autoRotateSpeed}_getZoomScale(n){const t=Math.abs(n*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(n){this._sphericalDelta.theta-=n}_rotateUp(n){this._sphericalDelta.phi-=n}_panLeft(n,t){rt.setFromMatrixColumn(t,0),rt.multiplyScalar(-n),this._panOffset.add(rt)}_panUp(n,t){this.screenSpacePanning===!0?rt.setFromMatrixColumn(t,1):(rt.setFromMatrixColumn(t,0),rt.crossVectors(this.object.up,rt)),rt.multiplyScalar(n),this._panOffset.add(rt)}_pan(n,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;rt.copy(s).sub(this.target);let r=rt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*n*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(n*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(n){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=n:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(n){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=n:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(n,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=n-i.left,r=t-i.top,d=i.width,c=i.height;this._mouse.x=s/d*2-1,this._mouse.y=-(r/c)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(n){return Math.max(this.minDistance,Math.min(this.maxDistance,n))}_handleMouseDownRotate(n){this._rotateStart.set(n.clientX,n.clientY)}_handleMouseDownDolly(n){this._updateZoomParameters(n.clientX,n.clientX),this._dollyStart.set(n.clientX,n.clientY)}_handleMouseDownPan(n){this._panStart.set(n.clientX,n.clientY)}_handleMouseMoveRotate(n){this._rotateEnd.set(n.clientX,n.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(pt*this._rotateDelta.x/t.clientHeight),this._rotateUp(pt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(n){this._dollyEnd.set(n.clientX,n.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(n){this._panEnd.set(n.clientX,n.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(n){this._updateZoomParameters(n.clientX,n.clientY),n.deltaY<0?this._dollyIn(this._getZoomScale(n.deltaY)):n.deltaY>0&&this._dollyOut(this._getZoomScale(n.deltaY)),this.update()}_handleKeyDown(n){let t=!1;switch(n.code){case this.keys.UP:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateUp(pt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateUp(-pt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateLeft(pt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:n.ctrlKey||n.metaKey||n.shiftKey?this.enableRotate&&this._rotateLeft(-pt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(n.preventDefault(),this.update())}_handleTouchStartRotate(n){if(this._pointers.length===1)this._rotateStart.set(n.pageX,n.pageY);else{const t=this._getSecondPointerPosition(n),i=.5*(n.pageX+t.x),s=.5*(n.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(n){if(this._pointers.length===1)this._panStart.set(n.pageX,n.pageY);else{const t=this._getSecondPointerPosition(n),i=.5*(n.pageX+t.x),s=.5*(n.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(n){const t=this._getSecondPointerPosition(n),i=n.pageX-t.x,s=n.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(n){this.enableZoom&&this._handleTouchStartDolly(n),this.enablePan&&this._handleTouchStartPan(n)}_handleTouchStartDollyRotate(n){this.enableZoom&&this._handleTouchStartDolly(n),this.enableRotate&&this._handleTouchStartRotate(n)}_handleTouchMoveRotate(n){if(this._pointers.length==1)this._rotateEnd.set(n.pageX,n.pageY);else{const i=this._getSecondPointerPosition(n),s=.5*(n.pageX+i.x),r=.5*(n.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(pt*this._rotateDelta.x/t.clientHeight),this._rotateUp(pt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(n){if(this._pointers.length===1)this._panEnd.set(n.pageX,n.pageY);else{const t=this._getSecondPointerPosition(n),i=.5*(n.pageX+t.x),s=.5*(n.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(n){const t=this._getSecondPointerPosition(n),i=n.pageX-t.x,s=n.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const d=(n.pageX+t.x)*.5,c=(n.pageY+t.y)*.5;this._updateZoomParameters(d,c)}_handleTouchMoveDollyPan(n){this.enableZoom&&this._handleTouchMoveDolly(n),this.enablePan&&this._handleTouchMovePan(n)}_handleTouchMoveDollyRotate(n){this.enableZoom&&this._handleTouchMoveDolly(n),this.enableRotate&&this._handleTouchMoveRotate(n)}_addPointer(n){this._pointers.push(n.pointerId)}_removePointer(n){delete this._pointerPositions[n.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==n.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(n){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==n.pointerId)return!0;return!1}_trackPointer(n){let t=this._pointerPositions[n.pointerId];t===void 0&&(t=new qe,this._pointerPositions[n.pointerId]=t),t.set(n.pageX,n.pageY)}_getSecondPointerPosition(n){const t=n.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(n){const t=n.deltaMode,i={clientX:n.clientX,clientY:n.clientY,deltaY:n.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return n.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function ld(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType==="touch"?this._onTouchStart(e):this._onMouseDown(e)))}function cd(e){this.enabled!==!1&&(e.pointerType==="touch"?this._onTouchMove(e):this._onMouseMove(e))}function fd(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Va),this.state=ke.NONE;break;case 1:const n=this._pointers[0],t=this._pointerPositions[n];this._onTouchStart({pointerId:n,pageX:t.x,pageY:t.y});break}}function dd(e){let n;switch(e.button){case 0:n=this.mouseButtons.LEFT;break;case 1:n=this.mouseButtons.MIDDLE;break;case 2:n=this.mouseButtons.RIGHT;break;default:n=-1}switch(n){case Xt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=ke.DOLLY;break;case Xt.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ke.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ke.ROTATE}break;case Xt.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=ke.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=ke.PAN}break;default:this.state=ke.NONE}this.state!==ke.NONE&&this.dispatchEvent(ei)}function ud(e){switch(this.state){case ke.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case ke.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case ke.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e);break}}function pd(e){this.enabled===!1||this.enableZoom===!1||this.state!==ke.NONE||(e.preventDefault(),this.dispatchEvent(ei),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(Va))}function hd(e){this.enabled!==!1&&this._handleKeyDown(e)}function md(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case zt.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=ke.TOUCH_ROTATE;break;case zt.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=ke.TOUCH_PAN;break;default:this.state=ke.NONE}break;case 2:switch(this.touches.TWO){case zt.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=ke.TOUCH_DOLLY_PAN;break;case zt.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=ke.TOUCH_DOLLY_ROTATE;break;default:this.state=ke.NONE}break;default:this.state=ke.NONE}this.state!==ke.NONE&&this.dispatchEvent(ei)}function _d(e){switch(this._trackPointer(e),this.state){case ke.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case ke.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case ke.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case ke.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=ke.NONE}}function gd(e){this.enabled!==!1&&e.preventDefault()}function vd(e){e.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ed(e){e.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class Td extends So{constructor(){super();const n=new jn;n.deleteAttribute("uv");const t=new Xi({side:vt}),i=new Xi,s=new xo(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new dt(n,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const d=new Mo(n,i,6),c=new To;c.position.set(-10.906,2.009,1.846),c.rotation.set(0,-.195,0),c.scale.set(2.328,7.905,4.651),c.updateMatrix(),d.setMatrixAt(0,c.matrix),c.position.set(-5.607,-.754,-.758),c.rotation.set(0,.994,0),c.scale.set(1.97,1.534,3.955),c.updateMatrix(),d.setMatrixAt(1,c.matrix),c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),c.updateMatrix(),d.setMatrixAt(2,c.matrix),c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),c.updateMatrix(),d.setMatrixAt(3,c.matrix),c.position.set(2.291,-.756,-2.621),c.rotation.set(0,-.286,0),c.scale.set(1.546,1.552,1.496),c.updateMatrix(),d.setMatrixAt(4,c.matrix),c.position.set(-2.193,-.369,-5.547),c.rotation.set(0,.516,0),c.scale.set(3.875,3.487,2.986),c.updateMatrix(),d.setMatrixAt(5,c.matrix),this.add(d);const T=new dt(n,Gt(50));T.position.set(-16.116,14.37,8.208),T.scale.set(.1,2.428,2.739),this.add(T);const x=new dt(n,Gt(50));x.position.set(-16.109,18.021,-8.207),x.scale.set(.1,2.425,2.751),this.add(x);const M=new dt(n,Gt(17));M.position.set(14.904,12.198,-1.832),M.scale.set(.15,4.265,6.331),this.add(M);const _=new dt(n,Gt(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);const v=new dt(n,Gt(20));v.position.set(3.235,11.486,-12.541),v.scale.set(2.5,2,.1),this.add(v);const g=new dt(n,Gt(100));g.position.set(0,20,0),g.scale.set(1,.1,1),this.add(g)}dispose(){const n=new Set;this.traverse(t=>{t.isMesh&&(n.add(t.geometry),n.add(t.material))});for(const t of n)t.dispose()}}function Gt(e){return new Ao({color:0,emissive:16777215,emissiveIntensity:e})}function Ad(e,n=!1){const t=e[0].index!==null,i=new Set(Object.keys(e[0].attributes)),s=new Set(Object.keys(e[0].morphAttributes)),r={},d={},c=e[0].morphTargetsRelative,T=new Qn;let x=0;for(let M=0;M<e.length;++M){const _=e[M];let v=0;if(t!==(_.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+M+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const g in _.attributes){if(!i.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+M+'. All geometries must have compatible attributes; make sure "'+g+'" attribute exists among all geometries, or in none of them.'),null;r[g]===void 0&&(r[g]=[]),r[g].push(_.attributes[g]),v++}if(v!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+M+". Make sure all geometries have the same number of attributes."),null;if(c!==_.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+M+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const g in _.morphAttributes){if(!s.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+M+".  .morphAttributes must be consistent throughout all geometries."),null;d[g]===void 0&&(d[g]=[]),d[g].push(_.morphAttributes[g])}if(n){let g;if(t)g=_.index.count;else if(_.attributes.position!==void 0)g=_.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+M+". The geometry must have either an index or a position attribute"),null;T.addGroup(x,g,M),x+=g}}if(t){let M=0;const _=[];for(let v=0;v<e.length;++v){const g=e[v].index;for(let I=0;I<g.count;++I)_.push(g.getX(I)+M);M+=e[v].attributes.position.count}T.setIndex(_)}for(const M in r){const _=va(r[M]);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+M+" attribute."),null;T.setAttribute(M,_)}for(const M in d){const _=d[M][0].length;if(_===0)break;T.morphAttributes=T.morphAttributes||{},T.morphAttributes[M]=[];for(let v=0;v<_;++v){const g=[];for(let L=0;L<d[M].length;++L)g.push(d[M][L][v]);const I=va(g);if(!I)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+M+" morphAttribute."),null;T.morphAttributes[M].push(I)}}return T}function va(e){let n,t,i,s=-1,r=0;for(let x=0;x<e.length;++x){const M=e[x];if(n===void 0&&(n=M.array.constructor),n!==M.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=M.itemSize),t!==M.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=M.normalized),i!==M.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=M.gpuType),s!==M.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=M.count*t}const d=new n(r),c=new en(d,t,i);let T=0;for(let x=0;x<e.length;++x){const M=e[x];if(M.isInterleavedBufferAttribute){const _=T/t;for(let v=0,g=M.count;v<g;v++)for(let I=0;I<t;I++){const L=M.getComponent(v,I);c.setComponent(v+_,I,L)}}else d.set(M.array,T);T+=M.count*t}return s!==void 0&&(c.gpuType=s),c}const Rd=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),bd=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);export{Md as O,Zi as P,Td as R,xd as W,Rd as e,Ad as m,bd as t};
