(()=>{
'use strict';
const KEY='warung-harga-v1',$=s=>document.querySelector(s);
const uid=()=>Math.random().toString(36).slice(2,9);
const nf=new Intl.NumberFormat('id-ID');
const rp=n=>'Rp\u00a0'+nf.format(n||0);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const mk=(n,l)=>({id:uid(),name:n,items:l||[]});
const it=(n,p,u)=>({id:uid(),name:n,price:p,unit:u||'pcs'});
const sample=()=>[
 {id:uid(),name:'Minuman Sachet',subs:[
  mk('Kopi',[it('Kapal Api Mix',2000,'sachet'),it('ABC Susu',2000,'sachet'),it('Good Day Cappuccino',2500,'sachet')]),
  mk('Susu',[it('Bendera Coklat',1500,'sachet'),it('Indomilk Putih',1500,'sachet')]),
  mk('Rasa Lain',[it('Extra Joss',2000,'sachet'),it('Nutrisari Jeruk',1500,'sachet')])]},
 {id:uid(),name:'Sembako',subs:[mk('Minyak & Beras',[it('Minyak Goreng 1L',18000,'botol'),it('Beras Premium 5kg',72000,'karung')])]}
];
let data,open=new Set(),q='',sort='az',undo=null,tt,st,dt,onDel=null;
try{data=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!Array.isArray(data))data=sample();
const save=()=>{clearTimeout(st);st=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}},150)};
const snap=()=>{undo=JSON.stringify(data)};
const fG=id=>data.find(g=>g.id===id),fS=(g,id)=>g.subs.find(s=>s.id===id);

const byName=(a,b)=>a.name.localeCompare(b.name,'id');
const S=()=>sort==='lo'?(a,b)=>a.price-b.price||byName(a,b):sort==='hi'?(a,b)=>b.price-a.price||byName(a,b):byName;
function hl(t,toks){let s=esc(t);if(!toks.length)return s;return s.replace(new RegExp('('+toks.map(x=>rx(esc(x))).join('|')+')','gi'),'<mark>$1</mark>')}
const row=(i,g,s,toks,path)=>`<li><button class="it" data-a="editI" data-g="${g.id}" data-s="${s.id}" data-i="${i.id}"><span class="nm">${hl(i.name,toks)}<small>${path?hl(g.name,toks)+' › '+hl(s.name,toks)+' · ':''}per ${hl(i.unit||'pcs',toks)}</small></span><span class="tag">${rp(i.price)}</span></button></li>`;

function render(){
 const toks=q.toLowerCase().split(/\s+/).filter(Boolean),out=$('#out');
 let n=0;data.forEach(g=>g.subs.forEach(s=>n+=s.items.length));
 $('#stats').textContent=n+' barang di '+data.length+' kelompok';
 $('#tall').hidden=!!toks.length||!data.length;
 if(toks.length){
  const r=[];
  data.forEach(g=>g.subs.forEach(s=>s.items.forEach(i=>{
   const h=(g.name+' '+s.name+' '+i.name+' '+(i.unit||'')).toLowerCase();
   if(toks.every(t=>h.includes(t)))r.push({g,s,i});
  })));
  const f=S(),p=x=>x.i.name.toLowerCase().startsWith(toks[0])?0:1;
  r.sort((a,b)=>p(a)-p(b)||f(a.i,b.i));
  out.innerHTML=r.length?`<p class="rc">${r.length} hasil</p><div class="res"><ul class="items">${r.map(x=>row(x.i,x.g,x.s,toks,1)).join('')}</ul></div>`
   :`<div class="empty"><b>Tidak ketemu</b>Tidak ada barang bernama “${esc(q)}”. Tekan + Barang untuk menambahkannya.</div>`;
  return;
 }
 if(!data.length){out.innerHTML='<div class="empty"><b>Belum ada catatan</b>Tekan + Barang untuk menambah barang pertama.</div>';return}
 const f=S();
 out.innerHTML=data.map(g=>{
  const c=g.subs.reduce((a,s)=>a+s.items.length,0);
  return `<details class="grp" data-k="${g.id}"${open.has(g.id)?' open':''}><summary><i class="chev"></i><span class="nm1">${esc(g.name)} <span class="cnt">${c}</span></span><span class="tools"><button data-a="addS" data-g="${g.id}">+ Golongan</button><button data-a="editG" data-g="${g.id}" aria-label="Ubah kelompok">Ubah</button></span></summary>
  ${g.subs.length?g.subs.map(s=>`<details class="sub" data-k="${s.id}"${open.has(s.id)?' open':''}><summary><i class="chev"></i><span class="nm1">${esc(s.name)} <span class="cnt">${s.items.length}</span></span><span class="tools"><button data-a="addI" data-g="${g.id}" data-s="${s.id}">+ Barang</button><button data-a="editS" data-g="${g.id}" data-s="${s.id}" aria-label="Ubah golongan">Ubah</button></span></summary>
  ${s.items.length?`<ul class="items">${s.items.slice().sort(f).map(i=>row(i,g,s,[],0)).join('')}</ul>`:'<p class="none">Belum ada barang.</p>'}</details>`).join(''):'<p class="none" style="margin-left:28px">Belum ada golongan.</p>'}</details>`;
 }).join('');
}

