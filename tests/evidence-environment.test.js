import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { evidenceMechanisms, getEvidenceMechanism } from '../src/mechanisms/evidence.js';
import { createControlEnvironment,createIronEnvironment,createThreeNPEnvironment,createQuinEnvironment } from '../src/scene/evidence-environment.js';
import { createBilayer } from '../src/scene/mitochondrial-environment.js';
import { createMechanismSession } from '../src/core/mechanism-session.js';

const texture=new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1);
const models=new Map([
  ['e-control',createControlEnvironment({texture})],['e-feso4',createIronEnvironment({texture})],
  ['e-3np',createThreeNPEnvironment({texture})],['e-quin',createQuinEnvironment({texture})],
]);
const update=(id,step,time=0,extra={})=>{const model=models.get(id);model.update({stepIndex:step,state:evidenceMechanisms[id].steps[step].state,time,elapsed:5,...extra});return model;};
function snapshot(model) {
  const snapshot=[];
  model.root.traverse(o=>{snapshot.push(o.name,o.visible,o.position.toArray(),o.quaternion.toArray(),o.scale.toArray());
    if(o.geometry)snapshot.push(o.geometry.attributes.position.array.slice());
    if(o.isInstancedMesh)snapshot.push(o.count,o.instanceMatrix.array.slice());
  });return snapshot;
}
function poolSample(pool,index) {
  const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),scale=new THREE.Vector3();
  pool.getMatrixAt(index,matrix);position.setFromMatrixPosition(matrix);scale.setFromMatrixScale(matrix);return {position,size:scale.x};
}

test('four evidence definitions provide separate complete sessions, content and resolvable cameras',()=>{
  assert.deepEqual(Object.keys(evidenceMechanisms),['e-control','e-feso4','e-3np','e-quin']);
  assert.throws(()=>getEvidenceMechanism('unknown'),RangeError);
  for(const [id,model] of models) {
    const definition=getEvidenceMechanism(id),keys=Object.keys(definition.initialState).sort();
    assert.equal(definition.evidence,true);assert.equal(definition.isolatedContext,true);
    for(const [index,step] of definition.steps.entries()) {
      assert.ok(definition.cameraPoses[step.camera]);assert.ok(step.duration>0);
      assert.deepEqual(Object.keys(step.state).sort(),keys);assert.ok(Object.values(step.state).every(Number.isFinite));
      for(const key of step.labels)assert.ok(definition.content[key]?.text,`${id}/${key} needs content`);
      for(const key of model.visibleKeys(index))assert.ok(definition.content[key]?.text,`${id}/${key} must remain selectable with content`);
    }
    const session=createMechanismSession(definition,model);session.seek(definition.steps.length-1);session.render();
    session.timeline.play();session.advance(.4);session.timeline.pause();const time=session.time;
    session.advance(30);assert.equal(session.time,time,'a paused evidence session must not advance');
  }
});

test('evidence geometry remains finite with indexed surfaces and bounded object budgets',()=>{
  for(const [id,model] of models) {
    update(id,evidenceMechanisms[id].steps.length-1,9);
    let objects=0,triangles=0;
    model.root.traverse(o=>{
      objects++;if(!o.geometry)return;
      for(const [key,attribute] of Object.entries(o.geometry.attributes))assert.ok(attribute.array.every(Number.isFinite),`${id}/${o.name}/${key}`);
      const count=o.geometry.attributes.position.count;
      assert.ok(!o.geometry.index||o.geometry.index.array.every(value=>value>=0&&value<count));
      if(o.visible)triangles+=(o.geometry.index?.count??count)/3*(o.isInstancedMesh?o.count:1);
    });
    assert.ok(objects<150,`${id}: ${objects} objects`);assert.ok(triangles<380000,`${id}: ${triangles} triangles`);
  }
});

test('exported bilayer preserves D default receptor openings and permits closed evidence specimens',()=>{
  const normal=createBilayer(texture),explicit=createBilayer(texture,{holes:[new THREE.Vector3(-.65,2.2,.10),new THREE.Vector3(2.39,2.3,-.06)]});
  const closed=createBilayer(texture,{holes:[]});
  normal.update(0);explicit.update(0);closed.update(0);
  assert.deepEqual(normal.group.children[0].geometry.index.array,explicit.group.children[0].geometry.index.array);
  assert.deepEqual(normal.heads.instanceMatrix.array,explicit.heads.instanceMatrix.array);
  assert.ok(closed.group.children[0].geometry.index.count>normal.group.children[0].geometry.index.count);
  const ray=new THREE.Raycaster(new THREE.Vector3(-.65,4,.10),new THREE.Vector3(0,-1,0));
  assert.equal(ray.intersectObject(normal.group.children[0]).length,0);
  assert.ok(ray.intersectObject(closed.group.children[0]).length>0,'a membrane without receptors cannot retain empty receptor holes');
});

