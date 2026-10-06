import * as THREE from 'three';
import { v3, physical } from './geometry.js';

export function createParticles(root, channels, receptors) {
  const transform = new THREE.Object3D(), position = new THREE.Vector3();
  const geometry = new THREE.SphereGeometry(1, 12, 9);
  const make = (count,color,key,emission) => {
    const mat=physical(color,{roughness:.35,emissive:color,emissiveIntensity:emission});
    const mesh=new THREE.InstancedMesh(geometry,mat,count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled=false;mesh.userData.key=key;root.add(mesh);return mesh;
  };
  const glutamate=make(36,0xe7ae68,'glutamate',.18);
  const calcium=make(28,0xe27d72,'calcium',.24);
  const ros=make(18,0xc7739b,'ros',.20);
  const sodium=make(9,0x94cfc1,'ampa',.08);
  const glutPaths = Array.from({length:36},(_,i)=>{
    const target=receptors[i%receptors.length].group.position;
    const x=-.72+(i%5)*.35,z=.14+(i%3)*.19;
    return new THREE.CubicBezierCurve3(v3(x,1.13,z),v3(x+Math.sin(i*2.4)*.28,.77,z+.10),v3(target.x+Math.sin(i)*.2,.57,target.z+.12),v3(target.x,.23,target.z));
  });
  // Before crossing the membrane, every calcium path stays on its NMDA pore
  // axis. Only below the membrane do ions spread into the cytosol.
  const caPaths = Array.from({length:28},(_,i)=>{
    const c=channels[i%channels.length];
    return new THREE.CubicBezierCurve3(v3(c.x,c.y-.2,c.z),v3(c.x,c.y-.48,c.z),v3(c.x-.25+Math.sin(i)*.15,-.95,.7),v3(-.20+Math.sin(i*2.4)*.63,-1.36-Math.cos(i)*.17,.5+Math.sin(i)*.23));
  });
  const set=(mesh,index,p,size)=>{transform.position.copy(p);transform.scale.setScalar(Math.max(.00001,size));transform.updateMatrix();mesh.setMatrixAt(index,transform.matrix);};
  const fade=(q)=>Math.min(1,q*13,(1-q)*13);
  function update(t, state, selected){
    const { glut, ca, stress, activation }=state;
    for(let i=0;i<36;i++){
      const q=(t*.19+i*.618033)%1;
      glutPaths[i].getPoint(q,position);
      const weight=THREE.MathUtils.clamp(15+glut*21-i,0,1);
      set(glutamate,i,position,(.037+(i%3)*.006)*fade(q)*weight);
    }
    for(let i=0;i<28;i++){
      // Concentration controls visible ion density, not the phase of ions
      // already in flight. A shared clock keeps pause and seeking reversible.
      const q=(t*.21+i*.618033)%1,c=channels[i%channels.length];
      if(q<.35)position.set(c.x,c.y+.49-q/.35*.69,c.z);
      else caPaths[i].getPoint((q-.35)/.65,position);
      const weight=THREE.MathUtils.clamp(3+ca*25-i,0,1);
      set(calcium,i,position,(.030+(i%2)*.006)*fade(q)*weight);
    }
    for(let i=0;i<18;i++){
      const phase=t*.50+i*2.39996;
      position.set(.31+Math.sin(phase)*(.70+(i%3)*.10),-1.14+Math.cos(phase*.9+i)*.45,.47+Math.sin(i*1.7+phase)*.28);
      const weight=THREE.MathUtils.clamp(stress*19-i,0,1);
      set(ros,i,position,(.015+.014*(.5+.5*Math.sin(t*1.6+i)))*weight);
    }
    const a=receptors.find(r=>r.kind==='ampa').group.position;
    for(let i=0;i<9;i++){
      const q=(t*.24+i*.618033)%1;
      position.set(a.x+(q>.6?Math.sin(i)*.12*(q-.6):0),a.y+.39-q*.97,a.z);
      set(sodium,i,position,.022*fade(q)*THREE.MathUtils.clamp(3+activation*6-i,0,1));
    }
    for(const mesh of [glutamate,calcium,ros,sodium]){
      mesh.instanceMatrix.needsUpdate=true;
      // Raycasting caches this sphere; moving instances must refresh it even
      // though frustum culling is disabled for the small molecular clouds.
      mesh.computeBoundingSphere();
    }
    for(const mesh of [glutamate,calcium,ros]){
      mesh.material.emissiveIntensity=mesh.userData.key===selected?.38:.18;
    }
    ros.visible=stress>.015;
  }
  return {glutamate,calcium,ros,sodium,update,selectable:[glutamate,calcium,ros,sodium]};
}
