/* Ruhiy Maydon: Koinot + Catharsis + Audio + Nafas */

/* === 1. KOINOT CANVAS === */
(function(){
  var cv,ct,W,H,stars=[],neb=[],plan=[];
  function resize(){
    cv=document.getElementById('cosmos-canvas');
    if(!cv)return;
    ct=cv.getContext('2d');
    var w=cv.parentElement;
    W=cv.width=w?w.offsetWidth:800;
    H=cv.height=260;
    build();
  }
  function build(){
    stars=[];neb=[];plan=[];
    for(var i=0;i<200;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.2,a:Math.random()*.8+.2,da:(Math.random()-.5)*.008,sp:Math.random()*.15+.05});
    for(var i=0;i<5;i++)neb.push({x:Math.random()*W,y:Math.random()*H,r:60+Math.random()*120,h:Math.floor(Math.random()*360),a:.03+Math.random()*.05});
    var c=['#7c3aed','#3b82f6','#10b981','#f59e0b'];
    for(var i=0;i<3;i++)plan.push({x:Math.random()*W*.8+W*.1,y:Math.random()*H*.6+H*.2,r:4+Math.random()*10,c:c[Math.floor(Math.random()*4)],vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.1});
  }
  function frame(){
    if(!ct)return;
    requestAnimationFrame(frame);
    ct.clearRect(0,0,W,H);
    var bg=ct.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,'#020510');bg.addColorStop(.5,'#050a1a');bg.addColorStop(1,'#02060f');
    ct.fillStyle=bg;ct.fillRect(0,0,W,H);
    neb.forEach(function(n){var g=ct.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);g.addColorStop(0,'hsla('+n.h+',80%,50%,'+n.a+')');g.addColorStop(1,'transparent');ct.beginPath();ct.arc(n.x,n.y,n.r,0,Math.PI*2);ct.fillStyle=g;ct.fill();});
    stars.forEach(function(s){s.a+=s.da;if(s.a>1||s.a<.1)s.da*=-1;s.x-=s.sp;if(s.x<0){s.x=W;s.y=Math.random()*H;}ct.beginPath();ct.arc(s.x,s.y,s.r,0,Math.PI*2);ct.fillStyle='rgba(255,255,255,'+s.a+')';ct.fill();});
    plan.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<-p.r)p.x=W+p.r;if(p.x>W+p.r)p.x=-p.r;if(p.y<-p.r)p.y=H+p.r;if(p.y>H+p.r)p.y=-p.r;var g=ct.createRadialGradient(p.x-p.r*.3,p.y-p.r*.3,0,p.x,p.y,p.r*2);g.addColorStop(0,p.c+'aa');g.addColorStop(1,'transparent');ct.beginPath();ct.arc(p.x,p.y,p.r*2,0,Math.PI*2);ct.fillStyle=g;ct.fill();ct.beginPath();ct.arc(p.x,p.y,p.r,0,Math.PI*2);ct.fillStyle=p.c;ct.fill();});
  }
  document.addEventListener('DOMContentLoaded',function(){resize();window.addEventListener('resize',resize);frame();});
})();