/* dialog */
const dlg=$('#dlg');
const fld=(l,n,v,x)=>`<label>${l}<input name="${n}" value="${esc(v)}" autocomplete="off" ${x||''}></label>`;
function show(html,submit){
 dlg.innerHTML='<form>'+html+'</form>';
 const f=dlg.firstChild;f.onsubmit=e=>{e.preventDefault();submit(Object.fromEntries(new FormData(f)))};
 if(!dlg.open)dlg.showModal();
 const i=f.querySelector('input');if(i&&!i.value)i.focus();
}
const btns=del=>`<div class="acts">${del?'<button type="button" class="danger" data-a="del">Hapus</button>':''}<span></span><button type="button" data-a="close">Batal</button><button class="pri">Simpan</button></div>`;
function getOrMake(arr,name,make){const k=name.trim().toLowerCase();let x=arr.find(a=>a.name.toLowerCase()===k);if(!x){x=make(name.trim());arr.push(x)}return x}
function subList(gn){const g=data.find(x=>x.name.toLowerCase()===gn.trim().toLowerCase());return (g?g.subs:data.flatMap(x=>x.subs)).map(s=>`<option value="${esc(s.name)}">`).join('')}

function itemForm(g,s,i){
 show(`<h2>${i?'Ubah barang':'Tambah barang'}</h2>
 ${fld('Kelompok','g',g?g.name:'','list="dl-g" required placeholder="mis. Minuman Sachet"')}
 ${fld('Golongan','s',s?s.name:'','list="dl-s" required placeholder="mis. Kopi"')}
 ${fld('Nama barang','n',i?i.name:'','required placeholder="mis. Kapal Api Mix"')}
 <div class="two">${fld('Harga (Rp)','p',i?i.price:'','type="number" inputmode="numeric" min="0" required')}${fld('Satuan','u',i?i.unit:'pcs')}</div>
 <datalist id="dl-g">${data.map(x=>`<option value="${esc(x.name)}">`).join('')}</datalist><datalist id="dl-s">${subList(g?g.name:'')}</datalist>${btns(i)}`,
 o=>{
  snap();
  const G=getOrMake(data,o.g,n=>({id:uid(),name:n,subs:[]})),Sb=getOrMake(G.subs,o.s,n=>mk(n));
  if(i)s.items.splice(s.items.indexOf(i),1);
  const x=i||{id:uid()};Object.assign(x,{name:o.n.trim(),price:+o.p||0,unit:o.u.trim()||'pcs'});
  Sb.items.push(x);open.add(G.id);open.add(Sb.id);
  save();dlg.close();render();toast('Tersimpan',1);
 });
 onDel=i?()=>{snap();s.items.splice(s.items.indexOf(i),1);save();dlg.close();render();toast('Barang dihapus',1)}:null;
}
function nameForm(title,val,ok,del){
 show(`<h2>${esc(title)}</h2>${fld('Nama','n',val,'required')}${btns(!!del)}`,o=>{snap();ok(o.n.trim());save();dlg.close();render();toast('Tersimpan',1)});
 onDel=del?()=>{snap();del();save();dlg.close();render();toast('Dihapus',1)}:null;
}
dlg.addEventListener('input',e=>{if(e.target.name==='g'){const d=$('#dl-s');if(d)d.innerHTML=subList(e.target.value)}});

