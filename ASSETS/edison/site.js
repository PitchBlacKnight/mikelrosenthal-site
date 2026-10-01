/* One North present: shared behavior. No scroll listeners; reveals use IntersectionObserver, motion uses CSS timelines. */
(function(){
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* headline words rise one by one (plain-text h2s only) */
  $('h2').forEach(function(h){
    if(h.children.length) return;
    h.innerHTML = h.textContent.split(/(\s+)/).map(function(w,i){ return /\S/.test(w) ? '<span class="w" style="--wi:'+(i>>1)+'">'+w+'</span>' : w; }).join('');
    h.classList.add('words','rv');
  });

  /* counters */
  var counted = new WeakSet();
  function countUp(el){
    if(counted.has(el)) return; counted.add(el);
    var end = parseInt(el.getAttribute('data-count'),10), suf = el.getAttribute('data-suffix')||'';
    if(calm || !('requestAnimationFrame' in window)){ el.textContent = end + suf; return; }
    var t0 = null, dur = 1100;
    function tick(t){
      if(!t0) t0 = t;
      var p = Math.min(1,(t - t0)/dur); p = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * p) + suf;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function show(el){
    el.classList.add('in');
    $('[data-count]',el).forEach(countUp);
    if(el.hasAttribute('data-count')) countUp(el);
  }
  var items = $('.rv');
  if(!('IntersectionObserver' in window) || calm){
    items.forEach(show);
    $('[data-count]').forEach(function(el){ el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix')||''); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ show(e.target); io.unobserve(e.target); } });
    },{rootMargin:'0px 0px -10% 0px',threshold:0.12});
    items.forEach(function(el){ io.observe(el); });
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
    },{threshold:0.4});
    $('.case [data-count]').forEach(function(el){ cio.observe(el); });
    var hio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); hio.unobserve(e.target); } });
    },{threshold:0.6});
    $('.case .hl').forEach(function(el){ hio.observe(el); });
  }

  /* panel edges light under the cursor */
  $('.pn').forEach(function(d){
    d.addEventListener('pointermove',function(e){ var r=d.getBoundingClientRect(); d.style.setProperty('--mx',(e.clientX-r.left)+'px'); d.style.setProperty('--my',(e.clientY-r.top)+'px'); });
  });

  /* drawer: any [data-detail] opens the matching entry in window.DETAILS */
  var dr = document.getElementById('drawer');
  if(dr){
    var body = dr.querySelector('.sheet-body'), last = null;
    function openDetail(id){
      var d = (window.DETAILS||{})[id]; if(!d) return;
      body.innerHTML = '<p class="meta">'+(d.kicker||'')+'</p><h3>'+d.title+'</h3>'
        + (d.say ? '<div class="say"><small>Say it like this</small>'+d.say+'</div>' : '')
        + (d.body||'')
        + (d.link ? '<p><a class="link" href="'+d.link[1]+'" target="_blank" rel="noopener">'+d.link[0]+' ↗</a></p>' : '');
      dr.setAttribute('open',''); dr.querySelector('.x').focus();
      document.body.style.overflow = 'hidden';
    }
    function closeDetail(){ dr.removeAttribute('open'); document.body.style.overflow=''; if(last) last.focus(); }
    document.addEventListener('click',function(e){
      var b = e.target.closest('[data-detail]'); if(b){ last = b; openDetail(b.getAttribute('data-detail')); return; }
      if(e.target.closest('.drawer .x') || e.target.classList.contains('scrim')) closeDetail();
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape' && dr.hasAttribute('open')) closeDetail(); });
  }

  /* capabilities: the tall wrapper's height sets how far you scroll to pan the whole track */
  var capWrap = document.querySelector('.cap-wrap'), capTrack = document.querySelector('.cap-track');
  if(capWrap && capTrack && CSS.supports('animation-timeline','view()') && !calm){
    var size = function(){ if(innerWidth<=820){ capWrap.style.height=''; return; } capWrap.style.height = (capTrack.scrollWidth - innerWidth + innerHeight) + 'px'; };
    size(); addEventListener('resize', size);
  }

  /* the sky: a grid of cells that light and fade, with runners along the lines */
  var cv = document.getElementById('net');
  if(cv){
    var cx = cv.getContext('2d',{alpha:true}), W,H,D, cell=48, cols,rows, lit=[], runners=[], run=false, raf, t0=performance.now(), mouse={x:-1e4,y:-1e4};
    function build(){ var r=cv.getBoundingClientRect(); D=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height; cv.width=W*D; cv.height=H*D; cx.setTransform(D,0,0,D,0,0); cols=Math.ceil(W/cell)+1; rows=Math.ceil(H/cell)+1; lit=[]; runners=[]; for(var i=0;i<6;i++) runners.push(newRunner()); }
    function newRunner(){ var horiz=Math.random()<.5; return {h:horiz, x:horiz?-cell*3:Math.floor(Math.random()*cols)*cell, y:horiz?Math.floor(Math.random()*rows)*cell:-cell*3, v:(1.2+Math.random()*2.2)*(Math.random()<.5?1:-1), len:cell*(2+Math.random()*4)}; }
    function grid(){ cx.strokeStyle='rgba(255,255,255,.045)'; cx.lineWidth=1; cx.beginPath(); for(var x=0;x<=W;x+=cell){ cx.moveTo(x+.5,0); cx.lineTo(x+.5,H); } for(var y=0;y<=H;y+=cell){ cx.moveTo(0,y+.5); cx.lineTo(W,y+.5); } cx.stroke(); }
    function frame(t){ var dt=Math.min(2,(t-t0)/16.7); t0=t; cx.clearRect(0,0,W,H); grid();
      if(Math.random()<.08*dt) lit.push({c:Math.floor(Math.random()*cols), r:Math.floor(Math.random()*rows), a:0, up:true, max:.1+Math.random()*.25});
      for(var i=lit.length-1;i>=0;i--){ var L=lit[i]; L.a += (L.up?.012:-.006)*dt; if(L.a>=L.max) L.up=false; if(L.a<=0){ lit.splice(i,1); continue; }
        cx.fillStyle='rgba(0,153,255,'+L.a+')'; cx.fillRect(L.c*cell+1, L.r*cell+1, cell-1, cell-1); }
      /* cells near the cursor glow */
      if(mouse.x>-1e3){ var mc=Math.floor(mouse.x/cell), mr=Math.floor(mouse.y/cell); for(var dc=-2;dc<=2;dc++) for(var drr=-2;drr<=2;drr++){ var dd=Math.hypot(dc,drr); if(dd>2.2) continue; cx.fillStyle='rgba(0,153,255,'+(.16*(1-dd/2.4))+')'; cx.fillRect((mc+dc)*cell+1,(mr+drr)*cell+1,cell-1,cell-1); } }
      runners.forEach(function(R,i){ if(R.h){ R.x+=R.v*dt; } else { R.y+=R.v*dt; }
        var g = R.h ? cx.createLinearGradient(R.x,0,R.x+R.len*(R.v>0?-1:1),0) : cx.createLinearGradient(0,R.y,0,R.y+R.len*(R.v>0?-1:1));
        g.addColorStop(0,'rgba(39,189,250,.9)'); g.addColorStop(1,'rgba(39,189,250,0)');
        cx.strokeStyle=g; cx.lineWidth=1.5; cx.beginPath();
        if(R.h){ cx.moveTo(R.x,R.y+.5); cx.lineTo(R.x+R.len*(R.v>0?-1:1),R.y+.5); } else { cx.moveTo(R.x+.5,R.y); cx.lineTo(R.x+.5,R.y+R.len*(R.v>0?-1:1)); }
        cx.stroke();
        if(R.x<-cell*6||R.x>W+cell*6||R.y<-cell*6||R.y>H+cell*6) runners[i]=newRunner(); });
      if(run) raf=requestAnimationFrame(frame); }
    build();
    var rt; addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(build,120); });
    addEventListener('pointermove',function(e){ mouse.x=e.clientX; mouse.y=e.clientY; },{passive:true});
    document.documentElement.addEventListener('pointerleave',function(){ mouse.x=-1e4; mouse.y=-1e4; });
    if(calm){ grid(); for(var i=0;i<40;i++){ cx.fillStyle='rgba(0,153,255,'+(.05+Math.random()*.15)+')'; cx.fillRect(Math.floor(Math.random()*cols)*cell+1, Math.floor(Math.random()*rows)*cell+1, cell-1, cell-1); } }
    else { var wake=function(){ if(document.hidden){ run=false; cancelAnimationFrame(raf); } else if(!run){ run=true; t0=performance.now(); raf=requestAnimationFrame(frame); } }; document.addEventListener('visibilitychange',wake); wake(); }
  }

  /* live embeds: inject the iframe only when its frame scrolls near, never on ?noframe */
  if(!/noframe/.test(location.search)){
    var embeds = $('[data-embed]');
    var inject = function(el){ if(el.querySelector('iframe')) return; var f=document.createElement('iframe'); f.src=el.getAttribute('data-embed'); f.title=el.getAttribute('data-embed-title')||''; f.setAttribute('referrerpolicy','no-referrer'); f.setAttribute('loading','lazy'); el.appendChild(f); };
    if('IntersectionObserver' in window){ var eio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ inject(e.target); eio.unobserve(e.target); } }); },{rootMargin:'400px 0px'}); embeds.forEach(function(el){ eio.observe(el); }); }
    else embeds.forEach(inject);
  }

  /* tiles: a field of squares that breathe in a wave and lean toward the cursor; runs only while on screen */
  var tc = document.getElementById('tiles');
  if(tc){
    var tx = tc.getContext('2d'), TW,TH,TD, n=12, on=false, traf, tm={x:-1e4,y:-1e4}, tz=performance.now();
    function tbuild(){ var r=tc.getBoundingClientRect(); TD=Math.min(2,devicePixelRatio||1); TW=r.width; TH=r.height; tc.width=TW*TD; tc.height=TH*TD; tx.setTransform(TD,0,0,TD,0,0); }
    function tframe(t){ var s=Math.min(TW,TH)/n, pad=s*.18; tx.clearRect(0,0,TW,TH);
      for(var r=0;r<n;r++) for(var c=0;c<n;c++){ var x=c*s+s/2, y=r*s+s/2;
        var w = Math.sin((c*.55)+(r*.35)+t*.0012)*.5+.5;
        var d = Math.hypot(x-tm.x, y-tm.y), m = tm.x>-1e3 ? Math.max(0,1-d/(s*3.2)) : 0;
        var k = .35 + w*.45 + m*.5, half=(s-pad)*k/2, rot=(w-.5)*.35 + m*.6;
        tx.save(); tx.translate(x,y); tx.rotate(rot);
        tx.fillStyle = m>.05 ? 'rgba(0,153,255,'+(.25+m*.7)+')' : 'rgba(0,153,255,'+(.08+w*.22)+')';
        tx.fillRect(-half,-half,half*2,half*2);
        tx.strokeStyle='rgba(255,255,255,'+(.06+w*.14)+')'; tx.lineWidth=1; tx.strokeRect(-half+.5,-half+.5,half*2-1,half*2-1);
        tx.restore(); }
      if(on) traf=requestAnimationFrame(tframe); }
    tbuild(); addEventListener('resize',tbuild);
    tc.addEventListener('pointermove',function(e){ var r=tc.getBoundingClientRect(); tm.x=e.clientX-r.left; tm.y=e.clientY-r.top; });
    tc.addEventListener('pointerleave',function(){ tm.x=-1e4; tm.y=-1e4; });
    if(calm){ tframe(0); }
    else if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && !on){ on=true; traf=requestAnimationFrame(tframe); } else if(!e.isIntersecting && on){ on=false; cancelAnimationFrame(traf); } }); },{threshold:.05}).observe(tc); }
    else { on=true; traf=requestAnimationFrame(tframe); }
  }
})();