/* === 2. CATHARSIS === */
(function(){
  var cv,ct,W,H,pts=[],anim=false,raf=null;
  function init(){
    cv=document.getElementById('catharsis-canvas');
    if(!cv)return;
    ct=cv.getContext('2d');
    rs();stars();
    var btn=document.getElementById('catharsis-btn');
    if(btn)btn.addEventListener('click',release);
    var inp=document.getElementById('catharsis-input');
    if(inp)inp.addEventListener('input',function(){var e=document.getElementById('cat-chars');if(e)e.textContent=inp.value.length;});
    window.addEventListener('resize',function(){if(!anim){rs();stars();}});
  }
  function rs(){var p=cv.parentElement;W=cv.width=p?p.offsetWidth:600;H=cv.height=160;}
  function stars(){
    if(!ct)return;
    ct.clearRect(0,0,W,H);ct.fillStyle='#060a14';ct.fillRect(0,0,W,H);
    for(var i=0;i<100;i++){var x=Math.random()*W,y=Math.random()*H,r=Math.random()*1.1+.2;ct.beginPath();ct.arc(x,y,r,0,Math.PI*2);ct.fillStyle='rgba(255,255,255,'+(Math.random()*.5+.08)+')';ct.fill();}
  }
  function release(){
    var inp=document.getElementById('catharsis-input');
    var st=document.getElementById('catharsis-status');
    var hi=document.getElementById('catharsis-hint');
    var txt=inp?inp.value.trim():'';
    if(!txt){if(st){st.textContent='Avval biror narsa yozing...';st.style.color='#f59e0b';}return;}
    if(hi)hi.style.display='none';
    if(st){st.textContent='Koinosga yuborilmoqda...';st.style.color='#8b5cf6';}
    if(inp){inp.value='';var e=document.getElementById('cat-chars');if(e)e.textContent='0';}
    explode(txt);
    setTimeout(function(){if(st){st.textContent='Ular kosmosda erkin. Siz engillanasiz.';st.style.color='#10b981';}},1800);
    setTimeout(function(){if(st)st.textContent='';if(hi)hi.style.display='';},4500);
  }
  function explode(txt){
    rs();ct.clearRect(0,0,W,H);ct.fillStyle='#060a14';ct.fillRect(0,0,W,H);
    var mw=W*.88,fs=Math.max(11,Math.min(18,Math.floor(W/22)));
    ct.font='600 '+fs+'px Inter,sans-serif';ct.fillStyle='#fff';ct.textBaseline='middle';ct.textAlign='center';
    var words=txt.split(/\s+/),lines=[],line='';
    words.forEach(function(w){var t=line?line+' '+w:w;if(ct.measureText(t).width>mw&&line){lines.push(line);line=w;}else line=t;});
    if(line)lines.push(line);
    var lh=fs*1.5,sy=H/2-(lines.length-1)*lh/2;
    lines.forEach(function(l,i){ct.fillText(l,W/2,sy+i*lh);});
    var d=ct.getImageData(0,0,W,H).data;
    pts=[];
    for(var x=0;x<W;x+=3)for(var y=0;y<H;y+=3){var idx=(y*W+x)*4;if(d[idx+3]>80){var a=Math.random()*Math.PI*2,sp=5+Math.random()*9;pts.push({x:x,y:y,vx:Math.cos(a)*sp+(x-W/2)*.025,vy:Math.sin(a)*sp-1.5,r:Math.random()*2+.6,a:1,da:.008+Math.random()*.014,c:d[idx]+','+d[idx+1]+','+d[idx+2]});}}
    anim=true;if(raf)cancelAnimationFrame(raf);tick();
  }
  function tick(){
    if(!anim)return;
    raf=requestAnimationFrame(tick);
    ct.fillStyle='rgba(6,10,20,.16)';ct.fillRect(0,0,W,H);
    var alive=false;
    pts.forEach(function(p){if(p.a<=0)return;alive=true;p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy*=.97;p.a-=p.da;if(p.a<0)p.a=0;ct.beginPath();ct.arc(p.x,p.y,p.r,0,Math.PI*2);ct.fillStyle='rgba('+p.c+','+p.a+')';ct.fill();});
    if(!alive){anim=false;stars();}
  }
  document.addEventListener('DOMContentLoaded',init);
})();