function toast(m,u){
 $('#tmsg').textContent=m;$('#tundo').hidden=!u;$('#toast').hidden=false;
 clearTimeout(tt);tt=setTimeout(()=>$('#toast').hidden=true,5000);
}

const A={
 sort(t){sort=t.dataset.v;document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-pressed',b===t));render()},
 toggleAll(){const ids=[];data.forEach(g=>{ids.push(g.id);g.subs.forEach(s=>ids.push(s.id))});const all=ids.every(i=>open.has(i));open=new Set(all?[]:ids);$('#tall').textContent=all?'Buka semua':'Tutup semua';render()},
 addG(){nameForm('Kelompok baru','',n=>{const g={id:uid(),name:n,subs:[]};data.push(g);open.add(g.id)})},
 editG(t){const g=fG(t.dataset.g);nameForm('Ubah kelompok',g.name,n=>g.name=n,()=>data.splice(data.indexOf(g),1))},
 addS(t){const g=fG(t.dataset.g);nameForm('Golongan baru di '+g.name,'',n=>{const s=mk(n);g.subs.push(s);open.add(g.id);open.add(s.id)})},
 editS(t){const g=fG(t.dataset.g),s=fS(g,t.dataset.s);nameForm('Ubah golongan',s.name,n=>s.name=n,()=>g.subs.splice(g.subs.indexOf(s),1))},
 addI(t){const g=t.dataset.g?fG(t.dataset.g):null;itemForm(g,g&&t.dataset.s?fS(g,t.dataset.s):null,null)},
 editI(t){const g=fG(t.dataset.g),s=fS(g,t.dataset.s);itemForm(g,s,s.items.find(x=>x.id===t.dataset.i))},
 close(){dlg.close()},
 del(){onDel&&onDel()},
 undo(){if(!undo)return;data=JSON.parse(undo);undo=null;save();render();$('#toast').hidden=true},
 theme(){const d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;try{localStorage.setItem('warung-theme',n)}catch(e){}},
 export(){
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:'application/json'}));
  a.download='harga-warung-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('File backup diunduh');
 },
 import(){$('#file').click()}
};
$('#file').addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;
 f.text().then(t=>{
  const d=JSON.parse(t);
  if(!Array.isArray(d)||d.some(g=>!g||!Array.isArray(g.subs)))throw 0;
  snap();data=d;save();render();toast('Data berhasil diimpor',1);
 }).catch(()=>toast('File tidak valid')).finally(()=>{e.target.value=''});
});
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t||!A[t.dataset.a])return;
 if(t.closest('summary'))e.preventDefault();
 A[t.dataset.a](t);
});
document.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.k){d.open?open.add(d.dataset.k):open.delete(d.dataset.k)}},true);
$('#q').addEventListener('input',e=>{clearTimeout(dt);dt=setTimeout(()=>{q=e.target.value.trim();render()},60)});
document.addEventListener('keydown',e=>{
 if(e.key==='/'&&e.target.tagName!=='INPUT'){e.preventDefault();$('#q').focus()}
 if(e.key==='Escape'&&e.target.id==='q'){e.target.value='';q='';render()}
});
render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
   