test('Fe Fenton reactants yield distinct products and hydroxyl remains local',()=>{
  const model=update('e-feso4',0),pools=Object.fromEntries(['fe2','h2o2','fe3','hydroxide','hydroxyl'].map(key=>[key,model.root.getObjectByName(`particles:${key}`)]));
  assert.ok(Object.values(pools).every(pool=>pool.count===0));
  update('e-feso4',1,2);assert.ok(pools.fe2.count>0&&pools.h2o2.count>0);assert.equal(pools.hydroxyl.count,0);
  update('e-feso4',2,17,{elapsed:0});
  assert.ok(Array.from({length:pools.hydroxyl.count},(_,i)=>poolSample(pools.hydroxyl,i)).some(sample=>sample.size>.001),'seeking the reaction stage exposes the radical it explains');
  let events=0;
  for(let time=0;time<8;time+=.1) {
    update('e-feso4',2,time,{elapsed:time});
    for(let i=0;i<3;i++) {
      const fe2=poolSample(pools.fe2,i),fe3=poolSample(pools.fe3,i),oh=poolSample(pools.hydroxyl,i);
      assert.notEqual(fe2.size>.001,fe3.size>.001,'one illustrated iron centre cannot be Fe(II) and Fe(III) simultaneously');
      if(oh.size>.001) {
        assert.ok(fe3.size>.001&&poolSample(pools.hydroxide,i).size>.001);
        assert.ok(oh.position.distanceTo(new THREE.Vector3(...model.diagnostics().reactionSites[i]))<.16);events++;
      }
    }
  }
  assert.ok(events>15);update('e-feso4',3,8);
  const d=model.diagnostics().membrane;
  assert.ok(d.changedLipids>15&&d.changedLipids<d.totalLipids*.22);
  assert.ok(d.maximumDisplacement<.14,'oxidation cannot destroy the whole bilayer');
});

test('3-NP acts at matrix-facing SDH and suppresses its electron route without a proton pump',()=>{
  const model=update('e-3np',1,4),d=model.diagnostics();
  const anchor=new THREE.Vector3(...d.sdhAnchor),site=new THREE.Vector3(...d.activeSite),direction=new THREE.Vector3(...d.matrixDirection);
  assert.ok(site.clone().sub(anchor).normalize().dot(direction)>.999);
  assert.ok(Math.hypot(site.y-.05,site.z)<Math.hypot(anchor.y-.05,anchor.z),'catalytic domain points into matrix');
  assert.equal(d.protonPumpAtComplexII,false);assert.ok(d.particles.electronFlow>0);
  const succinate=model.root.getObjectByName('particles:succinate'),fumarate=model.root.getObjectByName('particles:fumarate');
  for(let i=0;i<succinate.count;i++)assert.notEqual(poolSample(succinate,i).size>.001,poolSample(fumarate,i).size>.001,'paired substrate and product occupy successive phases');
  update('e-3np',3,12);assert.equal(model.diagnostics().flux,0);assert.equal(model.diagnostics().particles.electronFlow,0);
  assert.equal(model.diagnostics().particles.succinate,0);assert.ok(model.diagnostics().particles.threeNP>0);
  assert.ok(!model.selectable.some(o=>['ros','calcium','caspases'].includes(o.userData.key)),'no unmeasured ROS burst or apoptosis is added');
});

test('QUIN remains extracellular, calcium is conditional and apoptosis machinery stays absent from the view',()=>{
  const model=update('e-quin',0,3),quin=model.root.getObjectByName('particles:quin');
  for(const step of [0,1]) {
    update('e-quin',step,3);assert.equal(model.diagnostics().calcium,0);
    for(const object of model.selectable.filter(o=>o.userData.key==='calcium'))assert.equal(object.visible,false);
  }
  for(let stage=0;stage<5;stage++)for(let time=0;time<7;time+=.7) {
    update('e-quin',stage,time);
    for(let i=0;i<quin.count;i++)assert.ok(poolSample(quin,i).position.y>.1,'QUIN never follows ions through the membrane');
    const d=model.diagnostics().base;
    assert.equal(d.caspasesVisible,false);assert.equal(d.cytochromeCount,0);assert.equal(d.intrinsicVisible,false);assert.equal(d.headRadialScale,1);
    assert.ok(!model.visibleKeys(stage).some(key=>['caspases','executioners','cytochrome','apaf1'].includes(key)));
  }
  update('e-quin',2,5);assert.ok(model.diagnostics().calcium>0);assert.equal(model.diagnostics().stress,0);
  update('e-quin',3,5);assert.ok(model.diagnostics().stress>0);
});

test('age and assay never alter specimens; revisits, pause and selection preserve biological geometry',()=>{
  for(const [id,model] of models) {
    const last=evidenceMechanisms[id].steps.length-1;
    update(id,last,7.25);const expected=snapshot(model),diagnostic=model.diagnostics();
    for(const age of ['PN3','PN5','PN9','PN12','PN30'])for(const assay of ['DCFDA','TBARS','MTT']) {
      update(id,last,7.25,{age,assay,selected:model.visibleKeys(last)[0]});
      assert.deepEqual(snapshot(model),expected,`${id}: age/assay/selection cannot move molecules`);
      assert.deepEqual(model.diagnostics(),diagnostic);
    }
    update(id,0);update(id,last,7.25);assert.deepEqual(snapshot(model),expected,'revisiting does not accumulate transforms');
    let before=0;model.root.traverse(()=>before++);
    for(let i=0;i<3;i++)for(let step=0;step<=last;step++)update(id,step,i+step);
    let after=0;model.root.traverse(()=>after++);assert.equal(after,before,'updates cannot allocate scene objects');
  }
});
