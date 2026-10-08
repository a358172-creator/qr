import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { v3, random, gridGeometry, membraneSurface, createSpineShaftJunction, organicLobe, tissueMaterial, physical } from './geometry.js';
import { createMolecularPool, molecularGlyph } from './molecular-particles.js';
import { createActinNetwork } from './actin-network.js';

const POST = [[.43,-3.52],[.34,-3.16],[.265,-2.68],[.38,-2.20],[.92,-1.86],[1.52,-1.46],[1.82,-.96],[1.79,-.59],[1.50,-.35],[.86,-.23],[0,-.20]];
const PRE = [[0,.91],[.55,.92],[1.25,.95],[1.64,1.10],[1.76,1.47],[1.61,1.97],[1.12,2.42],[.57,2.90],[.42,3.65],[.43,4.05]];
const CHANNEL = v3(.24,-.215,.26);
const BASE = { glut:.08, activation:.03, ca:0, scaffold:.25, disc1:.18, kalirin:.16, remodeling:0 };
const clamp = value => THREE.MathUtils.clamp(Number.isFinite(value) ? value : 0, 0, 1);
const morph = (point, amount) => {
  const weight = THREE.MathUtils.smoothstep(point.y,-2.1,-1.2);
  return point.set(point.x*(1+.17*amount*weight),point.y+.065*amount*weight,point.z*(1+.11*amount*weight));
};
const merge = parts => { const geometry = mergeGeometries(parts); parts.forEach(part=>part.dispose()); return geometry; };
// The neck and shaft share an actual oval aperture. Its ring follows the
// shaft's surface, instead of ending as a truncated tube inside another mesh.
const SHAFT_RADIUS=.40, ROOT_X=.20, ROOT_WIDTH=.43, ROOT_DEPTH=.31;
const shaftY=x=>-3.65-.014*x*x-.035*Math.sin(x*.65);
const shaftZ=x=>-.014*x*x;
const junction=createSpineShaftJunction({centerX:ROOT_X,halfWidth:ROOT_WIDTH,halfDepth:ROOT_DEPTH,shaftRadius:SHAFT_RADIUS,shaftY,shaftZ});

/** A sectioned, physiological postsynaptic microdomain. Protein proximity and
 * illumination represent functional context, not a compulsory molecular chain. */
