
const mosaic=document.getElementById('mosaic');
const stage=document.getElementById('stage');
const box=document.getElementById('lightbox');
const large=document.getElementById('large');
const caption=document.getElementById('caption');
let tiles=[],cursor=0,current=0;

function tileCount(){
  return Math.min(48,Math.max(30,Math.floor(stage.clientWidth/22)));
}
function point(i,n){
  // Gerono lemniscate (infinity): x=cos(t), y=sin(t)cos(t)
  const t=(Math.PI*2*i/n)-Math.PI/2;
  const w=stage.clientWidth,h=stage.clientHeight;
  const sx=Math.min(w*.43,520), sy=Math.min(h*.34,215);
  return [w/2+Math.cos(t)*sx,h/2+Math.sin(t)*Math.cos(t)*sy];
}
function showOnTile(tile,idx){
  idx=((idx%PHOTOS.length)+PHOTOS.length)%PHOTOS.length;
  const p=PHOTOS[idx];
  tile.dataset.idx=idx;
  const im=tile.querySelector('img');
  im.src=p.file; im.alt=p.original; im.loading='eager';
}
function build(){
  mosaic.innerHTML=''; tiles=[];
  const n=tileCount();
  for(let i=0;i<n;i++){
    const b=document.createElement('button');
    b.className='tile'; b.type='button';
    b.innerHTML='<img>';
    showOnTile(b,i);
    b.addEventListener('click',()=>openPhoto(+b.dataset.idx));
    mosaic.appendChild(b); tiles.push(b);
  }
  cursor=n; layout();
}
function layout(){
  const n=tiles.length;
  tiles.forEach((b,i)=>{
    const [x,y]=point(i,n);
    b.style.left=x+'px';b.style.top=y+'px';
    b.style.transform='translate(-50%,-50%) rotate('+(Math.sin(i)*3)+'deg)';
    b.style.zIndex=String(5+Math.round(Math.abs(Math.sin(i/n*Math.PI*2))*5));
  });
}
function rotatePhotos(){
  // Replace multiple positions each pass; cursor advances through ALL originals in order.
  const count=Math.max(2,Math.floor(tiles.length/9));
  for(let j=0;j<count;j++){
    const b=tiles[(cursor+j*11)%tiles.length];
    b.classList.add('fade');
    setTimeout(()=>{showOnTile(b,cursor++);b.classList.remove('fade')},320+j*70);
  }
}
function openPhoto(idx){
 current=idx; const p=PHOTOS[current]; large.src=p.file;large.alt=p.original;
 caption.textContent=(current+1)+' / '+PHOTOS.length+' • '+p.original;
 box.classList.add('open');box.setAttribute('aria-hidden','false');
}
function closePhoto(){box.classList.remove('open');box.setAttribute('aria-hidden','true')}
function step(d){openPhoto((current+d+PHOTOS.length)%PHOTOS.length)}
document.getElementById('close').onclick=closePhoto;
document.getElementById('prev').onclick=()=>step(-1);
document.getElementById('next').onclick=()=>step(1);
box.addEventListener('click',e=>{if(e.target===box)closePhoto()});
addEventListener('keydown',e=>{
 if(e.key==='Escape')closePhoto();
 if(box.classList.contains('open')&&e.key==='ArrowLeft')step(-1);
 if(box.classList.contains('open')&&e.key==='ArrowRight')step(1);
});
let rt;
addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{build()},180)});
build();
setInterval(rotatePhotos,1900);
