import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { v3, random, gridGeometry, membraneSurface, createSpineShaftJunction, organicLobe, surfaceTexture, tissueMaterial, physical } from './geometry.js';
import { createMitochondrialOrganelle } from './mitochondrial-organelle.js';

export function createAnatomy({ includeDendrite = false, proximalMito = false, texture = surfaceTexture() } = {}) {
  const root = new THREE.Group(), selectable = [], receptors = [];
  const spineSurfaces = [];
  const membranes = [], receptorMaterials = new Map(), labelAnchors = [];
  const anchor = (key, name, position, side = 'left', priority = 1) => labelAnchors.push({ key, name, position: v3(...position), side, priority });
  const proximalShaftY=x=>-3.72-.012*x*x, proximalShaftRadius=x=>.49+.025*Math.sin(x*1.8);
  const junction=proximalMito?createSpineShaftJunction({shaftY:proximalShaftY,shaftRadius:proximalShaftRadius}):null;
  const profiles = {
    pre: [[0,.91],[.55,.92],[1.25,.95],[1.71,1.06],[1.97,1.39],[1.84,1.95],[1.29,2.44],[.68,2.88],[.48,3.56],[.44,4.27],[.48,5.6]],
    post: [[.43,-3.52],[.34,-3.16],[.265,-2.68],[.38,-2.20],[.92,-1.86],[1.52,-1.46],[1.82,-.96],[1.79,-.59],[1.50,-.35],[.86,-.23],[0,-.20]],
  };
  const edgeMaterials = {
    pre: physical(0xd7c5e7, { roughness: .47, bumpMap: texture, bumpScale: .018 }),
    post: physical(0xe0c3d0, { roughness: .48, bumpMap: texture, bumpScale: .018 }),
  };
  for (const type of ['pre', 'post']) {
    const surface = membraneSurface(profiles[type], type);
    if(type==='post'&&junction) junction.fitSurface(surface);
    const outer = new THREE.Mesh(surface.geometry, tissueMaterial(texture, { side: THREE.FrontSide, fadeBase: type === 'post', ...(proximalMito ? {roughness:.72,bumpScale:.009,relief:.0025} : {}) }));
    const inner = new THREE.Mesh(surface.geometry, tissueMaterial(texture, {
      side: THREE.BackSide, color: type === 'pre' ? 0xc3b5d4 : 0xe0c2ce,
      opacity: 1, transparent: false, depthWrite: true, roughness: .79, bumpScale: .008, relief: .003, emissive: type === 'pre' ? 0x6a557b : 0x76515f, emissiveIntensity: .16, fadeBase: type === 'post',
    }));
    if(!(type==='post'&&junction)) inner.scale.set(.982,1,.982);
    outer.renderOrder = 1; inner.renderOrder = 0;
    outer.userData.tissue = type;
    // The intact tissue is selectable, while the section window remains open to
    // receptors and organelles. It has no invisible pick-blocking proxy mesh.
    outer.userData.key = type === 'pre' ? 'terminal' : 'spine';
    root.add(inner, outer); if (type === 'post') spineSurfaces.push(surface.geometry); membranes.push(outer, inner); selectable.push(outer);

    const opened = Array.from({length: 101}, (_, i) => THREE.MathUtils.lerp(...surface.windowRange, i / 100));
    const lipParts = [], coreParts = [];
    for (const side of [0, 1]) {
      const points = opened.map(u => surface.sample(u, side));
      const curve = new THREE.CatmullRomCurve3(points);
      lipParts.push(new THREE.TubeGeometry(curve, 90, .017, 7, false));
      const innerPoints = opened.map(u => surface.sample(u, side, .038));
      coreParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(innerPoints), 90, .009, 6, false));
      const sectionWall = gridGeometry(90, 3, (u, v) => {
        const t = THREE.MathUtils.lerp(opened[0], opened[opened.length - 1], u);
        return surface.sample(t, side, v * .045);
      });
      root.add(new THREE.Mesh(sectionWall, edgeMaterials[type]));
      if (type === 'post') spineSurfaces.push(sectionWall);
    }
    const lipGeometry = mergeGeometries(lipParts), coreGeometry = mergeGeometries(coreParts);
    lipParts.forEach(g => g.dispose()); coreParts.forEach(g => g.dispose());
    if (type === 'post') spineSurfaces.push(lipGeometry, coreGeometry);
    root.add(new THREE.Mesh(lipGeometry, edgeMaterials[type]));
    root.add(new THREE.Mesh(coreGeometry, physical(type === 'pre' ? 0x756180 : 0x916f88, { roughness: .65 })));

    // Faint longitudinal relief follows the membrane itself; these are surface
    // folds, without luminous outlines or decorative floating filaments.
    const fibres = [], fibreRng = random(type === 'pre' ? 79 : 91);
    for (let i = 0; i < 23; i++) {
      const start = .08 + fibreRng() * .60, span = .10 + fibreRng() * .23;
      const lane = .03 + fibreRng() * .94, points = [];
      for (let j = 0; j <= 25; j++) {
        const u = Math.min(.97, start + span * j / 25);
        const v = THREE.MathUtils.clamp(lane + Math.sin(u * 18 + i) * .010, .012, .988);
        points.push(surface.sample(u, v, -.009));
      }
      fibres.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 25, .007, 5, false));
    }
    const fibreGeometry = mergeGeometries(fibres); fibres.forEach(g => g.dispose());
    if (type === 'post') spineSurfaces.push(fibreGeometry);
    root.add(new THREE.Mesh(fibreGeometry, physical(type === 'pre' ? 0xb7a2cb : 0xd5aabf,
      { roughness: .67, transparent: true, opacity: .37, depthWrite: false })));
  }

  if (includeDendrite && !proximalMito) {
    const curve = new THREE.CatmullRomCurve3([v3(-9,-4.1,-.7),v3(-4.8,-3.89,-.3),v3(-2.8,-3.64,-.15),v3(-.2,-3.62,0),v3(2.4,-3.47,-.13),v3(5,-3.73,-.5),v3(9,-4.15,-1.1)]);
    const frames = curve.computeFrenetFrames(120, false);
    const shaftGeometry = gridGeometry(120, 24, (u, v) => {
      const p = curve.getPointAt(u), index = Math.min(120, Math.round(u * 120)), a = v * Math.PI * 2;
      const r = (.39 - u * .12) * (1 + .08 * Math.sin(u * 21) + .03 * Math.sin(a * 5 + u * 40));
      return p.addScaledVector(frames.normals[index], Math.cos(a) * r).addScaledVector(frames.binormals[index], Math.sin(a) * r);
    });
    const dendrite = new THREE.Mesh(shaftGeometry, tissueMaterial(texture, { vertexColors: false, color: 0x987eae, opacity: .92 }));
    dendrite.userData.key = 'dendrite'; root.add(dendrite); membranes.push(dendrite); selectable.push(dendrite);
  }


  if (includeDendrite && proximalMito) {
    // Two angular patches preserve both openings: an oval roof shared with the
    // spine neck, and the lateral teaching section exposing the mitochondrion.
    const sample = (u, v, inset = 0, band = 0) => {
      const x = -4.2 + u * 8.4, cy = proximalShaftY(x), roof=junction.roofHalf(x);
      const window = THREE.MathUtils.smoothstep(x,.50,.95)*(1-THREE.MathUtils.smoothstep(x,3.05,3.70));
      const half=window*1.15;
      const a=band===0?THREE.MathUtils.lerp(roof,Math.PI/2-half,v):THREE.MathUtils.lerp(Math.PI/2+half,Math.PI*2-roof,v);
      const relief=THREE.MathUtils.smoothstep(Math.abs(x-.20),.65,1.1);
      const r=proximalShaftRadius(x)*(1+.025*relief*Math.sin(a*3+x))-inset;
      return v3(x, cy + Math.cos(a)*r, Math.sin(a)*r);
    };
    const parts=[];
    for(const [start,end,rows] of [[-4.2,-.23,34],[-.23,.63,32],[.63,4.2,34]]) for(const band of [0,1]) {
      parts.push(gridGeometry(rows,24,(u,v)=>sample((THREE.MathUtils.lerp(start,end,u)+4.2)/8.4,v,0,band)));
    }
    const shaftGeometry=mergeGeometries(parts);parts.forEach(part=>part.dispose());
    // Both angular patches wind inward. Reverse once and render an opaque
    // section wall: blending near/far triangles caused a serrated silhouette.
    const indices=shaftGeometry.index.array;
    for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
    shaftGeometry.computeVertexNormals();
    const shaft = new THREE.Mesh(shaftGeometry, tissueMaterial(texture,{vertexColors:false,color:0xba9eb3,side:THREE.DoubleSide,transparent:false,depthWrite:true,opacity:1,roughness:.78,bumpScale:.006,relief:.002}));
    shaft.name='Proximal dendritic section'; shaft.userData.key='dendrite'; root.add(shaft);selectable.push(shaft);
    for (const side of [0,1]) root.add(new THREE.Mesh(gridGeometry(64,2,(u,v)=>sample((.50+u*3.2+4.2)/8.4,side?0:1,v*.035,side)), edgeMaterials.post));
  }

  // The paired active zone and postsynaptic density follow the curved membrane.
  const activeGeo = new THREE.SphereGeometry(1, 40, 16);
  const preZone = new THREE.Mesh(activeGeo, physical(0xaca0bc, { transparent:true, opacity:.40, depthWrite:false, roughness: .7 }));
  preZone.scale.set(1.36,.026,.83); preZone.position.set(.03,.936,.035); root.add(preZone);
  const postZone = new THREE.Mesh(activeGeo, physical(0xa68eab, { transparent:true, opacity:.29, depthWrite:false, roughness: .68 }));
  postZone.scale.set(1.33,.038,.79); postZone.position.set(.06,-.242,.01); root.add(postZone);
  const contactRims = [];
  for (const y of [.93, -.25]) {
    const points = [];
    for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; points.push(v3(.04 + Math.cos(a) * 1.36, y + .007 * Math.sin(a * 3), Math.sin(a) * .83)); }
    contactRims.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, .012, 5, true));
  }
  const contactGeometry = mergeGeometries(contactRims); contactRims.forEach(g => g.dispose());
  spineSurfaces.push(contactGeometry);
  root.add(new THREE.Mesh(contactGeometry, physical(0xcbb5ca, { roughness: .63, transparent: true, opacity: .6, depthWrite: false })));

  const vesicleGeometry = organicLobe(19);
  const vesicleMat = physical(0xc3a9cf, { transparent:true, opacity:.89, roughness:.56, depthWrite:false, bumpMap: texture, bumpScale: .012, side: THREE.FrontSide });
  vesicleMat.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      float vesicleWall = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 1.6);
      diffuseColor.a *= .61 + .39 * vesicleWall;
    `);
  };
  vesicleMat.customProgramCacheKey = () => 'vesicle-membrane-v1';
  const vesicles = new THREE.InstancedMesh(vesicleGeometry, vesicleMat, 32), vesicleSeeds = [];
  const rng = random(281), transform = new THREE.Object3D();
  for (let i=0;i<32;i++) {
    const a = i * 2.39996, r = Math.sqrt(rng()) * 1.29;
    const p = v3(Math.cos(a)*r-.08,1.23+rng()*.94,Math.sin(a)*r*.67);
    if (i<5) p.set(-.75+i*.35,1.13+(i%2)*.055,.14+(i%3)*.19);
    const radius=.096+rng()*.052;
    vesicleSeeds.push({ position:p.clone(), radius, phase:rng()*6.28 });
    transform.position.copy(p);transform.scale.setScalar(radius);transform.updateMatrix();vesicles.setMatrixAt(i,transform.matrix);
    vesicles.setColorAt(i,new THREE.Color().setHSL(.765 + rng()*.035,.19,.62 + rng()*.11));
  }
  vesicles.instanceMatrix.setUsage(THREE.DynamicDrawUsage); vesicles.userData.key='vesicles'; root.add(vesicles);selectable.push(vesicles);
  const cargo = new THREE.InstancedMesh(new THREE.SphereGeometry(.023,8,6),physical(0xd7b28b,{emissive:0x4d2611,emissiveIntensity:.05,roughness:.61}),vesicleSeeds.length*4);
  vesicleSeeds.forEach((s,i)=>{for(let j=0;j<4;j++){transform.position.copy(s.position).add(v3(Math.sin(j*2.4)*.05,Math.cos(j*1.5)*.04,Math.cos(j*2.4)*.05));transform.scale.setScalar(1);transform.updateMatrix();cargo.setMatrixAt(i*4+j,transform.matrix);}});
  cargo.instanceMatrix.setUsage(THREE.DynamicDrawUsage); root.add(cargo);

  function receptor(kind,x,z,scale=1) {
    const mat = physical(kind==='nmda'?0x8988c9:0x69a99d,{roughness:proximalMito?.68:.53,clearcoat:.025,emissive:kind==='nmda'?0x403765:0x1f4b43,emissiveIntensity:.06,bumpMap:texture,bumpScale:proximalMito?.006:.016});
    const parts=[], group = new THREE.Group();
    const addLobe = (seed, scale, pos, angle=0) => {
      const g=organicLobe(seed);g.scale(...scale);g.rotateZ(angle);g.translate(...pos);parts.push(g);
    };
    for(let i=0;i<4;i++) {
      const a=i*Math.PI/2+.35,dx=Math.cos(a),dz=Math.sin(a),r=kind==='nmda'?.155:.13;
      const helix=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v3(dx*.085,-.23,dz*.085),v3(dx*.105,-.05,dz*.105),v3(dx*r,.12,dz*r)]),14,.055,8,false);parts.push(helix);
      addLobe(i+2,[.103,kind==='nmda'?.165:.125,.10],[dx*r,.18,dz*r],-dx*.28);
      addLobe(i+7,[.106,kind==='nmda'?.145:.10,.095],[dx*(r+.028),kind==='nmda'?.38:.305,dz*(r+.018)],dx*.36);
      addLobe(i+12,[.057,.069,.06],[dx*(r+.093),kind==='nmda'?.32:.26,dz*(r+.059)],-dx*.48);
    }
    const geo=mergeGeometries(parts);parts.forEach(g=>g.dispose());
    const protein=new THREE.Mesh(geo,mat);group.add(protein);
    // Four separated subunits leave an open central pore; no floating cylinder.
    const pore = new THREE.Mesh(new THREE.TorusGeometry(.083,.023,8,20),physical(kind==='nmda'?0xc3b1dc:0xa1d2c5,{roughness:.55}));
    pore.rotation.x=Math.PI/2;pore.position.y=.005;group.add(pore);
    const y=-.205-.024*(x*x+z*z);group.position.set(x,y,z);group.scale.setScalar(scale);
    group.userData.key=kind;root.add(group);selectable.push(group);receptors.push({group,kind,material:mat,base:mat.emissiveIntensity});
    if(!receptorMaterials.has(kind))receptorMaterials.set(kind,[]);receptorMaterials.get(kind).push(mat);
    return group;
  }
  const ampa1=receptor('ampa',-.97,.48,1.05);receptor('ampa',-.55,-.53,.87);
  const nmda1=receptor('nmda',.20,.63,1.10);const nmda2=receptor('nmda',.96,.12,.97);receptor('nmda',.47,-.52,.82);

  const mito=createMitochondrialOrganelle(texture);mito.group.scale.setScalar(proximalMito ? .40 : .43);
  mito.group.position.set(...(proximalMito ? [1.65,-3.72,0] : [.18,-1.12,.45]));mito.group.rotation.set(.05,-.09,proximalMito ? -.035 : -.29);mito.group.userData.key='mitochondria';root.add(mito.group);selectable.push(mito.group);
  const caspases=new THREE.Group(), casMat=physical(0xb086a5,{emissive:0x7f315a,emissiveIntensity:.22,transparent:true,opacity:0});
  caspases.userData.key='caspases';const casGeo=organicLobe(13);
  for(let i=0;i<4;i++)for(let j=0;j<3;j++){
    const l=new THREE.Mesh(casGeo,casMat);l.scale.set(.085,.062,.07);l.position.set(-.48+i*.21+Math.cos(j*2.1)*.048,-1.83+Math.sin(i*2)*.065+Math.sin(j*2.1)*.048,.27+(j%2)*.04);caspases.add(l);
  }
  root.add(caspases);selectable.push(caspases);

  anchor('terminal','Terminal presináptica',[-1.49,2.18,.35],'left',2);
  anchor('vesicles','Vesículas sinápticas',[1.12,1.60,.70],'right',1);
  anchor('glutamate','Glutamato',[-.96,.64,.70],'left',2);
  anchor('ampa','AMPA',ampa1.position.toArray().map((v,i)=>v+(i===1?.28:0)),'left',3);
  anchor('nmda','NMDA',[1.12,.17,.28],'right',3);
  anchor('calcium','Ca²⁺',[-.36,-.76,.94],'left',2);
  anchor('mitochondria','Mitocondria',proximalMito ? [2.18,-3.62,.2] : [1.11,-1.25,.69],'right',3);
  anchor('spine','Espina dendrítica',[-.32,-2.40,.15],'left',2);
  anchor('ros','ROS',proximalMito ? [2.75,-3.76,.26] : [1.14,-1.67,.78],'right',1);
  anchor('caspases','Caspasa-3 local',[-.4,-1.82,.4],'left',1);
  return {root,texture,spineSurfaces,postZone,membranes,selectable,receptors,receptorMaterials,vesicles,vesicleSeeds,cargo,mito,caspases,casMat,labelAnchors,nmdaChannels:[nmda1.position.clone(),nmda2.position.clone()]};
}