export function createPlasticityEnvironment({ texture } = {}) {
  const root = new THREE.Group(); root.name = 'Plasticity postsynaptic microdomain';
  const selectable = [], labelAnchors = [], morphSurfaces = [], membraneMaterials = [], terminalMaterials = [];
  const anchor = (key,name,position,side='left',priority=2) => labelAnchors.push({key,name,position:v3(...position),side,priority});
  const register = (object,key,name) => { object.userData.key=key; object.name=name; root.add(object); selectable.push(object); return object; };
  const rememberMorph = geometry => morphSurfaces.push({geometry,base:geometry.attributes.position.array.slice()});

  // The inspection opening is cut into the membrane surface. Its rims and
  // thickness are geometry, so orbiting preserves a readable organic silhouette.
  for (const kind of ['post','pre']) {
    const surface = membraneSurface(kind==='post'?POST:PRE,kind);
    if(kind==='post') junction.fitSurface(surface);
    let geometry = surface.geometry;
    if (kind==='pre') {
      geometry = gridGeometry(40,42,surface.sample); surface.geometry.dispose();
    }
    const material = tissueMaterial(texture, {color:kind==='post'?0xf2ddea:0xbeb0ca,
      vertexColors:kind==='post',side:THREE.FrontSide,opacity:kind==='post'?.80:.46,
      roughness:.67,bumpScale:.009,relief:.003,emissive:kind==='post'?0x503549:0x343044,emissiveIntensity:.06});
    const membrane = register(new THREE.Mesh(geometry,material),kind==='post'?'spine':'terminal',kind==='post'?'Continuous mushroom membrane':'Contextual presynaptic terminal');
    membrane.renderOrder=2;
    (kind==='post'?membraneMaterials:terminalMaterials).push({material,opacity:material.opacity});
    if(kind==='post') rememberMorph(geometry);
    // Both cutaways retain their far wall: otherwise the presynaptic terminal
    // reads as an empty outline with free-floating vesicles. The inset shares
    // the real section boundary and keeps the vesicles inside a tissue volume.
    const innerMaterial=tissueMaterial(texture,{color:kind==='post'?0xc3a6ba:0x9c90ad,
      vertexColors:kind==='post',side:THREE.BackSide,opacity:kind==='post'?.72:.58,
      roughness:.78,bumpScale:.007,relief:.002,emissive:kind==='post'?0x513f50:0x3f364c,emissiveIntensity:.08});
    const inner=new THREE.Mesh(geometry,innerMaterial);
    if(kind==='pre') inner.scale.set(.99,1,.99);
    register(inner,kind==='post'?'spine':'terminal',kind==='post'?'Inner mushroom membrane':'Inner presynaptic membrane');
    (kind==='post'?membraneMaterials:terminalMaterials).push({material:innerMaterial,opacity:innerMaterial.opacity});
    const edgeMat = physical(kind==='post'?0xd2a9c2:0xb8a5c7,{roughness:.65,transparent:true,opacity:kind==='post'?.84:.46,depthWrite:false,bumpMap:texture,bumpScale:.008});
    const parts=[];
    for(const side of [0,1]) {
      const points = Array.from({length:75},(_,i)=>surface.sample(THREE.MathUtils.lerp(...surface.windowRange,i/74),side));
      parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),72,.017,6,false));
      parts.push(gridGeometry(72,2,(u,v)=>surface.sample(THREE.MathUtils.lerp(...surface.windowRange,u),side,v*.04)));
    }
    const edgeGeometry=merge(parts), edge = new THREE.Mesh(edgeGeometry,edgeMat); edge.name=`${kind} section thickness`; root.add(edge);
    (kind==='post'?membraneMaterials:terminalMaterials).push({material:edgeMat,opacity:edgeMat.opacity});
    if(kind==='post') rememberMorph(edgeGeometry);
  }

  const shaftParts=[[-5,ROOT_X-ROOT_WIDTH,30],[ROOT_X-ROOT_WIDTH,ROOT_X+ROOT_WIDTH,32],[ROOT_X+ROOT_WIDTH,5,30]].map(([start,end,rows])=>gridGeometry(rows,32,(u,v)=>{
    const x=THREE.MathUtils.lerp(start,end,u),half=junction.roofHalf(x);
    const a=half+v*(Math.PI*2-2*half),relief=THREE.MathUtils.smoothstep(Math.abs(x-ROOT_X),.65,1.3);
    const r=SHAFT_RADIUS*(1+.018*relief*Math.sin(x*2+a*3));
    return v3(x,shaftY(x)+Math.cos(a)*r,shaftZ(x)+Math.sin(a)*r);
  }));
  const shaftGeometry=merge(shaftParts);
  // Frenet circles run clockwise when viewed along this shaft's outward
  // normal. Reverse this local surface's indices before using FrontSide.
  const shaftIndices=shaftGeometry.index.array;
  for(let i=0;i<shaftIndices.length;i+=3) [shaftIndices[i+1],shaftIndices[i+2]]=[shaftIndices[i+2],shaftIndices[i+1]];
  shaftGeometry.index.needsUpdate=true;shaftGeometry.computeVertexNormals();
  register(new THREE.Mesh(shaftGeometry,tissueMaterial(texture,{vertexColors:false,color:0xbda0b6,side:THREE.FrontSide,opacity:.84,bumpScale:.007,relief:.002})),'dendrite','Supporting dendritic shaft');

  // Modest presynaptic context: eleven membrane-bound vesicles, no unrelated
  // organelles or damage machinery are constructed for this mechanism.
  const vesicleMat=physical(0xc2b3cd,{roughness:.63,transparent:true,opacity:.64,depthWrite:false,bumpMap:texture,bumpScale:.008});
  const vesicles=new THREE.InstancedMesh(organicLobe(19),vesicleMat,11), transform=new THREE.Object3D(), rng=random(142);
  vesicles.name='Contextual synaptic vesicles';
  for(let i=0;i<11;i++) {
    const a=i*2.4,r=.25+Math.sqrt(rng())*.8;
    transform.position.set(Math.cos(a)*r,1.28+rng()*.75,Math.sin(a)*r*.62); transform.scale.setScalar(.10+rng()*.035); transform.updateMatrix();vesicles.setMatrixAt(i,transform.matrix);
  }
  root.add(vesicles);terminalMaterials.push({material:vesicleMat,opacity:.64});

  // Four separated organic subunits maintain the existing receptor language.
  // Their very small radial excursion changes the pore rather than moving the receptor.
  const receptor=new THREE.Group(); receptor.position.copy(CHANNEL);
  const receptorMat=physical(0x8386b6,{roughness:.58,bumpMap:texture,bumpScale:.01,emissive:0x34394f,emissiveIntensity:.07});
  const receptorSubunits=[];
  for(let i=0;i<4;i++) {
    const a=i*Math.PI/2+.35,dx=Math.cos(a),dz=Math.sin(a),parts=[];
    parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v3(dx*.092,-.20,dz*.092),v3(dx*.105,-.045,dz*.105),v3(dx*.155,.115,dz*.155)]),14,.048,8,false));
    for(const [j,scale,pos,angle] of [[2,[.099,.16,.093],[dx*.155,.18,dz*.155],-dx*.28],[7,[.102,.137,.091],[dx*.183,.375,dz*.173],dx*.36],[12,[.054,.066,.057],[dx*.244,.32,dz*.215],-dx*.48]]) {
      const g=organicLobe(i+j);g.scale(...scale);g.rotateZ(angle);g.translate(...pos);parts.push(g);
    }
    const subunit=new THREE.Mesh(merge(parts),receptorMat);subunit.name=`NMDAR subunit ${i+1}`;receptor.add(subunit);receptorSubunits.push({subunit,dx,dz});
  }
  const poreMat=physical(0xb2abc9,{roughness:.61});
  const pore=new THREE.Mesh(new THREE.TorusGeometry(.080,.017,8,24),poreMat);pore.rotation.x=Math.PI/2;pore.position.y=-.005;receptor.add(pore);
  register(receptor,'nmda','NMDAR physiological channel');

  // A porous, irregular three-dimensional protein mesh under the membrane,
  // deliberately avoiding a plate, disk, or solid slab.
  const latticeParts=[],scaffoldRng=random(694),scaffoldCurves=[];
  for(let i=0;i<24;i++) {
    const angle=scaffoldRng()*Math.PI*2,turn=.8+scaffoldRng()*1.2;
    const depth=-.405-scaffoldRng()*.26;
    const origin=v3(Math.cos(angle)*(.68+scaffoldRng()*.32),depth+(scaffoldRng()-.5)*.04,Math.sin(angle)*.51);
    const destination=v3(Math.cos(angle+Math.PI+turn*.2)*(.63+scaffoldRng()*.37),depth+(scaffoldRng()-.5)*.05,Math.sin(angle+Math.PI+turn*.2)*.50);
    const middle=origin.clone().lerp(destination,.49).add(v3((scaffoldRng()-.5)*.38,(scaffoldRng()-.5)*.09,(scaffoldRng()-.5)*.29));
    const curve=new THREE.CatmullRomCurve3([origin,origin.clone().lerp(middle,.50).add(v3(.03,.04,-.02)),middle,middle.clone().lerp(destination,.58).add(v3(-.02,-.025,.03)),destination]);
    scaffoldCurves.push(curve);
    latticeParts.push(new THREE.TubeGeometry(curve,22,.015+scaffoldRng()*.006,5,false));
  }
  // Short unequal forks attach to the long paths at varying depths. Their
  // irregular spacing avoids reading the PSD as a rectangular fabric or grid.
  for(let i=0;i<30;i++) {
    const parent=scaffoldCurves[i%scaffoldCurves.length],u=.16+scaffoldRng()*.68,start=parent.getPoint(u);
    const tangent=parent.getTangent(u),side=v3(-tangent.z,(scaffoldRng()-.5)*.8,tangent.x).normalize().multiplyScalar(i%2?1:-1);
    const tip=start.clone().addScaledVector(side,.13+scaffoldRng()*.26).addScaledVector(tangent,.08+scaffoldRng()*.12);
    tip.x=THREE.MathUtils.clamp(tip.x,-1.04,1.04);tip.z=THREE.MathUtils.clamp(tip.z,-.58,.58);tip.y=THREE.MathUtils.clamp(tip.y,-.78,-.35);
    const middle=start.clone().lerp(tip,.52).add(v3(.025*Math.sin(i),-.025,.015*Math.cos(i)));
    latticeParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([start,middle,tip]),10,.012+scaffoldRng()*.004,5,false));
  }
  // Cross-links join adjacent depths rather than stacking disconnected sheets.
  // Small elongated domains sit on the scaffold itself, giving the density a
  // granular protein volume distinct from the finer, pink actin filaments.
  for(let i=0;i<20;i++) {
    const from=scaffoldCurves[i].getPoint(.27+(i%3)*.21),neighbor=scaffoldCurves[i+1];
    let nearest=neighbor.getPoint(0),distance=Infinity;
    for(let j=0;j<=20;j++) {
      const candidate=neighbor.getPoint(j/20),d=from.distanceToSquared(candidate);
      if(d<distance) {nearest=candidate;distance=d;}
    }
    const middle=from.clone().lerp(nearest,.53).add(v3(.025,-.013,.015));
    latticeParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([from,middle,nearest]),8,.014,5,false));
  }
  for(let i=0;i<34;i++) {
    const curve=scaffoldCurves[i%scaffoldCurves.length],u=.19+scaffoldRng()*.62;
    const center=curve.getPoint(u),tangent=curve.getTangent(u);
    const domain=new THREE.SphereGeometry(1,10,6),position=domain.attributes.position;
    for(let j=0;j<position.count;j++) {
      const x=position.getX(j),y=position.getY(j),z=position.getZ(j);
      const relief=1+.12*Math.sin(x*3+i)*Math.cos(y*4-i)*Math.sin(z*3+1);
      position.setXYZ(j,x*relief,y*relief,z*relief);
    }
    domain.scale(.047+scaffoldRng()*.025,.024+scaffoldRng()*.012,.025+scaffoldRng()*.013);
    domain.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(v3(1,0,0),tangent));
    domain.translate(center.x,center.y,center.z);domain.computeVertexNormals();latticeParts.push(domain);
  }
  // Irregular short elements approach the cytoplasmic membrane face; there is
  // no detached sheet or single protein masquerading as the entire density.
  for(let i=0;i<9;i++) {
    const start=scaffoldCurves[i*2].getPoint(.34+(i%3)*.14);
    const tip=v3(start.x*.96,-.31-.035*Math.abs(start.x),start.z*.97);
    latticeParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([start,start.clone().lerp(tip,.5).add(v3(.02,0,-.015)),tip]),8,.012+(i%3)*.002,5,false));
  }
  const psdMat=physical(0x6f958c,{roughness:.81,clearcoat:.02,transparent:true,opacity:.72,depthWrite:false,emissive:0x24433a,emissiveIntensity:.025});
  const psd=register(new THREE.Mesh(merge(latticeParts),psdMat),'psd','Porous postsynaptic protein scaffold');rememberMorph(psd.geometry);

  const proteinSpecs=[
    {key:'psd95',name:'PSD-95 scaffold complex',position:v3(.60,-.43,.37),color:0x8ea99f,emissive:0x344c43,
      scales:[[.075,.048,.065],[.079,.052,.059],[.081,.050,.065],[.072,.069,.058],[.105,.074,.075]],
      offsets:[[-.25,.025,-.025],[-.11,.012,.035],[.035,-.018,.03],[.13,-.085,-.008],[.25,-.13,-.015]]},
    {key:'disc1',name:'DISC1 structural complex',position:v3(-.69,-.98,.35),color:0x91a3b5,emissive:0x334453,
      scales:[[.086,.112,.072],[.049,.145,.052],[.057,.128,.048],[.089,.090,.063]],
      offsets:[[-.054,.19,-.025],[.007,.055,.012],[.02,-.115,.005],[.075,-.265,-.01]]},
    {key:'kalirin7',name:'Kalirin-7 actin-adjacent complex',position:v3(.63,-1.22,.32),color:0x99b6a4,emissive:0x3d5347,
      scales:[[.091,.064,.058],[.082,.041,.047],[.091,.044,.050],[.102,.045,.056],[.13,.085,.073],[.080,.059,.067]],
      offsets:[[-.35,.045,-.018],[-.22,-.025,.012],[-.075,-.073,.04],[.09,-.073,.027],[.27,-.02,0],[.31,.105,-.018]]},
  ];
  const proteins=proteinSpecs.map((spec,i)=>{
    const parts=spec.scales.map((scale,j)=>{const g=organicLobe(31+i*9+j);g.scale(...scale);g.rotateZ(Math.sin(j*1.7+i)*.22);g.rotateY(j*.27);g.translate(...spec.offsets[j]);return g;});
    // These connectors belong to each stylized multidomain silhouette. They
    // never connect different proteins or claim resolved atomic structures.
    parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spec.offsets.map(p=>v3(...p))),36,i===1?.038:.023,7,false));
    const material=physical(spec.color,{roughness:.73,clearcoat:.025,bumpMap:texture,bumpScale:.006,transparent:true,opacity:.8,emissive:spec.emissive,emissiveIntensity:.05});
    const mesh=register(new THREE.Mesh(merge(parts),material),spec.key,spec.name);mesh.position.copy(spec.position);
    return {...spec,mesh,material};
  });

  const actin=createActinNetwork({texture});root.add(actin.root);selectable.push(...actin.selectable);
  for(const item of actin.labelAnchors) labelAnchors.push(item);
  const calcium=createMolecularPool(root,{key:'calcium',capacity:8,geometry:molecularGlyph('single',.044),material:physical(0xd3a293,{roughness:.52,emissive:0x6b413b,emissiveIntensity:.16})});
  const glutamate=createMolecularPool(root,{key:'glutamate',capacity:7,geometry:molecularGlyph('triple',.035),material:physical(0xbeae8f,{roughness:.64,emissive:0x3f3827,emissiveIntensity:.05})});
  selectable.push(calcium.mesh,glutamate.mesh);

  anchor('spine','Espina dendrítica',[-1.38,-1.1,.65],'left',3);
  anchor('terminal','Terminal presináptica',[-1.02,1.96,.35],'left');
  anchor('dendrite','Dendrita',[-2.1,-3.55,.24],'left',1);
  anchor('nmda','NMDAR',[.45,.13,.32],'right',3);
  anchor('glutamate','Glutamato',[-.14,.55,.37],'left');
  anchor('calcium','Ca²⁺',[.17,-.66,.55],'left',3);
  anchor('psd','Densidad postsináptica',[-.91,-.45,.39],'left');
  anchor('psd95','PSD-95',[.79,-.52,.4],'right',3);
  anchor('disc1','DISC1',[-.68,-.98,.40],'left',3);
  anchor('kalirin7','Kalirin-7',[.88,-1.22,.37],'right',3);
  const anchorBases=new Map(labelAnchors.map(item=>[item.key,item.position.clone()]));
  const stageKeys=[
    ['spine','terminal','dendrite','actin','psd','nmda'],
    ['spine','terminal','dendrite','actin','psd','nmda','glutamate','calcium'],
    ['spine','terminal','dendrite','actin','psd','nmda','calcium','psd95','disc1'],
    ['spine','terminal','dendrite','actin','psd','nmda','calcium','psd95','disc1','kalirin7'],
    ['spine','terminal','dendrite','actin','psd','nmda','calcium','psd95','disc1','kalirin7'],
    ['spine','terminal','dendrite','actin','psd','nmda','psd95','disc1','kalirin7'],
  ];
  let lastMorph=NaN,currentStage=0,currentState={...BASE},viewOpacity=.8;
  // Independent cytosolic samples describe dispersion after pore entry. They
  // deliberately do not use protein coordinates as delivery destinations.
  const ionTargets=[v3(-.28,-.90,-.20),v3(.39,-1.10,-.31),v3(-.54,-1.30,-.02),v3(.08,-1.58,.14),
    v3(.81,-.96,-.13),v3(-.81,-1.02,-.28),v3(.24,-1.45,.10),v3(-.15,-.73,.41)];
  function update({time=0,state=BASE,stepIndex=0,elapsed=0,selected=null,viewDistance=17}={}) {
    currentStage=THREE.MathUtils.clamp(stepIndex|0,0,5);
    const values=Object.fromEntries(Object.keys(BASE).map(key=>[key,clamp(state[key])]));
    if(!currentStage) Object.assign(values,BASE);
    const amount=currentStage>=3?values.remodeling:0;
    values.remodeling=amount;currentState=values;
    if(amount!==lastMorph) {
      const point=new THREE.Vector3();
      for(const {geometry,base} of morphSurfaces) {
        const positions=geometry.attributes.position;
        for(let i=0;i<positions.count;i++) { point.fromArray(base,i*3);morph(point,amount);positions.setXYZ(i,point.x,point.y,point.z); }
        positions.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
      }
      for(const protein of proteins) protein.mesh.position.copy(morph(protein.position.clone(),amount));
      receptor.position.copy(morph(CHANNEL.clone(),amount));
      for(const item of labelAnchors) { if(item.key!=='actin') item.position.copy(morph(anchorBases.get(item.key).clone(),amount)); }
      lastMorph=amount;
    }
    const actinFocus=selected==='actin',facing=THREE.MathUtils.smoothstep(Number.isFinite(viewDistance)?viewDistance:17,9,17);
    viewOpacity=THREE.MathUtils.lerp(.55,.80,facing)*(actinFocus?.68:1);
    for(const {material,opacity} of membraneMaterials) material.opacity=viewOpacity*opacity/.80;
    for(const {material,opacity} of terminalMaterials) material.opacity=opacity*(actinFocus?.65:1);
    psdMat.opacity=(.66+.17*values.scaffold)*(actinFocus?.55:1);psdMat.emissiveIntensity=selected==='psd'?.19:.025+values.scaffold*.075;
    receptorMat.opacity=actinFocus?.65:1;receptorMat.transparent=true;
    receptorMat.emissiveIntensity=selected==='nmda'?.36:.07+values.activation*.15;
    for(const {subunit,dx,dz} of receptorSubunits) subunit.position.set(dx*.028*values.activation,0,dz*.028*values.activation);
    pore.scale.setScalar(1+.17*values.activation);poreMat.opacity=actinFocus?.65:1;poreMat.transparent=true;
    for(const protein of proteins) {
      const signal=protein.key==='psd95'?values.scaffold:protein.key==='disc1'?values.disc1*(currentStage===2?THREE.MathUtils.smoothstep(elapsed,3,5):1):values.kalirin;
      protein.material.opacity=(.64+.27*signal)*(actinFocus?.46:1);
      protein.material.emissiveIntensity=selected===protein.key?.40:.025+signal*.19;
    }
    actin.update({time,remodeling:amount,selected});
    const channel=receptor.position,ionCount=currentStage>=1&&currentStage<=4?Math.round(8*values.ca):0;
    calcium.update(ionCount,(index,object)=>{
      const t=(time*.14+index*.173)%1;
      if(t<.55) object.position.set(channel.x,channel.y+.72-t/.55*1.02,channel.z);
      else {
        const q=(t-.55)/.45,target=morph(ionTargets[index%ionTargets.length].clone(),amount);
        object.position.set(channel.x+(target.x-channel.x)*q*q,THREE.MathUtils.lerp(channel.y-.30,target.y,q),channel.z+(target.z-channel.z)*q*q);
      }
      object.scale.setScalar(.83+.15*Math.sin(index*1.7));
    });
    glutamate.update(currentStage===1?Math.round(7*values.glut):0,(index,object)=>{
      const t=(time*.19+index*.147)%1;
      object.position.set(THREE.MathUtils.lerp(-.43+(index%3)*.25,channel.x,t),THREE.MathUtils.lerp(.90,.20,t),THREE.MathUtils.lerp(.12+(index%2)*.24,channel.z,t));
      object.rotation.set(t,index*.8,t*.5);
    });
    root.updateMatrixWorld(true);
  }
  function diagnostics() {
    return {stage:currentStage,remodeling:currentState.remodeling,headRadialScale:1+.17*currentState.remodeling,
      junction:{center:ROOT_X,width:ROOT_WIDTH,depth:ROOT_DEPTH,shaftRadius:SHAFT_RADIUS},
      channel:receptor.position.toArray(),proteins:Object.fromEntries(proteins.map(protein=>[protein.key,protein.mesh.position.toArray()])),
      particles:{calcium:calcium.mesh.count,glutamate:glutamate.mesh.count},appearance:{membraneOpacity:viewOpacity},
      actin:actin.diagnostics()};
  }
  update();
  return {root,selectable,labelAnchors,update,visibleKeys:stepIndex=>stageKeys[THREE.MathUtils.clamp(stepIndex|0,0,5)],diagnostics};
}