/* === 3. AUDIO === */
(function(){
  var ac=null,mv=0.6,active={},vr={};
  function getAC(){if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();return ac;}
  function noise(vol){var c=getAC(),sz=c.sampleRate*3,buf=c.createBuffer(1,sz,c.sampleRate),d=buf.getChannelData(0);for(var i=0;i<sz;i++)d[i]=Math.random()*2-1;var s=c.createBufferSource();s.buffer=buf;s.loop=true;var g=c.createGain();g.gain.value=vol;s.connect(g);s.start();return{src:s,gain:g};}
  function build(id){
    var c=getAC(),mg=c.createGain();mg.gain.value=mv;mg.connect(c.destination);
    var vv=parseInt((document.getElementById('vol-'+id)||{value:70}).value)/100;
    var tg=c.createGain();tg.gain.value=vv;tg.connect(mg);
    var nd={};
    if(id==='rain'){var n=noise(.5),f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=3000;f.Q.value=.5;n.gain.disconnect();n.gain.connect(f);f.connect(tg);nd={src:n.src,gain:n.gain};}
    else if(id==='ocean'){var n=noise(.5),f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=500;var lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.12;lg.gain.value=300;lfo.connect(lg);lg.connect(f.frequency);lfo.start();n.gain.disconnect();n.gain.connect(f);f.connect(tg);nd={src:n.src,gain:n.gain,extra:[lfo]};}
    else if(id==='forest'){var n=noise(.3),f=c.createBiquadFilter();f.type='highpass';f.frequency.value=600;n.gain.disconnect();n.gain.connect(f);f.connect(tg);nd={src:n.src,gain:n.gain};}
    else if(id==='alpha'){var L=c.createOscillator(),R=c.createOscillator(),m=c.createChannelMerger(2),lg=c.createGain(),rg=c.createGain();L.type=R.type='sine';L.frequency.value=200;R.frequency.value=210;lg.gain.value=rg.gain.value=.3;L.connect(lg);lg.connect(m,0,0);R.connect(rg);rg.connect(m,0,1);m.connect(tg);L.start();R.start();nd={osc:[L,R]};}
    else if(id==='space'){var o1=c.createOscillator(),o2=c.createOscillator(),g1=c.createGain(),g2=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();o1.type=o2.type='sine';o1.frequency.value=55;o2.frequency.value=110;g1.gain.value=.2;g2.gain.value=.12;lfo.frequency.value=.04;lg.gain.value=.06;lfo.connect(lg);lg.connect(g1.gain);o1.connect(g1);g1.connect(tg);o2.connect(g2);g2.connect(tg);o1.start();o2.start();lfo.start();nd={osc:[o1,o2,lfo]};}
    else if(id==='white'){var n=noise(.4);n.gain.disconnect();n.gain.connect(tg);nd={src:n.src,gain:n.gain};}
    return{nd:nd,tg:tg,mg:mg};
  }
  function stopT(id){
    var t=active[id];if(!t)return;
    try{if(t.nd.src)t.nd.src.stop();}catch(e){}
    try{if(t.nd.osc)t.nd.osc.forEach(function(o){try{o.stop();}catch(e){}});}catch(e){}
    try{if(t.nd.extra)t.nd.extra.forEach(function(o){try{o.stop();}catch(e){}});}catch(e){}
    try{t.tg.disconnect();t.mg.disconnect();}catch(e){}
    delete active[id];stopViz(id);
  }
  function toggle(id){if(active[id]){stopT(id);btn(id,false);}else{active[id]=build(id);btn(id,true);viz(id);}}
  function btn(id,on){
    var b=document.getElementById('track-'+id+'-btn');if(!b)return;
    b.style.background=on?'linear-gradient(135deg,#10b981,#3b82f6)':'';
    b.style.color=on?'#fff':'';
    b.innerHTML=on?'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>':'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  }
  function viz(id){
    var c=document.getElementById('cv-'+id);if(!c)return;
    var cx=c.getContext('2d'),cw=c.width,ch=c.height,ph=0;
    var cols={rain:'#3b82f6',ocean:'#06b6d4',forest:'#10b981',alpha:'#8b5cf6',space:'#7c3aed',white:'#94a3b8'};
    var freq={rain:8,ocean:3,forest:6,alpha:12,space:2,white:15};
    function lp(){if(!active[id])return;vr[id]=requestAnimationFrame(lp);cx.clearRect(0,0,cw,ch);cx.fillStyle='rgba(10,14,26,.6)';cx.fillRect(0,0,cw,ch);ph+=(freq[id]||6)*.04;cx.beginPath();for(var x=0;x<cw;x++){var t=(x/cw)*Math.PI*3+ph,a=ch*.35,y=ch/2+a*Math.sin(t)*Math.cos(t*.4);x===0?cx.moveTo(x,y):cx.lineTo(x,y);}cx.strokeStyle=cols[id]||'#10b981';cx.lineWidth=1.8;cx.globalAlpha=.85;cx.stroke();cx.globalAlpha=1;}
    lp();
  }
  function stopViz(id){if(vr[id])cancelAnimationFrame(vr[id]);var c=document.getElementById('cv-'+id);if(!c)return;var cx=c.getContext('2d');cx.clearRect(0,0,c.width,c.height);cx.fillStyle='rgba(10,14,26,.6)';cx.fillRect(0,0,c.width,c.height);}
  document.addEventListener('DOMContentLoaded',function(){
    ['rain','ocean','forest','alpha','space','white'].forEach(function(id){
      var b=document.getElementById('track-'+id+'-btn');if(b)b.addEventListener('click',function(){toggle(id);});
      var v=document.getElementById('vol-'+id);if(v)v.addEventListener('input',function(e){if(active[id])active[id].tg.gain.value=e.target.value/100;});
      setTimeout(function(){var c=document.getElementById('cv-'+id);if(c){var cx=c.getContext('2d');cx.fillStyle='rgba(10,14,26,.6)';cx.fillRect(0,0,c.width,c.height);}},300);
    });
    var ms=document.getElementById('audio-master-vol'),mv2=document.getElementById('audio-vol-val');
    if(ms)ms.addEventListener('input',function(e){mv=e.target.value/100;if(mv2)mv2.textContent=e.target.value+'%';Object.values(active).forEach(function(t){if(t.mg)t.mg.gain.value=mv;});});
  });
})();

/* === 4. NAFAS === */
(function(){
  var PAT={
    '478':[{l:'Nafas oling',d:4000,c:'#10b981',ex:true},{l:'Ushlab turing',d:7000,c:'#06b6d4',ex:true},{l:'Nafas chiqaring',d:8000,c:'#3b82f6',ex:false}],
    'box':[{l:'Nafas oling',d:4000,c:'#10b981',ex:true},{l:'Ushlab turing',d:4000,c:'#06b6d4',ex:true},{l:'Nafas chiqaring',d:4000,c:'#3b82f6',ex:false},{l:'Ushlab turing',d:4000,c:'#8b5cf6',ex:false}],
    'simple':[{l:'Nafas oling',d:4000,c:'#10b981',ex:true},{l:'Nafas chiqaring',d:4000,c:'#3b82f6',ex:false}]
  };
  var pat='478',run=false,pi=0,ps=0,cyc=0,sec=0,ti=null,ra=null,cr=0,tr=0;
  var cv,ct,W,H,cx,cy,mn,mx;
  function ha(hex,a){var m=hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);if(!m)return'rgba(59,130,246,'+a+')';return'rgba('+parseInt(m[1],16)+','+parseInt(m[2],16)+','+parseInt(m[3],16)+','+a+')';}
  function idle(){if(!ct)return;ct.clearRect(0,0,W,H);var g=ct.createRadialGradient(cx-mn*.2,cy-mn*.2,0,cx,cy,mn);g.addColorStop(0,'rgba(59,130,246,.45)');g.addColorStop(1,'rgba(11,15,25,.3)');ct.beginPath();ct.arc(cx,cy,mn,0,Math.PI*2);ct.fillStyle=g;ct.fill();ct.strokeStyle='rgba(59,130,246,.3)';ct.lineWidth=1.5;ct.stroke();}
  function start(){
    run=true;pi=0;cyc=0;sec=0;ps=performance.now();cr=mn;
    var b=document.getElementById('breath-main-btn');if(b)b.textContent='Toxtatish';
    clearInterval(ti);
    ti=setInterval(function(){sec++;var m=String(Math.floor(sec/60)).padStart(2,'0'),s=String(sec%60).padStart(2,'0');var e=document.getElementById('bs-time');if(e)e.textContent=m+':'+s;},1000);
    if(ra)cancelAnimationFrame(ra);loop();
  }
  function stop(){
    run=false;clearInterval(ti);if(ra)cancelAnimationFrame(ra);
    var b=document.getElementById('breath-main-btn');if(b)b.textContent='Boshlash';
    var l=document.getElementById('breath-phase-lbl');if(l)l.textContent='Boshlash uchun bosing';
    var s=document.getElementById('breath-phase-secs');if(s)s.textContent='';
    ['inhale','hold','exhale'].forEach(function(x){var e=document.getElementById('bgs-'+x);if(e)e.classList.remove('active');});
    cr=mn;idle();
  }
  function loop(){
    if(!run)return;
    ra=requestAnimationFrame(loop);
    var now=performance.now(),ph=PAT[pat],st=ph[pi],el=now-ps;
    if(el>=st.d){if(pi===ph.length-1){cyc++;var e=document.getElementById('bs-cycles');if(e)e.textContent=cyc;}pi=(pi+1)%ph.length;ps=now;step(ph[pi]);}
    var s=ph[pi],p=Math.min(1,(now-ps)/s.d),e=p<.5?2*p*p:-1+(4-2*p)*p;
    tr=s.ex?mn+(mx-mn)*e:mx-(mx-mn)*e;
    cr+=(tr-cr)*.1;
    var r=Math.ceil((s.d-(now-ps))/1000);
    var sc=document.getElementById('breath-phase-secs');if(sc)sc.textContent=r+'s';
    draw(s.c);
  }
  function step(s){
    var l=document.getElementById('breath-phase-lbl');if(l)l.textContent=s.l;
    ['inhale','hold','exhale'].forEach(function(x){var e=document.getElementById('bgs-'+x);if(e)e.classList.remove('active');});
    if(s.l.includes('oling'))  {var e=document.getElementById('bgs-inhale');if(e)e.classList.add('active');}
    if(s.l.includes('Ushlab')) {var e=document.getElementById('bgs-hold');if(e)e.classList.add('active');}
    if(s.l.includes('chiqa'))  {var e=document.getElementById('bgs-exhale');if(e)e.classList.add('active');}
  }
  function draw(col){
    ct.clearRect(0,0,W,H);
    for(var i=2;i>=0;i--){var rr=cr+(i+1)*12,gr=ct.createRadialGradient(cx,cy,rr*.7,cx,cy,rr+8);gr.addColorStop(0,ha(col,.05-i*.01));gr.addColorStop(1,'transparent');ct.beginPath();ct.arc(cx,cy,rr+8,0,Math.PI*2);ct.fillStyle=gr;ct.fill();}
    var g=ct.createRadialGradient(cx-cr*.22,cy-cr*.22,0,cx,cy,cr);g.addColorStop(0,ha(col,.8));g.addColorStop(.6,ha(col,.3));g.addColorStop(1,'rgba(0,0,0,0)');ct.beginPath();ct.arc(cx,cy,cr,0,Math.PI*2);ct.fillStyle=g;ct.fill();
    ct.beginPath();ct.arc(cx,cy,cr,0,Math.PI*2);ct.strokeStyle=ha(col,.5);ct.lineWidth=1.8;ct.stroke();
  }
  function ui(){
    var ph=PAT[pat];
    var i=document.getElementById('bgs-inhale-secs');if(i)i.textContent=Math.round(ph[0].d/1000)+'s';
    var hst=ph.find(function(x){return x.l.includes('Ushlab');});
    var h=document.getElementById('bgs-hold-secs');if(h)h.textContent=hst?Math.round(hst.d/1000)+'s':'—';
    var e=document.getElementById('bgs-exhale-secs');if(e)e.textContent=Math.round(ph[ph.length-1].d/1000)+'s';
  }
  document.addEventListener('DOMContentLoaded',function(){
    cv=document.getElementById('breath-canvas');if(!cv)return;
    ct=cv.getContext('2d');W=cv.width;H=cv.height;cx=W/2;cy=H/2;mn=W*.22;mx=W*.42;cr=mn;tr=mn;idle();
    var b=document.getElementById('breath-main-btn');if(b)b.addEventListener('click',function(){run?stop():start();});
    document.querySelectorAll('.bp-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        document.querySelectorAll('.bp-btn').forEach(function(x){x.classList.remove('active');});
        btn.classList.add('active');pat=btn.getAttribute('data-pattern');ui();
        if(run){stop();setTimeout(start,100);}
      });
    });
    ui();
  });
})();

/* === 5. MINNATDORCHILIK === */
document.addEventListener('DOMContentLoaded',function(){
  var sb=document.getElementById('reflection-save');
  if(sb)sb.addEventListener('click',function(){
    var inp=document.getElementById('reflection-input');
    var txt=inp?inp.value.trim():'';
    if(!txt){if(window.showToast)showToast('Biror narsa yozing','warning');return;}
    if(window.MindCareStorage)MindCareStorage.saveReflection(txt);
    inp.value='';
    if(window.showToast)showToast('Minnatdorchilik qayd etildi!','success');
  });
});
