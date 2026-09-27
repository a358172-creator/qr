export function createLabels(layer, anchors, camera, canvas) {
  let enabled=true, selected=null, hovered=null, width=0, height=0;
  const nodes=anchors.map(anchor=>{
    const el=document.createElement('div');el.className='scene-label';el.dataset.side=anchor.side;el.dataset.key=anchor.key;
    const text=document.createElement('span');text.textContent=anchor.name;el.append(text,document.createElement('i'));layer.append(el);
    return {...anchor,el,screen:anchor.position.clone(),width:0};
  });
  function resize(w,h){width=w;height=h;nodes.forEach(n=>n.width=n.el.offsetWidth);}
  function update(state,panelOpen){
    const mobile=width<760, occupied=[];
    const ordered=[...nodes].sort((a,b)=>(b.key===selected?10:b.priority)-(a.key===selected?10:a.priority));
    for(const n of ordered){
      let show=enabled||n.key===hovered||n.key===selected;
      if(n.key==='ros'&&state.stress<.12&&selected!=='ros')show=false;
      if(n.key==='caspases'&&state.damage<.1&&selected!=='caspases')show=false;
      if(mobile&&['vesicles','terminal'].includes(n.key)&&selected!==n.key)show=false;
      n.screen.copy(n.position).project(camera);
      const px=(n.screen.x*.5+.5)*width,py=(-n.screen.y*.5+.5)*height;
      let x=px+(n.side==='left'?-n.width-8:8),y=py-13;
      // Hide rather than pile up labels when the camera is close or the info
      // sheet covers the specimen. Leaders therefore retain their true anchor.
      const box={x,y,w:n.width,h:27};
      if(n.screen.z>1||n.screen.z< -1||x<10||x+n.width>width-10||y<20||y>height-60)show=false;
      if(x<(mobile?175:240)&&y<(mobile?124:205))show=false;
      if(panelOpen&&(mobile?y+27>height-285:x+n.width>width-350&&y+27>height-355))show=false;
      if(occupied.some(b=>box.x<b.x+b.w+10&&box.x+box.w+10>b.x&&box.y<b.y+b.h+8&&box.y+box.h+8>b.y))show=false;
      if(show)occupied.push(box);
      n.el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      n.el.style.opacity=show?'1':'0';n.el.classList.toggle('selected',n.key===selected||n.key===hovered);
    }
  }
  return {resize,update,setEnabled:v=>enabled=v,setSelected:v=>selected=v,setHovered:v=>hovered=v,dispose:()=>layer.replaceChildren()};
}
